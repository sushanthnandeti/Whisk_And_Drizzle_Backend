import Coupon from "../models/coupon.model.js";
import { stripe } from "../lib/stripe.js";


export const createCheckoutSession = async(req,res) => {

    try {
        const {products, couponCode} = req.body; 

        if(!Array.isArray(products) || products.length === 0) {
            res.status(500).json({ error : "Invalid or Empty Array"});    
        } 
    
        let totalAmount = 0;
    
        const lineItems = products.map(product => {
            const amount = Math.round(product.price * 100) // Stripe wants us to send the amount in cents
            totalAmount+= amount * product.quantity;
    
            return {
                price_data : {
                    currency : "usd",
                    product_data : {
                        name: product.name,
                        images: [product.image],
                    },
                    unit_amount : amount
                }
            }
        });
        
        let coupon = null;
        if(couponCode) {
            coupon = await Coupon.findOne({code:couponCode, userId: req.user, isActive:true});
            if(coupon) {
                totalAmount-= Math.round(totalAmount * coupon.discountPercentage / 100);
            }
        }
    
        const session = await Stripe.checkout.sessions.create({
            payment_methods_types: ["card",],
            line_items: lineItems,
            mode: "payment",
            success_url : `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url : `${process.env.CLIENT_URL}/purchase-cancel`,
            discounts: coupon
            ? [
                {
                    coupon : await createStripeCoupon(coupon.discountPercentage),
                },
              ]
            : [],
        metadata : {
            userId:req.user._id.toString(),
            couponCode: couponCode || ""
        }
        });

        if(totalAmount >=20000) {
            await createNewCoupon(req.user._id);
        }
        
        res.status(200).json({id:session.id, totalAmount : totalAmount/100});

    } catch (error) {

    }
}

async function createStripeCoupon(discountPercentage) {
    const coupon = await stripe.coupons.create({
        percent_off : discountPercentage,
        duration: "once",
    })
    return coupon.id;

}

async function createNewCoupon(userId) {
    const newCoupon = new Coupon({
        code:"GIFT" + Math.random().toString(36).substring(2,8).toUpperCase(),
        discountPercentage : 10,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        userId : userId
    })

    await newCoupon.save();
    
    return newCoupon;
}

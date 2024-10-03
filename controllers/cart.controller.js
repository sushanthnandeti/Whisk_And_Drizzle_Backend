import Product from "../models/product.model.js";

export const getCartProducts = async(req,res) =>{
    try {
        const products = await Product.find({_id: {$in : req.user.cartItems }});

        // add quantity for each product

        const cartItems = products.map((product) => {
            const item  = req.user.cartItems.find((cartItem) => cartItem.id === product.id);
            return {...products.toJSON(), quantity: item.quantity };
            });
        
            res.json(cartItems);
        
    } catch (error) {
        console.log("Error in getCartProducts Controller", error.message);
        res.status(500).json({message: "Server error", error: error.message});
    }
}

export const addToCart = async(req,res) => {

    try {
        const {productId} = req.body;
        const user = req.user; 

        const existingItem = user.cartItems.find(item => item.id === productId);
        if(existingItem){
            existingItem.quantity += 1; 
        } else {
            user.cartItems.push(productId);
        }        

        await user.save();
        res.json(user.cartItems);

    } catch (error) {
        console.log("Error in addTOCart Controller", error.message);
        res.status(500).json({message: "Server error", error: error.message});
        
    }

};

export const removeAllFromCart = async(req,res) => {

    try {
        const {productId} = req.body;
        const user = req.user; 

        if(!productId){
            user.cartItems = []
        } else {
            user.cartItems = user.cartItems.filter((item) => item.id !== productId);
        }        
        await user.save();
        res.json(user.cartItems);

    } catch (error) {
        console.log("Error in removeAllFromCart Controller", error.message);
        res.status(500).json({message: "Server error", error: error.message});
        
    }
};


export const updateQuantity = async(req,res) => {
    try {
        const {id : productId} = req.params;
        const {quantity} = req.body;
        const user = req.user; 
        const existingItem = user.cartItems.find((item) => item.id === productId)

        if (existingItem) {
            if(quantity == 0) {
                user.cartItems = user.cartItems.filter((item) => item !== productId);
                await user.save();
                return res.json(user.cartItems);
            }

            existingItem.quantity = quantity;
            await user.save();
            res.json(user.cartItems);
        }
        else{
            res.status(404).json({message: "Product not found in cart"});
        }
        
    } catch (error) {
        console.log("Error in updateQuantity Controller", error.message);
        res.status(500).json({message: "Server error", error: error.message});
        
    }
}
import Order from "../models/order.model.js";
import Product from "../models/product.model.js"; // Assuming this is the correct Product model

export const getOrders = async (req, res) => {
    try {
        // Find orders for the authenticated user
        const orders = await Order.find({ user: req.user._id }).populate('products.product');

        // Process the orders to include product details and quantities
        const orderDetails = orders.map(order => {
            return {
                _id: order._id,
                totalAmount: order.totalAmount,
                stripeSessionId: order.stripeSessionId,
                products: order.products.map(item => ({
                    product: item.product,
                    quantity: item.quantity,
                    price: item.price
                })),
                createdAt: order.createdAt
            };
        });

        // Send the orders with product details back in the response
        res.json(orderDetails);

    } catch (error) {
        console.error("Error in getOrders controller:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

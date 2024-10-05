import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export const getAnalyticsData = async() => {
    
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    const salesData = await Order.aggregate([
        {
            $group: {
                _id: null, // groups all data together
                totalSales : {$sum:1},
                totalRevenue : {$sum : "$totalAmount"}
            }
        }
    ])

    const {totalSales, totalRevenue} = salesData[0] || {totalSales : 0, totalRevenue : 0};

    return {
        users: totalUsers,
        products: totalProducts,
        totalSales,
        totalRevenue
    };
 };

export const getDailySalesData = async() => {

    try {
        const dailySalesData = await Order.aggregate([
			{
				$match: {
					createdAt: {
						$gte: startDate,
						$lte: endDate,
					},
				},
			},
			{
				$group: {
					_id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
					sales: { $sum: 1 },
					revenue: { $sum: "$totalAmount" },
				},
			},
			{ $sort: { _id: 1 } },
		]);

        const datesArray = getDatesInRange(startDate, endDate);

        return datesArray.map(date => {
            const foundData = dailySalesData.find(item => item.id === date);

            return ({
                date, 
                sales : foundData?.sales || 0,
                revenue : foundData?.revenue || 0
            })
        })
        
        function getDatesInRange(startDate, endDate) {
            const dates = [];
            let currentDate = new Date(startDate);
        
            while (currentDate <= endDate) {
                dates.push(currentDate.toISOString().split("T")[0]);
                currentDate.setDate(currentDate.getDate() + 1);
            }
        
            return dates;
        }
    } catch (error) {
        throw error;
    }
}


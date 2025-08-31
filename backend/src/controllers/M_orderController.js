import orderModel from "../models/M_orderModel.js";
import userModel from "../models/M_userModel.js";
//placing order using COd

const placeOrder = async (req,res)=>{

    try {
        const {userId ,items,amount,address} = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod :"COD",
            payment:false,
            date: Date.now()

        }

        const newOrder = new orderModel(orderData)

        await newOrder.save()

        await userModel.findByIdAndUpdate(userId,{cartData:{}})
        res.json({success:true ,message:"order placed"})


        
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
        
        
    }

}



//placing order using Stripe

const placeOrderStripe = async (req,res)=>{


    
}

//All orders data for Admin pnel

const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});

    // stats
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
    const pendingOrders = orders.filter((o) => o.status !== "Delivered").length;
    const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;

    res.json({
      success: true,
      orders,
      stats: {
        totalRevenue,
        totalOrders,
        pendingOrders,
        deliveredOrders,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//ueser orders data for Frontend

const userOrder = async (req,res)=>{

    try {
        
        const {userId} =req.body
        const orders = await orderModel.find({userId})
        res.json({success:true,orders})

    } catch (error) {
         console.log(error);
        res.json({success:false,message:error.message})

        
    }


    
}

//Update order status admin panel
const updateStatus = async (req,res)=>{
try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.json({ success: false, message: "Order ID and status are required" });
    }

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true } // return updated doc
    );

    if (!updatedOrder) {
      return res.json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Order status updated", order: updatedOrder });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }

    

}
// in M_orderController.js
const analyticsReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const query = {};
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const orders = await orderModel.find(query);

    const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
    const totalOrders = orders.length;
    const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const uniqueCustomers = new Set(orders.map((o) => o.userId.toString())).size;

    res.json({
      success: true,
      stats: { totalRevenue, totalOrders, avgOrder, uniqueCustomers },
      orders,
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};


export {placeOrder,placeOrderStripe,allOrders,userOrder,updateStatus,analyticsReport}

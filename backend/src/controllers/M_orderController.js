import orderModel from "../models/M_orderModel.js";
import userModel from "../models/M_userModel.js";

// ==============================
// Place Order (Cash on Delivery)
// ==============================
// controllers/M_orderController.js
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address, lat, lng } = req.body;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
      location: {
        lat: lat ?? null,
        lng: lng ?? null,
        updatedAt: new Date(),
      },
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order placed", order: newOrder });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// ==============================
// All Orders (Admin)
// ==============================
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

// ==============================
// User Orders
// ==============================
const userOrder = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ==============================
// Update Order Status (Admin)
// ==============================
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.json({
        success: false,
        message: "Order ID and status are required",
      });
    }

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true } // return updated doc
    );

    if (!updatedOrder) {
      return res.json({ success: false, message: "Order not found" });
    }

    res.json({
      success: true,
      message: "Order status updated",
      order: updatedOrder,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ==============================
// Analytics Report (Admin)
// ==============================
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
    const uniqueCustomers = new Set(
      orders.map((o) => o.userId.toString())
    ).size;

    res.json({
      success: true,
      stats: { totalRevenue, totalOrders, avgOrder, uniqueCustomers },
      orders,
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// ==============================
// Delete Order (Admin)
// ==============================
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.json({ success: false, message: "Order ID required" });
    }

    const deleted = await orderModel.findByIdAndDelete(orderId);
    if (!deleted) {
      return res.json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ==============================
// Update Live Location
// ==============================
const updateOrderLocation = async (req, res) => {
  try {
    const { orderId, lat, lng } = req.body;

    if (!orderId || lat === undefined || lng === undefined) {
      return res.json({
        success: false,
        message: "OrderId, lat & lng required",
      });
    }

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { location: { lat, lng, updatedAt: new Date() } },
      { new: true }
    );

    if (!updatedOrder) {
      return res.json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Location updated", order: updatedOrder });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  allOrders,
  userOrder,
  updateStatus,
  analyticsReport,
  deleteOrder,
  updateOrderLocation,
};

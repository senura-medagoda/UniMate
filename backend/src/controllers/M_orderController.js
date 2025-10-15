import orderModel from "../models/M_orderModel.js";
import userModel from "../models/M_userModel.js";
import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51SFuVzH8LIDXZA2zO075kGZlR57uYrHnFYUcHJdejzLVMcD5yOTESlw9OUi47c0CF1mx8JJ6z4U0QLvdSt2J7Ee400VYE0hkMD');

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

// ==============================
// Create Stripe Checkout Session
// ==============================
const createStripeCheckout = async (req, res) => {
  try {
    const { userId, items, amount, address, lat, lng } = req.body;
    
    if (!userId || !items?.length || !amount || !address) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Check if total amount meets Stripe's minimum requirement (50 cents USD)
    const totalAmountUSD = Number(amount) * 0.003; // Approximate LKR to USD conversion
    if (totalAmountUSD < 0.50) {
      return res.status(400).json({ 
        success: false, 
        message: `Order amount too small for online payment. Minimum amount required: LKR ${Math.ceil(0.50 / 0.003)}` 
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: items.map((item) => ({
        price_data: {
          currency: 'usd', // Use USD for Stripe compatibility
          product_data: { 
            name: item.name,
            description: item.description || `Size: ${item.size || 'N/A'}`
          },
          unit_amount: Math.round(Number(item.price) * 0.003 * 100), // Convert LKR to USD cents
        },
        quantity: item.quantity,
      })),
      success_url: 'http://localhost:5173/M_payment-success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:5173/M_placeorder',
      metadata: {
        userId,
        address: JSON.stringify(address),
        totalAmount: String(amount),
        lat: lat || '',
        lng: lng || '',
        items: JSON.stringify(items.map(({ _id, quantity, size }) => ({ _id, quantity, size }))),
      },
    });

    return res.status(200).json({ success: true, sessionId: session.id, url: session.url });
  } catch (err) {
    console.error('createStripeCheckout error', err);
    return res.status(500).json({ success: false, message: 'Stripe error' });
  }
};

// ==============================
// Confirm Stripe Order
// ==============================
const confirmStripeOrder = async (req, res) => {
  try {
    const { sessionId, userId, items, amount, address, lat, lng } = req.body;
    
    if (!sessionId) return res.status(400).json({ success: false, message: 'sessionId required' });

    // Check if order already exists for this session to prevent duplicates
    const existingOrder = await orderModel.findOne({ stripeSessionId: sessionId });
    if (existingOrder) {
      return res.status(200).json({ success: true, order: existingOrder, message: 'Order already exists' });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') {
      return res.status(400).json({ success: false, message: 'Payment not completed' });
    }

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Online",
      payment: true,
      date: Date.now(),
      location: {
        lat: lat ?? null,
        lng: lng ?? null,
        updatedAt: new Date(),
      },
      stripeSessionId: sessionId,
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Clear user cart after successful payment
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    return res.status(201).json({ success: true, order: newOrder });
  } catch (err) {
    console.error('confirmStripeOrder error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
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
  createStripeCheckout,
  confirmStripeOrder,
};

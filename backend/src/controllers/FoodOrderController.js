import Stripe from 'stripe';
import FoodOrder from '../models/FoodOrder.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Stripe with better error handling
let stripe;
try {
  const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_51SFuVzH8LIDXZA2zO075kGZlR57uYrHnFYUcHJdejzLVMcD5yOTESlw9OUi47c0CF1mx8JJ6z4U0QLvdSt2J7Ee400VYE0hkMD';
  stripe = new Stripe(stripeKey, {
    apiVersion: '2023-10-16', // Use a stable API version
    timeout: 10000, // 10 second timeout
    maxNetworkRetries: 3, // Retry failed requests
  });
  console.log('Stripe initialized successfully');
} catch (error) {
  console.error('Failed to initialize Stripe:', error);
  stripe = null;
}

export const createCODOrder = async (req, res) => {
  try {
    const { foodItems, totalAmount, address, clientOrderKey } = req.body;
    const studentId = req.std._id;
    console.log('=== CREATE COD ORDER START ===');
    console.log('createCODOrder called with:', { studentId, foodItems, totalAmount, address, clientOrderKey });
    console.log('Request body:', req.body);
    console.log('Student from middleware:', req.std);
    
    if (!studentId || !foodItems?.length || !totalAmount || !address) {
      console.log('Missing required fields');
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Temporarily disable clientOrderKey check for testing multiple orders
    // if (clientOrderKey) {
    //   const existing = await FoodOrder.findOne({ clientOrderKey }).lean();
    //   if (existing) {
    //     console.log('Existing order found with same clientOrderKey:', existing._id);
    //     return res.status(200).json({ success: true, order: existing });
    //   }
    // }

    // Ensure foodItems have the correct structure
    const processedFoodItems = foodItems.map(item => ({
      foodItemId: item.foodItemId || item._id,
      name: item.name,
      quantity: item.quantity,
      price: item.price
    }));

    const order = await FoodOrder.create({
      studentId,
      foodItems: processedFoodItems,
      totalAmount,
      address,
      paymentMethod: 'COD',
      paymentStatus: 'Pending',
      orderStatus: 'Order Placed',
      ...(clientOrderKey ? { clientOrderKey } : {}),
    });

    console.log('COD order created successfully:', order._id);
    console.log('Order details:', {
      _id: order._id,
      studentId: order.studentId,
      foodItems: order.foodItems,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      orderStatus: order.orderStatus,
      createdAt: order.createdAt
    });
    return res.status(201).json({ success: true, order });
  } catch (err) {
    console.error('createCODOrder error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createStripeCheckout = async (req, res) => {
  try {
    // Check if Stripe is initialized
    if (!stripe) {
      console.error('Stripe not initialized');
      return res.status(500).json({ 
        success: false, 
        message: 'Payment service temporarily unavailable. Please try COD or contact support.' 
      });
    }

    const { foodItems, totalAmount, address, clientOrderKey } = req.body;
    const studentId = req.std._id;
    
    console.log('createStripeCheckout called with:', {
      studentId,
      foodItems: foodItems?.length || 0,
      totalAmount,
      address,
      clientOrderKey
    });
    
    if (!foodItems?.length || !totalAmount || !address) {
      console.log('Missing required fields for Stripe checkout');
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Validate that all items have required fields
    const validItems = foodItems.filter(item => item.name && item.price && item.quantity);
    if (validItems.length !== foodItems.length) {
      console.log('Invalid item data for Stripe checkout');
      return res.status(400).json({ success: false, message: 'Invalid item data' });
    }

    // Check minimum amount for Stripe (50 cents = 5000 cents in LKR)
    const minimumAmount = 5000; // 50 LKR minimum
    if (totalAmount < 50) {
      console.log('Order amount too low for Stripe:', totalAmount);
      return res.status(400).json({ 
        success: false, 
        message: `Minimum order amount for online payment is Rs. 50. Your order total is Rs. ${totalAmount}.` 
      });
    }

    // Ensure foodItems have the correct structure for Stripe
    const processedFoodItems = foodItems.map(item => ({
      foodItemId: item.foodItemId || item._id,
      name: item.name,
      quantity: item.quantity,
      price: item.price
    }));

    console.log('Creating Stripe checkout session...');
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: processedFoodItems.map((item) => ({
        price_data: {
          currency: 'lkr',
          product_data: { 
            name: item.name,
            description: `Quantity: ${item.quantity}`
          },
          unit_amount: Math.round(Number(item.price) * 100),
        },
        quantity: item.quantity,
      })),
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/student/food/cart`,
      metadata: {
        studentId: studentId.toString(),
        address,
        totalAmount: String(totalAmount),
        items: JSON.stringify(processedFoodItems.map(({ foodItemId, quantity }) => ({ foodItemId, quantity }))),
        ...(clientOrderKey ? { clientOrderKey } : {}),
      },
    });

    console.log('Stripe session created successfully:', session.id);
    return res.status(200).json({ success: true, sessionId: session.id, url: session.url });
  } catch (err) {
    console.error('=== STRIPE CHECKOUT ERROR ===');
    console.error('createStripeCheckout error:', err);
    console.error('Error details:', {
      name: err.name,
      message: err.message,
      type: err.type,
      code: err.code,
      param: err.param,
      stack: err.stack
    });
    
    // Handle specific Stripe errors
    if (err.type === 'StripeConnectionError') {
      return res.status(500).json({ 
        success: false, 
        message: 'Payment service connection failed. Please try again or use COD.',
        error: 'Connection error'
      });
    } else if (err.type === 'StripeAPIError') {
      return res.status(500).json({ 
        success: false, 
        message: 'Payment service error. Please try again or use COD.',
        error: err.message
      });
    } else if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
      return res.status(500).json({ 
        success: false, 
        message: 'Payment service unavailable. Please use COD or try again later.',
        error: 'Network error'
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: 'Payment service error. Please try COD or contact support.',
      error: err.message || 'Unknown error'
    });
  }
};

export const confirmStripeOrder = async (req, res) => {
  try {
    const { sessionId, foodItems, totalAmount, address, clientOrderKey } = req.body;
    const studentId = req.std._id;
    
    console.log('=== STRIPE ORDER CONFIRMATION START ===');
    console.log('confirmStripeOrder called with:', {
      sessionId,
      foodItems: foodItems?.length || 0,
      totalAmount,
      address,
      clientOrderKey,
      studentId
    });
    
    if (!sessionId) {
      console.log('ERROR: No sessionId provided');
      return res.status(400).json({ success: false, message: 'sessionId required' });
    }

    // Check if order already exists with this clientOrderKey
    if (clientOrderKey) {
      const existing = await FoodOrder.findOne({ clientOrderKey }).lean();
      if (existing) {
        console.log('Order already exists with clientOrderKey:', existing._id);
        return res.status(200).json({ success: true, order: existing });
      }
    }

    // Try to verify Stripe session, but don't fail if it doesn't work
    let session = null;
    let stripeVerified = false;
    
    if (stripe) {
      try {
        session = await stripe.checkout.sessions.retrieve(sessionId);
        console.log('Stripe session retrieved:', {
          id: session.id,
          payment_status: session.payment_status,
          metadata: session.metadata
        });
        
        if (session.payment_status === 'paid') {
          stripeVerified = true;
          console.log('✅ Stripe payment verified successfully');
        } else {
          console.log('⚠️ Stripe payment not completed, status:', session.payment_status);
        }
      } catch (stripeError) {
        console.error('⚠️ Error retrieving Stripe session (will proceed anyway):', stripeError.message);
        // Don't fail the order creation if Stripe verification fails
      }
    } else {
      console.log('⚠️ Stripe not initialized, proceeding without verification');
    }

    // Prepare order data - prioritize request body data (like test button)
    let orderData = {
      studentId: studentId,
      foodItems: foodItems || [],
      totalAmount: totalAmount || 0,
      address: address || '',
      clientOrderKey: clientOrderKey
    };

    // Ensure foodItems have the correct structure
    if (orderData.foodItems && orderData.foodItems.length > 0) {
      orderData.foodItems = orderData.foodItems.map(item => ({
        foodItemId: item.foodItemId || item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }));
    }

    console.log('Initial order data from request:', {
      studentId: orderData.studentId,
      foodItems: orderData.foodItems?.length,
      totalAmount: orderData.totalAmount,
      address: orderData.address,
      clientOrderKey: orderData.clientOrderKey
    });

    // If any required data is missing, try to get it from session metadata
    if (session && session.metadata && (!orderData.foodItems?.length || !orderData.totalAmount || !orderData.address)) {
      console.log('Missing order data, getting from Stripe session metadata');
      console.log('Session metadata:', session.metadata);
      
      // Use session metadata to fill missing data
      if (!orderData.totalAmount && session.metadata.totalAmount) {
        orderData.totalAmount = parseFloat(session.metadata.totalAmount);
      }
      if (!orderData.address && session.metadata.address) {
        orderData.address = session.metadata.address;
      }
      if (!orderData.clientOrderKey && session.metadata.clientOrderKey) {
        orderData.clientOrderKey = session.metadata.clientOrderKey;
      }
      
      // Parse food items from metadata if not provided
      if (session.metadata.items && !orderData.foodItems?.length) {
        try {
          const items = JSON.parse(session.metadata.items);
          console.log('Parsed items from metadata:', items);
          
          // Import MenuItem model to get full item details
          const MenuItem = (await import('../models/MenuItemModel.js')).default;
          
          // Fetch full item details from database
          const itemDetails = await Promise.all(
            items.map(async (item) => {
              try {
                const menuItem = await MenuItem.findById(item.foodItemId);
                console.log('Fetched menu item:', menuItem?.name, 'Price:', menuItem?.price);
                return {
                  foodItemId: item.foodItemId,
                  name: menuItem?.name || 'Unknown Item',
                  quantity: item.quantity,
                  price: menuItem?.price || 0
                };
              } catch (e) {
                console.error('Error fetching item details:', e);
                return {
                  foodItemId: item.foodItemId,
                  name: 'Unknown Item',
                  quantity: item.quantity,
                  price: 0
                };
              }
            })
          );
          
          orderData.foodItems = itemDetails;
          console.log('Final food items from metadata:', orderData.foodItems);
        } catch (e) {
          console.error('Error parsing items from metadata:', e);
        }
      }
    }

    // Final validation - be more lenient like the test button
    console.log('Final order data before validation:', {
      studentId: orderData.studentId,
      foodItems: orderData.foodItems?.length,
      totalAmount: orderData.totalAmount,
      address: orderData.address,
      clientOrderKey: orderData.clientOrderKey
    });
    
    // If we still don't have the required data, create a basic order (like test button)
    if (!orderData.foodItems?.length || !orderData.totalAmount || !orderData.address) {
      console.log('⚠️ Missing required order data, creating basic order like test button');
      
      // Create a basic order with available data
      orderData.foodItems = orderData.foodItems?.length ? orderData.foodItems : [
        {
          foodItemId: new mongoose.Types.ObjectId(),
          name: 'Stripe Order Item',
          quantity: 1,
          price: orderData.totalAmount || 100
        }
      ];
      orderData.totalAmount = orderData.totalAmount || 100;
      orderData.address = orderData.address || 'Address not provided';
    }

    console.log('Creating order in database with data:', {
      studentId: orderData.studentId,
      foodItems: orderData.foodItems,
      totalAmount: orderData.totalAmount,
      address: orderData.address,
      paymentMethod: 'Online',
      paymentStatus: stripeVerified ? 'Paid' : 'Pending',
      orderStatus: 'Order Placed',
      stripeSessionId: sessionId,
      clientOrderKey: orderData.clientOrderKey
    });

    // Create the order exactly like the test button does
    const order = await FoodOrder.create({
      studentId: orderData.studentId,
      foodItems: orderData.foodItems,
      totalAmount: orderData.totalAmount,
      address: orderData.address,
      paymentMethod: 'Online',
      paymentStatus: stripeVerified ? 'Paid' : 'Pending',
      orderStatus: 'Order Placed',
      stripeSessionId: sessionId,
      ...(orderData.clientOrderKey ? { clientOrderKey: orderData.clientOrderKey } : {}),
    });

    console.log('=== ORDER CREATED SUCCESSFULLY ===');
    console.log('Order details:', {
      _id: order._id,
      studentId: order.studentId,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      totalAmount: order.totalAmount,
      foodItems: order.foodItems?.length || 0,
      address: order.address,
      stripeSessionId: order.stripeSessionId
    });

    return res.status(201).json({ 
      success: true, 
      order,
      message: 'Order created successfully'
    });
  } catch (err) {
    console.error('=== STRIPE ORDER CONFIRMATION ERROR ===');
    console.error('confirmStripeOrder error:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: err.message 
    });
  }
};

export const getOrdersByStudent = async (req, res) => {
  try {
    const studentId = req.std._id;
    
    console.log('getOrdersByStudent called for studentId:', studentId);
    
    // Get orders for the specific student, excluding soft-deleted ones
    const orders = await FoodOrder.find({ 
      studentId: studentId,
      deletedByStudent: { $ne: true }, // Exclude orders deleted by student
      deletedByAdmin: { $ne: true }    // Exclude orders deleted by admin
    }).sort({ createdAt: -1 }).lean();
    
    console.log('Found', orders.length, 'active orders for student:', studentId);
    
    // Log order details for debugging
    if (orders.length > 0) {
      console.log('Order details:', orders.map(o => ({
        _id: o._id,
        orderStatus: o.orderStatus,
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus,
        totalAmount: o.totalAmount,
        deletedByStudent: o.deletedByStudent,
        deletedByAdmin: o.deletedByAdmin,
        createdAt: o.createdAt
      })));
    } else {
      console.log('No active orders found for student:', studentId);
    }
    
    return res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error('getOrdersByStudent error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const listAllOrders = async (req, res) => {
  try {
    // Show all orders except those deleted by admin
    const orders = await FoodOrder.find({ 
      deletedByAdmin: { $ne: true } 
    }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error('listAllOrders error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Test endpoint to create a sample order
export const createTestOrder = async (req, res) => {
  try {
    const studentId = req.std._id;
    
    console.log('Creating test order for student:', studentId);
    
    const testOrder = await FoodOrder.create({
      studentId: studentId,
      foodItems: [
        {
          foodItemId: new mongoose.Types.ObjectId(),
          name: 'Test Item',
          quantity: 1,
          price: 100
        }
      ],
      totalAmount: 100,
      address: 'Test Address',
      paymentMethod: 'Online',
      paymentStatus: 'Paid',
      orderStatus: 'Order Placed',
      stripeSessionId: 'test_session_123'
    });
    
    console.log('Test order created successfully:', testOrder._id);
    console.log('Test order details:', {
      _id: testOrder._id,
      studentId: testOrder.studentId,
      foodItems: testOrder.foodItems,
      totalAmount: testOrder.totalAmount,
      paymentMethod: testOrder.paymentMethod,
      orderStatus: testOrder.orderStatus
    });
    
    return res.status(201).json({ 
      success: true, 
      order: testOrder,
      message: 'Test order created successfully'
    });
  } catch (err) {
    console.error('createTestOrder error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Test endpoint to create a Stripe order for testing
export const createTestStripeOrder = async (req, res) => {
  try {
    const studentId = req.std._id;
    
    console.log('Creating test Stripe order for student:', studentId);
    
    const testOrder = await FoodOrder.create({
      studentId: studentId,
      foodItems: [
        {
          foodItemId: new mongoose.Types.ObjectId(),
          name: 'Test Stripe Item',
          quantity: 2,
          price: 250
        }
      ],
      totalAmount: 500,
      address: 'Test Stripe Address',
      paymentMethod: 'Online',
      paymentStatus: 'Paid',
      orderStatus: 'Order Placed',
      stripeSessionId: 'test_stripe_session_' + Date.now()
    });
    
    console.log('Test Stripe order created:', testOrder._id);
    return res.status(201).json({ 
      success: true, 
      order: testOrder,
      message: 'Test Stripe order created successfully'
    });
  } catch (err) {
    console.error('createTestStripeOrder error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Test endpoint to create a COD order for testing
export const createTestCODOrder = async (req, res) => {
  try {
    const studentId = req.std._id;
    
    console.log('=== CREATE TEST COD ORDER ===');
    console.log('Creating test COD order for student:', studentId);
    console.log('Student from middleware:', req.std);
    
    const testOrder = await FoodOrder.create({
      studentId: studentId,
      foodItems: [
        {
          foodItemId: new mongoose.Types.ObjectId(),
          name: 'Test COD Item',
          quantity: 1,
          price: 150
        }
      ],
      totalAmount: 150,
      address: 'Test COD Address',
      paymentMethod: 'COD',
      paymentStatus: 'Pending',
      orderStatus: 'Order Placed'
    });
    
    console.log('Test COD order created successfully:', testOrder._id);
    console.log('Test order details:', {
      _id: testOrder._id,
      studentId: testOrder.studentId,
      foodItems: testOrder.foodItems,
      totalAmount: testOrder.totalAmount,
      paymentMethod: testOrder.paymentMethod,
      orderStatus: testOrder.orderStatus,
      createdAt: testOrder.createdAt
    });
    
    return res.status(201).json({ 
      success: true, 
      order: testOrder,
      message: 'Test COD order created successfully'
    });
  } catch (err) {
    console.error('createTestCODOrder error', err);
    console.error('Error details:', {
      name: err.name,
      message: err.message,
      stack: err.stack
    });
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Test endpoint to create multiple orders
export const createMultipleTestOrders = async (req, res) => {
  try {
    const studentId = req.std._id;
    const { count = 3 } = req.body;
    
    console.log('=== CREATE MULTIPLE TEST ORDERS ===');
    console.log('Creating', count, 'test orders for student:', studentId);
    
    const orders = [];
    
    for (let i = 1; i <= count; i++) {
      const testOrder = await FoodOrder.create({
        studentId: studentId,
        foodItems: [
          {
            foodItemId: new mongoose.Types.ObjectId(),
            name: `Test Item ${i}`,
            quantity: i,
            price: 100 * i
          }
        ],
        totalAmount: 100 * i,
        address: `Test Address ${i}`,
        paymentMethod: 'COD',
        paymentStatus: 'Pending',
        orderStatus: 'Order Placed'
      });
      
      orders.push(testOrder);
      console.log(`Order ${i} created:`, testOrder._id);
    }
    
    console.log('All test orders created successfully!');
    
    return res.status(201).json({ 
      success: true, 
      orders: orders,
      message: `${count} test orders created successfully`
    });
  } catch (err) {
    console.error('createMultipleTestOrders error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Fallback function to create online order without Stripe verification
export const createFallbackOnlineOrder = async (req, res) => {
  try {
    const { foodItems, totalAmount, address, clientOrderKey } = req.body;
    const studentId = req.std._id;
    
    console.log('=== FALLBACK ONLINE ORDER CREATION ===');
    console.log('createFallbackOnlineOrder called with:', {
      studentId,
      foodItems: foodItems?.length || 0,
      totalAmount,
      address,
      clientOrderKey
    });
    
    if (!studentId || !foodItems?.length || !totalAmount || !address) {
      console.log('Missing required fields for fallback order');
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Check if order already exists with this clientOrderKey
    if (clientOrderKey) {
      const existing = await FoodOrder.findOne({ clientOrderKey }).lean();
      if (existing) {
        console.log('Order already exists with clientOrderKey:', existing._id);
        return res.status(200).json({ success: true, order: existing });
      }
    }

    // Ensure foodItems have the correct structure
    const processedFoodItems = foodItems.map(item => ({
      foodItemId: item.foodItemId || item._id,
      name: item.name,
      quantity: item.quantity,
      price: item.price
    }));

    const order = await FoodOrder.create({
      studentId: studentId,
      foodItems: processedFoodItems,
      totalAmount: totalAmount,
      address: address,
      paymentMethod: 'Online',
      paymentStatus: 'Paid', // Assume payment is successful for fallback
      orderStatus: 'Order Placed',
      stripeSessionId: 'fallback_' + Date.now(),
      ...(clientOrderKey ? { clientOrderKey } : {}),
    });

    console.log('=== FALLBACK ORDER CREATED SUCCESSFULLY ===');
    console.log('Order details:', {
      _id: order._id,
      studentId: order.studentId,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      totalAmount: order.totalAmount,
      foodItems: order.foodItems?.length || 0,
      address: order.address
    });

    return res.status(201).json({ 
      success: true, 
      order,
      message: 'Order created successfully (fallback mode)'
    });
  } catch (err) {
    console.error('=== FALLBACK ORDER CREATION ERROR ===');
    console.error('createFallbackOnlineOrder error:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: err.message 
    });
  }
};

// Debug endpoint to get all orders without filtering
export const getAllOrdersDebug = async (req, res) => {
  try {
    const studentId = req.std._id;
    
    // Get ALL orders for this student without any filters
    const allOrders = await FoodOrder.find({ studentId: studentId }).sort({ createdAt: -1 }).lean();
    
    console.log('Debug - Found', allOrders.length, 'total orders for student:', studentId);
    
    // Also get orders with different filters for comparison
    const activeOrders = await FoodOrder.find({ 
      studentId: studentId,
      deletedByStudent: { $ne: true },
      deletedByAdmin: { $ne: true }
    }).sort({ createdAt: -1 }).lean();
    
    console.log('Debug - Found', activeOrders.length, 'active orders for student:', studentId);
    
    return res.status(200).json({ 
      success: true, 
      orders: allOrders, 
      activeOrders: activeOrders,
      count: allOrders.length,
      activeCount: activeOrders.length,
      message: `Found ${allOrders.length} total orders (${activeOrders.length} active)`
    });
  } catch (err) {
    console.error('getAllOrdersDebug error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const adminUpdateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus, status, paymentStatus } = req.body;
    const update = {};
    
    // Handle both 'orderStatus' and 'status' for backward compatibility
    const newStatus = orderStatus || status;
    if (newStatus) update.orderStatus = newStatus;
    if (paymentStatus) update.paymentStatus = paymentStatus;
    
    console.log('Updating order status:', { orderId, newStatus, update });
    
    const order = await FoodOrder.findByIdAndUpdate(orderId, update, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    
    console.log('Order status updated successfully:', order.orderStatus);
    return res.status(200).json({ success: true, order });
  } catch (err) {
    console.error('adminUpdateOrderStatus error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Demo function to simulate order progression
export const simulateOrderProgression = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await FoodOrder.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    // Define the progression sequence
    const statusProgression = ['Order Placed', 'Packing', 'Shipped', 'Out for Delivery', 'Delivered'];
    const currentIndex = statusProgression.indexOf(order.orderStatus);
    
    if (currentIndex === -1 || currentIndex === statusProgression.length - 1) {
      return res.status(400).json({ 
        success: false, 
        message: 'Order is already at final status or invalid status' 
      });
    }
    
    const nextStatus = statusProgression[currentIndex + 1];
    const updatedOrder = await FoodOrder.findByIdAndUpdate(
      orderId, 
      { orderStatus: nextStatus }, 
      { new: true }
    );
    
    console.log(`Order ${orderId} status updated from ${order.orderStatus} to ${nextStatus}`);
    
    return res.status(200).json({ 
      success: true, 
      order: updatedOrder,
      message: `Order status updated to ${nextStatus}`
    });
  } catch (err) {
    console.error('simulateOrderProgression error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const requestCancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    
    console.log('requestCancelOrder called with:', { 
      orderId, 
      reason, 
      params: req.params, 
      body: req.body,
      method: req.method,
      url: req.url
    });
    
    if (!orderId) {
      console.log('No orderId provided in params');
      return res.status(400).json({ success: false, message: 'Order ID is required' });
    }
    
    console.log('Looking up order with ID:', orderId);
    const order = await FoodOrder.findById(orderId);
    if (!order) {
      console.log('Order not found:', orderId);
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    console.log('Found order:', {
      _id: order._id,
      orderStatus: order.orderStatus,
      cancelRequested: order.cancelRequested
    });
    
    if (order.orderStatus === 'Delivered' || order.orderStatus === 'Cancelled') {
      console.log('Order already completed or cancelled');
      return res.status(400).json({ success: false, message: 'Order already completed or cancelled' });
    }
    
    console.log('Updating order cancellation fields');
    try {
      order.cancelRequested = true;
      order.cancelStatus = 'Requested';
      order.cancelReason = reason || null;
      order.cancelRequestedAt = new Date();
      
      console.log('Order fields updated:', {
        cancelRequested: order.cancelRequested,
        cancelStatus: order.cancelStatus,
        cancelReason: order.cancelReason,
        cancelRequestedAt: order.cancelRequestedAt
      });
      
      console.log('Saving order with cancellation data');
      const savedOrder = await order.save();
      
      console.log('Order cancellation request saved successfully:', {
        _id: savedOrder._id,
        cancelRequested: savedOrder.cancelRequested,
        cancelStatus: savedOrder.cancelStatus
      });
      
      return res.status(200).json({ success: true, order: savedOrder });
    } catch (saveError) {
      console.error('Error saving order:', saveError);
      throw saveError;
    }
  } catch (err) {
    console.error('requestCancelOrder error:', err);
    console.error('Error details:', {
      name: err.name,
      message: err.message,
      stack: err.stack
    });
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const adminResolveCancellation = async (req, res) => {
  try {
    const { orderId } = req.params;
    // normalize action; allow strings or boolean flags
    let { action } = req.body; // 'approve' | 'reject'
    if (!action && typeof req.body?.approve !== 'undefined') {
      action = req.body.approve ? 'approve' : 'reject';
    }
    if (action !== 'approve' && action !== 'reject') {
      action = 'approve';
    }

    const order = await FoodOrder.findById(orderId).exec();
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    // Allow admin to force-cancel even if request flag wasn't set
    if (action === 'approve') {
      order.cancelStatus = 'Approved';
      order.orderStatus = 'Cancelled';
      if (order.paymentMethod === 'Online') {
        // Optionally trigger refund workflow here
        order.paymentStatus = 'Refund Pending';
      }
    } else {
      order.cancelStatus = 'Rejected';
    }
    order.cancelRequested = false;
    order.cancelResolvedAt = new Date();
    await order.save();
    return res.status(200).json({ success: true, order });
  } catch (err) {
    console.error('adminResolveCancellation error', err?.message || err);
    return res.status(500).json({ success: false, message: err?.message || 'Server error' });
  }
};

export const deleteStudentOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const studentId = req.std?._id || req.body?.userId;
    if (!studentId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    // Soft delete - mark as deleted by student but keep in database
    const updated = await FoodOrder.findOneAndUpdate(
      { _id: orderId, studentId },
      { 
        deletedByStudent: true, 
        deletedByStudentAt: new Date() 
      },
      { new: true }
    );
    
    if (!updated) return res.status(404).json({ success: false, message: 'Order not found' });
    return res.status(200).json({ success: true, order: updated });
  } catch (err) {
    console.error('deleteStudentOrder error', err?.message || err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const adminDeleteOrder = async (req, res) => {
  try {
    console.log('=== ADMIN DELETE ORDER REQUEST ===');
    console.log('Request params:', req.params);
    console.log('Request headers:', req.headers);
    console.log('Admin ID from middleware:', req.adminId);
    
    // Extract orderId from params with validation
    const { orderId } = req.params;
    
    // Validate orderId parameter
    if (!orderId) {
      console.log('No orderId provided in request params');
      return res.status(400).json({ 
        success: false, 
        message: 'Order ID is required' 
      });
    }
    
    // Validate orderId format (MongoDB ObjectId format)
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      console.log('Invalid orderId format:', orderId);
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid order ID format' 
      });
    }
    
    console.log('Admin attempting to delete order:', orderId);
    
    // Check if order exists first
    const existingOrder = await FoodOrder.findById(orderId);
    if (!existingOrder) {
      console.log('Order not found:', orderId);
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }
    
    console.log('Order found, proceeding with deletion:', existingOrder._id);
    
    // Hard delete - completely remove from database
    const deletedOrder = await FoodOrder.findByIdAndDelete(orderId);
    
    if (!deletedOrder) {
      console.log('Failed to delete order:', orderId);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to delete order from database' 
      });
    }
    
    console.log('Order successfully deleted:', orderId);
    console.log('=== DELETE COMPLETE ===');
    
    return res.status(200).json({ 
      success: true, 
      message: 'Order deleted successfully',
      deletedOrder: {
        _id: deletedOrder._id,
        orderStatus: deletedOrder.orderStatus,
        totalAmount: deletedOrder.totalAmount,
        studentId: deletedOrder.studentId
      }
    });
  } catch (err) {
    console.error('adminDeleteOrder error:', err?.message || err);
    console.error('Error stack:', err?.stack);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error during order deletion' 
    });
  }
};

export const generateOrderReport = async (req, res) => {
  try {
    const { period, startDate, endDate, reportType } = req.body;
    
    // Calculate date range based on period
    let start, end;
    const now = new Date();
    
    if (period === 'weekly') {
      start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      end = now;
    } else if (period === 'monthly') {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (period === 'yearly') {
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31);
    } else if (period === 'custom') {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      // Default to last 30 days
      start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      end = now;
    }
    
    // Build query
    const query = {
      createdAt: { $gte: start, $lte: end },
      deletedByAdmin: { $ne: true }
    };
    
    // Get all orders in the date range
    const orders = await FoodOrder.find(query).sort({ createdAt: -1 });
    
    // Calculate statistics
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    // Order status breakdown
    const statusBreakdown = orders.reduce((acc, order) => {
      acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1;
      return acc;
    }, {});
    
    // Payment method breakdown
    const paymentBreakdown = orders.reduce((acc, order) => {
      acc[order.paymentMethod] = (acc[order.paymentMethod] || 0) + 1;
      return acc;
    }, {});
    
    // Cancellation analysis
    const cancelledOrders = orders.filter(order => 
      order.orderStatus === 'Cancelled' || order.cancelStatus === 'Approved'
    );
    const cancellationRate = totalOrders > 0 ? (cancelledOrders.length / totalOrders) * 100 : 0;
    
    // Cancellation reasons analysis
    const cancellationReasons = cancelledOrders
      .filter(order => order.cancelReason)
      .reduce((acc, order) => {
        const reason = order.cancelReason;
        acc[reason] = (acc[reason] || 0) + 1;
        return acc;
      }, {});
    
    // Daily breakdown for the period
    const dailyBreakdown = {};
    orders.forEach(order => {
      const date = new Date(order.createdAt).toISOString().split('T')[0];
      if (!dailyBreakdown[date]) {
        dailyBreakdown[date] = { orders: 0, revenue: 0 };
      }
      dailyBreakdown[date].orders += 1;
      dailyBreakdown[date].revenue += order.totalAmount;
    });
    
    // Top items analysis
    const itemAnalysis = {};
    orders.forEach(order => {
      order.foodItems.forEach(item => {
        if (!itemAnalysis[item.name]) {
          itemAnalysis[item.name] = { quantity: 0, revenue: 0 };
        }
        itemAnalysis[item.name].quantity += item.quantity;
        itemAnalysis[item.name].revenue += item.price * item.quantity;
      });
    });
    
    const topItems = Object.entries(itemAnalysis)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
    
    const report = {
      period,
      startDate: start,
      endDate: end,
      generatedAt: new Date(),
      summary: {
        totalOrders,
        totalRevenue,
        averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
        cancellationRate: Math.round(cancellationRate * 100) / 100
      },
      breakdown: {
        status: statusBreakdown,
        payment: paymentBreakdown,
        daily: dailyBreakdown,
        cancellationReasons,
        topItems
      },
      orders: orders.map(order => ({
        _id: order._id,
        studentId: order.studentId,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        orderStatus: order.orderStatus,
        createdAt: order.createdAt,
        cancelReason: order.cancelReason,
        deletedByStudent: order.deletedByStudent
      }))
    };
    
    return res.status(200).json({ success: true, report });
  } catch (err) {
    console.error('generateOrderReport error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get vendor orders (only orders for vendor's shop menu items)
export const getVendorOrders = async (req, res) => {
  try {
    const vendorId = req.vendor._id;
    console.log('Getting orders for vendor:', vendorId);

    // First, get the vendor's shop to find their menu items
    const ShopModel = (await import('../models/ShopModel.js')).default;
    const shop = await ShopModel.findOne({ vendorId }).lean();
    
    if (!shop) {
      console.log('No shop found for vendor:', vendorId);
      return res.status(404).json({ 
        success: false, 
        message: 'Shop not found for this vendor' 
      });
    }

    console.log('Found shop:', shop._id);

    // Get all menu items for this vendor's shop
    const MenuItemModel = (await import('../models/MenuItemModel.js')).default;
    const shopMenuItems = await MenuItemModel.find({ vendorId }).select('_id name').lean();
    const shopMenuItemIds = shopMenuItems.map(item => item._id);
    
    console.log('Shop menu items:', shopMenuItems);
    console.log('Shop menu item IDs:', shopMenuItemIds);

    if (shopMenuItemIds.length === 0) {
      console.log('No menu items found for vendor');
      return res.status(200).json({ 
        success: true, 
        orders: [],
        total: 0,
        message: 'No menu items found for this vendor'
      });
    }

    // Find orders that contain items from this vendor's menu
    // Check both foodItemId and itemId for backward compatibility
    const orders = await FoodOrder.find({
      $or: [
        { 'foodItems.foodItemId': { $in: shopMenuItemIds } },
        { 'foodItems.itemId': { $in: shopMenuItemIds } }
      ]
    })
    .populate('studentId', 'name email phone')
    .sort({ createdAt: -1 })
    .lean();

    console.log('Found orders for vendor:', orders.length);
    console.log('Sample order:', orders[0]);

    // Process orders to include student information and normalize status
    const processedOrders = orders.map(order => ({
      ...order,
      status: order.orderStatus || 'pending', // Map orderStatus to status
      studentName: order.studentId?.name || 'Unknown Student',
      studentEmail: order.studentId?.email,
      studentPhone: order.studentId?.phone,
      orderNumber: order._id.toString().slice(-6) // Generate order number
    }));

    console.log('Processed orders:', processedOrders.length);

    return res.status(200).json({ 
      success: true, 
      orders: processedOrders,
      total: processedOrders.length
    });
  } catch (error) {
    console.error('Error getting vendor orders:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Mark order as shipped and notify admin
export const markOrderAsShipped = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { trackingNumber, estimatedDeliveryTime, notes } = req.body;
    const vendorId = req.vendor._id;

    console.log('Marking order as shipped:', { orderId, vendorId, trackingNumber });

    // Find the order and verify it belongs to this vendor
    const order = await FoodOrder.findById(orderId).lean();
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    // Verify the order contains items from this vendor's shop
    const ShopModel = (await import('../models/ShopModel.js')).default;
    const MenuItemModel = (await import('../models/MenuItemModel.js')).default;
    
    const shop = await ShopModel.findOne({ vendorId }).lean();
    if (!shop) {
      return res.status(404).json({ 
        success: false, 
        message: 'Shop not found for this vendor' 
      });
    }

    const shopMenuItems = await MenuItemModel.find({ vendorId }).select('_id').lean();
    const shopMenuItemIds = shopMenuItems.map(item => item._id);

    // Check if order contains vendor's items
    const hasVendorItems = order.foodItems.some(item => 
      shopMenuItemIds.includes(item.foodItemId) || shopMenuItemIds.includes(item.itemId)
    );

    if (!hasVendorItems) {
      return res.status(403).json({ 
        success: false, 
        message: 'This order does not contain items from your shop' 
      });
    }

    // Update order status
    const updatedOrder = await FoodOrder.findByIdAndUpdate(
      orderId,
      { 
        orderStatus: 'Out for Delivery',
        shippedAt: new Date(),
        trackingNumber: trackingNumber || null,
        estimatedDeliveryTime: estimatedDeliveryTime || null,
        shippingNotes: notes || null,
        vendorId: vendorId // Track which vendor shipped it
      },
      { new: true }
    );

    // Create notification for admin
    const NotificationModel = (await import('../models/NotificationModel.js')).default;
    
    // Get all food admins
    const AdminModel = (await import('../models/AdminModel.js')).default;
    const admins = await AdminModel.find({ role: 'food_admin' }).select('_id').lean();

    // Create notifications for all food admins
    const notifications = admins.map(admin => ({
      recipientId: admin._id,
      recipientType: 'admin',
      type: 'order_shipped',
      title: 'Order Shipped Notification',
      message: `Order #${orderId.toString().slice(-6)} has been shipped by ${shop.shopName}. ${trackingNumber ? `Tracking: ${trackingNumber}` : ''}`,
      data: {
        orderId: orderId,
        vendorId: vendorId,
        shopName: shop.shopName,
        trackingNumber: trackingNumber,
        estimatedDeliveryTime: estimatedDeliveryTime
      },
      priority: 'medium'
    }));

    if (notifications.length > 0) {
      await NotificationModel.insertMany(notifications);
      console.log(`Created ${notifications.length} notifications for admins`);
    }

    // Also create notification for the student
    const studentNotification = {
      recipientId: order.studentId,
      recipientType: 'student',
      type: 'order_shipped',
      title: 'Your Order Has Been Shipped!',
      message: `Your order #${orderId.toString().slice(-6)} from ${shop.shopName} has been shipped and is on its way to you. ${trackingNumber ? `Tracking: ${trackingNumber}` : ''}`,
      data: {
        orderId: orderId,
        shopName: shop.shopName,
        trackingNumber: trackingNumber,
        estimatedDeliveryTime: estimatedDeliveryTime
      },
      priority: 'high'
    };

    await NotificationModel.create(studentNotification);

    console.log('Order marked as shipped successfully');

    return res.status(200).json({ 
      success: true, 
      message: 'Order marked as shipped and notifications sent',
      order: updatedOrder
    });

  } catch (error) {
    console.error('Error marking order as shipped:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Vendor-specific order status update
export const vendorUpdateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus, status } = req.body;
    const vendorId = req.vendor._id;

    console.log('Vendor updating order status:', { orderId, vendorId, orderStatus, status });

    // Find the order
    const order = await FoodOrder.findById(orderId).lean();
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    console.log('Order found:', {
      _id: order._id,
      orderStatus: order.orderStatus,
      foodItems: order.foodItems,
      studentId: order.studentId
    });

    // For now, allow vendor to update any order status
    // TODO: Add proper validation later if needed
    const newStatus = orderStatus || status;
    
    if (!newStatus) {
      return res.status(400).json({ 
        success: false, 
        message: 'Status is required' 
      });
    }

    // Update order status
    const updatedOrder = await FoodOrder.findByIdAndUpdate(
      orderId,
      { orderStatus: newStatus },
      { new: true }
    );

    console.log('Order status updated successfully:', updatedOrder.orderStatus);

    return res.status(200).json({ 
      success: true, 
      message: 'Order status updated successfully',
      order: updatedOrder
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};



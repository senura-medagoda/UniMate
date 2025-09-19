import userModel from '../models/M_userModel.js'

const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body
    console.log('Adding to cart:', { userId, itemId, size });
    
    if (!userId || !itemId) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const userData = await userModel.findById(userId)
    if (!userData) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const cartData = userData.cartData || {}

    if (!cartData[itemId]) cartData[itemId] = {}
    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1

    await userModel.findByIdAndUpdate(userId, { cartData }, { new: true })
    console.log('Cart updated successfully for user:', userId);
    res.json({ success: true, message: 'Added To Cart' })
  } catch (error) {
    console.error('Error adding to cart:', error)
    res.status(500).json({ success: false, message: error.message })
  }
}

const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body
    console.log('Updating cart:', { userId, itemId, size, quantity });
    
    if (!userId || !itemId || size === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const userData = await userModel.findById(userId)
    if (!userData) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const cartData = userData.cartData || {}

    if (!cartData[itemId]) cartData[itemId] = {}
    cartData[itemId][size] = quantity

    // Remove item completely if quantity is 0
    if (quantity === 0) {
      delete cartData[itemId][size];
      // If no sizes left for this item, remove the item completely
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    }

    await userModel.findByIdAndUpdate(userId, { cartData }, { new: true })
    console.log('Cart updated successfully for user:', userId);
    res.json({ success: true, message: 'Cart Updated' })
  } catch (error) {
    console.error('Error updating cart:', error)
    res.status(500).json({ success: false, message: error.message })
  }
}

const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body
    console.log('Getting cart for user:', userId);
    
    if (!userId) {
      return res.status(400).json({ success: false, message: 'Missing userId' });
    }

    const userData = await userModel.findById(userId)
    if (!userData) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    console.log('Cart data retrieved for user:', userId, userData.cartData);
    res.json({ success: true, cartData: userData.cartData || {} })
  } catch (error) {
    console.error('Error getting user cart:', error)
    res.status(500).json({ success: false, message: error.message })
  }
}

export { addToCart, updateCart, getUserCart }

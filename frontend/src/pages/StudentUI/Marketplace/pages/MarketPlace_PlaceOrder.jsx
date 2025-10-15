import React, { useContext, useState } from 'react'
import M_Title from '../components/M_Title'
import M_CartTotal from '../components/M_CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/M_ShopContext'
import MarketPlace_Navbar from '../components/MarketPlace_Navbar'
import axios from 'axios'
import { toast } from 'react-toastify'

const MarketPlace_PlaceOrder = ({ user, setUser }) => {
  const { navigate, token, cartItems, clearCart, getCartAmount, delivery_fee, products } = useContext(ShopContext)

  const [method, setMethod] = useState('cod')

  // ✅ fix setter name typo
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    district: '',
    phone: '',
  })

  // Add validation state
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  //  single handler used by ALL inputs
  const onChangeHandler = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  }

  const validateZipcode = (zipcode) => {
    const zipRegex = /^[0-9]{5,6}$/
    return zipRegex.test(zipcode)
  }

  const validateForm = () => {
    const newErrors = {}

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters'
    } else if (!/^[a-zA-Z\s]+$/.test(formData.firstName.trim())) {
      newErrors.firstName = 'First name can only contain letters and spaces'
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters'
    } else if (!/^[a-zA-Z\s]+$/.test(formData.lastName.trim())) {
      newErrors.lastName = 'Last name can only contain letters and spaces'
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Street validation
    if (!formData.street.trim()) {
      newErrors.street = 'Street address is required'
    } else if (formData.street.trim().length < 5) {
      newErrors.street = 'Street address must be at least 5 characters'
    }

    // City validation
    if (!formData.city.trim()) {
      newErrors.city = 'City is required'
    } else if (formData.city.trim().length < 2) {
      newErrors.city = 'City must be at least 2 characters'
    } else if (!/^[a-zA-Z\s]+$/.test(formData.city.trim())) {
      newErrors.city = 'City can only contain letters and spaces'
    }

    // State validation
    if (!formData.state.trim()) {
      newErrors.state = 'State is required'
    } else if (formData.state.trim().length < 2) {
      newErrors.state = 'State must be at least 2 characters'
    } else if (!/^[a-zA-Z\s]+$/.test(formData.state.trim())) {
      newErrors.state = 'State can only contain letters and spaces'
    }

    // Zipcode validation
    if (!formData.zipcode.trim()) {
      newErrors.zipcode = 'Zipcode is required'
    } else if (!validateZipcode(formData.zipcode.trim())) {
      newErrors.zipcode = 'Please enter a valid 5-6 digit zipcode'
    }

    // District validation
    if (!formData.district.trim()) {
      newErrors.district = 'District is required'
    } else if (formData.district.trim().length < 2) {
      newErrors.district = 'District must be at least 2 characters'
    } else if (!/^[a-zA-Z\s]+$/.test(formData.district.trim())) {
      newErrors.district = 'District can only contain letters and spaces'
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!validatePhone(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit phone number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  //  submit theform
  const onSubmit = async (e) => {
    e.preventDefault()

    // Validate form before submission
    if (!validateForm()) {
      toast.error('Please fix the validation errors before submitting.')
      return
    }

    setIsSubmitting(true)

    try {

      let orderItems = []

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items))
            if (itemInfo) {
              itemInfo.size = item
              itemInfo.quantity = cartItems[items][item]
              orderItems.push(itemInfo)

            }

          }
        }
      }
      let orderData = {
        userId: user?.id || user?._id,
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee
      }

      switch (method) {
        //api calls for COD orders
        case 'cod':
              const studentToken = localStorage.getItem('studentToken');
              try {
                const response= await axios.post('http://localhost:5001/api/order/M_place',orderData,{headers:{token: studentToken}})
                if (response.data.success) {
                  clearCart() // This clears both context and localStorage
                  navigate('/M_orders')
                  
                }else{
                  toast.error(`❌ Order failed: ${response.data.message}`)
                }
              } catch (error) {
                console.error('Order API error:', error);
                toast.error(`❌ Order API not available. Please try again later.`);
              }
          break;

        //api calls for Stripe payments
        case 'stripe':
              const stripeToken = localStorage.getItem('studentToken');
              try {
                // Store order data for payment confirmation
                console.log('Storing order data:', orderData);
                localStorage.setItem('stripeOrderData', JSON.stringify(orderData));
                
                const response = await axios.post('http://localhost:5001/api/order/M_stripe-checkout', orderData, {headers: {token: stripeToken}});
                if (response.data.success) {
                  // Redirect to Stripe checkout
                  window.location.href = response.data.url;
                } else {
                  toast.error(`❌ Stripe checkout failed: ${response.data.message}`);
                }
              } catch (error) {
                console.error('Stripe checkout error:', error);
                toast.error(`❌ Stripe checkout not available. Please try again later.`);
              }
          break;

        default:
          break;
      }



    } catch (error) {
      console.log(error)
      toast.error(`❌ Network error: ${error.message}. Please try again.`)
    } finally {
      setIsSubmitting(false)
    }

    navigate('/M_orders')
  }

  return (
    <div className='mr-10 ml-10'><MarketPlace_Navbar user={user} setUser={setUser} />
    <div className='min-h-screen bg-gradient-to-br from-amber-50/30 via-orange-50/30 to-yellow-50/30 mt-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        

        <div className='py-8'>
          {/* Progress */}
          <div className='mb-12'>
            <div className='flex items-center justify-center max-w-md mx-auto'>
              <div className='flex items-center'>
                <div className='flex items-center justify-center w-8 h-8 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-full text-sm font-medium'>
                  ✓
                </div>
                <span className='ml-2 text-sm font-medium text-gray-600'>Cart</span>
              </div>
              <div className='w-16 h-px bg-gradient-to-r from-yellow-600 to-orange-600 mx-4'></div>
              <div className='flex items-center'>
                <div className='flex items-center justify-center w-8 h-8 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-full text-sm font-medium'>
                  2
                </div>
                <span className='ml-2 text-sm font-medium text-orange-600'>Checkout</span>
              </div>
              <div className='w-16 h-px bg-gray-200 mx-4'></div>
              <div className='flex items-center'>
                <div className='flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-500 rounded-full text-sm font-medium'>
                  3
                </div>
                <span className='ml-2 text-sm font-medium text-gray-400'>Complete</span>
              </div>
            </div>
          </div>

          {/* ✅ ONE top-level form only */}
          <form onSubmit={onSubmit} className='grid lg:grid-cols-5 gap-8'>
            {/* Left: Delivery info */}
            <div className='lg:col-span-3'>
              <div className='bg-white rounded-2xl p-8 shadow-sm border border-orange-100'>
                <div className='mb-8'>
                  <div className='flex items-center gap-3 mb-4'>
                    <div className='w-10 h-10 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full flex items-center justify-center'>
                      <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                      </svg>
                    </div>
                    <M_Title text1={'DELIVERY'} text2={'INFORMATION'} />
                  </div>
                  <p className='text-gray-600 text-sm'>Please provide your delivery details</p>
                </div>

                {/* ✅ not a form; just a wrapper */}
                <div className='space-y-6'>
                  {/* Name */}
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <label className='text-sm font-medium text-gray-700' htmlFor='firstName'>First Name</label>
                      <input
                        id='firstName'
                        name='firstName'
                        value={formData.firstName}
                        onChange={onChangeHandler}
                        type='text'
                        placeholder='Enter first name'
                        required
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-all duration-200 ${
                          errors.firstName 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                            : 'border-gray-200 focus:border-orange-500 focus:ring-orange-200'
                        }`}
                      />
                      {errors.firstName && (
                        <p className='text-red-500 text-xs mt-1'>{errors.firstName}</p>
                      )}
                    </div>
                    <div className='space-y-2'>
                      <label className='text-sm font-medium text-gray-700' htmlFor='lastName'>Last Name</label>
                      <input
                        id='lastName'
                        name='lastName'
                        value={formData.lastName}
                        onChange={onChangeHandler}
                        type='text'
                        placeholder='Enter last name'
                        required
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-all duration-200 ${
                          errors.lastName 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                            : 'border-gray-200 focus:border-orange-500 focus:ring-orange-200'
                        }`}
                      />
                      {errors.lastName && (
                        <p className='text-red-500 text-xs mt-1'>{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-gray-700' htmlFor='email'>Email Address</label>
                    <input
                      id='email'
                      name='email'
                      value={formData.email}
                      onChange={onChangeHandler}
                      type='email'
                      placeholder='Enter email address'
                      required
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-all duration-200 ${
                        errors.email 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                          : 'border-gray-200 focus:border-orange-500 focus:ring-orange-200'
                      }`}
                    />
                    {errors.email && (
                      <p className='text-red-500 text-xs mt-1'>{errors.email}</p>
                    )}
                  </div>

                  {/* Street */}
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-gray-700' htmlFor='street'>Street Address</label>
                    <input
                      id='street'
                      name='street'
                      value={formData.street}
                      onChange={onChangeHandler}
                      type='text'
                      placeholder='Enter street address'
                      required
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-all duration-200 ${
                        errors.street 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                          : 'border-gray-200 focus:border-orange-500 focus:ring-orange-200'
                      }`}
                    />
                    {errors.street && (
                      <p className='text-red-500 text-xs mt-1'>{errors.street}</p>
                    )}
                  </div>

                  {/* City / State */}
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <label className='text-sm font-medium text-gray-700' htmlFor='city'>City</label>
                      <input
                        id='city'
                        name='city'
                        value={formData.city}
                        onChange={onChangeHandler}
                        type='text'
                        placeholder='Enter city'
                        required
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-all duration-200 ${
                          errors.city 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                            : 'border-gray-200 focus:border-orange-500 focus:ring-orange-200'
                        }`}
                      />
                      {errors.city && (
                        <p className='text-red-500 text-xs mt-1'>{errors.city}</p>
                      )}
                    </div>
                    <div className='space-y-2'>
                      <label className='text-sm font-medium text-gray-700' htmlFor='state'>State</label>
                      <input
                        id='state'
                        name='state'
                        value={formData.state}
                        onChange={onChangeHandler}
                        type='text'
                        placeholder='Enter state'
                        required
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-all duration-200 ${
                          errors.state 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                            : 'border-gray-200 focus:border-orange-500 focus:ring-orange-200'
                        }`}
                      />
                      {errors.state && (
                        <p className='text-red-500 text-xs mt-1'>{errors.state}</p>
                      )}
                    </div>
                  </div>

                  {/* Zip / District */}
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <label className='text-sm font-medium text-gray-700' htmlFor='zipcode'>Zipcode</label>
                      <input
                        id='zipcode'
                        name='zipcode'
                        value={formData.zipcode}
                        onChange={onChangeHandler}
                        type='text'
                        placeholder='Enter zipcode'
                        required
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-all duration-200 ${
                          errors.zipcode 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                            : 'border-gray-200 focus:border-orange-500 focus:ring-orange-200'
                        }`}
                      />
                      {errors.zipcode && (
                        <p className='text-red-500 text-xs mt-1'>{errors.zipcode}</p>
                      )}
                    </div>
                    <div className='space-y-2'>
                      <label className='text-sm font-medium text-gray-700' htmlFor='district'>District</label>
                      <input
                        id='district'
                        name='district'
                        value={formData.district}
                        onChange={onChangeHandler}
                        type='text'
                        placeholder='Enter district'
                        required
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-all duration-200 ${
                          errors.district 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                            : 'border-gray-200 focus:border-orange-500 focus:ring-orange-200'
                        }`}
                      />
                      {errors.district && (
                        <p className='text-red-500 text-xs mt-1'>{errors.district}</p>
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-gray-700' htmlFor='phone'>Phone Number</label>
                    <input
                      id='phone'
                      name='phone'
                      value={formData.phone}
                      onChange={onChangeHandler}
                      type='tel'
                      placeholder='Enter 10-digit phone number'
                      required
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-all duration-200 ${
                        errors.phone 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                          : 'border-gray-200 focus:border-orange-500 focus:ring-orange-200'
                      }`}
                    />
                    {errors.phone && (
                      <p className='text-red-500 text-xs mt-1'>{errors.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Summary + Payment */}
            <div className='lg:col-span-2 space-y-6'>
              <div className='bg-white rounded-2xl p-6 shadow-sm border border-orange-100 sticky top-6'>
                <div className='flex items-center gap-3 mb-6'>
                  <div className='w-8 h-8 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full flex items-center justify-center'>
                    <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />
                    </svg>
                  </div>
                  <h3 className='text-lg font-semibold text-gray-900'>Order Summary</h3>
                </div>

                <M_CartTotal />

                {/* Payment Method */}
                <div className='mt-8'>
                  <div className='flex items-center gap-3 mb-6'>
                    <div className='w-8 h-8 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full flex items-center justify-center'>
                      <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' />
                      </svg>
                    </div>
                    <M_Title text1={'PAYMENT'} text2={'METHOD'} />
                  </div>

                  {/* Use visually-hidden radios for accessibility */}
                  <div className='space-y-3'>
                    <label
                      className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-sm ${method === 'stripe' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <input
                        type='radio'
                        name='paymentMethod'
                        value='stripe'
                        checked={method === 'stripe'}
                        onChange={() => setMethod('stripe')}
                        className='sr-only'
                      />
                      <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${method === 'stripe' ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                        }`}>
                        {method === 'stripe' && <div className='w-2 h-2 bg-white rounded-full' />}
                      </div>
                      <img className='h-6' src={assets.stripe_logo} alt='Stripe' />
                      <span className='text-sm font-medium text-gray-700 flex-grow'>Credit/Debit Card</span>
                    </label>


                    <label
                      className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-sm ${method === 'cod' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <input
                        type='radio'
                        name='paymentMethod'
                        value='cod'
                        checked={method === 'cod'}
                        onChange={() => setMethod('cod')}
                        className='sr-only'
                      />
                      <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${method === 'cod' ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                        }`}>
                        {method === 'cod' && <div className='w-2 h-2 bg-white rounded-full' />}
                      </div>
                      <div className='flex items-center gap-2'>
                        <svg className='w-6 h-6 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' />
                        </svg>
                        <span className='text-sm font-medium text-gray-700'>Cash on Delivery</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Submit */}
                <div className='mt-8'>
                  <button
                    type='submit'
                    disabled={isSubmitting}
                    className={`w-full font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                      isSubmitting 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white hover:shadow-lg hover:shadow-orange-200 transform hover:-translate-y-0.5'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className='animate-spin w-5 h-5' fill='none' viewBox='0 0 24 24'>
                          <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                          <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                        </svg>
                        PROCESSING...
                      </>
                    ) : (
                      <>
                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                        </svg>
                        PLACE ORDER
                      </>
                    )}
                  </button>

                  <div className='mt-4 flex items-center justify-center gap-4 text-xs text-gray-500'>
                    <div className='flex items-center gap-1'>
                      <svg className='w-4 h-4 text-green-500' fill='currentColor' viewBox='0 0 20 20'>
                        <path fillRule='evenodd' d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z' />
                      </svg>
                      SSL Secured
                    </div>
                    <div className='flex items-center gap-1'>
                      <svg className='w-4 h-4 text-blue-500' fill='currentColor' viewBox='0 0 20 20'>
                        <path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                      </svg>
                      Safe Payment
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>

        </div>
      </div>
    </div>
    </div>
  )
}

export default MarketPlace_PlaceOrder

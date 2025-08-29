import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/M_ShopContext'
import M_Title from '../components/M_Title';
import { assets } from '../assets/assets';
import M_CartTotal from '../components/M_CartTotal';
import MarketPlace_Navbar from '../components/MarketPlace_Navbar'
import M_Footer from '../components/M_Footer';

const MarketPlace_Cart = () => {


  const {products ,currency , cartItems ,updateQuantity,navigate} = useContext(ShopContext);

  const [cartData,setCartData] = useState([]);

  useEffect(()=>{

    const tempData =[];
    for(const items in cartItems){

      for(const item in cartItems[items]){
        if (cartItems[items][item] > 0) {
          tempData.push({
            _id:items,
            size:item,
            quantity:cartItems[items][item]
          })
          
        }
      }
    }
   setCartData(tempData);
    

  },[cartItems])

  return (
    <div>
    <div className='mr-10 ml-10'>
      <MarketPlace_Navbar/>
    <div className='border-t pt-14'>

      <div className='text-2xl mb-3'>
        <M_Title text1={'Your '} text2={'CART'}/>

      </div>
      <div className=''>
        {
          cartData.map((item,index)=>{
           const productData = products.find((product) => product._id === item._id);

            return (
              <div key={index} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
                  <div className='flex items-start gap-6'>
                    <img className='w-16 sm:w-20' src={productData.image[0]} alt="" />
                    <div >

                      <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>
                      <div className='flex items-center gap-5 mt-2'>
                        <p>{currency}{productData.price}</p>
                        <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>{item.size}</p>

                      </div>
                    </div>

                  </div>
                  <input onChange={(e)=>e.target.value === ''|| e.target.value === '0' ? null :updateQuantity(item._id,item.size,Number(e.target.value))} type="number" min={1}  defaultValue={item.quantity} className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1'/>
                  <img  onClick={()=>updateQuantity(item._id,item.size,0)} className='w-4 mr-4 sm:w-5 cursor-pointer'  src={assets.bin_icon} alt="" />


              </div>
            )
          })
        }

      </div>
      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <M_CartTotal />
          <div className='w-full text-end'>
            <button onClick={()=>navigate('/M_placeorder')} className='bg-orange-400 text-white text-sm my-8 px-8 py-3'>PROCEED TO CHECKOUT</button>


          </div>

        </div>

      </div>


      </div>
    </div>
    <M_Footer/>
    </div>
  )
}

export default MarketPlace_Cart

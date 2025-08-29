import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/M_ShopContext'
import M_Title from './M_Title';
import M_ProductItem from './M_ProductItem';

const M_RelatedProducts = ({category,subCategory}) => {



    const {products} = useContext(ShopContext);
    const [related,setRelated] = useState([]);


        useEffect(()=>{

            if (products.length > 0) {
                let productsCopy =products.slice();

                productsCopy= productsCopy.filter((item)=>category== item.category);
                productsCopy= productsCopy.filter((item)=> subCategory==item.subCategory);

                setRelated(productsCopy.slice(0,5));
                
            }
            else{

            }


        },[products])

  return (
    <div className='my-24'>
        <div className='text-center text-3xl py-2'>
        <M_Title text1={'RELATED'} text2={'PRODUCTS ITEMS'} />
       </div>
       <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6 '>
        {related.map((item,index)=>(
            <M_ProductItem  key={index}  id={item._id} name={item.name} price={item.price} image={item.image}/>
        ))}
       </div>

      
    </div>
  )
}

export default M_RelatedProducts

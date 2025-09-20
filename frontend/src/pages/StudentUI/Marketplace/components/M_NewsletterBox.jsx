import React, { useState } from 'react'

const M_NewsletterBox = () => {
    const [email, setEmail] = useState('');
    const [isHovered, setIsHovered] = useState(false);

    const onSubmitHandler = (event) => {
        event.preventDefault(); //when we submit this it will not reload the webpage
        
    }

    return (
        <div className='text-center py-16 px-6 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden'>
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-100/20 via-orange-100/20 to-amber-100/20"></div>
            <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-r from-orange-400/10 to-amber-400/10 rounded-full blur-xl"></div>
            
            <div className="relative z-10 max-w-2xl mx-auto">
                {/* Header with gradient text */}
                <div className="mb-8">
                    <h2 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-600 via-orange-600 to-amber-600 bg-clip-text text-transparent mb-4 leading-tight'>
                        Subscribe & Save 20%
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-yellow-600 to-orange-600 mx-auto rounded-full"></div>
                </div>

                <p className='text-lg text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto'>
                    Stay ahead with our latest collection, featuring smart picks and student-friendly styles made just for you.
                </p>

                {/* Enhanced form */}
                <div className='max-w-md mx-auto'>
                    <div className='relative group'>
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 via-orange-600 to-amber-600 rounded-full blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                        
                        <div className='relative flex items-center bg-white rounded-full shadow-2xl border-2 border-transparent bg-clip-padding backdrop-blur-sm'>
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/20 via-orange-600/20 to-amber-600/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            
                            <input 
                                className='flex-1 px-6 py-4 text-gray-700 placeholder-gray-400 bg-transparent rounded-l-full outline-none text-lg relative z-10'
                                type="email" 
                                placeholder='Enter your email address'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            
                            <button 
                                className='bg-gradient-to-r from-yellow-600 via-orange-600 to-amber-600 hover:from-yellow-700 hover:via-orange-700 hover:to-amber-700 text-white font-semibold px-8 py-4 rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl relative z-10'
                                onClick={onSubmitHandler}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                            >
                                <span className="flex items-center gap-2">
                                    SUBSCRIBE
                                    <svg 
                                        className={`w-5 h-5 transform transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Trust indicators */}
                <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full"></div>
                        <span>No spam, ever</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-orange-600 to-amber-600 rounded-full"></div>
                        <span>Unsubscribe anytime</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-full"></div>
                        <span>Exclusive offers</span>
                    </div>
                </div>

                {/* Floating elements for extra visual appeal */}
                <div className="absolute top-1/2 left-4 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute top-1/3 right-8 w-2 h-2 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute bottom-1/3 left-8 w-4 h-4 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full opacity-15 animate-pulse" style={{animationDelay: '2s'}}></div>
            </div>
        </div>
    )
}

export default M_NewsletterBox
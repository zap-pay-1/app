import React from 'react'

export default function CheckoutPage() {
  return (
    <div className='w-full h-screen flex flex-col md:flex-row '>
 <div className=' w-full md:w-1/2 flex-1 bg-gray-50 h-screen flex  py-4 md:py-10 justify-end border-b border-r-0 md:border-r md:border-gray-200 px-4 md:px-10 relative'>
    <div className=' bg-red-600 h-[600px] w-full md:max-w-[500px]'>
        <p>iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii</p>
    </div>

    <div className='p-5 border border-yellow-500 hidden md:flex items-center justify-center absolute bottom-2 w-full max-w-[500px]'>
        <p>Absolute contents</p>
    </div>
 </div>
 <div className='w-full md:w-1/2 flex-1 bg-white h-screen flex px-4  md:px-20 py-4 md:py-10'>
<div className=' bg-blue-600 h-[300px] w-full md:max-w-[500px]'>
        <p>iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii</p>
    </div>
 </div>
    </div>
  )
}

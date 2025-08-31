"use client"

import React from 'react'
import { SidebarTrigger } from './ui/sidebar'
import { PenLine, PhoneForwardedIcon } from 'lucide-react'

export default function Header() {
  return (
    <div className='w-full sticky top-0 z-20 h-[50px] flex items-center justify-between border-b border-gray-200 bg-white mb-5'>
      <div className='w-full'>
      <SidebarTrigger className='' />
    </div>
    <div className='flex items-center space-x-2 px-5'>
   <div className='flex items-center space-x-2 cursor-pointer'>
    <PhoneForwardedIcon className='w-4 h-4 text-muted-foreground' />
       <p className='text-sm'>Support</p>
   </div>
     <div className='flex items-center space-x-2 cursor-pointer'>
    <PenLine className='w-4 h-4 text-muted-foreground' />
       <p className='text-sm'>Feedback</p>
   </div>
    </div>
    </div>
  )
}

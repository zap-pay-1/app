import Image from 'next/image'
import React from 'react'

type Props = {
    showBeta? : boolean
}
export default function LogoComp({showBeta = true}: Props) {
  return (
    <div className='flex items-center space-x-1'>
      <Image  src={`/img/logo.svg`} width={120} height={30} alt='logo' className='w-[140px] object-cover'/>
     {showBeta && (
         <p className='text-xs text-muted-foreground'>BETA</p>
     )}
    </div>
  )
}

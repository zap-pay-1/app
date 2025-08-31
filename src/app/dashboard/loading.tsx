import { Loader2 } from 'lucide-react'
import React from 'react'

export default function loading() {
  return (
    <div className='w-full h-screen flex items-center justify-center'>
      <Loader2 className='w-9 h-9 text-muted-foreground animate-spin' />
    </div>
  )
}

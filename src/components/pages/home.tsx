"use client"

import React from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'
import { Button } from '../ui/button'
export default function Home() {
    const {signOut} = useAuth()

  return (
    <div>
      <Button onClick={() => signOut()}>Logout</Button>
    </div>
  )
}

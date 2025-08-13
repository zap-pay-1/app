import Login from '@/components/pages/login'
import React from 'react'

import { currentUser } from '@clerk/nextjs/server'
import Dashboard from '@/components/pages/dashboard'

export default async function Page() {
  const user = await currentUser()
  console.log("user is", user)
  if (!user) return <div>Not signed in</div>

  return <div><Dashboard /></div>
}
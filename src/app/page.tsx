import Login from '@/components/pages/login'
import React from 'react'

import { currentUser } from '@clerk/nextjs/server'


export default async function Page() {
  const user = await currentUser()
  console.log("user is", user)
  if (!user) return <div>Not signed in</div>

  return <div>
    <p>Home page</p>
  </div>
}
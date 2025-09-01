

import Login from '@/components/pages/login'
import React from 'react'

import { currentUser, } from '@clerk/nextjs/server'
import Home from '@/components/pages/home'


export default async function Page() {
  return <div>
    <Home />
  </div>
}
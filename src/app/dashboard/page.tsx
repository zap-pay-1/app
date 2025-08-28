import Dashboard from '@/components/pages/dashboard'
import React from 'react'
import { auth } from '@clerk/nextjs/server'
import { SERVER_EDNPOINT_URL } from '@/lib/constants';
import { PAYMENT_DATA, STATS } from '@/types/types';

export default async function Page() {
   const { userId } = await auth()
 const res = await fetch(`${SERVER_EDNPOINT_URL}users/stats/${userId}`, {
    // next: { revalidate: 120 },
    cache: 'no-store',
  });
  const stats : STATS = await res.json();
  console.log(stats)
//
  return (
    <Dashboard stats={stats} />
  )
}
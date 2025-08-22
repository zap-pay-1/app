import Dashboard from '@/components/pages/dashboard'
import React from 'react'
import { auth } from '@clerk/nextjs/server'
import { SERVER_EDNPOINT_URL } from '@/lib/constants';
import { PAYMENT_DATA } from '@/types/types';

export default async function Page() {
   const { userId } = await auth()
 const res = await fetch(`${SERVER_EDNPOINT_URL}payments/${userId}`, {
    // next: { revalidate: 120 },
    cache: 'no-store',
  });
  const payments : PAYMENT_DATA = await res.json();
  console.log(payments)

  return (
    <Dashboard data={payments} />
  )
}
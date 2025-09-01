import Payments from '@/components/pages/payments'
import React from 'react'
import {auth} from '@clerk/nextjs/server'
import { SERVER_EDNPOINT_URL } from '@/lib/constants';
import { PAYMENT_DATA } from '@/types/types';
export default async function page() {
    const { userId } = await auth()
   const res = await fetch(`${SERVER_EDNPOINT_URL}payments/${userId}`, {
      // next: { revalidate: 120 },
      cache: 'no-store',
    });
    const payments : PAYMENT_DATA = await res.json();
  return (
    <div className='w-full'>
      <Payments data={payments}  />
    </div>
  )
}

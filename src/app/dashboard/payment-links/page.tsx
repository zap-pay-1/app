import PaymentLinks from '@/components/pages/payment-links'
import React from 'react'
import {auth} from '@clerk/nextjs/server'
import { SERVER_EDNPOINT_URL } from '@/lib/constants';
import { USER_PAYMENT_LINKS_DATA } from '@/types/types';
export default async function page() {
     const { userId } = await auth()
     const res = await fetch(`${SERVER_EDNPOINT_URL}payment-links/user/${userId}`, {
        // next: { revalidate: 120 },
        cache: 'no-store',
      });
      const paymentsLinks : USER_PAYMENT_LINKS_DATA = await res.json();
      console.log(paymentsLinks)
  return (
    <div className='w-full'>
      <PaymentLinks data={paymentsLinks} />
    </div>
  )
}

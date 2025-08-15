import CheckoutPage from '@/components/pages/checkou-page';
import PayLinkPage from '@/components/pages/payment-link-page'
import { SERVER_EDNPOINT_URL } from '@/lib/constants';
import { PAYMENT_LINK_DATA, SESSION_DATA } from '@/types/types';
import React from 'react'
export default async function page({ params }: any) {
    const sessionId = await params?.sessionId;
    console.log("payId", sessionId)
  const res = await fetch(`${SERVER_EDNPOINT_URL}payment-links/session/${sessionId}`, {
    // next: { revalidate: 120 },
    cache: 'no-store',
  });
  const session: SESSION_DATA = await res.json();

  console.log("Payment link", session)

  return (
    <div>
<CheckoutPage data={session}/>
    </div>
  );
}

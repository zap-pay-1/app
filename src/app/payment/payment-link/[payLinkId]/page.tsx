import PayLinkPage from '@/components/pages/payment-link-page'
import { SERVER_EDNPOINT_URL } from '@/lib/constants';
import { PAYMENT_LINK_DATA } from '@/types/types';
import React from 'react'
export default async function page({ params }: any) {
    const payLinkId = await params?.payLinkId;
    console.log("payId", payLinkId)
  const res = await fetch(`${SERVER_EDNPOINT_URL}payment-links/${payLinkId}`, {
    // next: { revalidate: 120 },
    cache: 'no-store',
  });
  const paymentLink: PAYMENT_LINK_DATA = await res.json();


  return (
    <div>
  <PayLinkPage data={paymentLink} />
    </div>
  );
}


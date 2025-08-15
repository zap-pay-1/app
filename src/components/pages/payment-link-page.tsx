import { PAYMENT_LINK_DATA } from '@/types/types'
import React from 'react'


type Props = {
  data : PAYMENT_LINK_DATA
}
export default function PayLinkPage(data : Props) {
  return (
    <div>
      <p>Pay link page : {data.data.paymentLink.title}</p>
    </div>
  )
}

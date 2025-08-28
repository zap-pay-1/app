


export interface BUSINESS {
    id : string
    userId : string
    name : string
    country : string
    addressLine1 : string
    addressLine2 : string
    city : string
    state : string
    zipCode : string
    notificationEmail : string
    supportEmail : string
    website : string
    companyIdentificationNumber : string
    taxIdentificationNumber : string
    privacyPolicyUrl : string
    termsUrl : string
    countryCode : string
    businessPhone : string
    createdAt : Date

}

export interface WALLET {
 label : string
 address : string
}
 export interface USER {
    first_name : string
    last_name : string
    email : string
    wallets : WALLET[]
 }

  export interface USER_DATA {
      message: string,
      user : USER
 }

 export interface SUPPORTED_COLLECTION_FIELDS {
    name : boolean
    email : boolean
    phone : boolean
    billing : boolean
    shipping : boolean
    customFields : boolean
 }

  export interface CUSTOMER_COLLECTED_DATA {
    name? : string
    email? : string
    phone? : string
    city? : string
    state? : string
    zipCode : string
 }

 export interface PRODUCT {
    image : string
    title? : string
    name ? : string
    description : string
    price? : number
    quantity: number,
 }
 export interface METADATA {
   note : string
   type : "checkout" | "payLink"
 }
 export interface COUPON {
    id : string
   active : boolean
   code : string
   name : string
   couponType : string
   discountValue : number
   redemptionLimit : number
   timesRedeemed : number
   updatedAt : Date
   createdAt : Date

 }

export interface COUPONS {
    mesaage : string
    coupons : COUPON[]
}
export interface PAY_LINK_TYPES {
    id : string
    business : BUSINESS
    user : USER
    title : string
    description : string
    tag : string
    btnText : string
    successMsg : string
    amount : number
    currency : string
    collectFields : SUPPORTED_COLLECTION_FIELDS
    products : PRODUCT[]
    metadata? : METADATA
    type : "fixed" | "custom"
    successUrl? : string
    cancelUrl ? : string
    createdAt: Date,
    updatedAt: Date

}

export interface PAYMENT_LINK_DATA {
  message : string
  paymentLink : PAY_LINK_TYPES
}

export interface USER_PAYMENT_LINKS_DATA {
  message : string
  paymentLinks : PAY_LINK_TYPES[]
}


export interface USER_BUSINESSES {
    message : string
    businesses : BUSINESS[]
}

  
export interface SESSION {
    id : string
    business : BUSINESS
    amount : number
    status : "pending" | "confirmed" | "failed" | "canceled" | "expired"
    currency : string
    cancelUrl? : string
    successUrl? : string
    collectFields : SUPPORTED_COLLECTION_FIELDS
    collectedData : CUSTOMER_COLLECTED_DATA
    products : PRODUCT[]
    expiresAt : Date
    createdAt : Date
    updatedAt : Date
    txId : string
    confirmations : string
    verificationAttempts : string
    user : USER

}
export interface SESSION_DATA  {
 message : string
 session : SESSION
}

export interface PAYMENT {
    id : string
    businessId : string
    amount : number
    currency : string
    status : "pending" | "comfirmed" | "failed" | "canceled" | "expired"
    metadata? : METADATA
     successUrl: string,
    cancelUrl: string,
    ollectFields : SUPPORTED_COLLECTION_FIELDS
    collectedData : CUSTOMER_COLLECTED_DATA
    producs : PRODUCT[]
    paymentLink : PAY_LINK_TYPES
    business : BUSINESS
    user : USER
    expiresAt: Date,
    createdAt: Date,
    updatedAt: Date,
    txid: string,
    confirmations: number,
    verificationAttempts: number,
}

export interface PAYMENT_DATA {
    payments : PAYMENT[]
}

export interface API_KEY {
    id : string
    label : string
    key : string
    keyHash : string
    status : string
    createdAt : Date
}

export interface WEB_HOOK {
    id : string
    url : string
    events : string[]
    secret : string
    status : string
    createdAt : Date
}

export interface API_KEYS_DATA {
    message : string
    apiKeys : API_KEY[]
}

export interface WEB_HOOKS_DATA {
    message : string
    webhooks : WEB_HOOK[]
}

export interface VOLUME_STATS {
    value : number
    unit : string
    growth : string
    thisMonth : number
    lastMoth : number
}

export interface TRASANCTIONS_STATS {
    value : number
    growth : string
    thisMonth : number
    lastMoth : number
}
export interface PAYLINKS_STATS {
    value : number
    growth : string
}

export interface STATS {
  stats : {
    totalVolume : VOLUME_STATS
    totalTransactions : TRASANCTIONS_STATS
    totalPaymentLinks : PAYLINKS_STATS

  }
}





 
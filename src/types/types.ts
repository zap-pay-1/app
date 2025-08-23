


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
    title : string
    description : string
    price? : number
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
     successUrl: string,
    cancelUrl: string,
    ollectFields : SUPPORTED_COLLECTION_FIELDS
    collectedData : CUSTOMER_COLLECTED_DATA
    producs : PRODUCT[]
    paymentLink : PAY_LINK_TYPES
    business : BUSINESS
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



 
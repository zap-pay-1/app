


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

export interface USER_BUSINESSES {
    message : string
    businesses : BUSINESS[]
}


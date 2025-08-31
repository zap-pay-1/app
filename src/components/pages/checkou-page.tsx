/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client"


import { PRODUCT, SESSION_DATA } from '@/types/types'
import { CheckCircle2, Clock, Copy, CreditCard, Download, Loader2, LogOut, Mail, Phone, QrCode, ScanIcon, User, Wallet, XCircle } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Separator } from '../ui/separator'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Checkbox } from '../ui/checkbox'
import { Button } from '../ui/button'
import useCollectInfo from '@/hooks/useCollectFileds'
import { useSubmitTx } from '@/hooks/useSubmitTx'
import { useParams } from "next/navigation";
import { connect, disconnect, getLocalStorage, isConnected, request } from "@stacks/connect";
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { socket } from '@/lib/wsClient'
import TransferSbtc from '../transferSbtc'
import { showContractCall } from '@stacks/connect';
import { Cl, Pc, PostConditionMode, AnchorMode } from '@stacks/transactions';
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { sBTClOGO, SERVER_EDNPOINT_URL } from '@/lib/constants'
import { openInExplorer, truncateMiddle } from '@/lib/utils'
import ScanQrCode from '../scanQrCode'
import { toast } from '@/hooks/use-toast'
import { error } from 'console'
import {  formatSatsToBtcUI1, getBtcUsdPrice, satsToUsd, usdToBtc } from '@/lib/currencyRates'
import { useSatsToUsd } from '@/hooks/useGetUsdBySats'
import TimerCountDown from '../timer-countDown'
import {CountryWithPhoneCode, useCountriesWithPhoneCodes } from '@/hooks/useGetCountries'

type Props = {
  data : SESSION_DATA
}

type RedeemProps = {
  couponCode : string
  sessionId : string
}

export default function CheckoutPage(data : Props) {
    const [timeRemaining, setTimeRemaining] = useState(59 * 60 + 13);
     const [connected, setConnected] = useState(false);
     const [paymentState, setpaymentState] = useState("default")
     const [stxAddress, setstxAddress] = useState<string | null>()
     const [btcAddress, setbtcAddress] = useState<string | null>()
    const [txStatus, settxStatus] = useState()
     const [isApplyCoupon, setisApplyCoupon] = useState(false)
    const [finalAmount, setfinalAmount] = useState(data.data.session.amount)
     const [appliedCode, setappliedCode] = useState("")
     const [applied, setapplied] = useState(false)
     const [transferTxId, settransferTxId] = useState("")
     const [isConnectingWallet, setisConnectingWallet] = useState(false)
    const { data: countries =[], isLoading, isError: isCountriesError, error: countriesError } = useCountriesWithPhoneCodes();

     
  
     useEffect(() => {
   if(isConnected()){
  // Get stored addresses from local storage
const userData = getLocalStorage();
if (userData?.addresses) {
  const stxAddress = userData.addresses.stx[0].address;
  const btcAddress = userData.addresses.btc[0].address;
  setstxAddress(stxAddress)
  setbtcAddress(btcAddress)
  console.log('STX:', stxAddress);
  console.log('BTC:', btcAddress);
   }
}
     }, [connected])
     


  const params = useParams(); 
  const sessionId = params.sessionId; 
   console.log("current pay state", paymentState)

useEffect(() => {
  socket.emit('join_checkout', sessionId);

  socket.on('paymentStatus', (msg) => {
    if (msg.sessionId === sessionId) {
      settxStatus(msg.txId);
      setpaymentState(msg.status); // stop loading immediately when tx confirmed
    }
  });

  return () => {
    socket.off('paymentStatus');
  };
}, [sessionId]);

   /*const [collectInfo, setCollectInfo] = useState<CollectInfo>({
    name: "",
    email: "",
    phone: "",
    billingAddress: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    shippingAddress: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    customFields: {},
  });*/
  const { collectInfo, updateField } = useCollectInfo();
  // Timer countdown
  /*useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);*/

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };


async function connectWallet() {
  // Check if already connected
  if (isConnected()) {
    console.log('Already authenticated');
    return;
  }

  // Connect to wallet
  setisConnectingWallet(true)
  const response = await connect();
  setisConnectingWallet(false)
  setConnected(true)
  console.log('Connected:', response.addresses);
}

// Logout function
function disconnectWallet() {
  disconnect(); // Clears storage and wallet selection
  setstxAddress(null)
}

// Transfer BTC

const sbtcTokenAddress = "ST1F7QA2MDF17S807EPA36TSS8AMEFY4KA9TVGWXT.sbtc-token";
const sbtcTokenName = "sbtc-token";
const recipient = data.data.session.user.wallets[0].address; // who receives sBTC
// 2. Function args (transfer)
const amount = 1000; // in satoshis (check decimals of sBTC contract)
const sender = stxAddress || recipient; // this will actually be auto-filled from wallet


  console.log("stxaddress", stxAddress)

// 3. Post condition: ensure exactly `amount` sBTC leaves wallet
const postConditions = [
  Pc.principal(sender)
    .willSendEq(finalAmount)
    .ft(sbtcTokenAddress, sbtcTokenName),
];

const {data:usdValue, isLoading:usdValueLoading} = useSatsToUsd(finalAmount)

const transferSbtc = async () => {
  if(!stxAddress) {
    console.log("Connect Wallet first")
    return
  }
  return new Promise((resolve, reject) => {
    try {
      showContractCall({
        contractAddress: sbtcTokenAddress,
        contractName: sbtcTokenName,
        functionName: "transfer",
        functionArgs: [
          Cl.uint(finalAmount),             // amount (make sure in sats)
          Cl.principal(sender),        // sender principal
          Cl.principal(recipient),     // recipient principal
          Cl.none(),                   // optional memo
        ],
        postConditions,
        postConditionMode: PostConditionMode.Deny,
        anchorMode: AnchorMode.Any,
        network: STACKS_TESTNET,
        onFinish: (data) => {
          if (!data.txId) return;
          resolve(data.txId);
        },
        onCancel: () => {
          console.log("User canceled transaction");
          setpaymentState("failed");
          reject(new Error("User canceled transaction"));
        },
      });
    } catch (error) {
      console.error("Transaction error:", error);
      setpaymentState("failed");
      reject(error);
    }
  });
};
 
  const handleApplyCoupon = async () => {
    const res = await axios.post(`${SERVER_EDNPOINT_URL}coupons/redeem-coupon`, {
      couponCode : appliedCode,
      sessionId : sessionId
    })
    return res
  }

   const applyMutation = useMutation({
    mutationFn : handleApplyCoupon,
    mutationKey : ['api/coupons'],
    onSuccess : (info) => {
      toast({
        title : "Coupon applied succefully"
      })
      console.log("The information returned", info)
      setfinalAmount(info.data?.amount)
      setapplied(true)
    },
    onError : (erro) => {
        toast({
        title : "Something went wrong",
        description : erro.message
      })
    }
   })

   //@ts-ignore
   const submitTx = useSubmitTx(sessionId);

      console.log("the collected ddata", collectInfo)
  /* const handleSubmitTx = async () => {
      console.log("handleSubmitTx called");
    const txId = await transferSbtc()
    console.log("Got txId:", txId);
    const res =  await submitTx.mutateAsync({
      txid : txId,
      collectedData : collectInfo
     })
     console.log("submitted copy", res)
    setTimeout(() => {
    setpaymentState("loading");
  }, 70000);
   }*/

  const handleSubmitTx = async () => {
  console.log("handleSubmitTx called");

  try {
    // 1️⃣ Transfer sBTC and get txId
    const txId = await transferSbtc();
    console.log("Got txId:", txId);
    //@ts-ignore
    settransferTxId(txId)

    // 2️⃣ Submit the tx to your backend
    const res = await submitTx.mutateAsync({
      //@ts-ignore
      txid: txId,
      collectedData: collectInfo,
    });


    // 3️⃣ Set loading state immediately
    setpaymentState("loading");

    // 4️⃣ Keep the loading for 70 seconds
    await new Promise((resolve) => setTimeout(resolve, 90000));

    // 5️⃣ After 70s, you can check status or leave socket to update
    console.log("Loading finished, now waiting for backend socket update");
    // Optionally, update state to something else if needed
    // setpaymentState("waitingConfirmation");

  } catch (err) {
    console.error("Error submitting tx:", err);
    setpaymentState("error");
  }
};

 const handleSendPayment = async () => {
 if(!isConnected()){
  connectWallet ()
 }else {
  handleSubmitTx()
 }
 }


    const LoadingState = () => (
       <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="text-center py-8"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-16 h-16 mx-auto mb-6"
                    >
                      <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full">
                        <Loader2 className="w-8 h-8 text-blue-600 m-3 animate-spin" />
                      </div>
                    </motion.div>

                    <motion.h3 
                      className="text-lg font-semibold text-gray-900 mb-2"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      Processing Payment
                    </motion.h3>
                    
                    <motion.p 
                      className="text-sm text-gray-600 mb-6"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Waiting for blockchain confirmation...
                      <br />
                      This may take up to 1 minute.
                    </motion.p>

                    <motion.div
                      className="bg-blue-50 rounded-lg p-4 text-left"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Amount</span>
                        <span className="font-medium text-gray-900">{formatSatsToBtcUI1(finalAmount)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Network</span>
                        <span className="font-medium text-gray-900">{'Stacks'}</span>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="flex items-center justify-center mt-4 text-xs text-gray-500"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Clock className="w-4 h-4 mr-1" />
                      Please do not close this window
                    </motion.div>
                  </motion.div>
    )
  
     const ExpiredState = () => (
       <motion.div
                    key="expired"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="text-center py-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                      className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center"
                    >
                      <XCircle className="w-8 h-8 text-red-600" />
                    </motion.div>

                    <motion.h3 
                      className="text-xl font-bold text-gray-900 mb-2"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Session Expired
                    </motion.h3>
                    
                    <motion.p 
                      className="text-sm text-gray-600 mb-6"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      Your checkout session has expired.
                      <br />
                      Please start a new payment process.
                    </motion.p>

                    <motion.div
                      className="bg-red-50 rounded-lg p-4 mb-6"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Amount</span>
                        <span className="font-medium text-gray-900">{formatSatsToBtcUI1(finalAmount)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Status</span>
                        <span className="font-medium text-red-600">Expired</span>
                      </div>
                    </motion.div>

                    <motion.div
                      className="space-y-3"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Button 
                        onClick={() => window.location.reload()}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        data-testid="button-try-again"
                      >
                        Try Again
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setpaymentState('default')}
                        className="w-full"
                        data-testid="button-back-to-checkout"
                      >
                        Back to Checkout
                      </Button>
                    </motion.div>
                  </motion.div>
                )

      const FailedState = () => (
       <motion.div
                    key="failed"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="text-center py-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                      className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center"
                    >
                      <XCircle className="w-8 h-8 text-red-600" />
                    </motion.div>

                    <motion.h3 
                      className="text-xl font-bold text-gray-900 mb-2"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                     Payment Failed
                    </motion.h3>
                    
                    <motion.p 
                      className="text-sm text-gray-600 mb-6"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      Something went wrong while processing.
                      <br />
                        Please try again or contact support.
                    </motion.p>

                    <motion.div
                      className="bg-red-50 rounded-lg p-4 mb-6"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Amount</span>
                        <span className="font-medium text-gray-900">{formatSatsToBtcUI1(finalAmount)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Status</span>
                        <span className="font-medium text-red-600">Failed</span>
                      </div>
                    </motion.div>

                    <motion.div
                      className="space-y-3"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Button 
                        onClick={() => setpaymentState("default")}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        data-testid="button-try-again"
                      >
                        Try Again
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setpaymentState('default')}
                        className="w-full"
                        data-testid="button-back-to-checkout"
                      >
                        Back to Checkout
                      </Button>
                    </motion.div>
                  </motion.div>
                )


     const SuccesssState = () => (
       <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  >
                    <div className="text-center py-4">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                        className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"
                      >
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                      </motion.div>

                      <motion.h3 
                        className="text-xl font-bold text-gray-900 mb-2"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        Payment Successful!
                      </motion.h3>
                      
                      <motion.p 
                        className="text-sm text-gray-600 mb-6"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        Your payment has been confirmed on the blockchain
                      </motion.p>
                    </div>

                    <motion.div
                      className="space-y-4"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-gray-900">Transaction Hash</span>
                          <button 
                            onClick={() => navigator.clipboard.writeText(transferTxId)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs font-mono text-gray-700 break-all">{transferTxId}</p>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">From Address</span>
                          <span className="font-mono text-xs text-gray-900">{stxAddress && truncateMiddle(stxAddress, 13, 6)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">To Address</span>
                          <span className="font-mono text-xs text-gray-900">{data.data.session.user.wallets && truncateMiddle(data.data.session.user.wallets[0].address, 13, 6)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Amount</span>
                          <span className="font-medium text-gray-900">{formatSatsToBtcUI1(finalAmount)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Status</span>
                          <span className="font-medium text-green-600">Comfirmed</span>
                        </div>
                      </div>

                      <Separator />

                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700"
                        data-testid="button-download-receipt"
                        onClick={() => openInExplorer(transferTxId)}
                      >
                        <ScanIcon className="w-4 h-4 mr-2" />
                        View on Explorer
                      </Button>
                    </motion.div>
                  </motion.div>
     )

     const DefaultState = () => (
      <div className='   w-full md:max-w-[500px]'>
        <div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-semibold text-gray-900">{data.data.session.business?.name}</h1>
                </div>
            <TimerCountDown onExpire={() => setpaymentState("expire")} initialMinutes={30} initialSeconds={0} />
              </div>

              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Fill in the details</h2>

                <div  className="space-y-6">
                  {/* Contact Information */}
                  <div>
{(
  data?.data?.session?.collectFields?.email ||
  data?.data?.session?.collectFields?.phone ||
  data?.data?.session?.collectFields?.name
) && (
  <h3 className="text-sm font-medium text-gray-700 mb-4">Contact Information</h3>
)}
                   
                    <div className="space-y-0 ">
                      {data.data.session.collectFields.name  &&
                      <div className='flex items-center space-x-0.5'>
                        <Label htmlFor="name" className="flex items-center text-sm font-medium text-gray-700">
                          <User className="w-4 h-4 mr-2" />
                        </Label>
                        <Input
                          id="name"
                          placeholder="Name"
                          value={collectInfo.name}
                         onChange={(e) => updateField("name", e.target.value)}
                          className="mt-1 h-8"
                          data-testid="input-name"
                        />
                      </div>
}

{data.data.session.collectFields.email  &&
                      <div className='flex items-center space-x-0.5'>
                        <Label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700">
                          <Mail className="w-4 h-4 mr-2" />
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Email"
                          value={collectInfo.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          className="mt-1 h-7"
                          data-testid="input-email"
                        />
                      </div>

}

                      {data.data.session.collectFields.phone && (
                        <div className='flex items-center space-x-0.5'>
                          <Label htmlFor="phone" className="flex items-center text-sm font-medium text-gray-700">
                            <Phone className="w-4 h-4 mr-2" />
                          </Label>
                          <Input
                            id="phone"
                            placeholder="Phone"
                            value={collectInfo.phone}
                            onChange={(e) => updateField("phone", e.target.value)}
                            className="mt-1 h-8"
                            data-testid="input-phone"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Shipping Information (only if collecting billing) */}
                  {data.data.session.collectFields.shipping || data.data.session.collectFields.billing && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-4">Shipping Information</h3>
                      <div className="space-y-0  rounded-xl">
                        <div className='flex items-center space-x-3'>
                          <Select
                           value={collectInfo.billingAddress.country}
                          onValueChange={(value) => updateField("billingAddress.country", value)}>
                            <SelectTrigger data-testid="select-country">
                              <SelectValue placeholder="Country" />
                            </SelectTrigger>
                            <SelectContent>
                             {
                                        //@ts-ignore
                                       (countries ?? []).map((item: CountryWithPhoneCode, i) => (
                                        <SelectItem key={i} value={item.name}>{item.name}</SelectItem>
                                       ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className='flex items-center space-x-0.5'>
                          <Input
                            id="addressLine1"
                            placeholder="address line 1"
                            value={collectInfo.billingAddress.line1}
                            onChange={(e) => updateField("billingAddress.line1", e.target.value)}
                            className="mt-1"
                            data-testid="input-address-1"
                          />
                        </div>

                        <div className='flex items-center space-x-0.5'>
                          <Input
                            id="addressLine2"
                            placeholder="Address Line 2"
                            value={collectInfo.billingAddress.line2}
                            onChange={(e) => updateField("billingAddress.line2", e.target.value)}
                            className="mt-1"
                            data-testid="input-address-2"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Input
                              id="city"
                              placeholder="City"
                              value={collectInfo.billingAddress.city}
                              onChange={(e) => updateField("billingAddress.city", e.target.value)}
                              className="mt-1"
                              data-testid="input-city"
                            />
                          </div>
                          <div>
                            <Input
                              id="state"
                              placeholder="State"
                              value={collectInfo.billingAddress.state}
                              onChange={(e) => updateField("billingAddress.state", e.target.value)}
                              className="mt-1"
                              data-testid="input-state"
                            />
                          </div>
                          <div>
                            <Input
                              id="zipCode"
                              placeholder="Zip Code"
                              value={collectInfo.billingAddress.zipCode}
                              onChange={(e) => updateField("billingAddress.zipCode", e.target.value)}
                              className="mt-1"
                              data-testid="input-zip"
                            />
                          </div>
                        </div>

                      </div>
                    </div>
                  )}


                </div>
                 <div className='mt-10'>
                  <h4 className='text-sm'>Continue with your preferred payment method</h4>
                   <div className='my-3 space-y-3'>
                   <div className='flex justify-between items-center px-4 border rounded-xl cursor-pointer py-3' onClick={() => handleSendPayment()}>
                    {submitTx.isPending ? (
                      <div className='flex space-x-1 items-stretch'><Loader2 className='animate-spin text-muted-foreground'  /> <p>Loading...</p> </div>
                    ) : isConnectingWallet ? (
                      <div className='flex space-x-1 items-stretch'><Loader2 className='animate-spin text-muted-foreground'  /> <p>Connecting Wallet...</p> </div>
                    ) :(
                     <div className='flex items-center space-x-1'> 
                      <Wallet className='w-5 h-5 text-gray-800' />
                      <p className='font-semibold text-sm'>{stxAddress ? "Pay With Wallet" : "Connect Wallet"}</p>
                     </div>
                    )}
                     <div className='flex items-center space-x-2'>
                     <Image src={`/img/wallet-1.svg`} width={22} height={22} alt='wallet' className='rounded-lg'  />
                     <Image src={`/img/wallet-2.svg`} width={22} height={22} alt='wallet' className='rounded-lg'  />
                     <Image src={`/img/wallet-3.svg`} width={22} height={22} alt='wallet' className='rounded-lg'  />
                     </div>
                   </div>

                    <ScanQrCode data={data.data} amount={finalAmount} />

                    
                  
                   </div>
             
                  </div>
              </div>
            </div>
    </div>
     )
     
  return (
    <div className='w-full h-screen flex flex-col md:flex-row relative '>
      {stxAddress &&
  <div className='  absolute right-5 top-1 hidden md:flex'>
    <div className='flex p-2 bg-gray-100 rounded-xl items-center space-x-3 border'> 
       <p className='text-sm'>{truncateMiddle(stxAddress)}</p>
       <LogOut className='w-4 h-4 cursor-pointer'  onClick={() => disconnectWallet()}/>
    </div>
  </div>
}
 <div className=' w-full md:w-1/2 flex-1 bg-gray-50 md:min-h-screen flex  py-4 md:py-10 justify-end border-b border-r-0 md:border-r md:border-gray-200 px-4 md:px-10 relative'>
    <div className=' md:max-h-[700px]  w-full md:max-w-[500px]'>
    <div className="bg-white rounded-lg border p-6 h-fit">
              <div className="flex items-center justify-between mb-6">
  <h3 className="text-lg font-semibold text-gray-900">Total Payable</h3>
  <div className="flex items-center space-x-2">
    {/* BTC Logo */}
    <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
      <Image src={sBTClOGO} width={24} height={24} alt="sBTC Logo" className="object-cover" />
    </div>

    {/* Amounts */}
    <div className="flex flex-col items-end">
      <span className="text-lg font-medium text-gray-900">
        {formatSatsToBtcUI1(data.data.session.amount) || data.data.session.amount.toFixed(2)}
      </span>
      <span className="text-xs text-gray-500 mt-0.5">
        ≈ ${usdValue?.toFixed(2) || data.data.session.amount.toFixed(2)} USD
      </span>
    </div>
  </div>
</div>

       
           {data.data.session.products?.map((prod : PRODUCT, i) => (
              <div className="space-y-4 mb-6" key={i}>
                <div className="flex items-center space-x-3">
                  <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center border p-0.5 border-gray-100 ">
                    {prod.image ? (
                      <img  src={prod.image} className=' w-full h-full object-cover' />
                    ) : (
                    <CreditCard className="w-8 h-8 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1 flex justify-between">
                    <div>
                    <h4 className=" text-sm font-medium text-gray-900 ">{prod.name ? prod.name :   prod.title && prod.title}</h4>
                     <div className="text-xs text-gray-500 mt-1"> {prod.description ?<p className='capitalize'>{truncateMiddle(prod.description, 26, 4)}</p>: <p><span className=' font-light'>Qty</span> {prod?.quantity || 1}</p> }</div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">{prod.price ? prod.price.toFixed(2) : usdValue?.toFixed(2)} USD</span>
                    </div>
                  </div>
                </div>
              </div>
           ))}
        

              {/*DEMO PRODUCTS CARD*/}

                    <div className="space-y-4 mb-6 hidden">
                <div className="flex items-center space-x-3">
                  <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-8 h-8 text-gray-600" />
                  </div>
                  <div className="flex-1 flex border justify-between">
                    <div>
                    <h4 className="text-sm font-medium text-gray-900">{`this is the title part`}</h4>
                    <p className="text-xs text-gray-500 mt-1">{`This is the description part.....`}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">10.0 USDC</span>
                    </div>
                  </div>
                </div>
              </div>
        
              

              <div className="space-y-3 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{usdValue?.toFixed(2)} USD</span>
                </div>
                
                {isApplyCoupon ? (
                  <div>
          <div className='w-full p-0.5 border  flex  rounded-lg'>
            <Input className='
             border-none 
    focus:outline-none 
    focus:ring-0 
    focus:ring-offset-0 
    focus-visible:ring-0 
    focus-visible:ring-offset-0
            ' 
             value={appliedCode}
             onChange={(e) => setappliedCode(e.target.value)}
            />
             <Button size={"sm"} onClick={() => applyMutation.mutateAsync()} disabled={!appliedCode || applyMutation.isPending || applied}>{applyMutation.isPending ? "Loading.." : applied? "Applied" : "Apply"}</Button>
             </div>
               {applyMutation.isError &&
              <div className='my-1'> 
                <p className='text-xs text-red-600'>Coupon not found or inactive.</p>
              </div>
             }
             </div>
                ):(
                <div className="flex justify-between text-sm">
                  <button className="text-blue-600 hover:text-blue-800 text-left">
                    Add discount code
                  </button>
                  <button className="text-blue-600 hover:text-blue-800" onClick={() => setisApplyCoupon(true)}>
                    Apply
                  </button>
                </div>
)}

                <Separator />

                <div className="flex justify-between font-semibold">
                  <span>Amount due</span>
                  <div className="flex flex-col items-end">
      <span className="text-lg font-medium text-gray-900">
        {formatSatsToBtcUI1(data.data.session.amount) || data.data.session.amount.toFixed(2)}
      </span>
      <span className="text-xs text-gray-500 mt-0.5">
        ≈ ${usdValue?.toFixed(2) || data.data.session.amount.toFixed(2)} USD
      </span>
    </div>
                </div>
              </div>
            </div>
    </div>

    <div className='p-5  hidden md:flex items-center justify-center absolute bottom-2 w-full max-w-[500px] space-x-3'>
        <div>
           <p className=''><span className=' text-xs text-gray-400'>Powered by</span> <span className='font-semibold text-balance text-sm text-gray-400'>MunaPay</span></p>
        </div>
        <div className='w-[2px] h-6 bg-gray-300'></div>
        <div className='flex items-center space-x-3'>
          <p className=' text-xs text-gray-400'>Terms</p>
           <p className=' text-xs text-gray-400'>Terms</p>
        </div>
    </div>
 </div>
 <div className='w-full md:w-1/2 flex-1 bg-white h-screen flex px-4  md:px-20 py-4 md:py-10'>

    <motion.div className=' w-full md:max-w-[500px]'
    transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <AnimatePresence mode="wait">
      {paymentState === 'default' && (
        <DefaultState  />
      )}
        {paymentState === 'loading' && (
        <LoadingState  />
      )}
        {paymentState === 'comfirmed' && (
        <SuccesssState  />
      )}
        {paymentState === 'expire' && (
        <ExpiredState  />
      )}
        {paymentState === 'failed' && (
        <FailedState  />
      )}
       {paymentState === 'error' && (
        <FailedState  />
      )}
       {paymentState === 'abort_by_post_condition' && (
        <FailedState  />
      )}
      </AnimatePresence>

    </motion.div>
 </div>
    </div>
  )
}

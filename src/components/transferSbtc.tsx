import React from 'react'
import { Button } from './ui/button'
import { showContractCall } from '@stacks/connect';
import { Cl, Pc, PostConditionMode, AnchorMode } from '@stacks/transactions';
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';
export default function TransferSbtc() {

    const sbtcTokenAddress = "ST1F7QA2MDF17S807EPA36TSS8AMEFY4KA9TVGWXT.sbtc-token";
const sbtcTokenName = "sbtc-token";
// 2. Function args (transfer)
const amount = 1000; // in satoshis (check decimals of sBTC contract)
const sender = "ST3CC2E8Q38R6S4P8A5JKZZ2T15CJEG6HG44ZME4M"; // this will actually be auto-filled from wallet
const recipient = "ST2XQ48SPBHKQZPQVK3Y1BGJYV8Q9ZJT3K9A7KCJB"; // who receives sBTC

// 3. Post condition: ensure exactly `amount` sBTC leaves wallet
const postConditions = [
  Pc.principal(sender)
    .willSendEq(amount)
    .ft(sbtcTokenAddress, sbtcTokenName),
];

// 4. Show wallet popup
const transferSbtc = async() =>  {
  await showContractCall({
    contractAddress: sbtcTokenAddress,
    contractName: sbtcTokenName,
    functionName: "transfer",
    functionArgs: [
      Cl.uint(amount),              // amount
      Cl.principal(sender),         // sender principal
      Cl.principal(recipient),      // recipient principal
      Cl.none(),                    // optional memo
    ],
    postConditions,
    postConditionMode: PostConditionMode.Deny,
    anchorMode: AnchorMode.Any,
    network: STACKS_TESTNET,
    onFinish: (data) => {
      console.log("Transaction submitted:", data.txId);
    },
    onCancel: () => {
      console.log("User canceled transaction");
    },
  });
}
  return (
    <div>
      <Button onClick={transferSbtc}>Transfer Sbtc</Button>
    </div>
  )
}

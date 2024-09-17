import {
    Transaction,
    WalletAdapterNetwork,
    WalletNotConnectedError
  } from "@demox-labs/aleo-wallet-adapter-base";
  import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
  import  { FC, useEffect, useState } from "react";
  
  export const RequestTransaction: FC = () => {
    const { publicKey, requestTransaction ,transactionStatus} = useWallet();
    const [txStatus, setTxStatus] = useState<string>("Not Started");
    const [txId, setTxId] = useState<string>("");
  
    const onClick = async () => {
      if (!publicKey) throw new WalletNotConnectedError();
      
      const inputs =[
        "[247u8,54u8,129u8,47u8,89u8,127u8,6u8,160u8,118u8,116u8,179u8,239u8,130u8,220u8,51u8,84u8,53u8,0u8,23u8,104u8]",
        "7762733435768450701175613132855021266350528043336325734791579813035551958761field",
        "aleo1rgak647n3t7ryn9ua5dcetg44c0u9yx8peg4vd37zwrw0rvvtq9szvf50w",
        "1000000u128",
        "19u64",
        "6708445u64",
        "[aleo1eslxvrgwtev68t9y6l0nxtts86exewrucgj33aw309k20tch45ps6pex24,aleo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3ljyzc,aleo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3ljyzc,aleo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3ljyzc,aleo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3ljyzc]",
        "[sign156lp7emfvmzcm2sgh79e36qfxt4dgjum4dlctlnqrlzag7e5xuqe89rql24q2a933r55uku6qkg8c05mnkrmfvsthvd2z2vu3utvjq4gn5s3nawm2kd052ekynu68mg4jty0wshn8udha3ss2zar3839q52er42ve68ugrhtzupr2apptlpejtcnm605j9zdun6ehfzqaa53yqlj79y,sign156lp7emfvmzcm2sgh79e36qfxt4dgjum4dlctlnqrlzag7e5xuqe89rql24q2a933r55uku6qkg8c05mnkrmfvsthvd2z2vu3utvjq4gn5s3nawm2kd052ekynu68mg4jty0wshn8udha3ss2zar3839q52er42ve68ugrhtzupr2apptlpejtcnm605j9zdun6ehfzqaa53yqlj79y,sign156lp7emfvmzcm2sgh79e36qfxt4dgjum4dlctlnqrlzag7e5xuqe89rql24q2a933r55uku6qkg8c05mnkrmfvsthvd2z2vu3utvjq4gn5s3nawm2kd052ekynu68mg4jty0wshn8udha3ss2zar3839q52er42ve68ugrhtzupr2apptlpejtcnm605j9zdun6ehfzqaa53yqlj79y,sign156lp7emfvmzcm2sgh79e36qfxt4dgjum4dlctlnqrlzag7e5xuqe89rql24q2a933r55uku6qkg8c05mnkrmfvsthvd2z2vu3utvjq4gn5s3nawm2kd052ekynu68mg4jty0wshn8udha3ss2zar3839q52er42ve68ugrhtzupr2apptlpejtcnm605j9zdun6ehfzqaa53yqlj79y,sign156lp7emfvmzcm2sgh79e36qfxt4dgjum4dlctlnqrlzag7e5xuqe89rql24q2a933r55uku6qkg8c05mnkrmfvsthvd2z2vu3utvjq4gn5s3nawm2kd052ekynu68mg4jty0wshn8udha3ss2zar3839q52er42ve68ugrhtzupr2apptlpejtcnm605j9zdun6ehfzqaa53yqlj79y]",
        "28556963657430695u128",
        "[94u8,39u8,161u8,62u8,58u8,178u8,12u8,108u8,122u8,54u8,181u8,124u8,191u8,171u8,90u8,239u8,228u8,78u8,124u8,226u8]"
    ]
      const fee = 1_000_000; // This will fail if fee is not set high enough
  
      const aleoTransaction = Transaction.createTransaction(
        publicKey,
        WalletAdapterNetwork.TestnetBeta,
       "token_service_dev_v3.aleo",
        "token_receive",
        inputs,
        fee,
        false
      );
  
      if (requestTransaction) {
        // Returns a transaction Id, that can be used to check the status. Note this is not the on-chain transaction id
        const txId=await requestTransaction(aleoTransaction);
        setTxStatus("Started")
        if(transactionStatus){
            console.log("Checking status")
            const status=await transactionStatus(txId)
            setTxStatus(status)
        }
        setTxId(txId)
      }
    };
    const checkStatus = async () => {
        if(transactionStatus){
            console.log("Checking status")
            const status=await transactionStatus(txId)
            setTxStatus(status)
        }

       
      
    }
    // make a useEffect that will check in interval of 5 seconds the status of the transaction and on every change of the status update the state
    useEffect(()=>{
      const interval=setInterval(async ()=>{
        if(transactionStatus){
            console.log("Checking status")
          const status=await transactionStatus(txId)
          setTxStatus(status)
        }
      },5000)
      return ()=>clearInterval(interval)
    },[txId])
  
    return (
        <>
      <button onClick={onClick} disabled={!publicKey}>
        Request Transaction
      </button>
        <div>
            <p>Transaction Status: {txStatus}</p>
            <p>Transaction Id: {txId}</p>
        </div>

        <button onClick={checkStatus}>Check status</button>
      </>
    );
  };
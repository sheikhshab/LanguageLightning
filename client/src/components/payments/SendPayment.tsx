import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { usePayment } from "@/contexts/PaymentContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Send, Loader2, Check, X, Smartphone, Users, AlertCircle } from "lucide-react";
import BottomNavigation from "@/components/shared/BottomNavigation";
import OfflineBanner from "@/components/shared/OfflineBanner";
import PinInput from "@/components/shared/PinInput";
import SecurityBadge from "@/components/shared/SecurityBadge";
import { formatCurrency } from "@/lib/paymentUtils";
import { checkNfcSupport, initiateNfcPayment, getNfcPositioningGuide, getNfcInstructions, NfcStatus } from "@/lib/nfcUtils";

export const SendPayment: React.FC = () => {
  const [_, setLocation] = useLocation();
  const { createTransaction, simulateNfcPayment, isLoading } = usePayment();
  const { user } = useAuth();
  
  const [step, setStep] = useState<"details" | "confirm" | "pin" | "result" | "nfc">("details");
  const [amount, setAmount] = useState<string>("");
  const [receiverInfo, setReceiverInfo] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [pin, setPin] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [transactionSuccess, setTransactionSuccess] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<"transfer" | "nfc">("transfer");
  const [nfcSupported, setNfcSupported] = useState<boolean | null>(null);
  const [nfcStatus, setNfcStatus] = useState<NfcStatus>("inactive");
  
  // Check if device supports NFC when component mounts
  useEffect(() => {
    const checkNfc = async () => {
      try {
        const supported = await checkNfcSupport();
        setNfcSupported(supported);
      } catch (error) {
        console.error("Failed to check NFC support:", error);
        setNfcSupported(false);
      }
    };
    
    checkNfc();
  }, []);
  
  const handleNext = () => {
    if (step === "details") {
      // Validate input
      if (!amount || parseFloat(amount) <= 0) {
        setError("Please enter a valid amount");
        return;
      }
      
      if (!receiverInfo) {
        setError("Recipient information is required");
        return;
      }
      
      // Check if user has enough balance
      const amountValue = parseFloat(amount);
      const fee = amountValue * 0.005;
      const totalAmount = amountValue + fee;
      
      if (user && parseFloat(user.balance) < totalAmount) {
        setError("Insufficient balance for this transaction");
        return;
      }
      
      setError(null);
      setStep("confirm");
    } else if (step === "confirm") {
      setStep("pin");
    } else if (step === "pin") {
      if (pin.length !== 4) {
        setError("Please enter a valid 4-digit PIN");
        return;
      }
      
      if (user && pin !== user.pin) {
        setError("Incorrect PIN");
        return;
      }
      
      handleSendPayment();
    }
  };
  
  const handleSendPayment = async () => {
    setError(null);
    
    try {
      if (paymentMethod === "nfc") {
        setStep("nfc");
        return;
      }
      
      const amountValue = parseFloat(amount);
      const transaction = await createTransaction({
        type: "send",
        amount: amount,
        receiverInfo: receiverInfo,
        paymentMethod: "transfer",
      });
      
      if (transaction) {
        setTransactionSuccess(true);
      } else {
        setTransactionSuccess(false);
        setError("Transaction failed. Please try again.");
      }
    } catch (error) {
      setTransactionSuccess(false);
      setError("An unexpected error occurred");
    }
    
    setStep("result");
  };
  
  const handleNfcPayment = async () => {
    setNfcStatus("inactive");
    setError(null);
    
    try {
      // First update NFC status through callbacks
      const result = await initiateNfcPayment(
        { amount: parseFloat(amount), receiverName: receiverInfo },
        (status) => setNfcStatus(status)
      );
      
      // If NFC connection was successful, process the transaction
      if (result) {
        const success = await simulateNfcPayment(parseFloat(amount), receiverInfo);
        setTransactionSuccess(success);
        
        if (!success) {
          setError("Transaction was initiated but could not be completed");
        }
      } else {
        setTransactionSuccess(false);
        setError("Could not establish NFC connection");
      }
      
      // Go to result screen
      setStep("result");
    } catch (error) {
      console.error("NFC payment error:", error);
      setTransactionSuccess(false);
      setError("An error occurred during the NFC payment");
      setStep("result");
    }
  };
  
  const goBack = () => {
    if (step === "details") {
      setLocation("/dashboard");
    } else if (step === "confirm") {
      setStep("details");
    } else if (step === "pin") {
      setStep("confirm");
    } else if (step === "nfc") {
      setStep("pin");
    } else if (step === "result") {
      if (transactionSuccess) {
        setLocation("/dashboard");
      } else {
        setStep("details");
      }
    }
  };

  return (
    <div className="min-h-screen pb-16">
      <div className="bg-white px-4 py-3 border-b border-neutral-200 flex items-center">
        <button onClick={goBack} className="p-2 text-neutral-600">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold flex-grow text-center mr-8">Send Payment</h1>
      </div>
      
      <OfflineBanner className="mt-1 mx-2" />
      
      <div className="px-6 py-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 flex items-center">
            <X className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}
        
        {step === "details" && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Send Money</h2>
            <p className="text-neutral-600 mb-6">Enter payment details</p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Amount to Send
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <span className="text-neutral-500 text-lg">PKR</span>
                  </div>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-14 text-lg"
                  />
                </div>
                <div className="mt-1 flex justify-between text-xs text-neutral-500">
                  <span>Fee: 0.5%</span>
                  <span>
                    Available Balance: {user ? formatCurrency(parseFloat(user.balance)) : formatCurrency(0)}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Recipient Information
                </label>
                <Input
                  placeholder="Phone number or username"
                  value={receiverInfo}
                  onChange={(e) => setReceiverInfo(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Note (Optional)
                </label>
                <Input
                  placeholder="What's this payment for?"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
              
              {nfcSupported && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Payment Method
                  </label>
                  <Tabs 
                    defaultValue="transfer" 
                    value={paymentMethod}
                    onValueChange={(value) => setPaymentMethod(value as "transfer" | "nfc")}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="transfer" className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        Bank/Account
                      </TabsTrigger>
                      <TabsTrigger value="nfc" className="flex items-center">
                        <Smartphone className="w-4 h-4 mr-2" />
                        NFC Payment
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                  
                  {paymentMethod === "nfc" && (
                    <div className="mt-3 bg-blue-50 p-3 rounded-md text-sm text-blue-700">
                      <div className="flex items-start">
                        <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        <p>NFC payment requires devices to be physically close. Tap the recipient's device to complete the payment.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <Button 
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
              onClick={handleNext}
            >
              Continue
            </Button>
          </div>
        )}
        
        {step === "confirm" && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Confirm Payment</h2>
            <p className="text-neutral-600 mb-6">Review the transaction details</p>
            
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-neutral-100">
                    <div className="text-neutral-600">Amount to Send</div>
                    <div className="font-semibold">{formatCurrency(parseFloat(amount))}</div>
                  </div>
                  <div className="flex justify-between py-2 border-b border-neutral-100">
                    <div className="text-neutral-600">Transaction Fee (0.5%)</div>
                    <div className="font-semibold">{formatCurrency(parseFloat(amount) * 0.005)}</div>
                  </div>
                  <div className="flex justify-between py-2 border-b border-neutral-100">
                    <div className="text-neutral-600">Total Amount</div>
                    <div className="font-semibold text-blue-600">
                      {formatCurrency(parseFloat(amount) * 1.005)}
                    </div>
                  </div>
                  <div className="flex justify-between py-2 border-b border-neutral-100">
                    <div className="text-neutral-600">Recipient</div>
                    <div className="font-semibold">{receiverInfo}</div>
                  </div>
                  <div className="flex justify-between py-2 border-b border-neutral-100">
                    <div className="text-neutral-600">Payment Method</div>
                    <div className="font-semibold flex items-center">
                      {paymentMethod === "nfc" ? (
                        <>
                          <Smartphone className="w-4 h-4 mr-1" />
                          NFC Payment
                        </>
                      ) : (
                        <>
                          <Users className="w-4 h-4 mr-1" />
                          Bank/Account Transfer
                        </>
                      )}
                    </div>
                  </div>
                  {note && (
                    <div className="flex justify-between py-2">
                      <div className="text-neutral-600">Note</div>
                      <div className="font-semibold">{note}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-center mb-6">
              <SecurityBadge type="shield" />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={goBack}
              >
                Edit
              </Button>
              <Button 
                className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
                onClick={handleNext}
              >
                Confirm
              </Button>
            </div>
          </div>
        )}
        
        {step === "pin" && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Enter PIN</h2>
            <p className="text-neutral-600 mb-6">Enter your 4-digit security PIN to authorize this transaction</p>
            
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-blue-700 font-medium">Transaction Amount</div>
                <div className="text-blue-700 font-bold">{formatCurrency(parseFloat(amount))}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-blue-700 font-medium">Recipient</div>
                <div className="text-blue-700 font-medium">{receiverInfo}</div>
              </div>
            </div>
            
            <div className="mb-6">
              <PinInput 
                length={4} 
                onChange={setPin} 
                value={pin} 
              />
            </div>
            
            <Button 
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
              onClick={handleNext}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Authorize Payment"
              )}
            </Button>
          </div>
        )}
        
        {step === "nfc" && (
          <div>
            <h2 className="text-xl font-semibold mb-2">NFC Payment</h2>
            <p className="text-neutral-600 mb-6">
              Hold your phone close to the recipient's device
            </p>
            
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-blue-700 font-medium">Transaction Amount</div>
                <div className="text-blue-700 font-bold">{formatCurrency(parseFloat(amount))}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-blue-700 font-medium">Recipient</div>
                <div className="text-blue-700 font-medium">{receiverInfo}</div>
              </div>
            </div>
            
            <div className="mb-6 text-center">
              <div className="mb-4">
                <div dangerouslySetInnerHTML={{ __html: getNfcPositioningGuide() }} />
              </div>
              
              <div className="mt-6 relative h-10">
                {nfcStatus === "scanning" && (
                  <div className="animate-pulse text-blue-600 flex items-center justify-center">
                    <Smartphone className="mr-2 h-5 w-5" />
                    Scanning for device...
                  </div>
                )}
                
                {nfcStatus === "connecting" && (
                  <div className="text-amber-600 flex items-center justify-center">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Connecting to device...
                  </div>
                )}
                
                {nfcStatus === "processing" && (
                  <div className="text-emerald-600 flex items-center justify-center">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing payment...
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2 mb-6">
              <h3 className="text-sm font-medium text-neutral-700">Instructions:</h3>
              <ul className="space-y-2">
                {getNfcInstructions().map((instruction, index) => (
                  <li key={index} className="flex items-start text-sm text-neutral-600">
                    <span className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    {instruction}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={goBack}
              >
                Cancel
              </Button>
              <Button 
                className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
                onClick={handleNfcPayment}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Start NFC Payment"
                )}
              </Button>
            </div>
          </div>
        )}
        
        {step === "result" && (
          <div>
            <h2 className="text-xl font-semibold mb-2">
              {transactionSuccess ? "Payment Sent!" : "Payment Failed"}
            </h2>
            <p className="text-neutral-600 mb-6">
              {transactionSuccess 
                ? "Your transaction has been processed successfully" 
                : "We couldn't process your payment at this time"}
            </p>
            
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  {transactionSuccess ? (
                    <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                      <Check className="h-8 w-8 text-emerald-600" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                      <X className="h-8 w-8 text-red-600" />
                    </div>
                  )}
                </div>
                
                {transactionSuccess && (
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-neutral-100">
                      <div className="text-neutral-600">Amount Sent</div>
                      <div className="font-semibold">{formatCurrency(parseFloat(amount))}</div>
                    </div>
                    <div className="flex justify-between py-2 border-b border-neutral-100">
                      <div className="text-neutral-600">Transaction Fee</div>
                      <div className="font-semibold">{formatCurrency(parseFloat(amount) * 0.005)}</div>
                    </div>
                    <div className="flex justify-between py-2 border-b border-neutral-100">
                      <div className="text-neutral-600">Total Amount</div>
                      <div className="font-semibold text-blue-600">
                        {formatCurrency(parseFloat(amount) * 1.005)}
                      </div>
                    </div>
                    <div className="flex justify-between py-2">
                      <div className="text-neutral-600">Recipient</div>
                      <div className="font-semibold">{receiverInfo}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-2 gap-3">
              {transactionSuccess ? (
                <>
                  <Button 
                    variant="outline"
                    className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                    onClick={() => setLocation("/transaction-history")}
                  >
                    View History
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
                    onClick={() => setLocation("/dashboard")}
                  >
                    Back to Home
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline"
                    onClick={() => setLocation("/dashboard")}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
                    onClick={() => setStep("details")}
                  >
                    Try Again
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default SendPayment;

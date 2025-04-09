import React, { useState } from "react";
import { useLocation } from "wouter";
import { usePayment } from "@/contexts/PaymentContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Smartphone, Phone, PhoneCall, Check, Loader2 } from "lucide-react";
import BottomNavigation from "@/components/shared/BottomNavigation";
import SecurityBadge from "@/components/shared/SecurityBadge";
import OfflineBanner from "@/components/shared/OfflineBanner";

export const ReceivePayment: React.FC = () => {
  const [_, setLocation] = useLocation();
  const { generateUssdCode, simulateNfcPayment, isLoading, offlineMode } = usePayment();
  
  const [step, setStep] = useState<"amount" | "method" | "nfc" | "ussd" | "confirmation">("amount");
  const [amount, setAmount] = useState<string>("");
  const [ussdCode, setUssdCode] = useState<string>("");
  const [ussdExpiry, setUssdExpiry] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [nfcStatus, setNfcStatus] = useState<"waiting" | "connecting" | "success" | "error">("waiting");
  
  const handleAmountSubmit = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setStep("method");
  };
  
  const handleNfcSelected = () => {
    setStep("nfc");
  };
  
  const handleUssdSelected = async () => {
    setStep("ussd");
    try {
      const response = await generateUssdCode(parseFloat(amount));
      if (response) {
        setUssdCode(response.ussdCode);
        setUssdExpiry(response.expiresIn);
      }
    } catch (error) {
      console.error("Failed to generate USSD code:", error);
    }
  };
  
  const simulateNfcProcess = async () => {
    setNfcStatus("connecting");
    try {
      const success = await simulateNfcPayment(parseFloat(amount), customerName || "Customer");
      if (success) {
        setNfcStatus("success");
        setTimeout(() => {
          setStep("confirmation");
        }, 1000);
      } else {
        setNfcStatus("error");
      }
    } catch (error) {
      setNfcStatus("error");
    }
  };
  
  const goBack = () => {
    if (step === "amount") {
      setLocation("/dashboard");
    } else if (step === "method") {
      setStep("amount");
    } else if (step === "nfc" || step === "ussd") {
      setStep("method");
    } else if (step === "confirmation") {
      setLocation("/dashboard");
    }
  };

  return (
    <div className="min-h-screen pb-16">
      <div className="bg-white px-4 py-3 border-b border-neutral-200 flex items-center">
        <button onClick={goBack} className="p-2 text-neutral-600">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold flex-grow text-center mr-8">Receive Payment</h1>
      </div>
      
      <OfflineBanner className="mt-1 mx-2" />
      
      <div className="px-6 py-6">
        {step === "amount" && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Enter Payment Amount</h2>
            <p className="text-neutral-600 mb-6">How much would you like to receive?</p>
            
            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <span className="text-neutral-500 text-lg">$</span>
                </div>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8 text-lg py-6"
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <div className="text-neutral-500">Fee: 0.5%</div>
                <div className="text-neutral-500">
                  You'll receive: ${amount ? (parseFloat(amount) * 0.995).toFixed(2) : "0.00"}
                </div>
              </div>
            </div>
            
            <Button 
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 py-6"
              onClick={handleAmountSubmit}
              disabled={!amount || parseFloat(amount) <= 0}
            >
              Continue
            </Button>
          </div>
        )}
        
        {step === "method" && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Choose Payment Method</h2>
            <p className="text-neutral-600 mb-6">How would you like to receive ${amount}?</p>
            
            <Tabs defaultValue="nfc" className="mb-6">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="nfc">NFC</TabsTrigger>
                <TabsTrigger value="ussd">USSD</TabsTrigger>
              </TabsList>
              
              <TabsContent value="nfc">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Smartphone className="h-5 w-5 mr-2 text-blue-600" />
                      NFC Payment
                    </CardTitle>
                    <CardDescription>
                      Tap customer's phone or card to your device to receive payment
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <Input
                        placeholder="Customer name (optional)"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="mb-2"
                      />
                      <div className="flex justify-center mb-4">
                        <img 
                          src="https://cdn-icons-png.flaticon.com/512/4403/4403386.png" 
                          alt="NFC Guide" 
                          className="h-40 opacity-70"
                        />
                      </div>
                      <div className="flex justify-center">
                        <SecurityBadge type="shield" />
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
                      onClick={handleNfcSelected}
                    >
                      Start NFC Payment
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="ussd">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Phone className="h-5 w-5 mr-2 text-blue-600" />
                      USSD Payment
                    </CardTitle>
                    <CardDescription>
                      Generate a USSD code for customer to dial on any phone
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <Input
                        placeholder="Customer name (optional)"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="mb-4"
                      />
                      <div className="text-center mb-6">
                        <PhoneCall className="h-16 w-16 mx-auto text-blue-200 mb-2" />
                        <p className="text-sm text-neutral-500">
                          Works with any feature phone, no smartphone or internet required
                        </p>
                      </div>
                      <div className="flex justify-center">
                        <SecurityBadge type="lock" />
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
                      onClick={handleUssdSelected}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating Code...
                        </>
                      ) : (
                        "Generate USSD Code"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        {step === "nfc" && (
          <div>
            <h2 className="text-xl font-semibold mb-2">NFC Payment</h2>
            <p className="text-neutral-600 mb-6">Receiving ${amount}</p>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  {nfcStatus === "waiting" && (
                    <>
                      <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                        <Smartphone className="h-10 w-10 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold mb-1">Ready to Scan</h3>
                      <p className="text-neutral-500 mb-4">Tap customer's card or phone to your device</p>
                    </>
                  )}
                  
                  {nfcStatus === "connecting" && (
                    <>
                      <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
                      </div>
                      <h3 className="text-lg font-semibold mb-1">Processing</h3>
                      <p className="text-neutral-500 mb-4">Keep devices close together...</p>
                    </>
                  )}
                  
                  {nfcStatus === "success" && (
                    <>
                      <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                        <Check className="h-10 w-10 text-emerald-600" />
                      </div>
                      <h3 className="text-lg font-semibold mb-1">Payment Successful!</h3>
                      <p className="text-neutral-500 mb-4">Transaction completed</p>
                    </>
                  )}
                  
                  {nfcStatus === "error" && (
                    <>
                      <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                        <PhoneCall className="h-10 w-10 text-red-600" />
                      </div>
                      <h3 className="text-lg font-semibold mb-1">Payment Failed</h3>
                      <p className="text-neutral-500 mb-4">Please try again or use USSD</p>
                    </>
                  )}
                </div>
                
                {nfcStatus === "waiting" && (
                  <Button 
                    className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
                    onClick={simulateNfcProcess}
                  >
                    Simulate NFC Payment
                  </Button>
                )}
                
                {nfcStatus === "connecting" && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    disabled
                  >
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </Button>
                )}
                
                {nfcStatus === "success" && (
                  <Button 
                    className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
                    onClick={() => setStep("confirmation")}
                  >
                    View Details
                  </Button>
                )}
                
                {nfcStatus === "error" && (
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setNfcStatus("waiting")}
                    >
                      Try Again
                    </Button>
                    <Button 
                      className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
                      onClick={() => setStep("method")}
                    >
                      Change Method
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
        
        {step === "ussd" && (
          <div>
            <h2 className="text-xl font-semibold mb-2">USSD Payment</h2>
            <p className="text-neutral-600 mb-6">Receiving ${amount}</p>
            
            <Card>
              <CardContent className="pt-6">
                {ussdCode ? (
                  <div className="text-center mb-6">
                    <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                      <PhoneCall className="h-10 w-10 text-blue-600" />
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-4">USSD Code Generated</h3>
                    
                    <div className="bg-neutral-100 p-3 rounded-md mb-4">
                      <p className="text-xl font-mono font-bold">{ussdCode}</p>
                    </div>
                    
                    <div className="text-sm text-neutral-600 mb-4">
                      <p>Ask customer to dial this code on their phone</p>
                      <p>Code expires in {ussdExpiry}</p>
                    </div>
                    
                    <div className="border border-neutral-200 rounded-md p-3 mb-4">
                      <p className="font-medium mb-1">Customer Instructions:</p>
                      <ol className="text-sm text-left list-decimal pl-5 space-y-1">
                        <li>Dial {ussdCode} on your phone</li>
                        <li>Select option 1 to pay</li>
                        <li>Enter amount: ${amount}</li>
                        <li>Confirm payment with your PIN</li>
                      </ol>
                    </div>
                  </div>
                ) : (
                  <div className="text-center mb-6">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                    <p>Generating USSD code...</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep("method")}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
                    onClick={() => setStep("confirmation")}
                    disabled={!ussdCode}
                  >
                    Payment Complete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {step === "confirmation" && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Payment Received!</h2>
            <p className="text-neutral-600 mb-6">Transaction completed successfully</p>
            
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <Check className="h-8 w-8 text-emerald-600" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-neutral-100">
                    <div className="text-neutral-600">Amount Received</div>
                    <div className="font-semibold">${amount}</div>
                  </div>
                  <div className="flex justify-between py-2 border-b border-neutral-100">
                    <div className="text-neutral-600">Transaction Fee (0.5%)</div>
                    <div className="font-semibold">${(parseFloat(amount) * 0.005).toFixed(2)}</div>
                  </div>
                  <div className="flex justify-between py-2 border-b border-neutral-100">
                    <div className="text-neutral-600">Net Amount</div>
                    <div className="font-semibold text-emerald-600">${(parseFloat(amount) * 0.995).toFixed(2)}</div>
                  </div>
                  <div className="flex justify-between py-2">
                    <div className="text-neutral-600">Payment Method</div>
                    <div className="font-semibold">{step === "nfc" ? "NFC" : "USSD"}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-2 gap-3">
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
            </div>
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default ReceivePayment;

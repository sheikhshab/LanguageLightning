import React from "react";
import { useLocation } from "wouter";
import { Check, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Transaction } from "@shared/schema";

interface TransactionConfirmationProps {
  transaction: Transaction;
  onBack: () => void;
  onTryAgain?: () => void;
}

export const TransactionConfirmation: React.FC<TransactionConfirmationProps> = ({
  transaction,
  onBack,
  onTryAgain
}) => {
  const [_, setLocation] = useLocation();
  
  const amount = parseFloat(transaction.amount);
  const fee = parseFloat(transaction.fee);
  const netAmount = transaction.type === "receive" ? amount - fee : amount + fee;
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-white px-4 py-3 border-b border-neutral-200 flex items-center">
        <button onClick={onBack} className="p-2 text-neutral-600">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold flex-grow text-center mr-8">
          Transaction Complete
        </h1>
      </div>
      
      <div className="flex-grow p-6">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold mb-1">Transaction Successful!</h2>
          <p className="text-neutral-600">
            {transaction.type === "receive" 
              ? "Payment has been received successfully"
              : "Payment has been sent successfully"}
          </p>
        </div>
        
        <Card className="mb-6">
          <CardContent className="p-5">
            <div className="flex justify-between mb-4 pb-4 border-b border-neutral-100">
              <div className="text-neutral-600">
                {transaction.type === "receive" ? "Amount Received" : "Amount Sent"}
              </div>
              <div className="font-semibold">${amount.toFixed(2)}</div>
            </div>
            <div className="flex justify-between mb-4 pb-4 border-b border-neutral-100">
              <div className="text-neutral-600">Transaction Fee (0.5%)</div>
              <div className="font-semibold">${fee.toFixed(2)}</div>
            </div>
            <div className="flex justify-between mb-4 pb-4 border-b border-neutral-100">
              <div className="text-neutral-600">
                {transaction.type === "receive" ? "Net Amount" : "Total Amount"}
              </div>
              <div className={`font-semibold ${
                transaction.type === "receive" ? "text-emerald-600" : "text-blue-600"
              }`}>
                ${netAmount.toFixed(2)}
              </div>
            </div>
            <div className="flex justify-between mb-4 pb-4 border-b border-neutral-100">
              <div className="text-neutral-600">
                {transaction.type === "receive" ? "From" : "To"}
              </div>
              <div className="font-semibold">
                {transaction.type === "receive"
                  ? transaction.senderInfo || "Unknown"
                  : transaction.receiverInfo || "Unknown"}
              </div>
            </div>
            <div className="flex justify-between">
              <div className="text-neutral-600">Payment Method</div>
              <div className="font-semibold">
                {(transaction.paymentMethod || "Bank Transfer").toUpperCase()}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-2 gap-3">
          {onTryAgain ? (
            <>
              <Button 
                variant="outline" 
                onClick={onTryAgain}
              >
                Try Again
              </Button>
              <Button 
                className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
                onClick={() => setLocation("/dashboard")}
              >
                Back Home
              </Button>
            </>
          ) : (
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
                Continue
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionConfirmation;

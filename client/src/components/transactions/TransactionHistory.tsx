import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { usePayment } from "@/contexts/PaymentContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Activity, Send, ArrowDownToLine, Calendar, Search } from "lucide-react";
import BottomNavigation from "@/components/shared/BottomNavigation";
import OfflineBanner from "@/components/shared/OfflineBanner";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Transaction } from "@shared/schema";

export const TransactionHistory: React.FC = () => {
  const [_, setLocation] = useLocation();
  const { transactions, fetchTransactions, isLoading } = usePayment();
  
  const [filter, setFilter] = useState<"all" | "sent" | "received">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);
  
  const filteredTransactions = transactions.filter(transaction => {
    if (filter === "sent" && transaction.type !== "send") return false;
    if (filter === "received" && transaction.type !== "receive") return false;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        (transaction.senderInfo && transaction.senderInfo.toLowerCase().includes(query)) ||
        (transaction.receiverInfo && transaction.receiverInfo.toLowerCase().includes(query)) ||
        transaction.amount.toString().includes(query)
      );
    }
    
    return true;
  });
  
  const groupTransactionsByDate = (transactions: Transaction[]) => {
    const groups: { [date: string]: Transaction[] } = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      if (!groups[date]) {
        groups[date] = [];
      }
      
      groups[date].push(transaction);
    });
    
    return groups;
  };
  
  const groupedTransactions = groupTransactionsByDate(filteredTransactions);
  
  const formatTime = (dateString: Date) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen pb-16">
      <div className="bg-white px-4 py-3 border-b border-neutral-200 flex items-center">
        <button onClick={() => setLocation("/dashboard")} className="p-2 text-neutral-600">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold flex-grow text-center mr-8">Transaction History</h1>
      </div>
      
      <OfflineBanner className="mt-1 mx-2" />
      
      <div className="px-6 py-4">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="all" onClick={() => setFilter("all")}>All</TabsTrigger>
            <TabsTrigger value="received" onClick={() => setFilter("received")}>Received</TabsTrigger>
            <TabsTrigger value="sent" onClick={() => setFilter("sent")}>Sent</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Activity className="h-8 w-8 text-neutral-300 animate-pulse" />
            <p className="mt-2 text-neutral-500">Loading transactions...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-neutral-800 mb-1">No transactions found</h3>
            <p className="text-neutral-500 mb-4">
              {searchQuery 
                ? "Try a different search term" 
                : filter !== "all" 
                  ? `You don't have any ${filter === "sent" ? "sent" : "received"} transactions yet` 
                  : "Your transaction history will appear here"}
            </p>
            
            <Button 
              onClick={() => setLocation("/dashboard")}
              className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
            >
              Back to Dashboard
            </Button>
          </div>
        ) : (
          <div>
            {Object.entries(groupedTransactions).map(([date, dateTransactions]) => (
              <div key={date} className="mb-6">
                <div className="flex items-center mb-2">
                  <Calendar className="h-4 w-4 text-neutral-500 mr-2" />
                  <h3 className="text-sm font-medium text-neutral-500">{date}</h3>
                </div>
                
                <Card>
                  <CardContent className="p-0">
                    {dateTransactions.map((transaction, index) => (
                      <div 
                        key={transaction.id} 
                        className={`p-4 ${
                          index < dateTransactions.length - 1 ? "border-b border-neutral-100" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-full mr-3 ${
                              transaction.type === "receive" 
                                ? "bg-emerald-100 text-emerald-600" 
                                : "bg-blue-100 text-blue-600"
                            }`}>
                              {transaction.type === "receive" ? (
                                <ArrowDownToLine className="h-4 w-4" />
                              ) : (
                                <Send className="h-4 w-4" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">
                                {transaction.type === "receive" 
                                  ? `Received from ${transaction.senderInfo || "Unknown"}` 
                                  : `Sent to ${transaction.receiverInfo || "Unknown"}`}
                              </p>
                            </div>
                          </div>
                          <div className={transaction.type === "receive" ? "text-emerald-600" : "text-blue-600"}>
                            <span className="font-semibold">
                              {transaction.type === "receive" ? "+" : "-"}${parseFloat(transaction.amount).toFixed(2)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center text-xs text-neutral-500">
                          <div className="flex items-center">
                            <span>{formatTime(transaction.createdAt)}</span>
                            <span className="mx-1">•</span>
                            <span>{transaction.paymentMethod?.toUpperCase() || "BANK"}</span>
                            {transaction.offlineSync && (
                              <>
                                <span className="mx-1">•</span>
                                <span>Offline transaction</span>
                              </>
                            )}
                          </div>
                          <div>
                            Fee: ${parseFloat(transaction.fee).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default TransactionHistory;

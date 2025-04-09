import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { usePayment } from "@/contexts/PaymentContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/shared/BottomNavigation";
import OfflineBanner from "@/components/shared/OfflineBanner";
import { formatCurrency } from "@/lib/paymentUtils";
import { 
  CreditCard, 
  Send, 
  History, 
  ArrowDownToLine, 
  Wallet, 
  User,
  Activity,
  ShieldCheck
} from "lucide-react";

export const Dashboard: React.FC = () => {
  const [_, setLocation] = useLocation();
  const { user } = useAuth();
  const { fetchTransactions, transactions, toggleOfflineMode, offlineMode } = usePayment();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const recentTransactions = transactions.slice(0, 3); // Get 3 most recent transactions

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Header with balance */}
      <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-6 pt-10 pb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Circular App</h1>
            <p className="text-sm text-white/80">Welcome, {user?.fullName}</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="bg-white/20 text-white hover:bg-white/30 hover:text-white"
            onClick={() => setLocation("/profile")}
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
        
        <div>
          <p className="text-sm text-white/80">Current Balance</p>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">
              {formatCurrency(parseFloat(user?.balance || "0"))}
            </div>
            <div className="flex gap-1 items-center">
              <Badge variant="outline" className="bg-white/20 text-white border-0">
                <ShieldCheck className="h-3 w-3 mr-1" />
                Secured
              </Badge>
              <Badge 
                variant="outline" 
                className={`border-0 ${offlineMode ? 'bg-amber-400/30 text-white' : 'bg-emerald-400/30 text-white'}`}
                onClick={toggleOfflineMode}
              >
                {offlineMode ? 'Offline' : 'Online'}
              </Badge>
            </div>
          </div>
        </div>
      </div>
      
      <OfflineBanner className="mt-1 mx-2" />

      {/* Quick actions */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-2 gap-3">
          <Button 
            className="flex flex-col items-center justify-center h-24 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-100"
            onClick={() => setLocation("/receive-payment")}
          >
            <CreditCard className="h-6 w-6 mb-2" />
            <span>Receive Payment</span>
          </Button>
          <Button 
            className="flex flex-col items-center justify-center h-24 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100"
            onClick={() => setLocation("/send-payment")}
          >
            <Send className="h-6 w-6 mb-2" />
            <span>Send Payment</span>
          </Button>
          <Button 
            className="flex flex-col items-center justify-center h-24 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-100"
            onClick={() => setLocation("/transaction-history")}
          >
            <History className="h-6 w-6 mb-2" />
            <span>Transaction History</span>
          </Button>
          <Button 
            className="flex flex-col items-center justify-center h-24 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-100"
          >
            <ArrowDownToLine className="h-6 w-6 mb-2" />
            <span>Bank Transfer</span>
          </Button>
        </div>
      </div>
      
      {/* Recent Transactions */}
      <div className="px-6 py-2">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
          <button 
            className="text-sm text-blue-600"
            onClick={() => setLocation("/transaction-history")}
          >
            View all
          </button>
        </div>
        
        <Card>
          <CardContent className="p-0">
            {recentTransactions.length > 0 ? (
              <div>
                {recentTransactions.map((transaction, index) => (
                  <div 
                    key={transaction.id} 
                    className={`p-3 flex items-center justify-between ${
                      index < recentTransactions.length - 1 ? "border-b border-neutral-100" : ""
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full mr-3 ${
                        transaction.type === "receive" 
                          ? "bg-emerald-100 text-emerald-600" 
                          : "bg-blue-100 text-blue-600"
                      }`}>
                        {transaction.type === "receive" ? (
                          <Wallet className="h-5 w-5" />
                        ) : (
                          <Send className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {transaction.type === "receive" 
                            ? `Received from ${transaction.senderInfo || "Unknown"}` 
                            : `Sent to ${transaction.receiverInfo || "Unknown"}`}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {formatDate(transaction.createdAt)} • {transaction.paymentMethod?.toUpperCase() || "BANK"}
                          {transaction.offlineSync && " • Offline"}
                        </p>
                      </div>
                    </div>
                    <div className={`font-semibold ${
                      transaction.type === "receive" ? "text-emerald-600" : "text-blue-600"
                    }`}>
                      {transaction.type === "receive" ? "+" : "-"}{formatCurrency(parseFloat(transaction.amount))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <Activity className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
                <p className="text-neutral-500">No transactions yet</p>
                <p className="text-sm text-neutral-400">Your transaction history will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Stats & Activity */}
      <div className="px-6 py-4">
        <h2 className="text-lg font-semibold mb-3">Payment Statistics</h2>
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-neutral-500 mb-1">Payments Received</p>
              <p className="text-xl font-semibold">
                {formatCurrency(transactions
                  .filter(t => t.type === "receive")
                  .reduce((sum, t) => sum + parseFloat(t.amount), 0))}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-neutral-500 mb-1">Payments Sent</p>
              <p className="text-xl font-semibold">
                {formatCurrency(transactions
                  .filter(t => t.type === "send")
                  .reduce((sum, t) => sum + parseFloat(t.amount), 0))}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Dashboard;

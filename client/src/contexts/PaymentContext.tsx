import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "./AuthContext";
import { Transaction } from "@shared/schema";

interface PaymentContextType {
  transactions: Transaction[];
  offlineMode: boolean;
  pendingTransactions: Transaction[];
  isLoading: boolean;
  fetchTransactions: () => Promise<void>;
  createTransaction: (transactionData: Partial<Transaction>) => Promise<Transaction | null>;
  generateUssdCode: (amount: number) => Promise<{ ussdCode: string; expiresIn: string } | null>;
  simulateNfcPayment: (amount: number, receiverInfo: string) => Promise<boolean>;
  toggleOfflineMode: () => void;
  syncPendingTransactions: () => Promise<void>;
}

const PaymentContext = createContext<PaymentContextType>({
  transactions: [],
  offlineMode: false,
  pendingTransactions: [],
  isLoading: false,
  fetchTransactions: async () => {},
  createTransaction: async () => null,
  generateUssdCode: async () => null,
  simulateNfcPayment: async () => false,
  toggleOfflineMode: () => {},
  syncPendingTransactions: async () => {},
});

export const usePayment = () => useContext(PaymentContext);

export const PaymentProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pendingTransactions, setPendingTransactions] = useState<Transaction[]>([]);
  const [offlineMode, setOfflineMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const response = await apiRequest("GET", `/api/transactions/user/${user.id}`, undefined);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      toast({
        title: "Failed to load transactions",
        description: "Could not fetch your transaction history",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  const createTransaction = async (transactionData: Partial<Transaction>) => {
    if (!user) return null;
    
    const fullTransactionData = {
      ...transactionData,
      userId: user.id,
      status: offlineMode ? "pending" : "completed",
      offlineSync: offlineMode,
    };
    
    // If offline, store locally
    if (offlineMode) {
      const offlineTransaction = {
        ...fullTransactionData,
        id: Date.now(), // Temporary ID
        createdAt: new Date(),
      } as Transaction;
      
      setPendingTransactions(prev => [...prev, offlineTransaction]);
      
      toast({
        title: "Transaction saved offline",
        description: "Will sync when connection is restored",
      });
      
      return offlineTransaction;
    }
    
    // Online - send to server
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/transactions", fullTransactionData);
      const newTransaction = await response.json();
      
      setTransactions(prev => [...prev, newTransaction]);
      
      toast({
        title: "Transaction successful",
        description: `${transactionData.type === 'receive' ? 'Received' : 'Sent'} ${transactionData.amount}`,
      });
      
      return newTransaction;
    } catch (error) {
      toast({
        title: "Transaction failed",
        description: error instanceof Error ? error.message : "Could not complete transaction",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const generateUssdCode = async (amount: number) => {
    if (!user) return null;
    
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/ussd/generate", { 
        userId: user.id, 
        amount 
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      toast({
        title: "Failed to generate USSD code",
        description: "Please try again later",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const simulateNfcPayment = async (amount: number, receiverInfo: string) => {
    // Simulate NFC payment processing
    setIsLoading(true);
    
    try {
      // Add artificial delay to simulate NFC communication
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create transaction record
      const transactionResult = await createTransaction({
        type: "receive",
        amount: amount.toString(),
        receiverInfo,
        paymentMethod: "nfc",
      });
      
      return !!transactionResult;
    } catch (error) {
      toast({
        title: "NFC Payment Failed",
        description: "Could not complete NFC payment",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOfflineMode = () => {
    setOfflineMode(prev => !prev);
    toast({
      title: !offlineMode ? "Offline Mode Enabled" : "Online Mode Restored",
      description: !offlineMode 
        ? "Transactions will be stored locally until connection is restored" 
        : "You're back online",
    });
  };

  const syncPendingTransactions = async () => {
    if (offlineMode || !user || pendingTransactions.length === 0) return;
    
    setIsLoading(true);
    try {
      const synced = [];
      
      for (const transaction of pendingTransactions) {
        const { id, createdAt, ...transactionData } = transaction;
        
        // Attempt to sync with server
        const response = await apiRequest("POST", "/api/transactions", {
          ...transactionData,
          status: "completed",
          offlineSync: true,
        });
        
        if (response.ok) {
          synced.push(id);
        }
      }
      
      // Remove synced transactions from pending list
      if (synced.length > 0) {
        setPendingTransactions(prev => prev.filter(t => !synced.includes(t.id)));
        await fetchTransactions(); // Refresh transactions list
        
        toast({
          title: "Sync Complete",
          description: `${synced.length} transactions synchronized`,
        });
      }
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Could not sync offline transactions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PaymentContext.Provider
      value={{
        transactions,
        offlineMode,
        pendingTransactions,
        isLoading,
        fetchTransactions,
        createTransaction,
        generateUssdCode,
        simulateNfcPayment,
        toggleOfflineMode,
        syncPendingTransactions,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

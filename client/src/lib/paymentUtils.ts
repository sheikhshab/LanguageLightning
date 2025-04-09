import { apiRequest } from "@/lib/queryClient";
import { User, Transaction } from "@shared/schema";

/**
 * Calculates the transaction fee
 * @param amount The transaction amount
 * @param feePercentage The fee percentage (default 0.5%)
 * @returns The fee amount
 */
export const calculateFee = (amount: number, feePercentage: number = 0.5): number => {
  return amount * (feePercentage / 100);
};

/**
 * Formats a currency amount
 * @param amount The amount to format
 * @param currency The currency symbol (default $)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number | string, currency: string = "$"): string => {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  return `${currency}${numAmount.toFixed(2)}`;
};

/**
 * Formats a transaction date
 * @param date The date to format
 * @returns Formatted date string
 */
export const formatTransactionDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(dateObj);
};

/**
 * Formats a transaction date for grouping
 * @param date The date to format
 * @returns Formatted date string for grouping
 */
export const formatDateForGrouping = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj);
};

/**
 * Check if user has sufficient balance for a transaction
 * @param user The user object
 * @param amount The transaction amount
 * @param includeFee Whether to include the transaction fee
 * @returns True if sufficient balance, false otherwise
 */
export const hasSufficientBalance = (
  user: User | null,
  amount: number,
  includeFee: boolean = true
): boolean => {
  if (!user) return false;
  
  const currentBalance = parseFloat(user.balance);
  const fee = includeFee ? calculateFee(amount) : 0;
  const totalAmount = amount + fee;
  
  return currentBalance >= totalAmount;
};

/**
 * Updates the user's balance
 * @param userId The user ID
 * @param amount The amount to adjust (positive or negative)
 * @returns Promise that resolves to the updated balance
 */
export const updateUserBalance = async (
  userId: number,
  amount: string
): Promise<string> => {
  try {
    const response = await apiRequest("POST", "/api/balance/update", {
      userId,
      amount,
    });
    
    const data = await response.json();
    return data.balance;
  } catch (error) {
    console.error("Failed to update balance:", error);
    throw error;
  }
};

/**
 * Process a transaction and handle balance update
 * @param transactionData The transaction data
 * @returns Promise that resolves to the created transaction
 */
export const processTransaction = async (
  transactionData: Partial<Transaction>
): Promise<Transaction> => {
  try {
    const response = await apiRequest("POST", "/api/transactions", transactionData);
    return await response.json();
  } catch (error) {
    console.error("Failed to process transaction:", error);
    throw error;
  }
};

import { apiRequest } from "@/lib/queryClient";

/**
 * Interface representing a USSD response
 */
export interface UssdResponse {
  ussdCode: string;
  amount: number | string;
  expiresIn: string;
}

/**
 * Generates a USSD code for payment
 * @param userId The user ID
 * @param amount The payment amount
 * @returns Promise that resolves to a USSD response
 */
export const generateUssdCode = async (
  userId: number,
  amount: number | string
): Promise<UssdResponse> => {
  try {
    const amountValue = typeof amount === "string" ? parseFloat(amount) : amount;
    
    const response = await apiRequest("POST", "/api/ussd/generate", {
      userId,
      amount: amountValue.toString(),
    });
    
    return await response.json();
  } catch (error) {
    console.error("Failed to generate USSD code:", error);
    throw error;
  }
};

/**
 * Verifies if a USSD transaction was completed
 * This is a simulated function since we can't actually verify USSD transactions
 * @param ussdCode The USSD code to verify
 * @returns Promise that resolves to a boolean indicating if the transaction was completed
 */
export const verifyUssdTransaction = async (ussdCode: string): Promise<boolean> => {
  // In a real implementation, this would call an API to check the status
  // For simulation, we'll just return true after a delay
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate a 90% success rate
      const isSuccessful = Math.random() < 0.9;
      resolve(isSuccessful);
    }, 2000);
  });
};

/**
 * Format a USSD code for display
 * @param code The USSD code
 * @returns Formatted USSD code
 */
export const formatUssdCode = (code: string): string => {
  // Remove any whitespace
  const cleanedCode = code.replace(/\s/g, "");
  
  // Add appropriate format if needed
  if (!cleanedCode.startsWith("*") && !cleanedCode.endsWith("#")) {
    return `*${cleanedCode}#`;
  }
  
  return cleanedCode;
};

/**
 * Generates USSD instructions for customers
 * @param ussdCode The USSD code
 * @param amount The payment amount
 * @returns Array of step-by-step instructions
 */
export const generateUssdInstructions = (
  ussdCode: string,
  amount: number | string
): string[] => {
  const formattedAmount = typeof amount === "string" ? amount : amount.toFixed(2);
  
  return [
    `Dial ${ussdCode} on your phone`,
    `Select option 1 to pay`,
    `Enter amount: PKR ${formattedAmount}`,
    `Confirm payment with your PIN`
  ];
};

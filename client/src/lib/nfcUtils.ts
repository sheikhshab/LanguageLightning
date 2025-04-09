/**
 * Interface for NFC payment data
 */
export interface NfcPaymentData {
  amount: number | string;
  receiverName?: string;
  cardType?: string;
}

/**
 * NFC status types
 */
export type NfcStatus = "inactive" | "scanning" | "connecting" | "processing" | "success" | "error";

/**
 * Check if the device supports NFC
 * This is a simulated function since we can't actually check NFC support in a browser
 * @returns Promise that resolves to a boolean indicating if NFC is supported
 */
export const checkNfcSupport = async (): Promise<boolean> => {
  // In a real implementation, this would check if the device has NFC capabilities
  // For simulation, we'll just return true
  return Promise.resolve(true);
};

/**
 * Simulates initiating an NFC payment
 * @param paymentData The payment data
 * @param onStatusChange Callback for status changes
 * @returns Promise that resolves when the payment is complete
 */
export const initiateNfcPayment = async (
  paymentData: NfcPaymentData,
  onStatusChange: (status: NfcStatus) => void
): Promise<boolean> => {
  // Begin the NFC payment flow (simulated)
  onStatusChange("scanning");
  
  return new Promise<boolean>((resolve) => {
    // Simulate the scanning process
    setTimeout(() => {
      onStatusChange("connecting");
      
      // Simulate connecting to the card/device
      setTimeout(() => {
        onStatusChange("processing");
        
        // Simulate processing the payment
        setTimeout(() => {
          // Simulate a 90% success rate
          const isSuccessful = Math.random() < 0.9;
          
          if (isSuccessful) {
            onStatusChange("success");
            resolve(true);
          } else {
            onStatusChange("error");
            resolve(false);
          }
        }, 1500);
      }, 1000);
    }, 1500);
  });
};

/**
 * Get a visual guide for NFC positioning based on card type
 * @param cardType The type of card/device
 * @returns An SVG or instructions for NFC positioning
 */
export const getNfcPositioningGuide = (cardType?: string): string => {
  // In a real implementation, this would return different guides based on the card type
  
  // For simulation, we'll just return a generic guide
  return `
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="40" y="60" width="120" height="80" rx="4" stroke="#10B981" stroke-width="2"/>
      <path d="M100 50C77.9086 50 60 67.9086 60 90C60 112.091 77.9086 130 100 130C122.091 130 140 112.091 140 90C140 67.9086 122.091 50 100 50Z" stroke="#3B82F6" stroke-width="2" stroke-dasharray="4 4"/>
      <path d="M100 70C88.9543 70 80 78.9543 80 90C80 101.046 88.9543 110 100 110C111.046 110 120 101.046 120 90C120 78.9543 111.046 70 100 70Z" stroke="#3B82F6" stroke-width="2"/>
      <path d="M100 80C94.4772 80 90 84.4772 90 90C90 95.5228 94.4772 100 100 100C105.523 100 110 95.5228 110 90C110 84.4772 105.523 80 100 80Z" fill="#3B82F6"/>
    </svg>
  `;
};

/**
 * Generate NFC usage instructions
 * @returns Array of step-by-step instructions
 */
export const getNfcInstructions = (): string[] => {
  return [
    "Hold the customer's card close to the back of your phone",
    "Keep the devices steady until the payment is confirmed",
    "Do not move the devices until you see a success message",
    "You may need to ask the customer to unlock their phone first"
  ];
};

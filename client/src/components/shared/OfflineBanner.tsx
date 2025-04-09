import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WifiOff, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePayment } from "@/contexts/PaymentContext";

interface OfflineBannerProps {
  className?: string;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ className = "" }) => {
  const { offlineMode, toggleOfflineMode, pendingTransactions, syncPendingTransactions } = usePayment();

  if (!offlineMode && pendingTransactions.length === 0) {
    return null;
  }

  return (
    <Alert 
      className={`${className} ${offlineMode ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {offlineMode ? (
            <WifiOff className="h-4 w-4" />
          ) : (
            <Wifi className="h-4 w-4" />
          )}
          <AlertDescription>
            {offlineMode 
              ? "You're offline. Transactions will be stored locally." 
              : `${pendingTransactions.length} offline transaction(s) pending sync.`}
          </AlertDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className={offlineMode 
            ? "border-amber-300 bg-amber-100 hover:bg-amber-200 text-amber-800" 
            : "border-emerald-300 bg-emerald-100 hover:bg-emerald-200 text-emerald-800"
          }
          onClick={offlineMode ? toggleOfflineMode : syncPendingTransactions}
        >
          {offlineMode ? "Reconnect" : "Sync Now"}
        </Button>
      </div>
    </Alert>
  );
};

export default OfflineBanner;

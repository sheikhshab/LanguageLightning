import React from "react";
import { Shield, Lock } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface SecurityBadgeProps {
  type?: "shield" | "lock";
  className?: string;
}

export const SecurityBadge: React.FC<SecurityBadgeProps> = ({ 
  type = "shield",
  className = ""
}) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className={`inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium cursor-help ${className}`}>
          {type === "shield" ? (
            <Shield className="h-3 w-3" />
          ) : (
            <Lock className="h-3 w-3" />
          )}
          <span>{type === "shield" ? "Secure" : "Encrypted"}</span>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-4">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Security Information</h4>
          {type === "shield" ? (
            <p className="text-xs text-muted-foreground">
              Your payments are protected with end-to-end security. All transaction data is encrypted and your PIN is never stored.
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Data is encrypted using AES-256 encryption. Payment information is securely transmitted even when offline.
            </p>
          )}
          <div className="mt-2 text-xs bg-blue-50 p-2 rounded">
            <p className="font-medium text-blue-700">Security Standards:</p>
            <ul className="list-disc list-inside text-blue-600 mt-1">
              <li>End-to-end encryption</li>
              <li>PIN protection</li>
              <li>Secure offline storage</li>
            </ul>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default SecurityBadge;

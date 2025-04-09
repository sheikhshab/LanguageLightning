import React from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import Logo from "@/components/shared/Logo";
import ComparisonChart from "@/components/shared/ComparisonChart";
import { CircleDollarSign, WifiOff, Shield, Zap } from "lucide-react";

export const WelcomeScreen: React.FC = () => {
  const [_, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-gradient-to-r from-emerald-500 to-blue-500 py-12 px-6 text-white text-center">
        <div className="mb-6">
          <Logo className="w-16 h-16 mx-auto text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Circular App</h1>
        <p className="text-white/80 mb-6">Instant, Low-Cost, Secure Offline Payments</p>
        <div className="flex justify-center gap-2 mt-3 text-sm">
          <div className="flex items-center gap-1">
            <Zap className="h-4 w-4" />
            <span>No POS needed</span>
          </div>
          <div className="px-1 text-white/40">•</div>
          <div className="flex items-center gap-1">
            <WifiOff className="h-4 w-4" />
            <span>Works offline</span>
          </div>
          <div className="px-1 text-white/40">•</div>
          <div className="flex items-center gap-1">
            <CircleDollarSign className="h-4 w-4" />
            <span>Low fees</span>
          </div>
        </div>
      </div>
      
      <div className="flex-grow flex flex-col justify-center px-6 py-8">
        <div className="mb-8">
          <Button
            className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white py-6 mb-3"
            onClick={() => setLocation("/register")}
          >
            Register
          </Button>
          <Button
            variant="outline"
            className="w-full border-neutral-300 py-6"
            onClick={() => setLocation("/login")}
          >
            Login
          </Button>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-center">Why Circular App?</h2>
          <div className="bg-neutral-50 rounded-lg p-4">
            <div className="flex items-start mb-3">
              <div className="bg-emerald-100 text-emerald-600 p-2 rounded-full mr-3">
                <CircleDollarSign className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Low-Cost Transactions</h3>
                <p className="text-sm text-neutral-600">Only 0.5% fee per transaction</p>
              </div>
            </div>
            <div className="flex items-start mb-3">
              <div className="bg-blue-100 text-blue-600 p-2 rounded-full mr-3">
                <WifiOff className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Works Offline</h3>
                <p className="text-sm text-neutral-600">Accept payments without internet</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-amber-100 text-amber-600 p-2 rounded-full mr-3">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Secure & Simple</h3>
                <p className="text-sm text-neutral-600">Encrypted payments with PIN protection</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <ComparisonChart />
        </div>

        <div className="text-center text-neutral-500 text-sm mt-6">
          <p className="mb-1">By signing up, you agree to our</p>
          <div className="flex justify-center gap-1">
            <a href="#" className="text-blue-600">Terms of Service</a>
            <span>and</span>
            <a href="#" className="text-blue-600">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;

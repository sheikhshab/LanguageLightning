import React, { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { usePayment } from "@/contexts/PaymentContext";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  LogOut,
  Shield,
  Smartphone,
  WifiOff,
  HelpCircle,
  Info,
  ChevronRight,
  AlertTriangle
} from "lucide-react";
import BottomNavigation from "@/components/shared/BottomNavigation";
import SecurityBadge from "@/components/shared/SecurityBadge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Profile: React.FC = () => {
  const [_, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const { offlineMode, toggleOfflineMode, pendingTransactions } = usePayment();
  
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  
  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <div className="min-h-screen pb-16">
      <div className="bg-white px-4 py-3 border-b border-neutral-200 flex items-center">
        <button onClick={() => setLocation("/dashboard")} className="p-2 text-neutral-600">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold flex-grow text-center mr-8">Profile</h1>
      </div>
      
      <div className="px-6 py-6">
        <div className="flex items-center mb-6">
          <div className="h-16 w-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
            {user?.fullName.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold">{user?.fullName}</h2>
            <p className="text-neutral-600">{user?.phoneNumber}</p>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-sm font-medium text-neutral-500 mb-2">Account Info</h3>
          <Card>
            <CardContent className="p-0">
              <div className="py-3 px-4 border-b border-neutral-100 flex items-center">
                <User className="h-5 w-5 text-neutral-500 mr-3" />
                <div className="flex-grow">
                  <p className="text-sm font-medium">Username</p>
                  <p className="text-neutral-600 text-sm">{user?.username}</p>
                </div>
              </div>
              <div className="py-3 px-4 border-b border-neutral-100 flex items-center">
                <Phone className="h-5 w-5 text-neutral-500 mr-3" />
                <div className="flex-grow">
                  <p className="text-sm font-medium">Phone Number</p>
                  <p className="text-neutral-600 text-sm">{user?.phoneNumber}</p>
                </div>
              </div>
              {user?.email && (
                <div className="py-3 px-4 flex items-center">
                  <Mail className="h-5 w-5 text-neutral-500 mr-3" />
                  <div className="flex-grow">
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-neutral-600 text-sm">{user?.email}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-6">
          <h3 className="text-sm font-medium text-neutral-500 mb-2">Security & Privacy</h3>
          <Card>
            <CardContent className="p-0">
              <div className="py-3 px-4 border-b border-neutral-100 flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-neutral-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium">Change PIN</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-neutral-400" />
              </div>
              <div className="py-3 px-4 border-b border-neutral-100 flex items-center justify-between">
                <div className="flex items-center">
                  <Smartphone className="h-5 w-5 text-neutral-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium">Biometric Authentication</p>
                  </div>
                </div>
                <Switch checked={user?.enableBiometric} />
              </div>
              <div className="py-3 px-4 flex items-center justify-between">
                <div className="flex items-center">
                  <WifiOff className="h-5 w-5 text-neutral-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium">Offline Mode</p>
                    {pendingTransactions.length > 0 && (
                      <p className="text-xs text-amber-600">
                        {pendingTransactions.length} transaction(s) pending sync
                      </p>
                    )}
                  </div>
                </div>
                <Switch checked={offlineMode} onCheckedChange={toggleOfflineMode} />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-8">
          <h3 className="text-sm font-medium text-neutral-500 mb-2">Other</h3>
          <Card>
            <CardContent className="p-0">
              <div className="py-3 px-4 border-b border-neutral-100 flex items-center justify-between">
                <div className="flex items-center">
                  <HelpCircle className="h-5 w-5 text-neutral-500 mr-3" />
                  <p className="text-sm font-medium">Help & Support</p>
                </div>
                <ChevronRight className="h-5 w-5 text-neutral-400" />
              </div>
              <div className="py-3 px-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Info className="h-5 w-5 text-neutral-500 mr-3" />
                  <p className="text-sm font-medium">About Circular App</p>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-neutral-500 mr-2">v1.0.0</span>
                  <ChevronRight className="h-5 w-5 text-neutral-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <div className="flex justify-center mb-2">
            <SecurityBadge type="shield" />
          </div>
          <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                <AlertDialogDescription>
                  {pendingTransactions.length > 0 ? (
                    <div className="flex items-start mt-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                      <p>
                        You have {pendingTransactions.length} pending offline transaction(s) that need to be synced. 
                        Logging out now may cause these transactions to be lost.
                      </p>
                    </div>
                  ) : (
                    "You will need to login again to use the app."
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
                  Logout
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Profile;

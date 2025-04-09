import React from "react";
import { useLocation, Link } from "wouter";
import { Home, CreditCard, History, User } from "lucide-react";

export const BottomNavigation: React.FC = () => {
  const [location] = useLocation();

  const navItems = [
    { path: "/dashboard", label: "Home", icon: Home },
    { path: "/receive-payment", label: "Payments", icon: CreditCard },
    { path: "/transaction-history", label: "History", icon: History },
    { path: "/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="bg-white border-t border-neutral-200 fixed bottom-0 left-0 right-0 max-w-md mx-auto">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <a className="flex flex-col items-center justify-center w-full h-full">
                <item.icon 
                  className={`h-5 w-5 ${isActive ? "text-primary" : "text-neutral-400"}`} 
                />
                <span 
                  className={`text-xs mt-1 ${isActive ? "text-primary font-medium" : "text-neutral-400"}`}
                >
                  {item.label}
                </span>
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;

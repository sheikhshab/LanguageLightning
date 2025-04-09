import React, { useState } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft, Check } from "lucide-react";
import PinInput from "@/components/shared/PinInput";
import { useAuth } from "@/contexts/AuthContext";

// Step 1 - Phone verification
const phoneSchema = z.object({
  phoneNumber: z.string().min(8, "Phone number is required").max(15),
});

// Step 2 - Basic profile
const profileSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  username: z.string().min(3, "Username must be at least 3 characters").max(20),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Step 3 - Security
const securitySchema = z.object({
  pin: z.string().length(4, "PIN must be 4 digits"),
  enableBiometric: z.boolean().default(false),
});

// Combined schema for all steps
const registrationSchema = phoneSchema.merge(profileSchema).merge(securitySchema);

type RegistrationData = z.infer<typeof registrationSchema>;

export const RegistrationFlow: React.FC = () => {
  const [_, setLocation] = useLocation();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [stepData, setStepData] = useState<Partial<RegistrationData>>({});
  const { register, isLoading } = useAuth();

  // Phone form
  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: stepData.phoneNumber || "",
    },
  });

  // Profile form
  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: stepData.fullName || "",
      email: stepData.email || "",
      username: stepData.username || "",
      password: stepData.password || "",
    },
  });

  // Security form
  const securityForm = useForm<z.infer<typeof securitySchema>>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      pin: stepData.pin || "",
      enableBiometric: stepData.enableBiometric || false,
    },
  });

  const onPhoneSubmit = (data: z.infer<typeof phoneSchema>) => {
    setStepData(prev => ({ ...prev, ...data }));
    setStep(2);
  };

  const onProfileSubmit = (data: z.infer<typeof profileSchema>) => {
    setStepData(prev => ({ ...prev, ...data }));
    setStep(3);
  };

  const onSecuritySubmit = async (data: z.infer<typeof securitySchema>) => {
    const fullData = { ...stepData, ...data } as RegistrationData;
    
    const success = await register(fullData);
    if (success) {
      setLocation("/dashboard");
    }
  };

  const goBack = () => {
    if (step === 1) {
      setLocation("/");
    } else {
      setStep(prev => (prev - 1) as 1 | 2 | 3);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-white px-4 py-3 border-b border-neutral-200 flex items-center">
        <button onClick={goBack} className="p-2 text-neutral-600">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold flex-grow text-center mr-8">Create Account</h1>
      </div>

      <div className="px-6 py-8">
        <div className="flex justify-between mb-6">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm mb-1 ${
              step >= 1 ? "bg-emerald-500 text-white" : "bg-neutral-200 text-neutral-600"
            }`}>
              {step > 1 ? <Check className="h-4 w-4" /> : "1"}
            </div>
            <span className={`text-xs ${step >= 1 ? "text-neutral-600" : "text-neutral-400"}`}>Phone</span>
          </div>
          <div className="flex-grow flex items-center justify-center">
            <div className={`h-1 w-full max-w-[60px] ${step > 1 ? "bg-emerald-500" : "bg-neutral-200"}`}></div>
          </div>
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm mb-1 ${
              step >= 2 ? "bg-emerald-500 text-white" : "bg-neutral-200 text-neutral-600"
            }`}>
              {step > 2 ? <Check className="h-4 w-4" /> : "2"}
            </div>
            <span className={`text-xs ${step >= 2 ? "text-neutral-600" : "text-neutral-400"}`}>Profile</span>
          </div>
          <div className="flex-grow flex items-center justify-center">
            <div className={`h-1 w-full max-w-[60px] ${step > 2 ? "bg-emerald-500" : "bg-neutral-200"}`}></div>
          </div>
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm mb-1 ${
              step >= 3 ? "bg-emerald-500 text-white" : "bg-neutral-200 text-neutral-600"
            }`}>
              3
            </div>
            <span className={`text-xs ${step >= 3 ? "text-neutral-600" : "text-neutral-400"}`}>Security</span>
          </div>
        </div>

        {/* Step 1: Phone Verification */}
        {step === 1 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Verify Your Phone</h2>
            <p className="text-neutral-600 mb-6">We'll send a code to verify your identity</p>
            
            <Form {...phoneForm}>
              <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
                <FormField
                  control={phoneForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <div className="flex">
                        <select className="bg-neutral-50 border border-neutral-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-600">
                          <option>+1</option>
                          <option>+44</option>
                          <option>+91</option>
                          <option>+92</option>
                        </select>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter phone number"
                            className="flex-grow rounded-l-none"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
                >
                  Send Verification Code
                </Button>
              </form>
            </Form>
          </div>
        )}

        {/* Step 2: Basic Profile */}
        {step === 2 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Create Your Profile</h2>
            <p className="text-neutral-600 mb-6">Tell us a bit about yourself</p>
            
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                <FormField
                  control={profileForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your full name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="Enter your email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={profileForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Choose a username" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={profileForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" placeholder="Create a password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
                >
                  Continue
                </Button>
              </form>
            </Form>
          </div>
        )}

        {/* Step 3: Security Setup */}
        {step === 3 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Set Up Security</h2>
            <p className="text-neutral-600 mb-6">Create a secure PIN to protect your account</p>
            
            <Form {...securityForm}>
              <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-4">
                <FormField
                  control={securityForm.control}
                  name="pin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>4-Digit Security PIN</FormLabel>
                      <FormControl>
                        <PinInput 
                          value={field.value} 
                          onChange={field.onChange} 
                          length={4} 
                        />
                      </FormControl>
                      <div className="flex items-start mt-4">
                        <div className="text-xs bg-neutral-100 px-3 py-2 rounded-lg text-neutral-600 flex items-center">
                          <Shield className="h-4 w-4 text-blue-600 mr-2" />
                          <span>Your PIN will be required for sensitive actions and payments</span>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={securityForm.control}
                  name="enableBiometric"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Enable biometric login (fingerprint/face ID)
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Complete Registration"}
                </Button>
              </form>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationFlow;

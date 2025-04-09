import React, { useRef, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface PinInputProps {
  length?: number;
  onChange: (value: string) => void;
  value?: string;
  disabled?: boolean;
}

export const PinInput: React.FC<PinInputProps> = ({
  length = 4,
  onChange,
  value = "",
  disabled = false,
}) => {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Initialize input refs
    inputRefs.current = inputRefs.current.slice(0, length);
    
    // Set values from prop if provided
    if (value) {
      const valueArray = value.split("").slice(0, length);
      const filledValues = [...valueArray, ...Array(length - valueArray.length).fill("")];
      setValues(filledValues);
    }
  }, [length, value]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Only allow one character per input
    if (newValue.length > 1) {
      const chars = newValue.split("");
      
      // Fill current and next inputs if multiple characters were pasted
      let newValues = [...values];
      for (let i = 0; i < chars.length && index + i < length; i++) {
        newValues[index + i] = chars[i];
      }
      
      setValues(newValues);
      onChange(newValues.join(""));
      
      // Focus next available input or last input
      const nextIndex = Math.min(index + chars.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
      return;
    }
    
    // Handle single character input
    const newValues = [...values];
    newValues[index] = newValue;
    setValues(newValues);
    onChange(newValues.join(""));
    
    // Auto-focus next input when a digit is entered
    if (newValue !== "" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move focus to previous input on backspace
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Move focus to next input on right arrow
    if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Move focus to previous input on left arrow
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-between items-center gap-2">
      {Array.from({ length }).map((_, index) => (
        <Input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          className="w-14 h-14 text-center text-xl"
          value={values[index]}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          disabled={disabled}
          autoComplete="one-time-code"
        />
      ))}
    </div>
  );
};

export default PinInput;

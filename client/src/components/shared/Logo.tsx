import React from "react";

export const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <svg 
      className={className}
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="60" cy="60" r="55" stroke="currentColor" strokeWidth="3"/>
      <path d="M40 60C40 48.954 48.954 40 60 40C71.046 40 80 48.954 80 60C80 71.046 71.046 80 60 80" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <path d="M60 80L45 65L60 50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

export default Logo;

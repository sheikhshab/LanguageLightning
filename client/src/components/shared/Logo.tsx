import React from "react";

export const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <svg 
      width="100" height="100" viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="100" height="100" fill="black" />
      <g transform="translate(20,20)">
        <rect x="5" width="50" height="7" rx="3.5" fill="#63B1E7"/>
        <rect x="5" y="12" width="40" height="7" rx="3.5" fill="#63B1E7"/>
        <rect x="5" y="24" width="30" height="7" rx="3.5" fill="#63B1E7"/>
        <rect x="5" y="36" width="45" height="7" rx="3.5" fill="#63B1E7"/>
        <rect x="5" y="48" width="55" height="7" rx="3.5" fill="#63B1E7"/>
        <rect x="5" y="60" width="40" height="7" rx="3.5" fill="#63B1E7"/>
      </g>
    </svg>
  );
};

export default Logo;

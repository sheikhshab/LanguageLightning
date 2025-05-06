import React from 'react';

import logo from '../../../attached_assets/generated-icon.png'

export const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return <img src={logo} className={className} alt="logo"/>;
};

export default Logo;

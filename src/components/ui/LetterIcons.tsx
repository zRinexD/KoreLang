import React from 'react';

interface LetterIconProps {
  size?: number;
  className?: string;
}

export const CIcon: React.FC<LetterIconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <text
      x="50%"
      y="50%"
      dominantBaseline="central"
      textAnchor="middle"
      fontSize="18"
      fontWeight="800"
      fill="currentColor"
      fontFamily="system-ui, -apple-system, sans-serif"
    >
      C
    </text>
  </svg>
);

export const VIcon: React.FC<LetterIconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <text
      x="50%"
      y="50%"
      dominantBaseline="central"
      textAnchor="middle"
      fontSize="18"
      fontWeight="800"
      fill="currentColor"
      fontFamily="system-ui, -apple-system, sans-serif"
    >
      V
    </text>
  </svg>
);

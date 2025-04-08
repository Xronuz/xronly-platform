'use client';
import React from 'react';
import { Button } from '../button'; // To'g'rilandi

interface HighlightButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: string;
  children?: React.ReactNode; // Children uchun aniqroq tip
}

const HighlightButton: React.FC<HighlightButtonProps> = ({
  icon = '/images/check.png', // Tuzatildi
  children = 'ustunlikni egallab oling',
  ...rest
}) => {
  return (
    <Button
      icon={icon}
      {...rest}
    >
      {children}
    </Button>
  );
};

export default HighlightButton;

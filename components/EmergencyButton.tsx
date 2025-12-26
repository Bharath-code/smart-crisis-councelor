"use client";

import { Phone } from 'lucide-react';
import { cn } from '@/lib/constants';
import { callPhoneNumber } from '@/lib/tools';

interface EmergencyButtonProps {
  phoneNumber?: string;
  className?: string;
  variant?: 'default' | 'small';
}

export function EmergencyButton({ phoneNumber = '911', className, variant = 'default' }: EmergencyButtonProps) {
  const handleClick = () => {
    callPhoneNumber(phoneNumber);
  };

  if (variant === 'small') {
    return (
      <button
        onClick={handleClick}
        className={cn(
          'flex items-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 active:bg-red-800',
          'text-white rounded-lg font-semibold transition-all duration-200',
          'shadow-lg shadow-red-600/30 hover:shadow-red-600/50',
          'min-h-[48px] min-w-[48px]',
          className
        )}
      >
        <Phone className="w-5 h-5" />
        <span className="text-sm">Call {phoneNumber}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'flex items-center justify-center gap-3 w-full px-6 py-4',
        'bg-red-600 hover:bg-red-700 active:bg-red-800',
        'text-white rounded-xl font-bold text-lg transition-all duration-200',
        'shadow-xl shadow-red-600/30 hover:shadow-red-600/50',
        'min-h-[64px] border-2 border-red-500',
        'animate-pulse-slow',
        className
      )}
    >
      <Phone className="w-6 h-6" />
      <span>Emergency: {phoneNumber}</span>
    </button>
  );
}

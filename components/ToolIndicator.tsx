"use client";

import { cn } from '@/lib/constants';
import { Phone, MapPin } from 'lucide-react';
import type { ToolName } from '@/types';

interface ToolIndicatorProps {
  toolName: ToolName;
  isActive: boolean;
  className?: string;
}

export function ToolIndicator({ toolName, isActive, className }: ToolIndicatorProps) {
  const getToolConfig = () => {
    switch (toolName) {
      case 'alertEmergencyServices':
        return {
          icon: Phone,
          label: 'Emergency',
          color: isActive ? 'text-red-500' : 'text-slate-600',
          bg: isActive ? 'bg-red-500/10' : 'bg-slate-800/50',
          border: isActive ? 'border-red-500' : 'border-slate-700'
        };
      case 'provide_local_resource':
        return {
          icon: MapPin,
          label: 'Resource',
          color: isActive ? 'text-blue-500' : 'text-slate-600',
          bg: isActive ? 'bg-blue-500/10' : 'bg-slate-800/50',
          border: isActive ? 'border-blue-500' : 'border-slate-700'
        };
      case 'get_location':
        return {
          icon: MapPin,
          label: 'Location',
          color: isActive ? 'text-green-500' : 'text-slate-600',
          bg: isActive ? 'bg-green-500/10' : 'bg-slate-800/50',
          border: isActive ? 'border-green-500' : 'border-slate-700'
        };
      default:
        return {
          icon: Phone,
          label: 'Tool',
          color: 'text-slate-600',
          bg: 'bg-slate-800/50',
          border: 'border-slate-700'
        };
    }
  };

  const config = getToolConfig();
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all duration-300',
        config.bg,
        config.border,
        isActive && 'animate-pulse-slow',
        className
      )}
      title={config.label}
    >
      <Icon className={`w-4 h-4 ${config.color}`} />
      <span className={`text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    </div>
  );
}

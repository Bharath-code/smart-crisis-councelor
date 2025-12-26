"use client";

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/constants';

interface AudioVisualizerProps {
  isActive: boolean;
  volume?: number;
  height?: number;
  className?: string;
}

export function AudioVisualizer({ isActive, volume = 0, height = 50, className }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const draw = () => {
      animationId = requestAnimationFrame(draw);

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      if (!isActive) {
        drawFlatLine(ctx, width, height);
        return;
      }

      drawWaveform(ctx, width, height, volume, time);
      time += 0.05;
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isActive, volume]);

  const drawFlatLine = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const drawWaveform = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    volume: number,
    time: number
  ) => {
    const centerY = height / 2;
    const bars = 50;
    const barWidth = width / bars;

    for (let i = 0; i < bars; i++) {
      const normalizedVolume = Math.min(volume, 1);
      const barHeight = Math.sin(i * 0.2 + time) * normalizedVolume * (height * 0.4) + 5;

      const gradient = ctx.createLinearGradient(0, centerY - barHeight, 0, centerY + barHeight);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
      gradient.addColorStop(1, 'rgba(147, 197, 253, 0.8)');

      ctx.fillStyle = gradient;
      ctx.fillRect(i * barWidth, centerY - barHeight, barWidth - 2, barHeight * 2);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className={cn('w-full rounded-lg', className)}
      style={{ height: `${height}px` }}
      width={800}
      height={height}
    />
  );
}

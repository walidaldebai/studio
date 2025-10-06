
'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Palmtree, RefreshCw } from 'lucide-react';
import { useAppTranslation } from '@/context/language-provider';

export default function SandGardenPage() {
  const { t } = useAppTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  const draw = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Create a more subtle and textured line to mimic a rake in sand
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.015)'; // Very faint fill
    ctx.fill();

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.02)'; // Very faint stroke for texture
    
    // Create a few lines around the center for a 'rake' effect
    for(let i = -2; i <= 2; i += 2) {
      ctx.beginPath();
      ctx.moveTo(x - 5, y + i);
      ctx.lineTo(x + 5, y + i);
      ctx.stroke();
    }
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#f0e5d8'; // Sand color
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const container = canvas.parentElement;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    clearCanvas();

    const handleMouseDown = (e: MouseEvent) => {
      setIsDrawing(true);
      const rect = canvas.getBoundingClientRect();
      draw(ctx, e.clientX - rect.left, e.clientY - rect.top);
    };

    const handleMouseUp = () => {
      setIsDrawing(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDrawing) return;
      const rect = canvas.getBoundingClientRect();
      draw(ctx, e.clientX - rect.left, e.clientY - rect.top);
    };

    const handleTouchStart = (e: TouchEvent) => {
        setIsDrawing(true);
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        if (touch) {
          draw(ctx, touch.clientX - rect.left, touch.clientY - rect.top);
        }
    }

    const handleTouchMove = (e: TouchEvent) => {
        if (!isDrawing) return;
        e.preventDefault(); // Prevent scrolling
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        if (touch) {
          draw(ctx, touch.clientX - rect.left, touch.clientY - rect.top);
        }
    }
    
    const handleTouchEnd = () => {
        setIsDrawing(false);
    }

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseUp);
    
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchend', handleTouchEnd);
    canvas.addEventListener('touchmove', handleTouchMove);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseUp);

      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isDrawing, draw, clearCanvas]);

  useEffect(() => {
    const handleResize = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const container = canvas.parentElement;
        if (container) {
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
            clearCanvas();
        }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [clearCanvas]);

  return (
    <div className="container mx-auto p-4 md:p-8 flex flex-col h-[calc(100vh-3.5rem)]">
      <Card className="mb-4 flex-shrink-0">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center gap-2">
            <Palmtree /> {t('sandGardenPage.title')}
          </CardTitle>
          <CardDescription>{t('sandGardenPage.description')}</CardDescription>
        </CardHeader>
        <CardContent>
            <Button onClick={clearCanvas}>
                <RefreshCw className="mr-2 h-4 w-4" />
                {t('sandGardenPage.resetButton')}
            </Button>
        </CardContent>
      </Card>
      <div className="flex-grow w-full h-full rounded-lg overflow-hidden border shadow-sm">
        <canvas ref={canvasRef} className="w-full h-full cursor-pointer" />
      </div>
    </div>
  );
}

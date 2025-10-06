
'use client';

import { useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Palmtree, RefreshCw } from 'lucide-react';
import { useAppTranslation } from '@/context/language-provider';

export default function SandGardenPage() {
  const { t } = useAppTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();

  const cols = useRef(0);
  const rows = useRef(0);
  const grid = useRef<number[][]>();
  const resolution = 2; // Reverted to 2 for better performance
  const sandColor = '#f0e5d8';
  const backgroundColor = '#2d2d2d';

  const createGrid = useCallback((c: number, r: number) => {
    return Array(c).fill(null).map(() => Array(r).fill(0));
  }, []);

  const draw = useCallback((ctx: CanvasRenderingContext2D, currentGrid: number[][]) => {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = sandColor;
    for (let i = 0; i < cols.current; i++) {
      for (let j = 0; j < rows.current; j++) {
        if (currentGrid[i][j] === 1) {
          const x = i * resolution;
          const y = j * resolution;
          // Draw circles instead of squares
          ctx.beginPath();
          ctx.arc(x + resolution / 2, y + resolution / 2, resolution / 2, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    }
  }, []);

  const clearCanvas = useCallback(() => {
    if (cols.current > 0 && rows.current > 0) {
      grid.current = createGrid(cols.current, rows.current);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      draw(ctx, grid.current);
    }
  }, [createGrid, draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let isMouseDown = false;

    const setup = () => {
        const container = canvas.parentElement;
        if (container) {
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
            cols.current = Math.floor(canvas.width / resolution);
            rows.current = Math.floor(canvas.height / resolution);
            grid.current = createGrid(cols.current, rows.current);
        }
    };
    
    const update = () => {
      if (!grid.current) return;
      
      const nextGrid = createGrid(cols.current, rows.current);

      for (let i = 0; i < cols.current; i++) {
        for (let j = 0; j < rows.current; j++) {
          const state = grid.current[i][j];
          if (state === 1) {
            const below = j + 1;
            
            if (below >= rows.current) {
                nextGrid[i][j] = 1;
                continue;
            }

            if (grid.current[i][below] === 0) {
              nextGrid[i][below] = 1; // Move down
            } else {
                const dir = Math.random() < 0.5 ? -1 : 1;
                const belowA_col = i + dir;
                const belowB_col = i - dir;

                const belowA = belowA_col >= 0 && belowA_col < cols.current ? grid.current[belowA_col][below] : -1;
                const belowB = belowB_col >= 0 && belowB_col < cols.current ? grid.current[belowB_col][below] : -1;
                
                if (belowA === 0 && belowB === 0) {
                    nextGrid[i + (Math.random() < 0.5 ? -1 : 1)][below] = 1;
                } else if (belowA === 0) {
                    nextGrid[belowA_col][below] = 1;
                } else if (belowB === 0) {
                    nextGrid[belowB_col][below] = 1;
                } else {
                   nextGrid[i][j] = 1;
                }
            }
          }
        }
      }
      grid.current = nextGrid;
      draw(ctx, grid.current);
      animationFrameId.current = requestAnimationFrame(update);
    };
    
    setup();
    update();

    const handleMouseDown = (e: MouseEvent | TouchEvent) => { 
        isMouseDown = true; 
        if (e instanceof TouchEvent) {
             addSand(e.touches[0]);
        } else {
            addSand(e);
        }
    };
    const handleMouseUp = () => { isMouseDown = false; };
    
    const addSand = (e: MouseEvent | Touch) => {
        if (!grid.current) return;
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / resolution);
        const y = Math.floor((e.clientY - rect.top) / resolution);

        if(x >= 0 && x < cols.current && y >= 0 && y < rows.current) {
            const matrix = 10;
            const extent = Math.floor(matrix / 2);
            for(let i = -extent; i <= extent; i++) {
                for(let j = -extent; j <= extent; j++) {
                    if (Math.random() < 0.75) {
                        const col = x + i;
                        const row = y + j;
                         if(col >= 0 && col < cols.current && row >= 0 && row < rows.current) {
                            grid.current[col][row] = 1;
                        }
                    }
                }
            }
        }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (isMouseDown) addSand(e);
    };
    const handleTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        if(isMouseDown) addSand(e.touches[0]);
    }
    
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchstart', handleMouseDown);
    canvas.addEventListener('touchend', handleMouseUp);
    canvas.addEventListener('touchmove', handleTouchMove);

    const handleResize = () => {
        setup();
    }
    window.addEventListener('resize', handleResize);


    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchstart', handleMouseDown);
      canvas.removeEventListener('touchend', handleMouseUp);
      canvas.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [createGrid, draw]);

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

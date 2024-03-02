import React, { useCallback, useEffect, useState } from 'react';
import styles from './index.module.css';
import { Bitmap } from '@/utils/bitmap/Bitmap';
import { useSettingsStore } from '@/store/settings/useSettingsStore';
import { Sizes } from './types';
import { clearDisplay, drawBitmap, drawPointsBorders, drawGrid, getCanvasSize, drawArea } from './utils';
import { SelectedArea } from '../types';
import { Point } from '@/utils/bitmap/Point';
import { Area } from '@/utils/bitmap/Area';

interface BitmapViewProps {
  bitmap: Bitmap;
  onChangeBitmap?: (bitmap: Bitmap) => void;
  eraser?: boolean;
  area?: boolean;
  selectedArea?: SelectedArea;
  onChangeSelectedArea?: (value: SelectedArea) => void;
}

export const BitmapView = ({
  bitmap,
  onChangeBitmap,
  eraser,
  area,
  selectedArea,
  onChangeSelectedArea,
}: BitmapViewProps): JSX.Element => {
  const { grid } = useSettingsStore();
  const [sizes, setSizes] = useState<Sizes | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const isSelectingArea = area && (!selectedArea || selectedArea instanceof Point);
  const bitmapWidth = bitmap.width;
  const bitmapHeight = bitmap.height;

  const setCanvasRef = useCallback(
    (elem: HTMLCanvasElement | null) => {
      if (elem) {
        const canvasWidth = getCanvasSize(bitmapWidth);
        const canvasHeight = getCanvasSize(bitmapHeight);
        elem.width = canvasWidth;
        elem.height = canvasHeight;
        setSizes({ canvasWidth, canvasHeight, bitmapWidth, bitmapHeight });
        setCtx(elem.getContext('2d'));
        setCanvas(elem);
      } else {
        setSizes(null);
        setCtx(null);
        setCanvas(null);
      }
    },
    [bitmapHeight, bitmapWidth],
  );

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (canvas && sizes && onChangeBitmap) {
        const { left, top } = canvas.getBoundingClientRect();
        const x = event.clientX - left;
        const y = event.clientY - top;
        if (x >= 0 && y >= 0) {
          const posX = Math.floor(x / (sizes.canvasWidth / sizes.bitmapWidth));
          const posY = Math.floor(y / (sizes.canvasHeight / sizes.bitmapHeight));

          if (onChangeSelectedArea && area && !(selectedArea instanceof Area)) {
            const point = new Point(posX, posY);
            const nextSelectedArea = selectedArea instanceof Point ? new Area(selectedArea, point) : point;
            onChangeSelectedArea(nextSelectedArea);
          } else {
            if (area && selectedArea instanceof Area) {
              const isIntersection = selectedArea.isIntersect(new Point(posX, posY));
              if (isIntersection) {
                const nextBitmap = bitmap.clone();
                nextBitmap.setPixelValue(new Point(posX, posY), !eraser);
                onChangeBitmap(nextBitmap);
              }
            } else {
              const nextBitmap = bitmap.clone();
              nextBitmap.setPixelValue(new Point(posX, posY), !eraser);
              onChangeBitmap(nextBitmap);
            }
          }
        }
      }
    },
    [canvas, sizes, onChangeBitmap, onChangeSelectedArea, area, selectedArea, bitmap, eraser],
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isSelectingArea && (event.buttons || event.ctrlKey)) {
        handleClick(event);
      }
    },
    [handleClick, isSelectingArea],
  );

  useEffect(() => {
    if (!ctx || !sizes) {
      return;
    }

    clearDisplay(ctx, sizes);
    drawBitmap(ctx, bitmap);
    drawPointsBorders(ctx, sizes);
    drawGrid(ctx, sizes, grid);
    drawArea(ctx, sizes, !!area, selectedArea);
  }, [area, bitmap, ctx, grid, sizes, selectedArea]);

  return <canvas ref={setCanvasRef} className={styles.container} onClick={handleClick} onMouseMove={handleMouseMove} />;
};

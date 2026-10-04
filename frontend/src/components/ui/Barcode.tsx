'use client';

import { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

interface BarcodeProps {
  value: string;
  width?: number;
  height?: number;
  format?: 'CODE128' | 'CODE39' | 'EAN13';
  displayValue?: boolean;
  className?: string;
}

export default function Barcode({
  value,
  width = 1.8,
  height = 45,
  format = 'CODE128',
  displayValue = true,
  className = '',
}: BarcodeProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !value) return;
    try {
      JsBarcode(svgRef.current, value, {
        format,
        width,
        height,
        displayValue,
        fontSize: 12,
        font: 'monospace',
        margin: 4,
        background: '#ffffff',
        lineColor: '#000000',
      });
    } catch (e) {
      console.warn('Barcode rendering error:', e);
    }
  }, [value, width, height, format, displayValue]);

  return <svg ref={svgRef} className={className} />;
}

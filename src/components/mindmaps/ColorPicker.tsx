import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Palette } from 'lucide-react';

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

const colorPalette = [
  { name: 'Purple', value: 'hsl(var(--primary))', bg: 'bg-primary' },
  { name: 'Blue', value: '#3B82F6', bg: 'bg-blue-500' },
  { name: 'Green', value: '#10B981', bg: 'bg-emerald-500' },
  { name: 'Orange', value: '#F59E0B', bg: 'bg-amber-500' },
  { name: 'Red', value: '#EF4444', bg: 'bg-red-500' },
  { name: 'Pink', value: '#EC4899', bg: 'bg-pink-500' },
  { name: 'Indigo', value: '#6366F1', bg: 'bg-indigo-500' },
  { name: 'Teal', value: '#14B8A6', bg: 'bg-teal-500' },
  { name: 'Gray', value: '#6B7280', bg: 'bg-gray-500' },
];

export function ColorPicker({ selectedColor, onColorChange }: ColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 w-8 p-0 border-2"
          style={{ backgroundColor: selectedColor }}
          onClick={(e) => e.stopPropagation()}
        >
          <Palette className="h-3 w-3" style={{ color: selectedColor === '#FFFFFF' ? '#000' : '#fff' }} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-3" align="start" onClick={(e) => e.stopPropagation()}>
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Choose Color</h4>
          <div className="grid grid-cols-3 gap-2">
            {colorPalette.map((color) => (
              <Button
                key={color.name}
                variant="outline"
                size="sm"
                className={`h-8 w-full ${color.bg} border-2 ${
                  selectedColor === color.value ? 'ring-2 ring-ring' : ''
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onColorChange(color.value);
                }}
                title={color.name}
              >
                <span className="sr-only">{color.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
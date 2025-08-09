import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Square, 
  Circle, 
  Diamond, 
  Triangle, 
  Hexagon,
  MessageSquare,
  Star,
  ArrowRight,
  FileText,
  Cloud
} from 'lucide-react';

interface ShapePaletteProps {
  onShapeSelect: (shapeType: string) => void;
}

const shapes = [
  { type: 'rectangle', icon: Square, label: 'Rectangle', description: 'Basic rectangle shape' },
  { type: 'circle', icon: Circle, label: 'Circle', description: 'Round shape for ideas' },
  { type: 'diamond', icon: Diamond, label: 'Diamond', description: 'Decision points' },
  { type: 'triangle', icon: Triangle, label: 'Triangle', description: 'Warning or priority' },
  { type: 'hexagon', icon: Hexagon, label: 'Hexagon', description: 'Process step' },
  { type: 'speech', icon: MessageSquare, label: 'Speech Bubble', description: 'Comments or notes' },
  { type: 'star', icon: Star, label: 'Star', description: 'Important ideas' },
  { type: 'arrow', icon: ArrowRight, label: 'Arrow', description: 'Direction or flow' },
  { type: 'document', icon: FileText, label: 'Document', description: 'Files or reports' },
  { type: 'cloud', icon: Cloud, label: 'Cloud', description: 'Ideas or concepts' },
];

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

export function ShapePalette({ onShapeSelect }: ShapePaletteProps) {
  return (
    <div className="space-y-4">
      {/* Basic Shapes */}
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Basic Shapes</CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="grid grid-cols-2 gap-2">
            {shapes.slice(0, 6).map((shape) => {
              const Icon = shape.icon;
              return (
                <Button
                  key={shape.type}
                  variant="outline"
                  className="h-12 flex flex-col items-center justify-center gap-1 hover:bg-primary/10 hover:border-primary/30 transition-colors"
                  onClick={() => onShapeSelect(shape.type)}
                  title={shape.description}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs">{shape.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Special Shapes */}
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Special Shapes</CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="grid grid-cols-2 gap-2">
            {shapes.slice(6).map((shape) => {
              const Icon = shape.icon;
              return (
                <Button
                  key={shape.type}
                  variant="outline"
                  className="h-12 flex flex-col items-center justify-center gap-1 hover:bg-primary/10 hover:border-primary/30 transition-colors"
                  onClick={() => onShapeSelect(shape.type)}
                  title={shape.description}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs">{shape.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Colors */}
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Quick Colors</CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="grid grid-cols-3 gap-2">
            {colorPalette.map((color) => (
              <Button
                key={color.name}
                variant="outline"
                className={`h-8 w-full ${color.bg} border-2 hover:ring-2 hover:ring-ring transition-all`}
                title={`${color.name} - Drag to apply or right-click nodes`}
                style={{ backgroundColor: color.value }}
              >
                <span className="sr-only">{color.name}</span>
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Right-click any node to change colors
          </p>
        </CardContent>
      </Card>

      {/* Tips for Beginners */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-purple-700">💡 Tips</CardTitle>
        </CardHeader>
        <CardContent className="p-3 space-y-2">
          <div className="text-xs text-purple-600 space-y-1">
            <p>• Click a shape to add it to your canvas</p>
            <p>• Double-click nodes to edit text</p>
            <p>• Drag from edges to connect nodes</p>
            <p>• Right-click for more options</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
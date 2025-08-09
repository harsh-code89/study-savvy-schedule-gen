import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Save, 
  Download, 
  Upload, 
  Undo, 
  Redo,
  ZoomIn,
  ZoomOut,
  Maximize,
  Grid,
  Move,
  MousePointer,
  Type,
  Palette,
  Trash2,
  Copy,
  RotateCcw
} from 'lucide-react';

interface MindMapToolbarProps {
  onSave: () => void;
  onExport: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onClear: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  selectedTool: 'select' | 'text' | 'connect';
  onToolSelect: (tool: 'select' | 'text' | 'connect') => void;
  showGrid: boolean;
  onToggleGrid: () => void;
}

export function MindMapToolbar({ 
  onSave, 
  onExport, 
  onZoomIn, 
  onZoomOut, 
  onFitView,
  onClear,
  onUndo,
  onRedo,
  selectedTool,
  onToolSelect,
  showGrid,
  onToggleGrid
}: MindMapToolbarProps) {
  return (
    <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-2 shadow-sm">
      <div className="flex items-center gap-1">
        {/* File Operations */}
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onSave}
            className="hover:bg-primary/10"
            title="Save (Ctrl+S)"
          >
            <Save className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onExport}
            className="hover:bg-primary/10"
            title="Export"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onUndo}
            disabled={!onUndo}
            className="hover:bg-primary/10"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onRedo}
            disabled={!onRedo}
            className="hover:bg-primary/10"
            title="Redo (Ctrl+Y)"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Tools */}
        <div className="flex items-center gap-1">
          <Button 
            variant={selectedTool === 'select' ? 'secondary' : 'ghost'}
            size="sm" 
            onClick={() => onToolSelect('select')}
            className="hover:bg-primary/10"
            title="Select Tool (V)"
          >
            <MousePointer className="h-4 w-4" />
          </Button>
          <Button 
            variant={selectedTool === 'text' ? 'secondary' : 'ghost'}
            size="sm" 
            onClick={() => onToolSelect('text')}
            className="hover:bg-primary/10"
            title="Text Tool (T)"
          >
            <Type className="h-4 w-4" />
          </Button>
          <Button 
            variant={selectedTool === 'connect' ? 'secondary' : 'ghost'}
            size="sm" 
            onClick={() => onToolSelect('connect')}
            className="hover:bg-primary/10"
            title="Connect Tool (C)"
          >
            <Move className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* View Controls */}
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onZoomIn}
            className="hover:bg-primary/10"
            title="Zoom In (+)"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onZoomOut}
            className="hover:bg-primary/10"
            title="Zoom Out (-)"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onFitView}
            className="hover:bg-primary/10"
            title="Fit to View"
          >
            <Maximize className="h-4 w-4" />
          </Button>
          <Button 
            variant={showGrid ? 'secondary' : 'ghost'}
            size="sm" 
            onClick={onToggleGrid}
            className="hover:bg-primary/10"
            title="Toggle Grid"
          >
            <Grid className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Clear */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClear}
          className="hover:bg-red-100 text-red-600 hover:text-red-700"
          title="Clear Canvas"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
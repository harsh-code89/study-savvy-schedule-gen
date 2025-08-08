import React from 'react';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { ColorPicker } from './ColorPicker';
import { Edit, Trash2, Palette } from 'lucide-react';

interface NodeContextMenuProps {
  children: React.ReactNode;
  onEdit: () => void;
  onDelete: () => void;
  onColorChange: (color: string) => void;
  currentColor: string;
}

export function NodeContextMenu({ 
  children, 
  onEdit, 
  onDelete, 
  onColorChange, 
  currentColor 
}: NodeContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={onEdit} className="cursor-pointer">
          <Edit className="w-4 h-4 mr-2" />
          Edit Label
        </ContextMenuItem>
        <ContextMenuItem className="cursor-pointer p-0" onSelect={(e) => e.preventDefault()}>
          <div className="flex items-center w-full px-2 py-1.5">
            <Palette className="w-4 h-4 mr-2" />
            <span className="mr-2">Color</span>
            <ColorPicker 
              selectedColor={currentColor} 
              onColorChange={onColorChange} 
            />
          </div>
        </ContextMenuItem>
        <ContextMenuItem onClick={onDelete} className="cursor-pointer text-destructive">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Node
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
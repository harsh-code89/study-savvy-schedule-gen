import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { NodeContextMenu } from './NodeContextMenu';

interface NodeData {
  label: string;
  color: string;
  nodeId: string;
  shapeType?: string;
}

interface CustomNodeProps {
  data: NodeData;
  selected: boolean;
  onEdit: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
  onColorChange: (nodeId: string, color: string) => void;
}

const getShapeStyles = (shapeType: string, color: string) => {
  const baseStyles = {
    minWidth: '80px',
    minHeight: '40px',
    padding: '8px 12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '500',
    color: 'white',
    backgroundColor: color,
    border: `2px solid ${color}`,
    cursor: 'pointer',
    position: 'relative' as const,
  };

  switch (shapeType) {
    case 'circle':
      return {
        ...baseStyles,
        borderRadius: '50%',
        width: '80px',
        height: '80px',
      };
    case 'diamond':
      return {
        ...baseStyles,
        borderRadius: '4px',
        transform: 'rotate(45deg)',
        width: '60px',
        height: '60px',
      };
    case 'triangle':
      return {
        ...baseStyles,
        borderRadius: '0',
        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
        backgroundColor: color,
        border: 'none',
        width: '80px',
        height: '70px',
      };
    case 'hexagon':
      return {
        ...baseStyles,
        clipPath: 'polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)',
        backgroundColor: color,
        border: 'none',
        width: '100px',
        height: '60px',
      };
    case 'speech':
      return {
        ...baseStyles,
        borderRadius: '20px',
        position: 'relative' as const,
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-10px',
          left: '20px',
          width: '0',
          height: '0',
          borderLeft: '10px solid transparent',
          borderRight: '10px solid transparent',
          borderTop: `10px solid ${color}`,
        },
      };
    case 'star':
      return {
        ...baseStyles,
        clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
        backgroundColor: color,
        border: 'none',
        width: '80px',
        height: '80px',
      };
    case 'cloud':
      return {
        ...baseStyles,
        borderRadius: '50px',
        position: 'relative' as const,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-20px',
          left: '10px',
          width: '30px',
          height: '30px',
          backgroundColor: color,
          borderRadius: '50%',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '-15px',
          right: '15px',
          width: '20px',
          height: '20px',
          backgroundColor: color,
          borderRadius: '50%',
        },
      };
    case 'arrow':
      return {
        ...baseStyles,
        clipPath: 'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)',
        backgroundColor: color,
        border: 'none',
        width: '120px',
        height: '50px',
      };
    case 'document':
      return {
        ...baseStyles,
        borderRadius: '8px 8px 0 8px',
        position: 'relative' as const,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '0',
          right: '0',
          width: '0',
          height: '0',
          borderLeft: '15px solid white',
          borderTop: '15px solid transparent',
        },
      };
    case 'rectangle':
    default:
      return {
        ...baseStyles,
        borderRadius: '8px',
      };
  }
};

export function CustomNode({ data, selected, onEdit, onDelete, onColorChange }: CustomNodeProps) {
  const shapeStyles = getShapeStyles(data.shapeType || 'rectangle', data.color);
  
  // For shapes like diamond and triangle, we need to handle the text differently
  const isSpecialShape = ['diamond', 'triangle', 'star', 'hexagon', 'arrow'].includes(data.shapeType || '');
  
  return (
    <NodeContextMenu
      onEdit={() => onEdit(data.nodeId)}
      onDelete={() => onDelete(data.nodeId)}
      onColorChange={(color: string) => onColorChange(data.nodeId, color)}
      currentColor={data.color}
    >
      <div className="relative">
        <Handle 
          type="target" 
          position={Position.Top} 
          className="!bg-gray-400 !border-2 !border-white !w-3 !h-3" 
        />
        <Handle 
          type="source" 
          position={Position.Bottom} 
          className="!bg-gray-400 !border-2 !border-white !w-3 !h-3" 
        />
        <Handle 
          type="source" 
          position={Position.Left} 
          className="!bg-gray-400 !border-2 !border-white !w-3 !h-3" 
        />
        <Handle 
          type="source" 
          position={Position.Right} 
          className="!bg-gray-400 !border-2 !border-white !w-3 !h-3" 
        />
        
        <div 
          style={shapeStyles}
          className={`transition-all duration-200 ${
            selected ? 'ring-2 ring-blue-400 ring-offset-2' : ''
          } ${isSpecialShape ? 'text-center' : ''}`}
        >
          <span 
            className={`text-white font-medium ${
              isSpecialShape ? 'text-xs' : 'text-sm'
            } ${data.shapeType === 'diamond' ? 'transform -rotate-45' : ''}`}
            style={{ 
              lineHeight: '1.2',
              display: 'block',
              wordBreak: 'break-word',
              maxWidth: '100%',
              overflow: 'hidden',
            }}
          >
            {data.label}
          </span>
        </div>
      </div>
    </NodeContextMenu>
  );
}
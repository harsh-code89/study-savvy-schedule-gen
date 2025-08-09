import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Grid, Plus, Save, Download, Upload, Edit, Trash2, ZoomIn, ZoomOut, Move } from 'lucide-react';
import {
  ReactFlow,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Connection,
  Node,
  Edge,
  MarkerType,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import ParticleBackground from '@/components/ParticleBackground';
import { ShapePalette } from '@/components/mindmaps/ShapePalette';
import { MindMapToolbar } from '@/components/mindmaps/MindMapToolbar';
import { CustomNode } from '@/components/mindmaps/CustomNodes';
import { toast } from 'sonner';

interface MindMap {
  id: string;
  title: string;
  description?: string;
  nodes_data: any;
  edges_data: any;
  created_at: string;
  updated_at: string;
}

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    position: { x: 250, y: 150 },
    data: { 
      label: 'Central Idea', 
      color: 'hsl(var(--primary))',
      nodeId: '1',
      shapeType: 'rectangle'
    },
  },
];

const MindMaps = () => {
  const { user } = useAuth();
  const [mindMaps, setMindMaps] = useState<MindMap[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMindMap, setSelectedMindMap] = useState<MindMap | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [newMindMap, setNewMindMap] = useState({
    title: '',
    description: ''
  });

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeIdCounter, setNodeIdCounter] = useState(2);
  const [selectedTool, setSelectedTool] = useState<'select' | 'text' | 'connect'>('select');
  const [showGrid, setShowGrid] = useState(true);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Load mind maps from database
  useEffect(() => {
    if (user) {
      fetchMindMaps();
    }
  }, [user]);

  const fetchMindMaps = async () => {
    try {
      const { data, error } = await supabase
        .from('mind_maps')
        .select('*')
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setMindMaps(data || []);
    } catch (error) {
      console.error('Error fetching mind maps:', error);
      toast.error('Failed to load mind maps');
    } finally {
      setLoading(false);
    }
  };

  const createMindMap = async () => {
    if (!newMindMap.title.trim()) return;

    try {
      const { data, error } = await supabase
        .from('mind_maps')
        .insert([{
          user_id: user?.id,
          title: newMindMap.title,
          description: newMindMap.description || null,
          nodes_data: initialNodes as any,
          edges_data: [] as any,
        }])
        .select()
        .single();

      if (error) throw error;

      setMindMaps([data, ...mindMaps]);
      setSelectedMindMap(data);
      setNodes(initialNodes);
      setEdges([]);
      setNodeIdCounter(2);
      setNewMindMap({ title: '', description: '' });
      setIsCreating(false);
      toast.success('Mind map created successfully!');
    } catch (error) {
      console.error('Error creating mind map:', error);
      toast.error('Failed to create mind map');
    }
  };

  const saveMindMap = async () => {
    if (!selectedMindMap) return;

    try {
      const { error } = await supabase
        .from('mind_maps')
        .update({
          nodes_data: nodes as any,
          edges_data: edges as any,
        })
        .eq('id', selectedMindMap.id);

      if (error) throw error;

      setMindMaps(mindMaps.map(map =>
        map.id === selectedMindMap.id
          ? { ...map, nodes_data: nodes, edges_data: edges }
          : map
      ));
      toast.success('Mind map saved successfully!');
    } catch (error) {
      console.error('Error saving mind map:', error);
      toast.error('Failed to save mind map');
    }
  };

  const loadMindMap = (mindMap: MindMap) => {
    setSelectedMindMap(mindMap);
    setNodes(mindMap.nodes_data || initialNodes);
    setEdges(mindMap.edges_data || []);
    setNodeIdCounter(Math.max(...(mindMap.nodes_data?.map(n => parseInt(n.id)) || [1])) + 1);
  };

  const deleteMindMap = async (id: string) => {
    try {
      const { error } = await supabase
        .from('mind_maps')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMindMaps(mindMaps.filter(map => map.id !== id));
      if (selectedMindMap?.id === id) {
        setSelectedMindMap(null);
        setNodes(initialNodes);
        setEdges([]);
        setNodeIdCounter(2);
      }
      toast.success('Mind map deleted successfully!');
    } catch (error) {
      console.error('Error deleting mind map:', error);
      toast.error('Failed to delete mind map');
    }
  };

  const updateMindMapTitle = async (id: string, title: string) => {
    try {
      const { error } = await supabase
        .from('mind_maps')
        .update({ title })
        .eq('id', id);

      if (error) throw error;

      setMindMaps(mindMaps.map(map =>
        map.id === id ? { ...map, title } : map
      ));
      if (selectedMindMap?.id === id) {
        setSelectedMindMap({ ...selectedMindMap, title });
      }
      setEditingTitle(false);
      toast.success('Mind map title updated!');
    } catch (error) {
      console.error('Error updating title:', error);
      toast.error('Failed to update title');
    }
  };

  const onConnect = useCallback(
    (params: Connection) => {
      const edge = {
        ...params,
        type: 'smoothstep',
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        style: { strokeWidth: 2, stroke: '#8B5CF6' },
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );

  const addNode = (shapeType: string = 'rectangle') => {
    const defaultColor = '#6B7280';
    const newNode: Node = {
      id: nodeIdCounter.toString(),
      type: 'custom',
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 300 + 100,
      },
      data: { 
        label: 'New Idea', 
        color: defaultColor,
        nodeId: nodeIdCounter.toString(),
        shapeType
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setNodeIdCounter(nodeIdCounter + 1);
  };

  const updateNodeColor = (nodeId: string, color: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: { ...node.data, color },
            }
          : node
      )
    );
  };

  const editNodeLabel = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    const newLabel = prompt('Enter new label:', String(node.data.label || ''));
    if (newLabel !== null) {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId
            ? { ...n, data: { ...n.data, label: newLabel } }
            : n
        )
      );
    }
  };

  const deleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter(node => node.id !== nodeId));
    setEdges((eds) => eds.filter(edge => edge.source !== nodeId && edge.target !== nodeId));
  };

  // Memoized node types to prevent React Flow warnings
  const nodeTypes = useMemo(() => ({
    custom: ({ data, selected }: { data: any; selected: boolean }) => (
      <CustomNode
        data={data}
        selected={selected}
        onEdit={editNodeLabel}
        onDelete={deleteNode}
        onColorChange={updateNodeColor}
      />
    )
  }), []);

  const onNodeDoubleClick = (event: React.MouseEvent, node: Node) => {
    const newLabel = prompt('Enter new label:', String(node.data.label || ''));
    if (newLabel !== null) {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id
            ? { ...n, data: { ...n.data, label: newLabel } }
            : n
        )
      );
    }
  };

  const exportMindMap = () => {
    if (!selectedMindMap) return;
    
    const data = {
      title: selectedMindMap.title,
      nodes: nodes,
      edges: edges,
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedMindMap.title}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Mind map exported successfully!');
  };

  // Additional helper functions for the new interface
  const clearCanvas = () => {
    setNodes(initialNodes);
    setEdges([]);
    setNodeIdCounter(2);
    toast.success('Canvas cleared!');
  };

  const fitView = () => {
    // This would be handled by React Flow's fitView function
    toast.info('Fitting view to content');
  };

  const zoomIn = () => {
    toast.info('Zoom in');
  };

  const zoomOut = () => {
    toast.info('Zoom out');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center">
        <p className="text-gray-600">Please log in to access mind maps.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <ParticleBackground />
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Grid className="h-8 w-8 text-purple-600" />
                Mind Maps
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Visualize your ideas and concepts</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setIsCreating(true)}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Mind Map
              </Button>
              {selectedMindMap && (
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <Button onClick={() => addNode()} variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Node
                    </Button>
                    <Button onClick={saveMindMap} variant="outline">
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button onClick={exportMindMap} variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Quick Colors:</span>
                    {['hsl(var(--primary))', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'].map((color, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0 border-2"
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          toast.info('Right-click a node to change its color, or use the context menu');
                        }}
                        title={`${color} - Right-click nodes to apply colors`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Shape Palette Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                {/* Mind Maps List */}
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Your Mind Maps</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 max-h-60 overflow-y-auto">
                    {loading ? (
                      <div className="text-gray-500 text-center py-4">Loading...</div>
                    ) : mindMaps.length === 0 ? (
                      <div className="text-gray-500 text-center py-4">
                        <Grid className="h-6 w-6 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No mind maps yet</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {mindMaps.map((mindMap) => (
                          <div
                            key={mindMap.id}
                            className={`p-2 rounded-lg border cursor-pointer transition-colors text-sm ${
                              selectedMindMap?.id === mindMap.id
                                ? 'bg-purple-100 border-purple-300'
                                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                            }`}
                            onClick={() => loadMindMap(mindMap)}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-xs truncate">{mindMap.title}</h3>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(mindMap.updated_at).toLocaleDateString()}
                                </p>
                              </div>
                              {selectedMindMap?.id === mindMap.id && (
                                <div className="flex gap-1 ml-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingTitle(true);
                                    }}
                                    className="h-5 w-5 p-0"
                                  >
                                    <Edit className="h-2 w-2" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteMindMap(mindMap.id);
                                    }}
                                    className="h-5 w-5 p-0 text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="h-2 w-2" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Shape Palette */}
                {selectedMindMap && (
                  <ShapePalette onShapeSelect={(shapeType) => addNode(shapeType)} />
                )}

                {/* Create Mind Map Form */}
                {isCreating && (
                  <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
                    <CardHeader>
                      <CardTitle className="text-sm">Create Mind Map</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Input
                        placeholder="Mind map title..."
                        value={newMindMap.title}
                        onChange={(e) => setNewMindMap({ ...newMindMap, title: e.target.value })}
                        className="text-sm"
                      />
                      <Textarea
                        placeholder="Description (optional)..."
                        value={newMindMap.description}
                        onChange={(e) => setNewMindMap({ ...newMindMap, description: e.target.value })}
                        rows={2}
                        className="text-sm"
                      />
                      <div className="flex gap-2">
                        <Button onClick={createMindMap} disabled={!newMindMap.title.trim()} size="sm">
                          Create
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setIsCreating(false);
                            setNewMindMap({ title: '', description: '' });
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Mind Map Canvas */}
            <div className="lg:col-span-4">
              <div className="space-y-4">
                {/* Toolbar */}
                {selectedMindMap && (
                  <MindMapToolbar
                    onSave={saveMindMap}
                    onExport={exportMindMap}
                    onZoomIn={zoomIn}
                    onZoomOut={zoomOut}
                    onFitView={fitView}
                    onClear={clearCanvas}
                    selectedTool={selectedTool}
                    onToolSelect={setSelectedTool}
                    showGrid={showGrid}
                    onToggleGrid={() => setShowGrid(!showGrid)}
                  />
                )}

                {/* Canvas */}
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>{selectedMindMap ? selectedMindMap.title : 'Select a Mind Map'}</span>
                      {selectedMindMap && editingTitle && (
                        <Input
                          defaultValue={selectedMindMap.title}
                          onBlur={(e) => updateMindMapTitle(selectedMindMap.id, e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              updateMindMapTitle(selectedMindMap.id, e.currentTarget.value);
                            }
                          }}
                          className="h-auto p-1 text-lg font-semibold max-w-xs"
                          autoFocus
                        />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-1">
                    {selectedMindMap ? (
                      <div className="h-[650px] w-full border rounded-lg overflow-hidden" ref={reactFlowWrapper}>
                        <ReactFlow
                          nodes={nodes.map(node => ({
                            ...node,
                            data: {
                              ...node.data,
                              nodeId: node.id,
                            }
                          }))}
                          edges={edges}
                          onNodesChange={onNodesChange}
                          onEdgesChange={onEdgesChange}
                          onConnect={onConnect}
                          onNodeDoubleClick={onNodeDoubleClick}
                          fitView
                          attributionPosition="bottom-left"
                          nodeTypes={nodeTypes}
                          connectionLineStyle={{ strokeWidth: 2, stroke: '#8B5CF6' }}
                          defaultEdgeOptions={{
                            style: { strokeWidth: 2, stroke: '#8B5CF6' },
                            markerEnd: { type: MarkerType.ArrowClosed, color: '#8B5CF6' },
                          }}
                        >
                          <MiniMap
                            zoomable
                            pannable
                            position="bottom-right"
                            style={{
                              backgroundColor: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px',
                            }}
                          />
                          <Controls
                            position="bottom-left"
                            style={{
                              backgroundColor: '#ffffff',
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px',
                            }}
                          />
                          <Background 
                            color={showGrid ? "#e2e8f0" : "transparent"} 
                            gap={20}
                          />
                        </ReactFlow>
                      </div>
                    ) : (
                      <div className="h-[650px] flex items-center justify-center text-gray-500 border rounded-lg bg-gray-50/50">
                        <div className="text-center">
                          <Grid className="h-16 w-16 mx-auto mb-4 opacity-30" />
                          <p className="text-lg font-medium">Welcome to Mind Maps!</p>
                          <p className="text-sm mt-2 mb-4">Create or select a mind map to start visualizing your ideas</p>
                          <div className="space-y-2 text-xs text-gray-400">
                            <p>💡 Tips to get started:</p>
                            <p>• Create a new mind map with the button above</p>
                            <p>• Use shapes from the left panel to add variety</p>
                            <p>• Double-click nodes to edit text</p>
                            <p>• Right-click for more options</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MindMaps;
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CheckCircle, Plus, Clock, AlertCircle, Star, MoreVertical, Edit, Trash2, Filter, ListTodo } from "lucide-react";
import { TodoForm } from "@/components/todo/TodoForm";
import { TodoFilters } from "@/components/todo/TodoFilters";
import { TodoItem, TodoFilter } from "@/types/todo";

// Keep the old interface for backward compatibility
export interface FocusItem {
  id: string;
  title: string;
  type: 'task' | 'study' | 'deadline';
  priority: 'high' | 'medium' | 'low';
  completed?: boolean;
  dueTime?: string;
}

interface TodaysFocusProps {
  focusItems: FocusItem[];
  onAddFocus: () => void;
  onToggleComplete: (id: string) => void;
}

export function TodaysFocus({ focusItems, onAddFocus, onToggleComplete }: TodaysFocusProps) {
  // Convert FocusItems to TodoItems for enhanced functionality
  const [todos, setTodos] = useState<TodoItem[]>(() => 
    focusItems.map(item => ({
      ...item,
      description: '',
      completed: item.completed || false,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      type: item.type as TodoItem['type']
    }))
  );

  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);
  const [filter, setFilter] = useState<TodoFilter>({});
  const [searchQuery, setSearchQuery] = useState('');

  const priorityColors = {
    high: 'bg-priority-high text-priority-high-foreground',
    medium: 'bg-priority-medium text-priority-medium-foreground',
    low: 'bg-priority-low text-priority-low-foreground'
  };

  const typeIcons = {
    task: CheckCircle,
    study: Clock,
    deadline: AlertCircle,
    reminder: Star
  };

  // Filter and search logic
  const filteredTodos = todos.filter(todo => {
    // Search filter
    if (searchQuery && !todo.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !todo.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Type filter
    if (filter.type && filter.type.length > 0 && !filter.type.includes(todo.type)) {
      return false;
    }

    // Priority filter
    if (filter.priority && filter.priority.length > 0 && !filter.priority.includes(todo.priority)) {
      return false;
    }

    // Completion filter
    if (filter.completed !== undefined && todo.completed !== filter.completed) {
      return false;
    }

    return true;
  });

  const handleSaveTodo = (todoData: Partial<TodoItem>) => {
    if (todoData.id) {
      // Update existing todo
      setTodos(prev => prev.map(todo => 
        todo.id === todoData.id ? { ...todo, ...todoData } : todo
      ));
    } else {
      // Add new todo
      const newTodo: TodoItem = {
        id: Date.now().toString(),
        title: todoData.title || '',
        description: todoData.description || '',
        type: todoData.type || 'task',
        priority: todoData.priority || 'medium',
        completed: false,
        dueDate: todoData.dueDate,
        dueTime: todoData.dueTime,
        tags: todoData.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setTodos(prev => [...prev, newTodo]);
    }
    setEditingTodo(null);
  };

  const handleToggleComplete = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed, updatedAt: new Date().toISOString() } : todo
    ));
  };

  const handleEditTodo = (todo: TodoItem) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const formatDueDateTime = (dueDate?: string, dueTime?: string) => {
    if (!dueDate) return null;
    
    const date = new Date(dueDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    let dateStr = '';
    if (date.toDateString() === today.toDateString()) {
      dateStr = 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      dateStr = 'Tomorrow';
    } else {
      dateStr = date.toLocaleDateString();
    }
    
    return dueTime ? `${dateStr} at ${dueTime}` : dateStr;
  };

  return (
    <Card className="card-enhanced">
      <CardHeader className="pb-3 px-4 sm:px-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <ListTodo className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg sm:text-xl">Todo List</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {filteredTodos.filter(t => !t.completed).length} active
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowFilters(!showFilters)}
              className="interactive-hover shrink-0"
            >
              <Filter className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowForm(true)}
              className="interactive-hover shrink-0"
            >
              <Plus className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Add</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-4 sm:p-6">
        {/* Filters */}
        {showFilters && (
          <TodoFilters
            filter={filter}
            onFilterChange={setFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}

        {filteredTodos.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <ListTodo className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">
              {todos.length === 0 ? 'No todos yet' : 'No todos match your filters'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {todos.length === 0 ? 'Add your first task to get started' : 'Try adjusting your filters'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTodos.map((todo) => {
              const IconComponent = typeIcons[todo.type];
              const dueDateTimeString = formatDueDateTime(todo.dueDate, todo.dueTime);
              
              return (
                <div 
                  key={todo.id} 
                  className={`group flex items-start gap-3 p-3 sm:p-4 rounded-lg border transition-all duration-200 ${
                    todo.completed 
                      ? 'bg-muted/50 opacity-60 border-muted' 
                      : 'bg-card hover:bg-muted/30 hover:border-muted-foreground/20 hover:shadow-sm'
                  }`}
                >
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => handleToggleComplete(todo.id)}
                    className="mt-1 flex-shrink-0"
                  />
                  
                  <IconComponent className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                  
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium leading-snug ${
                      todo.completed 
                        ? 'line-through text-muted-foreground' 
                        : 'text-foreground'
                    }`}>
                      {todo.title}
                    </p>
                    
                    {todo.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {todo.description}
                      </p>
                    )}
                    
                    {dueDateTimeString && (
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Due: {dueDateTimeString}
                      </p>
                    )}
                    
                    {todo.tags && todo.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {todo.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge 
                      className={`${priorityColors[todo.priority]} text-xs font-medium px-2 py-1 rounded-full`}
                    >
                      {todo.priority}
                    </Badge>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditTodo(todo)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteTodo(todo.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      {/* Todo Form Modal */}
      <TodoForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingTodo(null);
        }}
        onSave={handleSaveTodo}
        editingTodo={editingTodo}
      />
    </Card>
  );
}
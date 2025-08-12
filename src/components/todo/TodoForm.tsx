import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { TodoItem } from "@/types/todo";
import { useForm } from "react-hook-form";

interface TodoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (todo: Partial<TodoItem>) => void;
  editingTodo?: TodoItem | null;
}

interface TodoFormData {
  title: string;
  description: string;
  type: string;
  priority: string;
  dueDate: string;
  dueTime: string;
  tags: string;
}

export function TodoForm({ isOpen, onClose, onSave, editingTodo }: TodoFormProps) {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<TodoFormData>({
    defaultValues: {
      title: editingTodo?.title || '',
      description: editingTodo?.description || '',
      type: editingTodo?.type || 'task',
      priority: editingTodo?.priority || 'medium',
      dueDate: editingTodo?.dueDate || '',
      dueTime: editingTodo?.dueTime || '',
      tags: editingTodo?.tags?.join(', ') || ''
    }
  });

  React.useEffect(() => {
    if (editingTodo) {
      reset({
        title: editingTodo.title,
        description: editingTodo.description || '',
        type: editingTodo.type,
        priority: editingTodo.priority,
        dueDate: editingTodo.dueDate || '',
        dueTime: editingTodo.dueTime || '',
        tags: editingTodo.tags?.join(', ') || ''
      });
    } else if (isOpen) {
      reset({
        title: '',
        description: '',
        type: 'task',
        priority: 'medium',
        dueDate: '',
        dueTime: '',
        tags: ''
      });
    }
  }, [editingTodo, isOpen, reset]);

  const onSubmit = (data: TodoFormData) => {
    const tags = data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];
    
    const todoData: Partial<TodoItem> = {
      id: editingTodo?.id,
      title: data.title,
      description: data.description,
      type: data.type as TodoItem['type'],
      priority: data.priority as TodoItem['priority'],
      dueDate: data.dueDate || undefined,
      dueTime: data.dueTime || undefined,
      tags,
      completed: editingTodo?.completed || false,
      updatedAt: new Date().toISOString()
    };

    if (!editingTodo) {
      todoData.createdAt = new Date().toISOString();
    }

    onSave(todoData);
    onClose();
  };

  const typeOptions = [
    { value: 'task', label: 'Task', icon: '✓' },
    { value: 'study', label: 'Study', icon: '📚' },
    { value: 'deadline', label: 'Deadline', icon: '⏰' },
    { value: 'reminder', label: 'Reminder', icon: '🔔' }
  ];

  const priorityOptions = [
    { value: 'high', label: 'High Priority', color: 'bg-priority-high' },
    { value: 'medium', label: 'Medium Priority', color: 'bg-priority-medium' },
    { value: 'low', label: 'Low Priority', color: 'bg-priority-low' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingTodo ? 'Edit Todo' : 'Add New Todo'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter task title..."
              {...register('title', { required: 'Title is required' })}
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add details about this task..."
              rows={3}
              {...register('description')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={watch('type')}
                onValueChange={(value) => setValue('type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className="flex items-center gap-2">
                        <span>{option.icon}</span>
                        {option.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={watch('priority')}
                onValueChange={(value) => setValue('priority', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${option.color}`} />
                        {option.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                {...register('dueDate')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueTime">Due Time</Label>
              <Input
                id="dueTime"
                type="time"
                {...register('dueTime')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              placeholder="Enter tags separated by commas..."
              {...register('tags')}
            />
            <p className="text-xs text-muted-foreground">
              Separate multiple tags with commas (e.g., urgent, work, personal)
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editingTodo ? 'Update Todo' : 'Add Todo'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
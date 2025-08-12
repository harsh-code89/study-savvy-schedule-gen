export interface TodoItem {
  id: string;
  title: string;
  description?: string;
  type: 'task' | 'study' | 'deadline' | 'reminder';
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  dueDate?: string;
  dueTime?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TodoCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface TodoFilter {
  type?: string[];
  priority?: string[];
  completed?: boolean;
  dueDate?: string;
  tags?: string[];
}
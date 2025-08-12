import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { X, Filter, Search } from "lucide-react";
import { TodoFilter } from "@/types/todo";

interface TodoFiltersProps {
  filter: TodoFilter;
  onFilterChange: (filter: TodoFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function TodoFilters({ filter, onFilterChange, searchQuery, onSearchChange }: TodoFiltersProps) {
  const typeOptions = [
    { value: 'task', label: 'Tasks', icon: '✓' },
    { value: 'study', label: 'Study', icon: '📚' },
    { value: 'deadline', label: 'Deadlines', icon: '⏰' },
    { value: 'reminder', label: 'Reminders', icon: '🔔' }
  ];

  const priorityOptions = [
    { value: 'high', label: 'High', color: 'bg-priority-high' },
    { value: 'medium', label: 'Medium', color: 'bg-priority-medium' },
    { value: 'low', label: 'Low', color: 'bg-priority-low' }
  ];

  const clearAllFilters = () => {
    onFilterChange({});
    onSearchChange('');
  };

  const hasActiveFilters = Object.keys(filter).length > 0 || searchQuery;

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Filters</span>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search todos..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Type Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Type</label>
        <div className="flex flex-wrap gap-2">
          {typeOptions.map((type) => {
            const isSelected = filter.type?.includes(type.value);
            return (
              <Badge
                key={type.value}
                variant={isSelected ? "default" : "outline"}
                className="cursor-pointer transition-colors"
                onClick={() => {
                  const newTypes = isSelected
                    ? filter.type?.filter(t => t !== type.value) || []
                    : [...(filter.type || []), type.value];
                  onFilterChange({
                    ...filter,
                    type: newTypes.length > 0 ? newTypes : undefined
                  });
                }}
              >
                <span className="mr-1">{type.icon}</span>
                {type.label}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Priority Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Priority</label>
        <div className="flex flex-wrap gap-2">
          {priorityOptions.map((priority) => {
            const isSelected = filter.priority?.includes(priority.value);
            return (
              <Badge
                key={priority.value}
                variant={isSelected ? "default" : "outline"}
                className="cursor-pointer transition-colors"
                onClick={() => {
                  const newPriorities = isSelected
                    ? filter.priority?.filter(p => p !== priority.value) || []
                    : [...(filter.priority || []), priority.value];
                  onFilterChange({
                    ...filter,
                    priority: newPriorities.length > 0 ? newPriorities : undefined
                  });
                }}
              >
                <div className={`w-2 h-2 rounded-full mr-1 ${priority.color}`} />
                {priority.label}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Completion Status */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Status</label>
        <div className="flex gap-2">
          <Badge
            variant={filter.completed === false ? "default" : "outline"}
            className="cursor-pointer transition-colors"
            onClick={() => {
              onFilterChange({
                ...filter,
                completed: filter.completed === false ? undefined : false
              });
            }}
          >
            Active
          </Badge>
          <Badge
            variant={filter.completed === true ? "default" : "outline"}
            className="cursor-pointer transition-colors"
            onClick={() => {
              onFilterChange({
                ...filter,
                completed: filter.completed === true ? undefined : true
              });
            }}
          >
            Completed
          </Badge>
        </div>
      </div>
    </div>
  );
}
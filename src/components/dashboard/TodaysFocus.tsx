import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Plus, Clock, AlertCircle, Star } from "lucide-react";

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
  const priorityColors = {
    high: 'bg-priority-high text-priority-high-foreground',
    medium: 'bg-priority-medium text-priority-medium-foreground',
    low: 'bg-priority-low text-priority-low-foreground'
  };

  const typeIcons = {
    task: CheckCircle,
    study: Clock,
    deadline: AlertCircle
  };

  return (
    <Card className="card-enhanced">
      <CardHeader className="pb-3 px-4 sm:px-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-warning" />
            <CardTitle className="text-lg sm:text-xl">Today's Focus</CardTitle>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onAddFocus}
            className="interactive-hover shrink-0"
          >
            <Plus className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline">Add</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-4 sm:p-6">
        {focusItems.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <Star className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">No focus items yet</p>
            <p className="text-sm text-muted-foreground mt-1">Add tasks or goals to stay focused</p>
          </div>
        ) : (
          <div className="space-y-2">
            {focusItems.map((item) => {
              const IconComponent = typeIcons[item.type];
              return (
                <div 
                  key={item.id} 
                  className={`group flex items-center gap-3 p-3 sm:p-4 rounded-lg border transition-all duration-200 ${
                    item.completed 
                      ? 'bg-muted/50 opacity-60 border-muted' 
                      : 'bg-card hover:bg-muted/30 hover:border-muted-foreground/20 hover:shadow-sm'
                  }`}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-primary/10 flex-shrink-0 transition-colors"
                    onClick={() => onToggleComplete(item.id)}
                  >
                    <CheckCircle 
                      className={`h-5 w-5 transition-colors ${
                        item.completed 
                          ? 'text-success fill-success/20' 
                          : 'text-muted-foreground group-hover:text-primary'
                      }`} 
                    />
                  </Button>
                  
                  <IconComponent className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium leading-snug ${
                      item.completed 
                        ? 'line-through text-muted-foreground' 
                        : 'text-foreground'
                    }`}>
                      {item.title}
                    </p>
                    {item.dueTime && (
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Due: {item.dueTime}
                      </p>
                    )}
                  </div>
                  
                  <Badge 
                    className={`${priorityColors[item.priority]} text-xs font-medium px-2 py-1 rounded-full flex-shrink-0`}
                  >
                    {item.priority}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
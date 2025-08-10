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
    high: 'bg-destructive text-destructive-foreground',
    medium: 'bg-warning text-warning-foreground',
    low: 'bg-muted text-muted-foreground'
  };

  const typeIcons = {
    task: CheckCircle,
    study: Clock,
    deadline: AlertCircle
  };

  return (
    <Card className="card-enhanced">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-warning" />
            <CardTitle className="text-lg">Today's Focus</CardTitle>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onAddFocus}
            className="interactive-hover"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {focusItems.length === 0 ? (
          <div className="text-center py-6">
            <Star className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No focus items yet</p>
            <p className="text-sm text-muted-foreground">Add tasks or goals to stay focused</p>
          </div>
        ) : (
          focusItems.map((item) => {
            const IconComponent = typeIcons[item.type];
            return (
              <div 
                key={item.id} 
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  item.completed 
                    ? 'bg-muted/50 opacity-60' 
                    : 'bg-card hover:bg-muted/30'
                }`}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-primary/10"
                  onClick={() => onToggleComplete(item.id)}
                >
                  <CheckCircle 
                    className={`h-5 w-5 ${
                      item.completed 
                        ? 'text-success fill-success' 
                        : 'text-muted-foreground'
                    }`} 
                  />
                </Button>
                
                <IconComponent className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${
                    item.completed ? 'line-through text-muted-foreground' : ''
                  }`}>
                    {item.title}
                  </p>
                  {item.dueTime && (
                    <p className="text-xs text-muted-foreground">
                      Due: {item.dueTime}
                    </p>
                  )}
                </div>
                
                <Badge 
                  variant="secondary" 
                  className={`${priorityColors[item.priority]} text-xs`}
                >
                  {item.priority}
                </Badge>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
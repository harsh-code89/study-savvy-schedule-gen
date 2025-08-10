import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Clock, 
  BookOpen, 
  TrendingUp,
  Calendar,
  Target
} from "lucide-react";

interface DashboardStatsProps {
  completedTasks: number;
  totalTasks: number;
  studyStreak: number;
  weeklyStudyHours: number;
  activeSubjects: number;
  upcomingDeadlines: number;
}

export function DashboardStats({
  completedTasks,
  totalTasks,
  studyStreak,
  weeklyStudyHours,
  activeSubjects,
  upcomingDeadlines
}: DashboardStatsProps) {
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      title: "Tasks Completed",
      value: completedTasks,
      total: totalTasks,
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
      description: `${completionRate}% completion rate`
    },
    {
      title: "Study Streak",
      value: studyStreak,
      suffix: "days",
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
      description: "Keep it up!"
    },
    {
      title: "This Week",
      value: weeklyStudyHours,
      suffix: "hrs",
      icon: Clock,
      color: "text-info",
      bgColor: "bg-info/10",
      description: "Study time logged"
    },
    {
      title: "Active Subjects",
      value: activeSubjects,
      icon: BookOpen,
      color: "text-warning",
      bgColor: "bg-warning/10",
      description: "Currently studying"
    },
    {
      title: "Upcoming",
      value: upcomingDeadlines,
      suffix: "deadlines",
      icon: Calendar,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      description: "This week"
    },
    {
      title: "Weekly Goal",
      value: Math.round((weeklyStudyHours / 20) * 100),
      suffix: "%",
      icon: Target,
      color: "text-primary",
      bgColor: "bg-primary/10",
      description: "20hrs target"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="card-enhanced">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-md ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stat.value}
              {stat.suffix && <span className="text-lg text-muted-foreground ml-1">{stat.suffix}</span>}
              {stat.total && (
                <span className="text-lg text-muted-foreground">/{stat.total}</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
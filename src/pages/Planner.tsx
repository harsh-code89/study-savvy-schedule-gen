import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, CheckSquare, BookOpen, PenTool, Plus, Clock, Target, TrendingUp } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import ParticleBackground from '@/components/ParticleBackground';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  due_date?: string;
  category: string;
}

interface JournalEntry {
  id: string;
  title: string;
  mood: string;
  entry_date: string;
}

interface StudySession {
  id: string;
  title: string;
  scheduled_date: string;
  scheduled_time: string;
  duration: number;
  completed: boolean;
}

const Planner = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);

  // Load all data
  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    try {
      const [tasksResult, journalResult, studyResult] = await Promise.all([
        supabase
          .from('tasks')
          .select('id, title, status, priority, due_date, category')
          .eq('user_id', user?.id),
        supabase
          .from('journal_entries')
          .select('id, title, mood, entry_date')
          .eq('user_id', user?.id),
        supabase
          .from('study_sessions')
          .select('id, title, scheduled_date, scheduled_time, duration, completed')
          .eq('user_id', user?.id)
      ]);

      if (tasksResult.error) throw tasksResult.error;
      if (journalResult.error) throw journalResult.error;
      if (studyResult.error) throw studyResult.error;

      setTasks(tasksResult.data || []);
      setJournalEntries(journalResult.data || []);
      setStudySessions(studyResult.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load planner data');
    } finally {
      setLoading(false);
    }
  };

  // Get items for selected date
  const getItemsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    
    const dayTasks = tasks.filter(task => 
      task.due_date && format(new Date(task.due_date), 'yyyy-MM-dd') === dateStr
    );
    
    const dayJournal = journalEntries.filter(entry => 
      entry.entry_date === dateStr
    );
    
    const dayStudy = studySessions.filter(session => 
      session.scheduled_date === dateStr
    );

    return { tasks: dayTasks, journal: dayJournal, study: dayStudy };
  };

  // Get week overview
  const getWeekOverview = () => {
    const weekStart = startOfWeek(selectedDate);
    const weekEnd = endOfWeek(selectedDate);
    const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return daysInWeek.map(day => {
      const items = getItemsForDate(day);
      return {
        date: day,
        ...items,
        totalItems: items.tasks.length + items.journal.length + items.study.length
      };
    });
  };

  // Calculate stats
  const getStats = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const thisWeek = getWeekOverview();
    
    const todayItems = getItemsForDate(new Date());
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const totalTasks = tasks.length;
    const weekTotal = thisWeek.reduce((sum, day) => sum + day.totalItems, 0);
    
    return {
      todayTotal: todayItems.tasks.length + todayItems.journal.length + todayItems.study.length,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      weekTotal,
      journalStreak: calculateJournalStreak()
    };
  };

  const calculateJournalStreak = () => {
    let streak = 0;
    let currentDate = new Date();
    
    for (let i = 0; i < 30; i++) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const hasEntry = journalEntries.some(entry => entry.entry_date === dateStr);
      
      if (hasEntry) {
        streak++;
        currentDate = addDays(currentDate, -1);
      } else if (i === 0) {
        // If today has no entry, check yesterday
        currentDate = addDays(currentDate, -1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'very_happy': return 'bg-pink-100 text-pink-800';
      case 'happy': return 'bg-green-100 text-green-800';
      case 'neutral': return 'bg-yellow-100 text-yellow-800';
      case 'sad': return 'bg-orange-100 text-orange-800';
      case 'very_sad': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = getStats();
  const selectedDayItems = getItemsForDate(selectedDate);
  const weekOverview = getWeekOverview();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center">
        <p className="text-gray-600">Please log in to access your planner.</p>
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <CalendarIcon className="h-8 w-8 text-purple-600" />
                Daily Planner
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Organize your day with tasks, study sessions, and journal entries</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => window.location.href = '/tasks'}
                variant="outline"
                className="flex items-center gap-2"
              >
                <CheckSquare className="h-4 w-4" />
                Add Task
              </Button>
              <Button
                onClick={() => window.location.href = '/journal'}
                variant="outline"
                className="flex items-center gap-2"
              >
                <PenTool className="h-4 w-4" />
                Write Journal
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <CalendarIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600">{stats.todayTotal}</div>
                <div className="text-sm text-gray-600">Today's Items</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Target className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">{stats.completionRate}%</div>
                <div className="text-sm text-gray-600">Completion Rate</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-purple-600">{stats.weekTotal}</div>
                <div className="text-sm text-gray-600">This Week</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <PenTool className="h-5 w-5 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-orange-600">{stats.journalStreak}</div>
                <div className="text-sm text-gray-600">Journal Streak</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-1">
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>

              {/* Week Overview */}
              <Card className="mt-4 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Week Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {weekOverview.map((day, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded-lg border cursor-pointer transition-colors ${
                          format(day.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                            ? 'bg-purple-100 border-purple-300'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                        onClick={() => setSelectedDate(day.date)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium text-sm">
                              {format(day.date, 'EEE, MMM d')}
                            </div>
                            <div className="text-xs text-gray-500">
                              {day.totalItems} items
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {day.tasks.length > 0 && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                            {day.journal.length > 0 && (
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            )}
                            {day.study.length > 0 && (
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Selected Day Details */}
            <div className="lg:col-span-3">
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading...</div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-3">
                      {/* Tasks */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <CheckSquare className="h-4 w-4 text-blue-600" />
                          Tasks ({selectedDayItems.tasks.length})
                        </h3>
                        {selectedDayItems.tasks.length === 0 ? (
                          <p className="text-gray-500 text-sm">No tasks for this day</p>
                        ) : (
                          <div className="space-y-2">
                            {selectedDayItems.tasks.map((task) => (
                              <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
                                <div className="font-medium text-sm">{task.title}</div>
                                <div className="flex gap-1 mt-2">
                                  <Badge className={getPriorityColor(task.priority)} variant="secondary">
                                    {task.priority}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {task.category}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Study Sessions */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-green-600" />
                          Study Sessions ({selectedDayItems.study.length})
                        </h3>
                        {selectedDayItems.study.length === 0 ? (
                          <p className="text-gray-500 text-sm">No study sessions for this day</p>
                        ) : (
                          <div className="space-y-2">
                            {selectedDayItems.study.map((session) => (
                              <div key={session.id} className="p-3 bg-green-50 rounded-lg">
                                <div className="font-medium text-sm">{session.title}</div>
                                <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                                  <Clock className="h-3 w-3" />
                                  {session.scheduled_time} ({session.duration}h)
                                </div>
                                {session.completed && (
                                  <Badge className="mt-2" variant="secondary">
                                    Completed
                                  </Badge>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Journal Entries */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <PenTool className="h-4 w-4 text-purple-600" />
                          Journal ({selectedDayItems.journal.length})
                        </h3>
                        {selectedDayItems.journal.length === 0 ? (
                          <p className="text-gray-500 text-sm">No journal entries for this day</p>
                        ) : (
                          <div className="space-y-2">
                            {selectedDayItems.journal.map((entry) => (
                              <div key={entry.id} className="p-3 bg-purple-50 rounded-lg">
                                <div className="font-medium text-sm">{entry.title}</div>
                                <Badge className={`mt-2 ${getMoodColor(entry.mood)}`} variant="secondary">
                                  {entry.mood.replace('_', ' ')}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="mt-4 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button
                      onClick={() => window.location.href = '/tasks'}
                      variant="outline"
                      className="flex flex-col items-center gap-2 h-auto py-4"
                    >
                      <CheckSquare className="h-6 w-6 text-blue-600" />
                      <span className="text-sm">Manage Tasks</span>
                    </Button>
                    <Button
                      onClick={() => window.location.href = '/journal'}
                      variant="outline"
                      className="flex flex-col items-center gap-2 h-auto py-4"
                    >
                      <PenTool className="h-6 w-6 text-purple-600" />
                      <span className="text-sm">Write Journal</span>
                    </Button>
                    <Button
                      onClick={() => window.location.href = '/'}
                      variant="outline"
                      className="flex flex-col items-center gap-2 h-auto py-4"
                    >
                      <BookOpen className="h-6 w-6 text-green-600" />
                      <span className="text-sm">Study Planner</span>
                    </Button>
                    <Button
                      onClick={() => window.location.href = '/mindmaps'}
                      variant="outline"
                      className="flex flex-col items-center gap-2 h-auto py-4"
                    >
                      <Target className="h-6 w-6 text-orange-600" />
                      <span className="text-sm">Mind Maps</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Planner;
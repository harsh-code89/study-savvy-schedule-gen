import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { PenTool, Plus, Search, Calendar as CalendarIcon, Edit, Trash2, Heart, Smile, Meh, Frown, HeartCrack } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import ParticleBackground from '@/components/ParticleBackground';
import { toast } from 'sonner';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  tags: string[];
  entry_date: string;
  created_at: string;
  updated_at: string;
}

const Journal = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMood, setFilterMood] = useState<string>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood: 'neutral' as any,
    tags: [] as string[],
    entry_date: new Date()
  });

  // Load journal entries from database
  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user?.id)
        .order('entry_date', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      toast.error('Failed to load journal entries');
    } finally {
      setLoading(false);
    }
  };

  const createEntry = async () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) return;

    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert([{
          user_id: user?.id,
          title: newEntry.title,
          content: newEntry.content,
          mood: newEntry.mood,
          tags: newEntry.tags,
          entry_date: format(newEntry.entry_date, 'yyyy-MM-dd'),
        }])
        .select()
        .single();

      if (error) throw error;

      setEntries([data, ...entries]);
      setNewEntry({
        title: '',
        content: '',
        mood: 'neutral',
        tags: [],
        entry_date: new Date()
      });
      setIsCreating(false);
      toast.success('Journal entry created successfully!');
    } catch (error) {
      console.error('Error creating journal entry:', error);
      toast.error('Failed to create journal entry');
    }
  };

  const updateEntry = async (id: string, updates: Partial<JournalEntry>) => {
    try {
      const { error } = await supabase
        .from('journal_entries')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setEntries(entries.map(entry =>
        entry.id === id ? { ...entry, ...updates } : entry
      ));
      setEditingId(null);
      toast.success('Journal entry updated successfully!');
    } catch (error) {
      console.error('Error updating journal entry:', error);
      toast.error('Failed to update journal entry');
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEntries(entries.filter(entry => entry.id !== id));
      toast.success('Journal entry deleted successfully!');
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      toast.error('Failed to delete journal entry');
    }
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'very_happy': return <Heart className="h-5 w-5 text-pink-500" />;
      case 'happy': return <Smile className="h-5 w-5 text-green-500" />;
      case 'neutral': return <Meh className="h-5 w-5 text-yellow-500" />;
      case 'sad': return <Frown className="h-5 w-5 text-orange-500" />;
      case 'very_sad': return <HeartCrack className="h-5 w-5 text-red-500" />;
      default: return <Meh className="h-5 w-5 text-gray-500" />;
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'very_happy': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'happy': return 'bg-green-100 text-green-800 border-green-200';
      case 'neutral': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'sad': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'very_sad': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const addTag = (tag: string) => {
    if (tag && !newEntry.tags.includes(tag)) {
      setNewEntry({ ...newEntry, tags: [...newEntry.tags, tag] });
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewEntry({
      ...newEntry,
      tags: newEntry.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesMood = filterMood === 'all' || entry.mood === filterMood;
    return matchesSearch && matchesMood;
  });

  const moodStats = {
    very_happy: entries.filter(e => e.mood === 'very_happy').length,
    happy: entries.filter(e => e.mood === 'happy').length,
    neutral: entries.filter(e => e.mood === 'neutral').length,
    sad: entries.filter(e => e.mood === 'sad').length,
    very_sad: entries.filter(e => e.mood === 'very_sad').length,
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center">
        <p className="text-gray-600">Please log in to access your journal.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <ParticleBackground />
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <PenTool className="h-8 w-8 text-purple-600" />
                Personal Journal
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Reflect on your thoughts and experiences</p>
            </div>
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Entry
            </Button>
          </div>

          {/* Mood Stats */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            {Object.entries(moodStats).map(([mood, count]) => (
              <Card key={mood} className="bg-white/80 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center mb-2">
                    {getMoodIcon(mood)}
                  </div>
                  <div className="text-xl font-bold text-gray-900">{count}</div>
                  <div className="text-xs text-gray-600 capitalize">{mood.replace('_', ' ')}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <Card className="mb-6 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search entries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterMood} onValueChange={setFilterMood}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Mood" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Moods</SelectItem>
                    <SelectItem value="very_happy">Very Happy</SelectItem>
                    <SelectItem value="happy">Happy</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="sad">Sad</SelectItem>
                    <SelectItem value="very_sad">Very Sad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Create Entry Form */}
          {isCreating && (
            <Card className="mb-6 bg-white/80 backdrop-blur-sm border-purple-200">
              <CardHeader>
                <CardTitle>New Journal Entry</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Entry title..."
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                />
                <Textarea
                  placeholder="What's on your mind?..."
                  value={newEntry.content}
                  onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                  rows={8}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    value={newEntry.mood}
                    onValueChange={(value: JournalEntry['mood']) =>
                      setNewEntry({ ...newEntry, mood: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="How are you feeling?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="very_happy">Very Happy</SelectItem>
                      <SelectItem value="happy">Happy</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                      <SelectItem value="sad">Sad</SelectItem>
                      <SelectItem value="very_sad">Very Sad</SelectItem>
                    </SelectContent>
                  </Select>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !newEntry.entry_date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(newEntry.entry_date, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={newEntry.entry_date}
                        onSelect={(date) => date && setNewEntry({ ...newEntry, entry_date: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Input
                    placeholder="Add tags (press Enter)..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const tag = e.currentTarget.value.trim();
                        if (tag) {
                          addTag(tag);
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newEntry.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => removeTag(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={createEntry} disabled={!newEntry.title.trim() || !newEntry.content.trim()}>
                    Create Entry
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false);
                      setNewEntry({
                        title: '',
                        content: '',
                        mood: 'neutral',
                        tags: [],
                        entry_date: new Date()
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Journal Entries */}
          {loading ? (
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="py-12 text-center">
                <div className="text-gray-500">Loading journal entries...</div>
              </CardContent>
            </Card>
          ) : filteredEntries.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="py-12 text-center">
                <PenTool className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="text-gray-500">
                  {searchTerm || filterMood !== 'all'
                    ? 'No entries found matching your filters.'
                    : 'No journal entries yet. Start writing your first entry!'}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredEntries.map((entry) => (
                <Card key={entry.id} className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg leading-tight">{entry.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={getMoodColor(entry.mood)}>
                            {getMoodIcon(entry.mood)}
                            <span className="ml-1 capitalize">{entry.mood.replace('_', ' ')}</span>
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {format(new Date(entry.entry_date), 'MMM dd, yyyy')}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingId(entry.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteEntry(entry.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-6 mb-3">
                      {entry.content}
                    </p>
                    {entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {entry.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Journal;
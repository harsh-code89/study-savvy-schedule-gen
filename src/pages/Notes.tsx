import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, Edit, Trash2, Save, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import ParticleBackground from '@/components/ParticleBackground';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const Notes = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newNote, setNewNote] = useState({ title: '', content: '' });

  // Load notes from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem('studysavvy_notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Save notes to localStorage
  const saveNotes = (updatedNotes: Note[]) => {
    setNotes(updatedNotes);
    localStorage.setItem('studysavvy_notes', JSON.stringify(updatedNotes));
  };

  const createNote = () => {
    if (!newNote.title.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedNotes = [note, ...notes];
    saveNotes(updatedNotes);
    setNewNote({ title: '', content: '' });
    setIsCreating(false);
  };

  const updateNote = (id: string, title: string, content: string) => {
    const updatedNotes = notes.map(note =>
      note.id === id
        ? { ...note, title, content, updatedAt: new Date().toISOString() }
        : note
    );
    saveNotes(updatedNotes);
    setEditingId(null);
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    saveNotes(updatedNotes);
  };

  const filteredNotes = notes.filter(
    note =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center">
        <p className="text-gray-600">Please log in to access your notes.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <ParticleBackground />
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Notes</h1>
              <p className="text-gray-600 dark:text-gray-400">Capture your thoughts and study ideas</p>
            </div>
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Note
            </Button>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-sm"
            />
          </div>

          {/* Create Note Form */}
          {isCreating && (
            <Card className="mb-6 bg-white/80 backdrop-blur-sm border-purple-200">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Create New Note</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsCreating(false);
                      setNewNote({ title: '', content: '' });
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Note title..."
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                />
                <Textarea
                  placeholder="Write your note content..."
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  rows={6}
                />
                <div className="flex gap-2">
                  <Button onClick={createNote} disabled={!newNote.title.trim()}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Note
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false);
                      setNewNote({ title: '', content: '' });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes Grid */}
          {filteredNotes.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="py-12 text-center">
                <div className="text-gray-500">
                  {searchTerm ? 'No notes found matching your search.' : 'No notes yet. Create your first note!'}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  isEditing={editingId === note.id}
                  onEdit={() => setEditingId(note.id)}
                  onSave={(title, content) => updateNote(note.id, title, content)}
                  onCancel={() => setEditingId(null)}
                  onDelete={() => deleteNote(note.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface NoteCardProps {
  note: Note;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (title: string, content: string) => void;
  onCancel: () => void;
  onDelete: () => void;
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}) => {
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);

  const handleSave = () => {
    if (editTitle.trim()) {
      onSave(editTitle, editContent);
    }
  };

  const handleCancel = () => {
    setEditTitle(note.title);
    setEditContent(note.content);
    onCancel();
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        {isEditing ? (
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="font-semibold"
          />
        ) : (
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg leading-tight">{note.title}</CardTitle>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={onEdit}>
                <Edit className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onDelete}>
                <Trash2 className="h-3 w-3 text-red-500" />
              </Button>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={4}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave}>
                <Save className="h-3 w-3 mr-1" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 line-clamp-4">
              {note.content || 'No content'}
            </p>
            <p className="text-xs text-gray-400">
              Updated {new Date(note.updatedAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Notes;
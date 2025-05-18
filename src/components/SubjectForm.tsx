
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, Minus } from 'lucide-react';
import { cn } from "@/lib/utils";
import { SubjectInfo, ChapterInfo } from '@/types/studyPlanner';
import { getRandomColor } from '@/utils/studyPlanGenerator';

interface SubjectFormProps {
  onAddSubject: (subject: SubjectInfo) => void;
}

const SubjectForm: React.FC<SubjectFormProps> = ({ onAddSubject }) => {
  const [name, setName] = useState<string>('');
  const [difficulty, setDifficulty] = useState<number>(3);
  const [examDate, setExamDate] = useState<Date | undefined>(undefined);
  const [chapters, setChapters] = useState<ChapterInfo[]>([]);
  const [chapterName, setChapterName] = useState<string>('');
  const [chapterDifficulty, setChapterDifficulty] = useState<number>(3);
  const [estimatedHours, setEstimatedHours] = useState<number>(2);

  const handleAddChapter = () => {
    if (chapterName.trim() === '') return;

    const newChapter: ChapterInfo = {
      id: Math.random().toString(36).substring(2, 9),
      name: chapterName,
      subjectId: '', // Will be set when subject is created
      difficulty: chapterDifficulty,
      estimatedHours: estimatedHours,
      completed: false,
    };

    setChapters([...chapters, newChapter]);
    setChapterName('');
    setChapterDifficulty(3);
    setEstimatedHours(2);
  };

  const handleRemoveChapter = (id: string) => {
    setChapters(chapters.filter(chapter => chapter.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name.trim() === '' || chapters.length === 0) return;

    const subjectId = Math.random().toString(36).substring(2, 9);
    
    const newSubject: SubjectInfo = {
      id: subjectId,
      name,
      difficulty,
      examDate: examDate || null,
      chapters: chapters.map(chapter => ({
        ...chapter,
        subjectId
      })),
      color: getRandomColor(),
    };

    onAddSubject(newSubject);
    
    // Reset form
    setName('');
    setDifficulty(3);
    setExamDate(undefined);
    setChapters([]);
  };

  return (
    <Card className="p-6 glass-card">
      <h2 className="text-xl font-bold mb-4 gradient-heading">Add Subject</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="subject-name">Subject Name</Label>
          <Input
            id="subject-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Mathematics, Physics, History"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Subject Difficulty (1-5)</Label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Easy</span>
            <Slider
              value={[difficulty]}
              min={1}
              max={5}
              step={1}
              onValueChange={(value) => setDifficulty(value[0])}
              className="flex-1"
            />
            <span className="text-sm text-gray-500">Hard</span>
            <span className="ml-2 min-w-[20px] text-center">{difficulty}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Exam Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {examDate ? format(examDate, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={examDate}
                onSelect={setExamDate}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="border-t pt-4 mt-4">
          <h3 className="text-lg font-medium mb-2">Add Chapters</h3>
          
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="chapter-name">Chapter Name</Label>
              <Input
                id="chapter-name"
                value={chapterName}
                onChange={(e) => setChapterName(e.target.value)}
                placeholder="e.g., Algebra, Calculus, World War II"
              />
            </div>

            <div className="space-y-2">
              <Label>Chapter Difficulty (1-5)</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Easy</span>
                <Slider
                  value={[chapterDifficulty]}
                  min={1}
                  max={5}
                  step={1}
                  onValueChange={(value) => setChapterDifficulty(value[0])}
                  className="flex-1"
                />
                <span className="text-sm text-gray-500">Hard</span>
                <span className="ml-2 min-w-[20px] text-center">{chapterDifficulty}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimated-hours">Estimated Study Hours</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setEstimatedHours(Math.max(1, estimatedHours - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  id="estimated-hours"
                  type="number"
                  min={1}
                  value={estimatedHours}
                  onChange={(e) => setEstimatedHours(parseInt(e.target.value) || 1)}
                  className="text-center"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setEstimatedHours(estimatedHours + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleAddChapter}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Chapter
            </Button>
          </div>

          {chapters.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Added Chapters:</h4>
              <ul className="space-y-2">
                {chapters.map((chapter) => (
                  <li
                    key={chapter.id}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded"
                  >
                    <div>
                      <span className="font-medium">{chapter.name}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        ({chapter.estimatedHours}h, Difficulty: {chapter.difficulty})
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveChapter(chapter.id)}
                    >
                      <Minus className="h-4 w-4 text-red-500" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-study-primary hover:bg-study-secondary"
          disabled={name.trim() === '' || chapters.length === 0}
        >
          Add Subject
        </Button>
      </form>
    </Card>
  );
};

export default SubjectForm;

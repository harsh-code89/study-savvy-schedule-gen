
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { SubjectInfo } from '@/types/studyPlanner';
import { CalendarDays, Book } from 'lucide-react';

interface SubjectsListProps {
  subjects: SubjectInfo[];
  onRemoveSubject: (id: string) => void;
}

const SubjectsList: React.FC<SubjectsListProps> = ({ subjects, onRemoveSubject }) => {
  if (subjects.length === 0) {
    return (
      <Card className="p-6 glass-card">
        <h2 className="text-xl font-bold mb-4 gradient-heading">Your Subjects</h2>
        <div className="text-center text-gray-500 py-8">
          <Book className="mx-auto h-12 w-12 mb-2 opacity-50" />
          <p>No subjects added yet.</p>
          <p className="text-sm mt-1">Add your first subject to get started!</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 glass-card">
      <h2 className="text-xl font-bold mb-4 gradient-heading">Your Subjects</h2>
      <div className="space-y-4">
        {subjects.map((subject) => (
          <div 
            key={subject.id}
            className="border rounded-md overflow-hidden"
            style={{ borderLeftColor: subject.color, borderLeftWidth: '4px' }}
          >
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{subject.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <span className="mr-2">Difficulty: {subject.difficulty}</span>
                    {subject.examDate && (
                      <div className="flex items-center">
                        <CalendarDays className="h-4 w-4 mr-1" />
                        <span>Exam: {format(new Date(subject.examDate), 'MMM dd, yyyy')}</span>
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveSubject(subject.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  Remove
                </Button>
              </div>

              <div className="mt-3">
                <h4 className="text-sm font-medium mb-1">Chapters ({subject.chapters.length}):</h4>
                <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
                  {subject.chapters.map((chapter) => (
                    <div
                      key={chapter.id}
                      className="text-xs bg-gray-50 p-2 rounded flex justify-between items-center"
                    >
                      <span>{chapter.name}</span>
                      <span className="text-gray-500">{chapter.estimatedHours}h</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SubjectsList;

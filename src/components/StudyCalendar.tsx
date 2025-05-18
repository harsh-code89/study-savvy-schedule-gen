
import React from 'react';
import { Card } from "@/components/ui/card";
import { SubjectInfo, StudySession } from '@/types/studyPlanner';
import { format, addDays, eachDayOfInterval } from 'date-fns';
import { Check } from 'lucide-react';

interface StudyCalendarProps {
  subjects: SubjectInfo[];
  sessions: StudySession[];
  startDate: Date | undefined;
  endDate: Date | undefined;
  onToggleSessionCompleted: (sessionId: string) => void;
}

const StudyCalendar: React.FC<StudyCalendarProps> = ({
  subjects,
  sessions,
  startDate,
  endDate,
  onToggleSessionCompleted
}) => {
  if (!startDate || !endDate || sessions.length === 0) {
    return (
      <Card className="p-6 glass-card">
        <h2 className="text-xl font-bold mb-4 gradient-heading">Study Calendar</h2>
        <div className="text-center text-gray-500 py-12">
          <p>Generate a study plan to see your calendar</p>
        </div>
      </Card>
    );
  }

  // Generate array of dates between start and end date
  const dateRange = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  // Get session for a specific date
  const getSessionsForDate = (date: Date) => {
    return sessions.filter(session => 
      format(new Date(session.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  // Find subject by ID
  const getSubjectById = (subjectId: string) => {
    return subjects.find(subject => subject.id === subjectId);
  };

  // Find chapter by ID for a given subject
  const getChapterById = (subjectId: string, chapterId: string) => {
    const subject = getSubjectById(subjectId);
    if (!subject) return null;
    return subject.chapters.find(chapter => chapter.id === chapterId);
  };

  return (
    <Card className="p-6 glass-card">
      <h2 className="text-xl font-bold mb-4 gradient-heading">Study Calendar</h2>
      
      <div className="space-y-4">
        {dateRange.map((date) => {
          const daysSessions = getSessionsForDate(date);
          if (daysSessions.length === 0) return null;

          return (
            <div key={format(date, 'yyyy-MM-dd')} className="border rounded-md overflow-hidden">
              <div className="bg-gray-50 p-3 font-medium">
                {format(date, 'EEEE, MMMM d, yyyy')}
              </div>
              <div className="divide-y">
                {daysSessions.map((session) => {
                  const subject = getSubjectById(session.subjectId);
                  const chapter = getChapterById(session.subjectId, session.chapterId);
                  
                  if (!subject || !chapter) return null;
                  
                  return (
                    <div 
                      key={session.id}
                      className="p-3 flex items-center hover:bg-gray-50 transition-colors"
                      style={{ borderLeft: `4px solid ${subject.color}` }}
                    >
                      <button 
                        className={`mr-3 h-5 w-5 rounded border flex items-center justify-center ${
                          session.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                        }`}
                        onClick={() => onToggleSessionCompleted(session.id)}
                      >
                        {session.completed && <Check className="h-3 w-3 text-white" />}
                      </button>
                      
                      <div className="flex-1">
                        <div className="font-medium">{subject.name}</div>
                        <div className="text-sm text-gray-600">{chapter.name}</div>
                      </div>
                      
                      <div className="text-sm font-medium">
                        {session.duration} hour{session.duration !== 1 ? 's' : ''}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default StudyCalendar;

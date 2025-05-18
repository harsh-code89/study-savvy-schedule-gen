
import React from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SubjectInfo, StudySession } from '@/types/studyPlanner';

interface ProgressSummaryProps {
  subjects: SubjectInfo[];
  sessions: StudySession[];
}

const ProgressSummary: React.FC<ProgressSummaryProps> = ({ subjects, sessions }) => {
  if (subjects.length === 0 || sessions.length === 0) {
    return null;
  }

  // Calculate total sessions and completed sessions
  const totalSessions = sessions.length;
  const completedSessions = sessions.filter(session => session.completed).length;
  const completionPercentage = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

  // Calculate total study hours
  const totalHours = sessions.reduce((total, session) => total + session.duration, 0);
  const completedHours = sessions
    .filter(session => session.completed)
    .reduce((total, session) => total + session.duration, 0);

  // Calculate progress by subject
  const subjectProgress = subjects.map(subject => {
    const subjectSessions = sessions.filter(session => session.subjectId === subject.id);
    const subjectTotalSessions = subjectSessions.length;
    const subjectCompletedSessions = subjectSessions.filter(session => session.completed).length;
    const subjectCompletionPercentage = subjectTotalSessions > 0 
      ? Math.round((subjectCompletedSessions / subjectTotalSessions) * 100)
      : 0;
    
    return {
      ...subject,
      completionPercentage: subjectCompletionPercentage
    };
  });

  return (
    <Card className="p-6 glass-card">
      <h2 className="text-xl font-bold mb-4 gradient-heading">Progress Summary</h2>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm font-medium">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{completedSessions} of {totalSessions} sessions completed</span>
            <span>{completedHours} of {totalHours} hours completed</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="font-medium">Progress by Subject</h3>
          {subjectProgress.map((subject) => (
            <div key={subject.id} className="space-y-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm">{subject.name}</span>
                <span className="text-sm">{subject.completionPercentage}%</span>
              </div>
              <Progress 
                value={subject.completionPercentage} 
                className="h-2" 
                style={{ backgroundColor: `${subject.color}20` }} // 20% opacity of the subject color
                indicatorStyle={{ backgroundColor: subject.color }}
              />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ProgressSummary;

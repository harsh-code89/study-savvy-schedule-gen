
import React from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SubjectInfo, StudySession } from '@/types/studyPlanner';

interface ProgressSummaryProps {
  subjects: SubjectInfo[];
  sessions: StudySession[];
}

const ProgressSummary: React.FC<ProgressSummaryProps> = ({ subjects, sessions }) => {
  // Calculate progress for each subject
  const subjectProgress = subjects.map(subject => {
    const subjectSessions = sessions.filter(session => session.subjectId === subject.id);
    const totalSessions = subjectSessions.length;
    const completedSessions = subjectSessions.filter(session => session.completed).length;
    const progressPercentage = totalSessions > 0 
      ? Math.round((completedSessions / totalSessions) * 100) 
      : 0;
    
    const totalHours = subjectSessions.reduce((sum, session) => sum + session.duration, 0);
    const completedHours = subjectSessions
      .filter(session => session.completed)
      .reduce((sum, session) => sum + session.duration, 0);
    
    return {
      subject,
      progressPercentage,
      completedSessions,
      totalSessions,
      completedHours,
      totalHours
    };
  });

  // Calculate overall progress
  const totalSessions = sessions.length;
  const completedSessions = sessions.filter(session => session.completed).length;
  const overallProgress = totalSessions > 0 
    ? Math.round((completedSessions / totalSessions) * 100) 
    : 0;

  // Check if there are any sessions
  if (sessions.length === 0) {
    return (
      <Card className="p-6 glass-card">
        <h2 className="text-xl font-bold mb-4 gradient-heading">Progress Summary</h2>
        <p className="text-center text-gray-500 py-8">
          No study sessions to show yet. Generate a study plan first!
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 glass-card">
      <h2 className="text-xl font-bold mb-4 gradient-heading">Progress Summary</h2>
      
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="font-medium">Overall Progress</span>
          <span>{overallProgress}%</span>
        </div>
        <Progress 
          value={overallProgress} 
          className="h-2"
          // Fix: Remove indicatorStyle prop that was causing the error
        />
        <div className="mt-1 text-sm text-gray-500">
          {completedSessions} of {totalSessions} sessions completed
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-medium">Subject Progress</h3>
        {subjectProgress.map(({ subject, progressPercentage, completedSessions, totalSessions, completedHours, totalHours }) => (
          <div key={subject.id} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-medium">{subject.name}</span>
              <span>{progressPercentage}%</span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-2"
              // Fix: Use inline styles rather than indicatorStyle prop
              style={{ 
                backgroundColor: `${subject.color}20` // Light background
              }}
            />
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>{completedSessions} of {totalSessions} sessions completed</span>
              <span>{completedHours} of {totalHours} hours completed</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ProgressSummary;


import React, { useState } from 'react';
import Header from '@/components/Header';
import SubjectForm from '@/components/SubjectForm';
import SubjectsList from '@/components/SubjectsList';
import TimeAllocationForm from '@/components/TimeAllocationForm';
import StudyCalendar from '@/components/StudyCalendar';
import ProgressSummary from '@/components/ProgressSummary';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

import { SubjectInfo, ChapterInfo, AvailableTime, StudySession, StudyPlan } from '@/types/studyPlanner';
import { generateStudyPlan } from '@/utils/studyPlanGenerator';

const Index = () => {
  const [subjects, setSubjects] = useState<SubjectInfo[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [availableTimes, setAvailableTimes] = useState<AvailableTime[]>([
    { day: "Monday", hours: 2 },
    { day: "Tuesday", hours: 2 },
    { day: "Wednesday", hours: 2 },
    { day: "Thursday", hours: 2 },
    { day: "Friday", hours: 2 },
    { day: "Saturday", hours: 4 },
    { day: "Sunday", hours: 4 },
  ]);
  
  const handleAddSubject = (subject: SubjectInfo) => {
    setSubjects([...subjects, subject]);
    toast({
      title: "Subject Added",
      description: `${subject.name} with ${subject.chapters.length} chapters has been added.`,
    });
  };

  const handleRemoveSubject = (id: string) => {
    setSubjects(subjects.filter(subject => subject.id !== id));
    // Also remove any sessions for this subject
    setStudySessions(studySessions.filter(session => session.subjectId !== id));
    toast({
      title: "Subject Removed",
      description: "The subject and its associated study sessions have been removed.",
    });
  };

  const handleGeneratePlan = () => {
    if (!startDate || !endDate || subjects.length === 0) {
      toast({
        title: "Cannot Generate Plan",
        description: "Please add at least one subject and select start/end dates.",
        variant: "destructive"
      });
      return;
    }

    try {
      const plan = generateStudyPlan(subjects, availableTimes, startDate, endDate);
      setStudySessions(plan.sessions);
      
      toast({
        title: "Study Plan Generated",
        description: `Your personalized study plan with ${plan.sessions.length} sessions has been created.`,
      });
      
      setTimeout(() => {
        // Scroll to calendar
        const calendarElement = document.getElementById('study-calendar');
        if (calendarElement) {
          calendarElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    } catch (error) {
      console.error("Error generating plan:", error);
      toast({
        title: "Error",
        description: "There was an error generating your study plan. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleToggleSessionCompleted = (sessionId: string) => {
    setStudySessions(sessions => 
      sessions.map(session => 
        session.id === sessionId 
          ? { ...session, completed: !session.completed } 
          : session
      )
    );
  };

  const totalStudyHours = subjects.reduce((total, subject) => {
    return total + subject.chapters.reduce((chapterTotal, chapter) => {
      return chapterTotal + chapter.estimatedHours;
    }, 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-study-light to-white">
      <Header />
      
      <main className="container mx-auto px-4 pb-16">
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">
            <span className="gradient-heading">Study Savvy</span>
          </h1>
          <p className="text-lg text-gray-600">
            Your personalized study plan generator to help you prepare effectively for exams
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SubjectForm onAddSubject={handleAddSubject} />
          <SubjectsList subjects={subjects} onRemoveSubject={handleRemoveSubject} />
        </div>
        
        {subjects.length > 0 && (
          <div className="mt-8">
            <TimeAllocationForm
              availableTimes={availableTimes}
              setAvailableTimes={setAvailableTimes}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              onGeneratePlan={handleGeneratePlan}
              disableGenerate={subjects.length === 0}
            />
          </div>
        )}
        
        <div className="mt-8" id="study-calendar">
          <StudyCalendar
            subjects={subjects}
            sessions={studySessions}
            startDate={startDate}
            endDate={endDate}
            onToggleSessionCompleted={handleToggleSessionCompleted}
          />
        </div>
        
        {studySessions.length > 0 && (
          <div className="mt-8">
            <ProgressSummary subjects={subjects} sessions={studySessions} />
          </div>
        )}
        
        {/* Statistics and summary */}
        {subjects.length > 0 && (
          <div className="mt-12 glass-card p-6 rounded-lg text-center">
            <h3 className="font-bold text-xl mb-4 gradient-heading">Your Study Plan Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-4xl font-bold text-study-primary">{subjects.length}</div>
                <div className="text-gray-500 mt-1">Subjects</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-4xl font-bold text-study-primary">
                  {subjects.reduce((sum, subject) => sum + subject.chapters.length, 0)}
                </div>
                <div className="text-gray-500 mt-1">Chapters</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-4xl font-bold text-study-primary">
                  {totalStudyHours}
                </div>
                <div className="text-gray-500 mt-1">Total Hours</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-4xl font-bold text-study-primary">
                  {studySessions.length}
                </div>
                <div className="text-gray-500 mt-1">Study Sessions</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;

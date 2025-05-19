import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Header from '@/components/Header';
import SubjectForm from '@/components/SubjectForm';
import SubjectsList from '@/components/SubjectsList';
import TimeAllocationForm from '@/components/TimeAllocationForm';
import StudyCalendar from '@/components/StudyCalendar';
import ProgressSummary from '@/components/ProgressSummary';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

import { SubjectInfo, ChapterInfo, AvailableTime, StudySession, StudyPlan } from '@/types/studyPlanner';
import * as api from '@/services/api';

const Index = () => {
  const queryClient = useQueryClient();
  
  // Fetch subjects with error handling
  const { data: subjects = [], isLoading: isLoadingSubjects, error: subjectsError, isError } = 
    useQuery({
      queryKey: ['subjects'],
      queryFn: api.fetchSubjects,
      refetchOnWindowFocus: false,
      retry: 1,
    });
  
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
  
  // Add subject mutation
  const addSubjectMutation = useMutation({
    mutationFn: api.addSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
    onError: (error) => {
      console.error('Error adding subject:', error);
      toast({
        title: "Error",
        description: "Failed to add subject. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Remove subject mutation
  const removeSubjectMutation = useMutation({
    mutationFn: api.removeSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
    onError: (error) => {
      console.error('Error removing subject:', error);
      toast({
        title: "Error",
        description: "Failed to remove subject. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Generate plan mutation
  const generatePlanMutation = useMutation({
    mutationFn: () => {
      if (!startDate || !endDate || subjects.length === 0) {
        throw new Error("Missing required data");
      }
      return api.generateStudyPlan(subjects, availableTimes, startDate, endDate);
    },
    onSuccess: (plan) => {
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
    },
    onError: (error) => {
      console.error("Error generating plan:", error);
      toast({
        title: "Error",
        description: "There was an error generating your study plan. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Update session mutation
  const updateSessionMutation = useMutation({
    mutationFn: ({ sessionId, updates }: { sessionId: string; updates: Partial<StudySession> }) => 
      api.updateStudySession(sessionId, updates),
    onSuccess: (updatedSession) => {
      setStudySessions(prevSessions => 
        prevSessions.map(session => 
          session.id === updatedSession.id ? updatedSession : session
        )
      );
    },
    onError: (error) => {
      console.error("Error updating session:", error);
      toast({
        title: "Error",
        description: "Failed to update study session. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  const handleAddSubject = (subject: SubjectInfo) => {
    addSubjectMutation.mutate(subject);
    toast({
      title: "Subject Added",
      description: `${subject.name} with ${subject.chapters.length} chapters has been added.`,
    });
  };

  const handleRemoveSubject = (id: string) => {
    removeSubjectMutation.mutate(id);
    // Also remove any sessions for this subject
    setStudySessions(studySessions.filter(session => session.subjectId !== id));
    toast({
      title: "Subject Removed",
      description: "The subject and its associated study sessions have been removed.",
    });
  };

  const handleGeneratePlan = () => {
    generatePlanMutation.mutate();
  };

  const handleToggleSessionCompleted = (sessionId: string) => {
    const session = studySessions.find(s => s.id === sessionId);
    if (session) {
      updateSessionMutation.mutate({
        sessionId,
        updates: { completed: !session.completed }
      });
    }
  };

  const totalStudyHours = subjects.reduce((total, subject) => {
    return total + subject.chapters.reduce((chapterTotal, chapter) => {
      return chapterTotal + chapter.estimatedHours;
    }, 0);
  }, 0);

  // Show simplified loading state to ensure UI always renders
  if (isLoadingSubjects) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-study-primary"></div>
      </div>
    );
  }

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
          
          {isError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
              <p>Unable to connect to the backend server. The app is running in offline mode.</p>
              <Button 
                onClick={() => queryClient.invalidateQueries({ queryKey: ['subjects'] })}
                variant="outline"
                className="mt-2"
              >
                Retry Connection
              </Button>
            </div>
          )}
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
              disableGenerate={subjects.length === 0 || generatePlanMutation.isPending}
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

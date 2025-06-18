
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import LandingPage from '@/components/LandingPage';
import Dashboard from '@/components/Dashboard';
import { StudySession } from '@/types/studyPlanner';

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  useEffect(() => {
    const savedUser = localStorage.getItem('studysavvy_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      
      if (!parsedUser.profileComplete) {
        setShowProfileSetup(true);
      }
    }

    const savedSubjects = localStorage.getItem('studysavvy_subjects');
    if (savedSubjects) {
      setSubjects(JSON.parse(savedSubjects));
    }

    const savedSessions = localStorage.getItem('studysavvy_sessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
  }, []);

  const handleLogin = () => {
    setShowAuthModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('studysavvy_user');
    localStorage.removeItem('studysavvy_subjects');
    localStorage.removeItem('studysavvy_sessions');
    setUser(null);
    setSubjects([]);
    setSessions([]);
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of StudySavvy."
    });
  };

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    setShowAuthModal(false);
    if (!userData.profileComplete) {
      setShowProfileSetup(true);
    }
    toast({
      title: "Welcome to StudySavvy!",
      description: `Hello ${userData.name}, let's start your study journey.`
    });
  };

  const handleProfileComplete = (profileData: any) => {
    setUser(profileData);
    setShowProfileSetup(false);
    toast({
      title: "Profile completed!",
      description: "Your profile has been set up successfully."
    });
  };

  const handleSubjectAdded = (subject: any) => {
    const updatedSubjects = [...subjects, { ...subject, id: Date.now().toString() }];
    setSubjects(updatedSubjects);
    localStorage.setItem('studysavvy_subjects', JSON.stringify(updatedSubjects));
    setShowSubjectForm(false);
    toast({
      title: "Subject added!",
      description: `${subject.name} has been added to your study plan.`
    });
  };

  const handleRemoveSubject = (id: string) => {
    const updatedSubjects = subjects.filter(subject => subject.id !== id);
    setSubjects(updatedSubjects);
    localStorage.setItem('studysavvy_subjects', JSON.stringify(updatedSubjects));
    
    // Also remove related sessions
    const updatedSessions = sessions.filter(session => session.subjectId !== id);
    setSessions(updatedSessions);
    localStorage.setItem('studysavvy_sessions', JSON.stringify(updatedSessions));
    
    toast({
      title: "Subject removed!",
      description: "Subject and related sessions have been removed."
    });
  };

  const handleToggleSessionCompleted = (sessionId: string) => {
    const updatedSessions = sessions.map(session =>
      session.id === sessionId ? { ...session, completed: !session.completed } : session
    );
    setSessions(updatedSessions);
    localStorage.setItem('studysavvy_sessions', JSON.stringify(updatedSessions));
  };

  if (!user) {
    return (
      <LandingPage
        showAuthModal={showAuthModal}
        onLogin={handleLogin}
        onCloseAuthModal={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    );
  }

  return (
    <Dashboard
      user={user}
      subjects={subjects}
      sessions={sessions}
      activeTab={activeTab}
      showProfileSetup={showProfileSetup}
      showSettings={showSettings}
      showSubjectForm={showSubjectForm}
      onTabChange={setActiveTab}
      onLogout={handleLogout}
      onShowSettings={() => setShowSettings(true)}
      onCloseProfileSetup={() => setShowProfileSetup(false)}
      onProfileComplete={handleProfileComplete}
      onCloseSettings={() => setShowSettings(false)}
      onUserUpdate={setUser}
      onShowSubjectForm={() => setShowSubjectForm(true)}
      onCloseSubjectForm={() => setShowSubjectForm(false)}
      onSubjectAdded={handleSubjectAdded}
      onRemoveSubject={handleRemoveSubject}
      onToggleSessionCompleted={handleToggleSessionCompleted}
    />
  );
};

export default Index;

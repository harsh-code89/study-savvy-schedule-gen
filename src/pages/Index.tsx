
import React, { useState, useEffect } from 'react';
import LandingPage from '@/components/LandingPage';
import Dashboard from '@/components/Dashboard';
import { useAuth } from '@/hooks/useAuth';
import { StudySession, Subject } from '@/types/studyPlanner';
import { generateStudyPlan } from '@/utils/studyPlanGenerator';

const Index = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);

  // Load data from localStorage
  useEffect(() => {
    const savedSubjects = localStorage.getItem('studysavvy_subjects');
    const savedSessions = localStorage.getItem('studysavvy_sessions');
    
    if (savedSubjects) {
      setSubjects(JSON.parse(savedSubjects));
    }
    
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
  }, []);

  // Listen for custom profile show event
  useEffect(() => {
    const handleShowProfile = () => {
      setShowProfileSetup(true);
    };

    window.addEventListener('showProfile', handleShowProfile);
    return () => window.removeEventListener('showProfile', handleShowProfile);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleShowSettings = () => {
    setShowSettings(true);
  };

  const handleCloseProfileSetup = () => {
    setShowProfileSetup(false);
  };

  const handleProfileComplete = (profileData: any) => {
    // Update user data in localStorage
    const updatedUser = { ...user, ...profileData };
    localStorage.setItem('studysavvy_user', JSON.stringify(updatedUser));
    setShowProfileSetup(false);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  const handleUserUpdate = (updatedUser: any) => {
    // Handle user updates from settings
    localStorage.setItem('studysavvy_user', JSON.stringify(updatedUser));
  };

  const handleShowSubjectForm = () => {
    setShowSubjectForm(true);
  };

  const handleCloseSubjectForm = () => {
    setShowSubjectForm(false);
  };

  const handleSubjectAdded = (newSubject: Subject) => {
    const updatedSubjects = [...subjects, newSubject];
    setSubjects(updatedSubjects);
    localStorage.setItem('studysavvy_subjects', JSON.stringify(updatedSubjects));
    
    // Generate study sessions for the new subject
    const newSessions = generateStudyPlan(newSubject);
    const updatedSessions = [...sessions, ...newSessions];
    setSessions(updatedSessions);
    localStorage.setItem('studysavvy_sessions', JSON.stringify(updatedSessions));
    
    setShowSubjectForm(false);
  };

  const handleRemoveSubject = (subjectId: string) => {
    const updatedSubjects = subjects.filter(subject => subject.id !== subjectId);
    const updatedSessions = sessions.filter(session => session.subject_id !== subjectId);
    
    setSubjects(updatedSubjects);
    setSessions(updatedSessions);
    
    localStorage.setItem('studysavvy_subjects', JSON.stringify(updatedSubjects));
    localStorage.setItem('studysavvy_sessions', JSON.stringify(updatedSessions));
  };

  const handleToggleSessionCompleted = (sessionId: string) => {
    const updatedSessions = sessions.map(session =>
      session.id === sessionId 
        ? { ...session, completed: !session.completed }
        : session
    );
    
    setSessions(updatedSessions);
    localStorage.setItem('studysavvy_sessions', JSON.stringify(updatedSessions));
  };

  const handleLogin = () => {
    setShowAuthModal(true);
  };

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  if (!user) {
    return (
      <LandingPage 
        showAuthModal={showAuthModal}
        onLogin={handleLogin}
        onCloseAuthModal={handleCloseAuthModal}
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
      onTabChange={handleTabChange}
      onLogout={handleLogout}
      onShowSettings={handleShowSettings}
      onCloseProfileSetup={handleCloseProfileSetup}
      onProfileComplete={handleProfileComplete}
      onCloseSettings={handleCloseSettings}
      onUserUpdate={handleUserUpdate}
      onShowSubjectForm={handleShowSubjectForm}
      onCloseSubjectForm={handleCloseSubjectForm}
      onSubjectAdded={handleSubjectAdded}
      onRemoveSubject={handleRemoveSubject}
      onToggleSessionCompleted={handleToggleSessionCompleted}
    />
  );
};

export default Index;

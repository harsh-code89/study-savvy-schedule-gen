import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import LandingPage from '@/components/LandingPage';
import Dashboard from '@/components/Dashboard';
import { supabase } from '@/integrations/supabase/client';
import { StudySession } from '@/types/studyPlanner';

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  // Fetch user profile and data when user is authenticated
  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchSubjects();
      fetchSessions();
    } else {
      setUserProfile(null);
      setSubjects([]);
      setSessions([]);
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
    } else {
      setUserProfile(data);
      // Show profile setup if profile is incomplete
      if (!data.study_level || !data.preferred_study_time) {
        setShowProfileSetup(true);
      }
    }
  };

  const fetchSubjects = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error fetching subjects:', error);
    } else {
      setSubjects(data || []);
    }
  };

  const fetchSessions = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error fetching sessions:', error);
    } else {
      setSessions(data || []);
    }
  };

  const handleLogin = () => {
    setShowAuthModal(true);
  };

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of StudySavvy."
      });
    }
  };

  const handleProfileComplete = async (profileData: any) => {
    if (!user) return;
    
    const { error } = await supabase
      .from('profiles')
      .update({
        study_level: profileData.studyLevel,
        preferred_study_time: profileData.preferredStudyTime,
        study_goals: profileData.studyGoals ? [profileData.studyGoals] : [],
        weekly_study_hours: profileData.weeklyStudyHours || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);
    
    if (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Profile update failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setShowProfileSetup(false);
      fetchUserProfile();
      toast({
        title: "Profile completed!",
        description: "Your profile has been set up successfully."
      });
    }
  };

  const handleSubjectAdded = async (subject: any) => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('subjects')
      .insert({
        user_id: user.id,
        name: subject.name,
        priority: subject.priority,
        difficulty: subject.difficulty,
        hours_per_week: subject.hoursPerWeek
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding subject:', error);
      toast({
        title: "Failed to add subject",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setSubjects(prev => [...prev, data]);
      setShowSubjectForm(false);
      toast({
        title: "Subject added!",
        description: `${subject.name} has been added to your study plan.`
      });
    }
  };

  const handleToggleSessionCompleted = async (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;
    
    const { error } = await supabase
      .from('study_sessions')
      .update({ completed: !session.completed })
      .eq('id', sessionId);
    
    if (error) {
      console.error('Error updating session:', error);
      toast({
        title: "Failed to update session",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setSessions(prev => prev.map(s => 
        s.id === sessionId ? { ...s, completed: !s.completed } : s
      ));
    }
  };

  const handleRemoveSubject = async (id: string) => {
    const { error } = await supabase
      .from('subjects')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error removing subject:', error);
      toast({
        title: "Failed to remove subject",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setSubjects(prev => prev.filter(subject => subject.id !== id));
      // Also remove related sessions
      setSessions(prev => prev.filter(session => session.subject_id !== id));
      toast({
        title: "Subject removed!",
        description: "Subject and related sessions have been removed."
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <LandingPage
        showAuthModal={showAuthModal}
        onLogin={handleLogin}
        onCloseAuthModal={() => setShowAuthModal(false)}
      />
    );
  }

  return (
    <Dashboard
      user={userProfile || { name: user.user_metadata?.full_name || user.email, email: user.email }}
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
      onUserUpdate={setUserProfile}
      onShowSubjectForm={() => setShowSubjectForm(true)}
      onCloseSubjectForm={() => setShowSubjectForm(false)}
      onSubjectAdded={handleSubjectAdded}
      onRemoveSubject={handleRemoveSubject}
      onToggleSessionCompleted={handleToggleSessionCompleted}
    />
  );
};

export default Index;

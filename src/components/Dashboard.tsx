
import React from 'react';
import DashboardTabs from '@/components/DashboardTabs';
import ProfileSetup from '@/components/profile/ProfileSetup';
import SettingsModal from '@/components/settings/SettingsModal';
import ParticleBackground from '@/components/ParticleBackground';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import SubjectFormModal from '@/components/dashboard/SubjectFormModal';
import { StudySession } from '@/types/studyPlanner';

interface DashboardProps {
  user: any;
  subjects: any[];
  sessions: StudySession[];
  activeTab: string;
  showProfileSetup: boolean;
  showSettings: boolean;
  showSubjectForm: boolean;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  onShowSettings: () => void;
  onCloseProfileSetup: () => void;
  onProfileComplete: (profileData: any) => void;
  onCloseSettings: () => void;
  onUserUpdate: (user: any) => void;
  onShowSubjectForm: () => void;
  onCloseSubjectForm: () => void;
  onSubjectAdded: (subject: any) => void;
  onRemoveSubject: (id: string) => void;
  onToggleSessionCompleted: (sessionId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  user,
  subjects,
  sessions,
  activeTab,
  showProfileSetup,
  showSettings,
  showSubjectForm,
  onTabChange,
  onLogout,
  onShowSettings,
  onCloseProfileSetup,
  onProfileComplete,
  onCloseSettings,
  onUserUpdate,
  onShowSubjectForm,
  onCloseSubjectForm,
  onSubjectAdded,
  onRemoveSubject,
  onToggleSessionCompleted
}) => {
  console.log('Dashboard showSubjectForm:', showSubjectForm);
  
  const handleProfileClick = () => {
    // Open profile setup modal when profile is clicked
    window.dispatchEvent(new CustomEvent('showProfile'));
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <ParticleBackground />
      
      <DashboardHeader
        user={user}
        onLogout={onLogout}
        onShowSettings={onShowSettings}
        onProfileClick={handleProfileClick}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <WelcomeSection user={user} />

        <div>
          <DashboardTabs
            user={user}
            subjects={subjects}
            sessions={sessions}
            activeTab={activeTab}
            onTabChange={onTabChange}
            onShowSubjectForm={onShowSubjectForm}
            onRemoveSubject={onRemoveSubject}
            onToggleSessionCompleted={onToggleSessionCompleted}
          />
        </div>
      </div>

      {/* Modals */}
      <ProfileSetup
        isOpen={showProfileSetup}
        onClose={onCloseProfileSetup}
        user={user}
        onProfileComplete={onProfileComplete}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={onCloseSettings}
        user={user}
        onUserUpdate={onUserUpdate}
      />

      <SubjectFormModal
        isOpen={showSubjectForm}
        onClose={onCloseSubjectForm}
        onSubjectAdded={onSubjectAdded}
      />
    </div>
  );
};

export default Dashboard;

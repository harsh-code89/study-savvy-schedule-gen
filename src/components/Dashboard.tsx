
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, Settings, LogOut } from 'lucide-react';
import DashboardTabs from '@/components/DashboardTabs';
import ProfileSetup from '@/components/profile/ProfileSetup';
import SettingsModal from '@/components/settings/SettingsModal';
import SubjectForm from '@/components/SubjectForm';
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
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-purple-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                StudySavvy
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onShowSettings}
                className="text-gray-600 hover:text-purple-600"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-gradient-to-r from-purple-400 to-indigo-400 text-white">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700">
                  {user?.name}
                </span>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="text-gray-600 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="text-gray-600">
            Let's continue your learning journey
          </p>
        </div>

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

      {showSubjectForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md h-[90vh] max-h-[600px] flex flex-col overflow-hidden shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0 bg-white">
              <h3 className="text-lg font-semibold text-gray-900">Add New Subject</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCloseSubjectForm}
                className="text-gray-400 hover:text-gray-600 h-8 w-8 p-0"
              >
                ×
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full w-full">
                <div className="p-6">
                  <SubjectForm onAddSubject={onSubjectAdded} />
                </div>
              </ScrollArea>
            </div>
            <div className="p-4 border-t border-gray-200 flex-shrink-0 bg-gray-50">
              <Button
                variant="outline"
                onClick={onCloseSubjectForm}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

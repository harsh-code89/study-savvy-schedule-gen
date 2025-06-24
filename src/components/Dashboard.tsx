
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BookOpen, Settings, LogOut, User, ChevronDown } from 'lucide-react';
import DashboardTabs from '@/components/DashboardTabs';
import ProfileSetup from '@/components/profile/ProfileSetup';
import SettingsModal from '@/components/settings/SettingsModal';
import SubjectForm from '@/components/SubjectForm';
import ParticleBackground from '@/components/ParticleBackground';
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

  // Get user display name (prioritize full_name over email)
  const getUserDisplayName = () => {
    // Check for full_name first (from user metadata or profile)
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.full_name) {
      return user.full_name;
    }
    // Check for name as fallback
    if (user?.name) {
      return user.name;
    }
    // Only use email as last resort
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  // Get user avatar initials (prioritize full_name over email)
  const getUserInitials = () => {
    // Check for full_name first (from user metadata or profile)
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.charAt(0).toUpperCase();
    }
    if (user?.full_name) {
      return user.full_name.charAt(0).toUpperCase();
    }
    // Check for name as fallback
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    // Only use email as last resort
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 perspective-container">
      <ParticleBackground />
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 dark:bg-gray-900/80 dark:border-gray-700 sticky top-0 z-40 shadow-3d">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-purple-600 dark:text-purple-400 logo-3d" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent text-3d">
                StudySavvy
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 hover:bg-purple-50 dark:hover:bg-gray-700 px-3 py-2 btn-3d shadow-3d-hover">
                    <Avatar className="h-8 w-8 card-3d">
                      <AvatarImage src={user?.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-r from-purple-400 to-indigo-400 text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {getUserDisplayName()}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-3d dark:bg-gray-800 dark:border-gray-700 card-3d">
                  <DropdownMenuItem 
                    className="flex items-center gap-2 cursor-pointer hover:bg-purple-50 dark:hover:bg-gray-700 dark:text-white"
                    onClick={handleProfileClick}
                  >
                    <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="flex items-center gap-2 cursor-pointer hover:bg-purple-50 dark:hover:bg-gray-700 dark:text-white"
                    onClick={onShowSettings}
                  >
                    <Settings className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="dark:bg-gray-600" />
                  <DropdownMenuItem 
                    className="flex items-center gap-2 cursor-pointer hover:bg-red-50 text-red-600 dark:hover:bg-red-900/20 dark:text-red-400"
                    onClick={onLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 float-3d">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Welcome back, {getUserDisplayName()}! 👋
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Let's continue your learning journey
          </p>
        </div>

        <div className="nav-3d">
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

      {/* Subject Form Modal - Fixed with proper accessibility and z-index */}
      {showSubjectForm && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="subject-form-title"
          onClick={(e) => {
            // Close modal when clicking backdrop
            if (e.target === e.currentTarget) {
              onCloseSubjectForm();
            }
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md h-[90vh] max-h-[600px] flex flex-col overflow-hidden shadow-3d card-3d">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-800">
              <h3 
                id="subject-form-title"
                className="text-lg font-semibold text-gray-900 dark:text-gray-100"
              >
                Add New Subject
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCloseSubjectForm}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 h-8 w-8 p-0 btn-3d"
                aria-label="Close dialog"
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
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 bg-gray-50 dark:bg-gray-900">
              <Button
                variant="outline"
                onClick={onCloseSubjectForm}
                className="w-full dark:border-gray-600 dark:hover:bg-gray-700 btn-3d"
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

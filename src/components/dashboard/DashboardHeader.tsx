
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BookOpen, Settings, LogOut, User, ChevronDown } from 'lucide-react';

interface DashboardHeaderProps {
  user: any;
  onLogout: () => void;
  onShowSettings: () => void;
  onProfileClick: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  onLogout,
  onShowSettings,
  onProfileClick
}) => {
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
    <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 dark:bg-gray-900/80 dark:border-gray-700 sticky top-0 z-40 shadow-3d">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-purple-600 dark:text-purple-400 logo-3d" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
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
              <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-3d dark:bg-gray-800 dark:border-gray-700 card-3d z-50">
                <DropdownMenuItem 
                  className="flex items-center gap-2 cursor-pointer hover:bg-purple-50 dark:hover:bg-gray-700 dark:text-white"
                  onClick={onProfileClick}
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
  );
};

export default DashboardHeader;

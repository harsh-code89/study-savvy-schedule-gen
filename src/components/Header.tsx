
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookOpen, Settings, LogOut } from 'lucide-react';

interface HeaderProps {
  user?: any;
  onLogin: () => void;
  onLogout: () => void;
  onSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogin, onLogout, onSettings }) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-purple-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              StudySavvy
            </h1>
          </div>
          
          {user ? (
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onSettings}
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
          ) : (
            <Button 
              onClick={onLogin}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { NotebookPen, Crown, User, LogOut, Settings, CheckSquare, BookOpen, PenTool, Calendar, Grid } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Navigation = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  if (!user) return null;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <NavLink to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SS</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              StudySavvy
            </span>
          </NavLink>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-purple-600'
                }`
              }
            >
              Dashboard
            </NavLink>
            
            <NavLink
              to="/tasks"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-purple-600'
                }`
              }
            >
              <CheckSquare className="h-4 w-4" />
              <span>Tasks</span>
            </NavLink>
            
            <NavLink
              to="/notes"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-purple-600'
                }`
              }
            >
              <NotebookPen className="h-4 w-4" />
              <span>Notes</span>
            </NavLink>

            <NavLink
              to="/journal"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-purple-600'
                }`
              }
            >
              <PenTool className="h-4 w-4" />
              <span>Journal</span>
            </NavLink>

            <NavLink
              to="/mindmaps"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-purple-600'
                }`
              }
            >
              <Grid className="h-4 w-4" />
              <span>Mind Maps</span>
            </NavLink>

            <NavLink
              to="/planner"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-purple-600'
                }`
              }
            >
              <Calendar className="h-4 w-4" />
              <span>Planner</span>
            </NavLink>

            <NavLink
              to="/subscription"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-purple-600'
                }`
              }
            >
              <Crown className="h-4 w-4" />
              <span>Premium</span>
            </NavLink>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.user_metadata?.full_name || 'User'} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-400 to-indigo-400 text-white">
                      {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 z-50 bg-white/95 backdrop-blur-md" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-sm text-gray-900">
                      {user?.user_metadata?.full_name || 'User'}
                    </p>
                    <p className="w-48 truncate text-xs text-gray-600">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <NavLink to="/profile" className="flex items-center cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink to="/settings" className="flex items-center cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <span className="sr-only">Open navigation menu</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 z-50 bg-white/95 backdrop-blur-md" align="end">
                <DropdownMenuItem asChild>
                  <NavLink to="/" className="flex items-center cursor-pointer">
                    Dashboard
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink to="/tasks" className="flex items-center cursor-pointer">
                    <CheckSquare className="mr-2 h-4 w-4" />
                    Tasks
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink to="/notes" className="flex items-center cursor-pointer">
                    <NotebookPen className="mr-2 h-4 w-4" />
                    Notes
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink to="/journal" className="flex items-center cursor-pointer">
                    <PenTool className="mr-2 h-4 w-4" />
                    Journal
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink to="/mindmaps" className="flex items-center cursor-pointer">
                    <Grid className="mr-2 h-4 w-4" />
                    Mind Maps
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink to="/planner" className="flex items-center cursor-pointer">
                    <Calendar className="mr-2 h-4 w-4" />
                    Planner
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink to="/subscription" className="flex items-center cursor-pointer">
                    <Crown className="mr-2 h-4 w-4" />
                    Premium
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <NavLink to="/profile" className="flex items-center cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </NavLink>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
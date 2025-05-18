
import React from 'react';
import { BookOpen } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-6">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-study-primary" />
          <h1 className="text-2xl font-bold gradient-heading">StudySavvy</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Your Smart Study Planner</span>
        </div>
      </div>
    </header>
  );
};

export default Header;

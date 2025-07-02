
import React from 'react';

interface WelcomeSectionProps {
  user: any;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ user }) => {
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

  return (
    <div className="mb-8 float-3d">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        Welcome back, {getUserDisplayName()}! 👋
      </h2>
      <p className="text-gray-600 dark:text-gray-300">
        Let's continue your learning journey
      </p>
    </div>
  );
};

export default WelcomeSection;

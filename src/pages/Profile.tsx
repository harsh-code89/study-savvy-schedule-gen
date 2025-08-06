import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Calendar, BookOpen, Target, Trophy } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import ParticleBackground from '@/components/ParticleBackground';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: user?.user_metadata?.full_name || '',
    bio: user?.user_metadata?.bio || '',
    studyGoals: user?.user_metadata?.studyGoals || '',
    preferredStudyTime: user?.user_metadata?.preferredStudyTime || '',
  });

  const handleSave = () => {
    // Here you would update the user profile in your backend
    console.log('Saving profile data:', profileData);
    setIsEditing(false);
    // For now, just update localStorage
    const updatedUser = { ...user, ...profileData };
    localStorage.setItem('studysavvy_user', JSON.stringify(updatedUser));
  };

  const handleCancel = () => {
    setProfileData({
      full_name: user?.user_metadata?.full_name || '',
      bio: user?.user_metadata?.bio || '',
      studyGoals: user?.user_metadata?.studyGoals || '',
      preferredStudyTime: user?.user_metadata?.preferredStudyTime || '',
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center">
        <p className="text-gray-600">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <ParticleBackground />
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Profile</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your account and study preferences</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Profile Card */}
            <Card className="md:col-span-2 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                  {!isEditing && (
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.user_metadata?.full_name || 'User'} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-400 to-indigo-400 text-white text-2xl">
                      {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {user?.user_metadata?.full_name || 'User'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {user?.email}
                    </p>
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={profileData.full_name}
                        onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        placeholder="Tell us about yourself..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="studyGoals">Study Goals</Label>
                      <Textarea
                        id="studyGoals"
                        value={profileData.studyGoals}
                        onChange={(e) => setProfileData({ ...profileData, studyGoals: e.target.value })}
                        placeholder="What are your study goals?"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="preferredStudyTime">Preferred Study Time</Label>
                      <Input
                        id="preferredStudyTime"
                        value={profileData.preferredStudyTime}
                        onChange={(e) => setProfileData({ ...profileData, preferredStudyTime: e.target.value })}
                        placeholder="e.g., Morning, Evening, Afternoon"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSave}>Save Changes</Button>
                      <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bio</Label>
                      <p className="text-gray-900 dark:text-gray-100 mt-1">
                        {user?.user_metadata?.bio || 'No bio added yet.'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Study Goals</Label>
                      <p className="text-gray-900 dark:text-gray-100 mt-1 flex items-center gap-2">
                        <Target className="h-4 w-4 text-purple-500" />
                        {user?.user_metadata?.studyGoals || 'No study goals set yet.'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Preferred Study Time</Label>
                      <p className="text-gray-900 dark:text-gray-100 mt-1 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-indigo-500" />
                        {user?.user_metadata?.preferredStudyTime || 'Not specified'}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats & Achievements */}
            <div className="space-y-6">
              {/* Account Stats */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    Your Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Member since</span>
                    <span className="text-sm font-medium">
                      {new Date(user?.created_at || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Subjects</span>
                    <Badge variant="secondary">
                      {JSON.parse(localStorage.getItem('studysavvy_subjects') || '[]').length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Study Sessions</span>
                    <Badge variant="secondary">
                      {JSON.parse(localStorage.getItem('studysavvy_sessions') || '[]').length}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Subscription Status */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-purple-500" />
                    Subscription
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <Badge className="bg-gray-100 text-gray-800">Free Plan</Badge>
                    <p className="text-sm text-gray-600 mt-2">
                      Upgrade to Premium for unlimited features
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-3"
                      onClick={() => window.location.href = '/subscription'}
                    >
                      View Plans
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
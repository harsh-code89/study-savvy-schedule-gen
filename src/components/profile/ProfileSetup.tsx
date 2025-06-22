
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, GraduationCap, Target, Calendar, Mail, Phone } from 'lucide-react';

interface ProfileSetupProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onProfileComplete: (profileData: any) => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ isOpen, onClose, user, onProfileComplete }) => {
  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    studyLevel: user?.studyLevel || '',
    studyGoals: user?.studyGoals || '',
    preferredStudyTime: user?.preferredStudyTime || '',
    avatar_url: user?.avatar_url || ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        full_name: user?.full_name || user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        bio: user?.bio || '',
        studyLevel: user?.studyLevel || '',
        studyGoals: user?.studyGoals || '',
        preferredStudyTime: user?.preferredStudyTime || '',
        avatar_url: user?.avatar_url || ''
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = {
      ...user,
      ...profileData,
      profileComplete: true
    };
    localStorage.setItem('studysavvy_user', JSON.stringify(updatedUser));
    onProfileComplete(updatedUser);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-white via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 border-none shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Profile Settings
          </DialogTitle>
        </DialogHeader>
        
        <Card className="border-none shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Avatar className="h-24 w-24 border-4 border-gradient-to-r from-purple-400 to-indigo-400">
                <AvatarImage src={profileData.avatar_url} />
                <AvatarFallback className="bg-gradient-to-r from-purple-400 to-indigo-400 text-white text-2xl">
                  {profileData.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl dark:text-gray-100">Manage Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="dark:text-gray-200">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="full_name"
                      name="full_name"
                      placeholder="Your full name"
                      value={profileData.full_name}
                      onChange={handleInputChange}
                      className="pl-10 bg-white/70 dark:bg-gray-700/70 border-purple-200 dark:border-gray-600 focus:border-purple-400 dark:focus:border-purple-400 dark:text-gray-100"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="dark:text-gray-200">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Your email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      disabled
                      className="pl-10 bg-gray-100 dark:bg-gray-600 border-gray-200 dark:border-gray-500 text-gray-500 dark:text-gray-400"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="dark:text-gray-200">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="Your phone number"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    className="pl-10 bg-white/70 dark:bg-gray-700/70 border-purple-200 dark:border-gray-600 focus:border-purple-400 dark:focus:border-purple-400 dark:text-gray-100"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio" className="dark:text-gray-200">About You</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                  <Textarea
                    id="bio"
                    name="bio"
                    placeholder="Tell us a bit about yourself and your study interests..."
                    value={profileData.bio}
                    onChange={handleInputChange}
                    className="pl-10 bg-white/70 dark:bg-gray-700/70 border-purple-200 dark:border-gray-600 focus:border-purple-400 dark:focus:border-purple-400 min-h-[100px] dark:text-gray-100"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="studyLevel" className="dark:text-gray-200">Current Study Level</Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                  <Select value={profileData.studyLevel} onValueChange={(value) => handleSelectChange('studyLevel', value)}>
                    <SelectTrigger className="pl-10 bg-white/70 dark:bg-gray-700/70 border-purple-200 dark:border-gray-600 focus:border-purple-400 dark:focus:border-purple-400 dark:text-gray-100">
                      <SelectValue placeholder="Select your study level" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                      <SelectItem value="high-school" className="dark:text-gray-100 dark:hover:bg-gray-700">High School</SelectItem>
                      <SelectItem value="undergraduate" className="dark:text-gray-100 dark:hover:bg-gray-700">Undergraduate</SelectItem>
                      <SelectItem value="graduate" className="dark:text-gray-100 dark:hover:bg-gray-700">Graduate</SelectItem>
                      <SelectItem value="professional" className="dark:text-gray-100 dark:hover:bg-gray-700">Professional</SelectItem>
                      <SelectItem value="other" className="dark:text-gray-100 dark:hover:bg-gray-700">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="studyGoals" className="dark:text-gray-200">Study Goals</Label>
                <div className="relative">
                  <Target className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                  <Textarea
                    id="studyGoals"
                    name="studyGoals"
                    placeholder="What are your main study goals? (e.g., pass exams, learn new skills, etc.)"
                    value={profileData.studyGoals}
                    onChange={handleInputChange}
                    className="pl-10 bg-white/70 dark:bg-gray-700/70 border-purple-200 dark:border-gray-600 focus:border-purple-400 dark:focus:border-purple-400 dark:text-gray-100"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="preferredStudyTime" className="dark:text-gray-200">Preferred Study Time</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                  <Select value={profileData.preferredStudyTime} onValueChange={(value) => handleSelectChange('preferredStudyTime', value)}>
                    <SelectTrigger className="pl-10 bg-white/70 dark:bg-gray-700/70 border-purple-200 dark:border-gray-600 focus:border-purple-400 dark:focus:border-purple-400 dark:text-gray-100">
                      <SelectValue placeholder="When do you prefer to study?" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                      <SelectItem value="early-morning" className="dark:text-gray-100 dark:hover:bg-gray-700">Early Morning (5AM - 8AM)</SelectItem>
                      <SelectItem value="morning" className="dark:text-gray-100 dark:hover:bg-gray-700">Morning (8AM - 12PM)</SelectItem>
                      <SelectItem value="afternoon" className="dark:text-gray-100 dark:hover:bg-gray-700">Afternoon (12PM - 5PM)</SelectItem>
                      <SelectItem value="evening" className="dark:text-gray-100 dark:hover:bg-gray-700">Evening (5PM - 9PM)</SelectItem>
                      <SelectItem value="night" className="dark:text-gray-100 dark:hover:bg-gray-700">Night (9PM - 12AM)</SelectItem>
                      <SelectItem value="flexible" className="dark:text-gray-100 dark:hover:bg-gray-700">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose}
                  className="flex-1 border-purple-200 dark:border-gray-600 hover:bg-purple-50 dark:hover:bg-gray-700 dark:text-gray-100"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-lg"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSetup;

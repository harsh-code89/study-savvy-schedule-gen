
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, GraduationCap, Target, Calendar } from 'lucide-react';

interface ProfileSetupProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onProfileComplete: (profileData: any) => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ isOpen, onClose, user, onProfileComplete }) => {
  const [profileData, setProfileData] = useState({
    bio: '',
    studyLevel: '',
    studyGoals: '',
    preferredStudyTime: '',
    avatar: ''
  });

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
      <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-white via-purple-50 to-indigo-50 border-none shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Complete Your Profile
          </DialogTitle>
        </DialogHeader>
        
        <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Avatar className="h-24 w-24 border-4 border-gradient-to-r from-purple-400 to-indigo-400">
                <AvatarImage src={profileData.avatar} />
                <AvatarFallback className="bg-gradient-to-r from-purple-400 to-indigo-400 text-white text-2xl">
                  {user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl">Welcome, {user?.name}!</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="bio">About You</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                  <Textarea
                    id="bio"
                    name="bio"
                    placeholder="Tell us a bit about yourself and your study interests..."
                    value={profileData.bio}
                    onChange={handleInputChange}
                    className="pl-10 bg-white/70 border-purple-200 focus:border-purple-400 min-h-[100px]"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="studyLevel">Current Study Level</Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                  <Select onValueChange={(value) => handleSelectChange('studyLevel', value)}>
                    <SelectTrigger className="pl-10 bg-white/70 border-purple-200 focus:border-purple-400">
                      <SelectValue placeholder="Select your study level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high-school">High School</SelectItem>
                      <SelectItem value="undergraduate">Undergraduate</SelectItem>
                      <SelectItem value="graduate">Graduate</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="studyGoals">Study Goals</Label>
                <div className="relative">
                  <Target className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                  <Textarea
                    id="studyGoals"
                    name="studyGoals"
                    placeholder="What are your main study goals? (e.g., pass exams, learn new skills, etc.)"
                    value={profileData.studyGoals}
                    onChange={handleInputChange}
                    className="pl-10 bg-white/70 border-purple-200 focus:border-purple-400"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="preferredStudyTime">Preferred Study Time</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                  <Select onValueChange={(value) => handleSelectChange('preferredStudyTime', value)}>
                    <SelectTrigger className="pl-10 bg-white/70 border-purple-200 focus:border-purple-400">
                      <SelectValue placeholder="When do you prefer to study?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="early-morning">Early Morning (5AM - 8AM)</SelectItem>
                      <SelectItem value="morning">Morning (8AM - 12PM)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (12PM - 5PM)</SelectItem>
                      <SelectItem value="evening">Evening (5PM - 9PM)</SelectItem>
                      <SelectItem value="night">Night (9PM - 12AM)</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose}
                  className="flex-1 border-purple-200 hover:bg-purple-50"
                >
                  Skip for Now
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-lg"
                >
                  Complete Profile
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

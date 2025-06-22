
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { User, Bell, Palette, Shield, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onUserUpdate: (updatedUser: any) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, user, onUserUpdate }) => {
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    notifications: true,
    emailReminders: true,
    darkMode: false,
    studyReminders: true,
    theme: 'purple',
    language: 'en'
  });

  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    study_level: '',
    weekly_study_hours: 0
  });

  // Load user data and settings when modal opens
  useEffect(() => {
    if (user && isOpen) {
      setProfileData({
        full_name: user.full_name || user.name || '',
        email: user.email || '',
        study_level: user.study_level || '',
        weekly_study_hours: user.weekly_study_hours || 0
      });
      
      // Load settings from localStorage or use defaults
      const savedSettings = localStorage.getItem('studysavvy_settings');
      if (savedSettings) {
        try {
          setSettings(JSON.parse(savedSettings));
        } catch (error) {
          console.error('Error loading settings:', error);
        }
      }
    }
  }, [user, isOpen]);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleProfileChange = (key: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    try {
      // Save settings to localStorage
      localStorage.setItem('studysavvy_settings', JSON.stringify(settings));
      
      // Create updated user object
      const updatedUser = {
        ...user,
        ...profileData,
        settings
      };
      
      // Save user data to localStorage
      localStorage.setItem('studysavvy_user', JSON.stringify(updatedUser));
      
      // Update user in parent component
      onUserUpdate(updatedUser);
      
      toast({
        title: "Settings saved!",
        description: "Your preferences have been updated successfully.",
      });
      
      onClose();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your preferences. Please try again.",
        variant: "destructive"
      });
    }
  };

  const applyTheme = (theme: string) => {
    // This would apply the theme to the app
    document.documentElement.setAttribute('data-theme', theme);
    toast({
      title: "Theme applied!",
      description: `Switched to ${theme} theme.`,
    });
  };

  const handleThemeChange = (theme: string) => {
    handleSettingChange('theme', theme);
    applyTheme(theme);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-gradient-to-br from-white via-purple-50 to-indigo-50 border-none shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Settings
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="profile" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="appearance" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white">
              <Palette className="h-4 w-4 mr-2" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="privacy" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white">
              <Shield className="h-4 w-4 mr-2" />
              Privacy
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4">
            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={profileData.full_name}
                    onChange={(e) => handleProfileChange('full_name', e.target.value)}
                    className="bg-white/70 border-purple-200 focus:border-purple-400"
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={profileData.email}
                    className="bg-white/70 border-purple-200 focus:border-purple-400"
                    disabled
                    placeholder="Email cannot be changed"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="study_level">Study Level</Label>
                  <Select value={profileData.study_level} onValueChange={(value) => handleProfileChange('study_level', value)}>
                    <SelectTrigger className="bg-white/70 border-purple-200 focus:border-purple-400">
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
                <div className="space-y-2">
                  <Label htmlFor="weekly_hours">Weekly Study Hours</Label>
                  <Input
                    id="weekly_hours"
                    type="number"
                    value={profileData.weekly_study_hours}
                    onChange={(e) => handleProfileChange('weekly_study_hours', parseInt(e.target.value) || 0)}
                    className="bg-white/70 border-purple-200 focus:border-purple-400"
                    placeholder="Hours per week"
                    min="0"
                    max="168"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications about your study sessions</p>
                  </div>
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(value) => handleSettingChange('notifications', value)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Reminders</Label>
                    <p className="text-sm text-gray-500">Get email reminders for upcoming study sessions</p>
                  </div>
                  <Switch
                    checked={settings.emailReminders}
                    onCheckedChange={(value) => handleSettingChange('emailReminders', value)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Study Reminders</Label>
                    <p className="text-sm text-gray-500">Daily reminders to maintain your study streak</p>
                  </div>
                  <Switch
                    checked={settings.studyReminders}
                    onCheckedChange={(value) => handleSettingChange('studyReminders', value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-4">
            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Theme Color</Label>
                  <Select value={settings.theme} onValueChange={handleThemeChange}>
                    <SelectTrigger className="bg-white/70 border-purple-200 focus:border-purple-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="purple">Purple Gradient</SelectItem>
                      <SelectItem value="blue">Blue Gradient</SelectItem>
                      <SelectItem value="green">Green Gradient</SelectItem>
                      <SelectItem value="orange">Orange Gradient</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-gray-500">Switch to dark theme</p>
                  </div>
                  <Switch
                    checked={settings.darkMode}
                    onCheckedChange={(value) => handleSettingChange('darkMode', value)}
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                    <SelectTrigger className="bg-white/70 border-purple-200 focus:border-purple-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-4">
            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Privacy & Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2 mb-2">
                    <HelpCircle className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Data Storage</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Your data is stored securely in Supabase with proper authentication and encryption.
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full border-red-200 hover:bg-red-50 text-red-600"
                  onClick={() => {
                    toast({
                      title: "Account deletion",
                      description: "Contact support to delete your account.",
                    });
                  }}
                >
                  Request Account Deletion
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1 border-purple-200 hover:bg-purple-50">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;

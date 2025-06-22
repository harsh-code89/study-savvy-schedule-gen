
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
import { supabase } from '@/integrations/supabase/client';

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

  const [loading, setLoading] = useState(false);

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
          const parsed = JSON.parse(savedSettings);
          setSettings(parsed);
          // Apply dark mode if it was previously set
          if (parsed.darkMode) {
            document.documentElement.classList.add('dark');
          }
        } catch (error) {
          console.error('Error loading settings:', error);
        }
      } else {
        // Check if system prefers dark mode
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          setSettings(prev => ({ ...prev, darkMode: true }));
          document.documentElement.classList.add('dark');
        }
      }
    }
  }, [user, isOpen]);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));

    // Handle dark mode toggle immediately
    if (key === 'darkMode') {
      if (value) {
        document.documentElement.classList.add('dark');
        toast({
          title: "Dark mode enabled",
          description: "The interface has been switched to dark mode.",
        });
      } else {
        document.documentElement.classList.remove('dark');
        toast({
          title: "Dark mode disabled",
          description: "The interface has been switched to light mode.",
        });
      }
    }

    // Handle theme changes immediately
    if (key === 'theme') {
      applyTheme(value);
    }
  };

  const handleProfileChange = (key: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Save settings to localStorage
      localStorage.setItem('studysavvy_settings', JSON.stringify(settings));
      
      // Update profile in Supabase if user is authenticated
      if (user?.id && supabase) {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: profileData.full_name,
            study_level: profileData.study_level,
            weekly_study_hours: profileData.weekly_study_hours,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (error) {
          console.error('Error updating profile:', error);
          toast({
            title: "Profile update failed",
            description: error.message,
            variant: "destructive"
          });
          return;
        }
      }
      
      // Create updated user object
      const updatedUser = {
        ...user,
        ...profileData,
        settings
      };
      
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
    } finally {
      setLoading(false);
    }
  };

  const applyTheme = (theme: string) => {
    // Apply theme styles to root element
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    
    // Update CSS custom properties based on theme
    switch (theme) {
      case 'blue':
        root.style.setProperty('--primary', '217 91% 60%');
        root.style.setProperty('--primary-foreground', '222.2 84% 4.9%');
        break;
      case 'green':
        root.style.setProperty('--primary', '142 76% 36%');
        root.style.setProperty('--primary-foreground', '355.7 100% 97.3%');
        break;
      case 'orange':
        root.style.setProperty('--primary', '24.6 95% 53.1%');
        root.style.setProperty('--primary-foreground', '60 9.1% 97.8%');
        break;
      default: // purple
        root.style.setProperty('--primary', '262 83% 63%');
        root.style.setProperty('--primary-foreground', '210 40% 98%');
        break;
    }
    
    toast({
      title: "Theme applied!",
      description: `Switched to ${theme} theme.`,
    });
  };

  const handleThemeChange = (theme: string) => {
    handleSettingChange('theme', theme);
  };

  const handleNotificationTest = () => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('StudySavvy Test', {
          body: 'This is a test notification from StudySavvy!',
          icon: '/favicon.ico'
        });
        toast({
          title: "Test notification sent!",
          description: "Check if you received the notification.",
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('StudySavvy Test', {
              body: 'This is a test notification from StudySavvy!',
              icon: '/favicon.ico'
            });
            toast({
              title: "Test notification sent!",
              description: "Check if you received the notification.",
            });
          }
        });
      } else {
        toast({
          title: "Notifications blocked",
          description: "Please enable notifications in your browser settings.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Notifications not supported",
        description: "Your browser doesn't support notifications.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-gradient-to-br from-white via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-none shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Settings
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/50 backdrop-blur-sm dark:bg-gray-800/50">
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
            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle className="dark:text-white">Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="dark:text-gray-200">Full Name</Label>
                  <Input
                    id="full_name"
                    value={profileData.full_name}
                    onChange={(e) => handleProfileChange('full_name', e.target.value)}
                    className="bg-white/70 border-purple-200 focus:border-purple-400 dark:bg-gray-700/70 dark:border-gray-600 dark:text-white"
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="dark:text-gray-200">Email</Label>
                  <Input
                    id="email"
                    value={profileData.email}
                    className="bg-white/70 border-purple-200 focus:border-purple-400 dark:bg-gray-700/70 dark:border-gray-600 dark:text-white"
                    disabled
                    placeholder="Email cannot be changed"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="study_level" className="dark:text-gray-200">Study Level</Label>
                  <Select value={profileData.study_level} onValueChange={(value) => handleProfileChange('study_level', value)}>
                    <SelectTrigger className="bg-white/70 border-purple-200 focus:border-purple-400 dark:bg-gray-700/70 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder="Select your study level" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                      <SelectItem value="high-school">High School</SelectItem>
                      <SelectItem value="undergraduate">Undergraduate</SelectItem>
                      <SelectItem value="graduate">Graduate</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weekly_hours" className="dark:text-gray-200">Weekly Study Hours</Label>
                  <Input
                    id="weekly_hours"
                    type="number"
                    value={profileData.weekly_study_hours}
                    onChange={(e) => handleProfileChange('weekly_study_hours', parseInt(e.target.value) || 0)}
                    className="bg-white/70 border-purple-200 focus:border-purple-400 dark:bg-gray-700/70 dark:border-gray-600 dark:text-white"
                    placeholder="Hours per week"
                    min="0"
                    max="168"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle className="dark:text-white">Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="dark:text-gray-200">Push Notifications</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications about your study sessions</p>
                  </div>
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(value) => handleSettingChange('notifications', value)}
                  />
                </div>
                <Separator className="dark:bg-gray-600" />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="dark:text-gray-200">Email Reminders</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Get email reminders for upcoming study sessions</p>
                  </div>
                  <Switch
                    checked={settings.emailReminders}
                    onCheckedChange={(value) => handleSettingChange('emailReminders', value)}
                  />
                </div>
                <Separator className="dark:bg-gray-600" />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="dark:text-gray-200">Study Reminders</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Daily reminders to maintain your study streak</p>
                  </div>
                  <Switch
                    checked={settings.studyReminders}
                    onCheckedChange={(value) => handleSettingChange('studyReminders', value)}
                  />
                </div>
                <Separator className="dark:bg-gray-600" />
                <Button 
                  variant="outline" 
                  onClick={handleNotificationTest}
                  className="w-full border-purple-200 hover:bg-purple-50 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  Test Notifications
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-4">
            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle className="dark:text-white">Appearance Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="dark:text-gray-200">Theme Color</Label>
                  <Select value={settings.theme} onValueChange={handleThemeChange}>
                    <SelectTrigger className="bg-white/70 border-purple-200 focus:border-purple-400 dark:bg-gray-700/70 dark:border-gray-600 dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                      <SelectItem value="purple">Purple Gradient</SelectItem>
                      <SelectItem value="blue">Blue Gradient</SelectItem>
                      <SelectItem value="green">Green Gradient</SelectItem>
                      <SelectItem value="orange">Orange Gradient</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator className="dark:bg-gray-600" />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="dark:text-gray-200">Dark Mode</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Switch to dark theme</p>
                  </div>
                  <Switch
                    checked={settings.darkMode}
                    onCheckedChange={(value) => handleSettingChange('darkMode', value)}
                  />
                </div>
                <Separator className="dark:bg-gray-600" />
                <div className="space-y-2">
                  <Label className="dark:text-gray-200">Language</Label>
                  <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                    <SelectTrigger className="bg-white/70 border-purple-200 focus:border-purple-400 dark:bg-gray-700/70 dark:border-gray-600 dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
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
            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle className="dark:text-white">Privacy & Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center gap-2 mb-2">
                    <HelpCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    <span className="font-medium text-yellow-800 dark:text-yellow-200">Data Storage</span>
                  </div>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Your data is stored securely in Supabase with proper authentication and encryption.
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full border-red-200 hover:bg-red-50 text-red-600 dark:border-red-800 dark:hover:bg-red-900/20 dark:text-red-400"
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
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="flex-1 border-purple-200 hover:bg-purple-50 dark:border-gray-600 dark:hover:bg-gray-700"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;

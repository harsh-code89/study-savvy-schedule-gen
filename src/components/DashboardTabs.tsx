
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Target, Calendar, Plus } from 'lucide-react';
import SubjectsList from '@/components/SubjectsList';
import StudyCalendar from '@/components/StudyCalendar';
import ProgressSummary from '@/components/ProgressSummary';
import { StudySession } from '@/types/studyPlanner';

interface DashboardTabsProps {
  user: any;
  subjects: any[];
  sessions: StudySession[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onShowSubjectForm: () => void;
  onRemoveSubject: (id: string) => void;
  onToggleSessionCompleted: (sessionId: string) => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({
  user,
  subjects,
  sessions,
  activeTab,
  onTabChange,
  onShowSubjectForm,
  onRemoveSubject,
  onToggleSessionCompleted
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-6">
      <TabsList className="grid w-full grid-cols-4 bg-white/50 backdrop-blur-sm">
        <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white">
          Overview
        </TabsTrigger>
        <TabsTrigger value="subjects" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white">
          Subjects
        </TabsTrigger>
        <TabsTrigger value="schedule" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white">
          Schedule
        </TabsTrigger>
        <TabsTrigger value="progress" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white">
          Progress
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                Total Subjects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {subjects.length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-indigo-600" />
                Study Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                {user?.studyGoals || 'Complete your profile to set goals'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                Study Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                {user?.preferredStudyTime || 'Not set'}
              </p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="subjects" className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-800">Your Subjects</h3>
          <Button
            onClick={onShowSubjectForm}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Subject
          </Button>
        </div>
        <SubjectsList subjects={subjects} onRemoveSubject={onRemoveSubject} />
      </TabsContent>

      <TabsContent value="schedule" className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800">Study Calendar</h3>
        <StudyCalendar 
          subjects={subjects} 
          sessions={sessions}
          startDate={new Date()}
          endDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
          onToggleSessionCompleted={onToggleSessionCompleted}
        />
      </TabsContent>

      <TabsContent value="progress" className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800">Progress Overview</h3>
        <ProgressSummary subjects={subjects} sessions={sessions} />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Target, TrendingUp, Calendar } from 'lucide-react';
import AuthModal from '@/components/auth/AuthModal';

interface LandingPageProps {
  showAuthModal: boolean;
  onLogin: () => void;
  onCloseAuthModal: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({
  showAuthModal,
  onLogin,
  onCloseAuthModal
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <BookOpen className="h-12 w-12 text-purple-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              StudySavvy
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transform your study routine with AI-powered planning and personalized learning paths. 
            Master your subjects, track your progress, and achieve your academic goals.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={onLogin}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full w-fit">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Smart Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                AI-powered study plans tailored to your learning style and schedule
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full w-fit">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Progress Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Monitor your learning progress with detailed analytics and insights
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full w-fit">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Flexible Scheduling</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Adaptive scheduling that fits your lifestyle and commitments
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={onCloseAuthModal}
      />
    </div>
  );
};

export default LandingPage;

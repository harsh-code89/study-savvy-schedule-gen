import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Star, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import ParticleBackground from '@/components/ParticleBackground';

const Subscription = () => {
  const { user } = useAuth();

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started with your studies',
      features: [
        'Up to 3 subjects',
        'Basic study planner',
        'Simple progress tracking',
        'Local data storage',
      ],
      current: true,
      buttonText: 'Current Plan',
      buttonVariant: 'outline' as const,
    },
    {
      name: 'Premium',
      price: '$9.99',
      period: 'month',
      description: 'Unlock advanced features for serious students',
      features: [
        'Unlimited subjects',
        'Advanced study analytics',
        'Cloud sync across devices',
        'Priority customer support',
        'Advanced note-taking',
        'Study streak tracking',
        'Export study data',
      ],
      current: false,
      buttonText: 'Upgrade to Premium',
      buttonVariant: 'default' as const,
      popular: true,
    },
    {
      name: 'Pro',
      price: '$19.99',
      period: 'month',
      description: 'For students who want everything',
      features: [
        'Everything in Premium',
        'AI-powered study recommendations',
        'Advanced collaboration tools',
        'Custom study templates',
        'Integration with external apps',
        'Personal study coach',
        'Early access to new features',
      ],
      current: false,
      buttonText: 'Upgrade to Pro',
      buttonVariant: 'default' as const,
    },
  ];

  const handleUpgrade = (planName: string) => {
    // Here you would integrate with your payment processor
    console.log(`Upgrading to ${planName}`);
    // For now, just show an alert
    alert(`Upgrade to ${planName} feature coming soon!`);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center">
        <p className="text-gray-600">Please log in to view subscription options.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <ParticleBackground />
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center items-center gap-2 mb-4">
              <Crown className="h-8 w-8 text-purple-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Choose Your Plan
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Unlock your full potential with premium features designed to supercharge your studies
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative bg-white/80 backdrop-blur-sm border-2 transition-all hover:shadow-xl ${
                  plan.popular
                    ? 'border-purple-300 shadow-lg'
                    : plan.current
                    ? 'border-green-300'
                    : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                {plan.current && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-500 text-white px-4 py-1">
                      <Check className="h-3 w-3 mr-1" />
                      Current Plan
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-2">
                    {plan.name === 'Free' && <Zap className="h-8 w-8 text-gray-500" />}
                    {plan.name === 'Premium' && <Crown className="h-8 w-8 text-purple-500" />}
                    {plan.name === 'Pro' && <Star className="h-8 w-8 text-indigo-500" />}
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {plan.price}
                    <span className="text-sm text-gray-500 font-normal">/{plan.period}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{plan.description}</p>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white'
                        : ''
                    }`}
                    variant={plan.buttonVariant}
                    onClick={() => handleUpgrade(plan.name)}
                    disabled={plan.current}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Comparison */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Why Upgrade?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <Crown className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold">Advanced Analytics</h3>
                  <p className="text-sm text-gray-600">
                    Get detailed insights into your study patterns and progress with advanced analytics and reporting.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
                    <Zap className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold">Cloud Sync</h3>
                  <p className="text-sm text-gray-600">
                    Access your study data across all your devices with seamless cloud synchronization.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Star className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold">Priority Support</h3>
                  <p className="text-sm text-gray-600">
                    Get help when you need it most with priority customer support and dedicated assistance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
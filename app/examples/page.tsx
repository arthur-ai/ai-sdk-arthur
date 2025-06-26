'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  MessageSquare, 
  Users, 
  FileText, 
  Zap, 
  TrendingUp,
  Eye,
  BarChart3,
  Info,
  X
} from 'lucide-react';
import { 
  SearchTasks, 
  ValidationExample, 
  TokenUsage, 
  QueryInferences,
  TaskDetailsModal 
} from '@/components/examples';

export default function ExamplesPage() {
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewTaskDetails = (task: any) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Arthur GenAI Engine API Examples
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Interactive examples demonstrating how to build safer, more reliable AI agents with comprehensive validation, 
          monitoring, and compliance features.
        </p>
      </div>

      {/* Interactive Examples */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Interactive Examples</h2>
        <div className="space-y-8">
          <SearchTasks onViewTaskDetails={handleViewTaskDetails} />
          <ValidationExample />
          <TokenUsage />
          <QueryInferences />
        </div>
      </div>

      {/* Use Cases Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Use Cases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="size-5 text-blue-600" />
                <CardTitle className="text-lg">Financial Advisor</CardTitle>
              </div>
              <CardDescription>
                Ensure compliance with financial regulations and prevent disclosure of sensitive information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="secondary">PII Detection</Badge>
                <Badge variant="secondary">Regulatory Compliance</Badge>
                <Badge variant="secondary">Data Privacy</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="size-5 text-green-600" />
                <CardTitle className="text-lg">Customer Support</CardTitle>
              </div>
              <CardDescription>
                Maintain brand voice consistency and prevent inappropriate responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="secondary">Toxicity Detection</Badge>
                <Badge variant="secondary">Brand Safety</Badge>
                <Badge variant="secondary">Response Quality</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Users className="size-5 text-purple-600" />
                <CardTitle className="text-lg">Healthcare Assistant</CardTitle>
              </div>
              <CardDescription>
                Protect patient privacy and ensure medical advice accuracy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="secondary">HIPAA Compliance</Badge>
                <Badge variant="secondary">Medical Accuracy</Badge>
                <Badge variant="secondary">Patient Safety</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="size-5 text-orange-600" />
                <CardTitle className="text-lg">Legal Assistant</CardTitle>
              </div>
              <CardDescription>
                Prevent unauthorized legal advice and maintain confidentiality
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="secondary">Legal Compliance</Badge>
                <Badge variant="secondary">Confidentiality</Badge>
                <Badge variant="secondary">Disclaimers</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="size-5 text-yellow-600" />
                <CardTitle className="text-lg">Code Assistant</CardTitle>
              </div>
              <CardDescription>
                Prevent security vulnerabilities and ensure code quality
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="secondary">Security Scanning</Badge>
                <Badge variant="secondary">Code Quality</Badge>
                <Badge variant="secondary">Best Practices</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="size-5 text-red-600" />
                <CardTitle className="text-lg">Trading Bot</CardTitle>
              </div>
              <CardDescription>
                Prevent market manipulation and ensure regulatory compliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="secondary">Market Compliance</Badge>
                <Badge variant="secondary">Risk Management</Badge>
                <Badge variant="secondary">Audit Trail</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features Overview */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="size-4 text-blue-600" />
                <h3 className="font-semibold">Real-time Validation</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Validate prompts and responses in real-time with comprehensive rule sets
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="size-4 text-green-600" />
                <h3 className="font-semibold">Analytics & Monitoring</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Track usage, monitor performance, and detect patterns in validation results
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="size-4 text-purple-600" />
                <h3 className="font-semibold">Compliance Ready</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Built-in support for HIPAA, GDPR, SOX, and other regulatory requirements
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="size-4 text-orange-600" />
                <h3 className="font-semibold">Easy Integration</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Simple REST API with TypeScript support and comprehensive documentation
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-12 text-center">
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <CardContent className="pt-6">
            <h3 className="text-xl font-bold mb-2">Ready to Build Secure AI Agents?</h3>
            <p className="text-muted-foreground mb-4">
              Start integrating Arthur GenAI Engine into your applications today
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg">
                Get Started
              </Button>
              <Button variant="outline" size="lg">
                View Documentation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task Details Modal */}
      <TaskDetailsModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
} 
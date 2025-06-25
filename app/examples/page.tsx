import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeExample } from '@/components/code-example';
import { 
  Shield, 
  MessageSquare, 
  Users, 
  FileText, 
  Zap, 
  TrendingUp,
  CheckCircle,
  Eye,
  BarChart3
} from 'lucide-react';

export default function ExamplesPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Arthur GenAI Engine API Examples
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover how to build safer, more reliable AI agents with comprehensive validation, 
          monitoring, and compliance features.
        </p>
      </div>

      {/* Use Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
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

      {/* API Examples */}
      <Tabs defaultValue="validation" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="workflow">Complete Workflow</TabsTrigger>
        </TabsList>

        <TabsContent value="validation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="size-5 text-green-600" />
                Prompt & Response Validation
              </CardTitle>
              <CardDescription>
                Validate inputs and outputs to ensure safety and compliance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Prompt Validation</h4>
                <CodeExample
                  code={`// Validate user input before processing
const promptValidation = await arthurAPI.validatePrompt(taskId, {
  prompt: "What is the customer's credit card number?",
  conversation_id: "conv-123",
  user_id: "user-456"
});

if (promptValidation.rule_results?.some(r => r.result === 'Fail')) {
  // Handle validation failure
  return { error: "Input contains sensitive information" };
}`}
                  language="typescript"
                />
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-semibold mb-2">Response Validation</h4>
                <CodeExample
                  code={`// Validate AI response before sending to user
const responseValidation = await arthurAPI.validateResponse(
  taskId,
  promptValidation.inference_id!,
  {
    response: aiResponse,
    context: userPrompt
  }
);

if (responseValidation.rule_results?.some(r => r.result === 'Fail')) {
  // Log violation and potentially redact content
  console.log("Response validation failed:", responseValidation);
}`}
                  language="typescript"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="size-5 text-blue-600" />
                Real-time Monitoring & Analytics
              </CardTitle>
              <CardDescription>
                Monitor AI agent performance and detect issues in real-time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Token Usage Tracking</h4>
                <CodeExample
                  code={`// Monitor API usage and costs
const usage = await arthurAPI.getTokenUsage({
  start_time: '2024-01-01T00:00:00Z',
  end_time: '2024-01-31T23:59:59Z',
  group_by: ['rule_type', 'task']
});

console.log("Total tokens used:", usage.reduce((sum, u) => 
  sum + u.count.inference, 0
));`}
                  language="typescript"
                />
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-semibold mb-2">Inference History</h4>
                <CodeExample
                  code={`// Query historical validation results
const inferences = await arthurAPI.queryInferences({
  task_ids: [taskId],
  start_time: '2024-01-01T00:00:00Z',
  end_time: '2024-01-31T23:59:59Z',
  rule_statuses: ['Pass', 'Fail'],
  include_count: true,
  page_size: 100,
  sort: 'desc'
});

// Analyze failure patterns
const failures = inferences.inferences.filter(
  inf => inf.result === 'Fail'
);
console.log("Validation failures:", failures.length);`}
                  language="typescript"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="size-5 text-purple-600" />
                Compliance & Security Rules
              </CardTitle>
              <CardDescription>
                Set up comprehensive rules for different compliance requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">PII Detection Rule</h4>
                <CodeExample
                  code={`// Create PII detection rule for healthcare
const piiRule = await arthurAPI.createTaskRule(taskId, {
  name: 'HIPAA PII Detection',
  type: 'PIIDataRule',
  apply_to_prompt: true,
  apply_to_response: true,
  config: {
    disabled_pii_entities: ['EMAIL_ADDRESS', 'PHONE_NUMBER'],
    confidence_threshold: 0.8,
    allow_list: ['arthur.ai', 'Arthur']
  }
});`}
                  language="typescript"
                />
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-semibold mb-2">Keyword Blocking</h4>
                <CodeExample
                  code={`// Block sensitive keywords
const keywordRule = await arthurAPI.createTaskRule(taskId, {
  name: 'Sensitive Keywords',
  type: 'KeywordRule',
  apply_to_prompt: true,
  apply_to_response: true,
  config: {
    keywords: [
      'confidential',
      'secret',
      'internal',
      'password',
      'credit card'
    ]
  }
});`}
                  language="typescript"
                />
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-semibold mb-2">Toxicity Detection</h4>
                <CodeExample
                  code={`// Detect inappropriate content
const toxicityRule = await arthurAPI.createTaskRule(taskId, {
  name: 'Content Moderation',
  type: 'ToxicityRule',
  apply_to_prompt: true,
  apply_to_response: true,
  config: {
    threshold: 0.7
  }
});`}
                  language="typescript"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflow" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="size-5 text-orange-600" />
                Complete AI Agent Workflow
              </CardTitle>
              <CardDescription>
                End-to-end example of a secure AI agent implementation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeExample
                code={`// Complete AI Agent with Arthur Validation
class SecureAIAgent {
  private arthurAPI: ArthurAPI;
  private taskId: string;

  constructor() {
    this.arthurAPI = createArthurAPI();
    this.taskId = process.env.ARTHUR_TASK_ID!;
  }

  async processUserMessage(userInput: string, userId: string) {
    try {
      // 1. Validate user input
      const promptValidation = await this.arthurAPI.validatePrompt(
        this.taskId,
        {
          prompt: userInput,
          user_id: userId,
          conversation_id: this.generateConversationId()
        }
      );

      // 2. Check for validation failures
      if (promptValidation.rule_results?.some(r => r.result === 'Fail')) {
        return {
          error: "Your message contains content that cannot be processed",
          validation: promptValidation
        };
      }

      // 3. Generate AI response
      const aiResponse = await this.generateResponse(userInput);

      // 4. Validate AI response
      const responseValidation = await this.arthurAPI.validateResponse(
        this.taskId,
        promptValidation.inference_id!,
        {
          response: aiResponse,
          context: userInput
        }
      );

      // 5. Handle response validation
      if (responseValidation.rule_results?.some(r => r.result === 'Fail')) {
        // Log violation for monitoring
        console.warn("Response validation failed:", responseValidation);
        
        // Return safe fallback response
        return {
          response: "I apologize, but I cannot provide that information as it may contain sensitive content.",
          validation: responseValidation
        };
      }

      // 6. Return validated response
      return {
        response: aiResponse,
        validation: responseValidation
      };

    } catch (error) {
      console.error("Error in secure AI agent:", error);
      return { error: "An error occurred while processing your request" };
    }
  }

  private async generateResponse(input: string): Promise<string> {
    // Your AI model call here
    return "AI generated response";
  }

  private generateConversationId(): string {
    return \`conv_\${Date.now()}_\${Math.random().toString(36).substr(2, 9)}\`;
  }
}`}
                language="typescript"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
    </div>
  );
} 
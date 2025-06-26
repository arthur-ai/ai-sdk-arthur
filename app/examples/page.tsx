'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeExample } from '@/components/code-example';
import { Input } from '@/components/ui/input';
import { 
  Shield, 
  MessageSquare, 
  Users, 
  FileText, 
  Zap, 
  TrendingUp,
  CheckCircle,
  Eye,
  BarChart3,
  Search,
  Info,
  AlertCircle,
  CheckCircle2,
  XCircle,
  X
} from 'lucide-react';
import { useState, useEffect } from 'react';

// Modal Component
function TaskDetailsModal({ 
  task, 
  isOpen, 
  onClose 
}: { 
  task: any; 
  isOpen: boolean; 
  onClose: () => void; 
}) {
  // Disable page scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Handle click outside modal
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !task) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-background rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <Info className="size-5 text-green-600" />
            <h2 className="text-xl font-bold">Task Details: {task.name}</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="size-8 p-0"
          >
            <X className="size-4" />
          </Button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Task Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID:</span>
                  <span className="font-mono">{task.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date(task.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated:</span>
                  <span>{new Date(task.updated_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rules:</span>
                  <span>{task.rules.length}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Rules Configuration</h3>
              <div className="space-y-3">
                {task.rules.map((rule: any) => (
                  <div key={rule.id} className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={rule.enabled ? "default" : "secondary"}>
                        {rule.enabled ? "Active" : "Disabled"}
                      </Badge>
                      <span className="font-medium">{rule.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{rule.type}</p>
                    {rule.config && (
                      <div className="text-xs bg-muted p-2 rounded">
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(rule.config, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-3">Code Example</h3>
            <CodeExample
              code={`// Get task details
const task = await arthurAPI.getTask('${task.id}');
console.log('Task:', task);

// Get task rules
const rules = task.rules;
rules.forEach(rule => {
  console.log(\`Rule: \${rule.name} (\${rule.type})\`);
  console.log('Config:', rule.config);
});`}
              language="typescript"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Interactive Examples Component
function InteractiveExamples() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [taskDetails, setTaskDetails] = useState<any>(null);
  const [validationInput, setValidationInput] = useState('');
  const [validationResult, setValidationResult] = useState<any>(null);
  const [tokenUsage, setTokenUsage] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data matching exact API response structures from OpenAPI spec
  const mockTasks = [
    {
      id: "957df309-c907-4b77-abe5-15dd00c081f8",
      name: "Customer Support Chat",
      created_at: 1723204737120,
      updated_at: 1723204787050,
      rules: [
        {
          id: "bc599a56-2e31-4cb7-910d-9e5ed6455db2",
          name: "Toxicity Detection",
          type: "ToxicityRule",
          apply_to_prompt: true,
          apply_to_response: true,
          enabled: true,
          scope: "task",
          created_at: 1723204737120,
          updated_at: 1723204737120,
          config: {
            threshold: 0.5
          }
        },
        {
          id: "a45267c5-96d9-4de2-a871-debf2c8fdb86",
          name: "PII Protection",
          type: "PIIDataRule",
          apply_to_prompt: true,
          apply_to_response: true,
          enabled: true,
          scope: "task",
          created_at: 1723204737120,
          updated_at: 1723204737120,
          config: {
            disabled_pii_entities: ["EMAIL_ADDRESS", "PHONE_NUMBER"],
            allow_list: ["arthur.ai", "Arthur"]
          }
        }
      ]
    },
    {
      id: "957df309-c907-4b77-abe5-15dd00c081f9",
      name: "Financial Advisor Bot",
      created_at: 1723204737120,
      updated_at: 1723204787050,
      rules: [
        {
          id: "bc599a56-2e31-4cb7-910d-9e5ed6455db3",
          name: "PII Detection",
          type: "PIIDataRule",
          apply_to_prompt: true,
          apply_to_response: true,
          enabled: true,
          scope: "task",
          created_at: 1723204737120,
          updated_at: 1723204737120,
          config: {
            disabled_pii_entities: ["CREDIT_CARD", "US_BANK_NUMBER"],
            allow_list: ["arthur.ai"]
          }
        },
        {
          id: "a45267c5-96d9-4de2-a871-debf2c8fdb87",
          name: "Sensitive Keywords",
          type: "KeywordRule",
          apply_to_prompt: true,
          apply_to_response: true,
          enabled: true,
          scope: "task",
          created_at: 1723204737120,
          updated_at: 1723204737120,
          config: {
            keywords: ["confidential", "secret", "internal"]
          }
        }
      ]
    },
    {
      id: "957df309-c907-4b77-abe5-15dd00c081fa",
      name: "Healthcare Assistant",
      created_at: 1723204737120,
      updated_at: 1723204787050,
      rules: [
        {
          id: "bc599a56-2e31-4cb7-910d-9e5ed6455db4",
          name: "HIPAA Compliance",
          type: "PIIDataRule",
          apply_to_prompt: true,
          apply_to_response: true,
          enabled: true,
          scope: "task",
          created_at: 1723204737120,
          updated_at: 1723204737120,
          config: {
            disabled_pii_entities: ["PERSON", "MEDICAL_LICENSE", "US_SSN"],
            allow_list: ["arthur.ai"]
          }
        },
        {
          id: "a45267c5-96d9-4de2-a871-debf2c8fdb88",
          name: "Medical Accuracy",
          type: "ModelHallucinationRuleV2",
          apply_to_prompt: false,
          apply_to_response: true,
          enabled: true,
          scope: "task",
          created_at: 1723204737120,
          updated_at: 1723204737120,
          config: null
        }
      ]
    }
  ];

  const mockValidationResults = {
    success: {
      inference_id: "4dd1fae1-34b9-4aec-8abe-fe7bf12af31d",
      rule_results: [
        {
          id: "bc599a56-2e31-4cb7-910d-9e5ed6455db2",
          name: "Toxicity Detection",
          rule_type: "ToxicityRule",
          scope: "task",
          result: "Pass",
          latency_ms: 73,
          details: null
        },
        {
          id: "a45267c5-96d9-4de2-a871-debf2c8fdb86",
          name: "PII Protection",
          rule_type: "PIIDataRule",
          scope: "task",
          result: "Pass",
          latency_ms: 107,
          details: null
        }
      ],
      user_id: "user-123"
    },
    failure: {
      inference_id: "4dd1fae1-34b9-4aec-8abe-fe7bf12af31e",
      rule_results: [
        {
          id: "bc599a56-2e31-4cb7-910d-9e5ed6455db2",
          name: "Toxicity Detection",
          rule_type: "ToxicityRule",
          scope: "task",
          result: "Pass",
          latency_ms: 73,
          details: null
        },
        {
          id: "a45267c5-96d9-4de2-a871-debf2c8fdb86",
          name: "PII Protection",
          rule_type: "PIIDataRule",
          scope: "task",
          result: "Fail",
          latency_ms: 107,
          details: {
            pii_entities: [
              {
                entity: "EMAIL_ADDRESS",
                span: "john.doe@email.com",
                confidence: 0.95
              },
              {
                entity: "PHONE_NUMBER",
                span: "555-123-4567",
                confidence: 0.98
              }
            ]
          }
        }
      ],
      user_id: "user-123"
    }
  };

  const mockTokenUsage = [
    {
      rule_type: "PIIDataRule",
      task_id: "957df309-c907-4b77-abe5-15dd00c081f8",
      count: {
        inference: 1250,
        eval_prompt: 500,
        eval_completion: 750,
        user_input: 1250,
        prompt: 500,
        completion: 750
      }
    },
    {
      rule_type: "ToxicityRule",
      task_id: "957df309-c907-4b77-abe5-15dd00c081f8",
      count: {
        inference: 1250,
        eval_prompt: 500,
        eval_completion: 750,
        user_input: 1250,
        prompt: 500,
        completion: 750
      }
    },
    {
      rule_type: "KeywordRule",
      task_id: "957df309-c907-4b77-abe5-15dd00c081f9",
      count: {
        inference: 800,
        eval_prompt: 300,
        eval_completion: 500,
        user_input: 800,
        prompt: 300,
        completion: 500
      }
    }
  ];

  const handleSearchTasks = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const filtered = mockTasks.filter(task => 
        task.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
      setLoading(false);
    }, 1000);
  };

  const handleGetTaskDetails = (taskId: string) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const task = mockTasks.find(t => t.id === taskId);
      if (task) {
        setSelectedTask(task);
        setTaskDetails(task);
        setIsModalOpen(true);
      }
      setLoading(false);
    }, 800);
  };

  const handleValidatePrompt = (shouldFail = false) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const result = shouldFail ? mockValidationResults.failure : mockValidationResults.success;
      setValidationResult(result);
      setLoading(false);
    }, 1200);
  };

  const handleGetTokenUsage = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setTokenUsage(mockTokenUsage);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="space-y-8">
      {/* 1. Search Tasks Example */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="size-5 text-blue-600" />
            Search Tasks
          </CardTitle>
          <CardDescription>
            Search for tasks and view their basic information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search tasks (e.g., 'support', 'healthcare')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchTasks()}
            />
            <Button onClick={handleSearchTasks} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>
          
          {searchResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold">Search Results:</h4>
              <div className="grid gap-2">
                {searchResults.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h5 className="font-medium">{task.name}</h5>
                      <p className="text-sm text-muted-foreground">
                        Created: {new Date(task.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleGetTaskDetails(task.id)}
                    >
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <CodeExample
            code={`// Search for tasks
const searchResults = await arthurAPI.searchTasks(
  { task_name: 'Customer Support' },
  { page_size: 10, sort: 'desc' }
);

console.log('Found tasks:', searchResults.tasks);
console.log('Total count:', searchResults.count);`}
            language="typescript"
          />
        </CardContent>
      </Card>

      {/* 3. Validation Example */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="size-5 text-purple-600" />
            Prompt & Response Validation
          </CardTitle>
          <CardDescription>
            Test validation with different inputs to see success and failure states
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Test Validation</h4>
              <div className="flex gap-2 mb-4">
                <Button 
                  onClick={() => {
                    setValidationInput("Hello, how are you today?");
                    handleValidatePrompt(false);
                  }}
                  disabled={loading}
                  variant="outline"
                >
                  Test Safe Input
                </Button>
                <Button 
                  onClick={() => {
                    setValidationInput("My email is john.doe@email.com and phone is 555-123-4567");
                    handleValidatePrompt(true);
                  }}
                  disabled={loading}
                  variant="outline"
                >
                  Test PII Input
                </Button>
              </div>
              
              {validationInput && (
                <div className="p-3 bg-muted rounded-lg">
                  <strong>Input:</strong> {validationInput}
                </div>
              )}
            </div>

            {validationResult && (
              <div>
                <h4 className="font-semibold mb-2">Validation Results:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Inference ID:</span>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {validationResult.inference_id}
                    </code>
                  </div>
                  <div className="space-y-2">
                    {validationResult.rule_results.map((rule: any) => (
                      <div key={rule.id} className="flex items-center gap-2 p-2 border rounded">
                        {rule.result === 'Pass' ? (
                          <CheckCircle2 className="size-4 text-green-600" />
                        ) : (
                          <XCircle className="size-4 text-red-600" />
                        )}
                        <span className="font-medium">{rule.name}</span>
                        <Badge variant={rule.result === 'Pass' ? 'default' : 'destructive'}>
                          {rule.result}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {rule.latency_ms}ms
                        </span>
                        {rule.details && (
                          <div className="text-xs text-muted-foreground ml-2">
                            {rule.details.pii_entities?.map((entity: any) => (
                              <div key={entity.span}>
                                Found: {entity.span} ({entity.entity})
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <CodeExample
              code={`// Validate prompt
const promptValidation = await arthurAPI.validatePrompt(taskId, {
  prompt: "${validationInput || 'User input here'}",
  user_id: 'user-123'
});

// Check results
promptValidation.rule_results.forEach(rule => {
  if (rule.result === 'Fail') {
    console.log(\`❌ \${rule.name} failed (\${rule.latency_ms}ms)\`);
    if (rule.details?.pii_entities) {
      rule.details.pii_entities.forEach(entity => {
        console.log(\`   Found PII: \${entity.span} (\${entity.entity})\`);
      });
    }
  } else {
    console.log(\`✅ \${rule.name} passed (\${rule.latency_ms}ms)\`);
  }
});`}
              language="typescript"
            />
          </div>
        </CardContent>
      </Card>

      {/* 4. Token Usage Example */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="size-5 text-orange-600" />
            Token Usage Analytics
          </CardTitle>
          <CardDescription>
            Monitor API usage and costs across different rule types and tasks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleGetTokenUsage} disabled={loading}>
            {loading ? 'Loading...' : 'Get Token Usage'}
          </Button>

          {tokenUsage && (
            <div className="space-y-4">
              <div className="grid gap-4">
                {tokenUsage.map((usage: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">
                        {usage.rule_type} - {usage.task_id}
                      </h4>
                      <Badge variant="outline">
                        {usage.count.inference} total tokens
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Inference</div>
                        <div className="font-medium">{usage.count.inference}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Eval Prompt</div>
                        <div className="font-medium">{usage.count.eval_prompt}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Eval Completion</div>
                        <div className="font-medium">{usage.count.eval_completion}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm">
                  <strong>Total Tokens:</strong> {tokenUsage.reduce((sum: number, u: any) => sum + u.count.inference, 0)}
                </div>
              </div>
            </div>
          )}

          <CodeExample
            code={`// Get token usage
const usage = await arthurAPI.getTokenUsage({
  start_time: '2024-01-01T00:00:00Z',
  end_time: '2024-01-31T23:59:59Z',
  group_by: ['rule_type', 'task']
});

// Calculate totals
const totalTokens = usage.reduce((sum, u) => sum + u.count.inference, 0);
const totalCost = totalTokens * 0.0001; // Example cost per token

console.log('Total tokens used:', totalTokens);
console.log('Estimated cost: $', totalCost.toFixed(4));

// Analyze by rule type
const byRuleType = usage.reduce((acc, u) => {
  acc[u.rule_type] = (acc[u.rule_type] || 0) + u.count.inference;
  return acc;
}, {});

console.log('Usage by rule type:', byRuleType);`}
            language="typescript"
          />
        </CardContent>
      </Card>

      {/* Task Details Modal */}
      <TaskDetailsModal
        task={taskDetails}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default function ExamplesPage() {
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
        <InteractiveExamples />
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
    </div>
  );
} 
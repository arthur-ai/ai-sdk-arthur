'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  ArrowLeft, 
  BarChart3, 
  RefreshCw, 
  AlertCircle,
  Search,
  Table,
  Shield,
  CheckCircle,
  XCircle,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { 
  SearchTasks, 
  ValidationExample, 
  TokenUsage, 
  QueryInferences,
  TaskDetailsModal 
} from '@/components/examples';

interface Task {
  id: string;
  name?: string;
  status?: string;
  created_at: string;
  model?: string;
  input_tokens?: number;
  output_tokens?: number;
  total_tokens?: number;
  rules?: any[];
}

interface Inference {
  id: string;
  task_id: string;
  status?: string;
  created_at: string;
  model?: string;
  input_tokens?: number;
  output_tokens?: number;
  total_tokens?: number;
  result?: string;
  task_name?: string;
  inference_prompt?: any;
  inference_response?: any;
}

interface TokenUsageCount {
  inference: number;
  eval_prompt: number;
  eval_completion: number;
  user_input: number;
  prompt: number;
  completion: number;
}

interface TokenUsageResponse {
  rule_type?: string | null;
  task_id?: string | null;
  count: TokenUsageCount;
}

interface ValidationResult {
  inference_id?: string | null;
  rule_results?: any[] | null;
  user_id?: string | null;
}

export default function RealDataPage() {
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Real data state
  const [realTasks, setRealTasks] = useState<Task[]>([]);
  const [realInferences, setRealInferences] = useState<Inference[]>([]);
  const [realTokenUsage, setRealTokenUsage] = useState<TokenUsageResponse[]>([]);

  const fetchData = async (type: string) => {
    try {
      const response = await fetch(`/api/arthur/real-data?type=${type}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${type}: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(`Error fetching ${type}:`, err);
      throw err;
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [tasksData, inferencesData, tokenUsageData] = await Promise.all([
        fetchData('tasks'),
        fetchData('inferences'),
        fetchData('token-usage')
      ]);

      setRealTasks(tasksData.data || tasksData.tasks || []);
      setRealInferences(inferencesData.data || inferencesData.inferences || []);
      setRealTokenUsage(Array.isArray(tokenUsageData) ? tokenUsageData : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleViewTaskDetails = (task: any) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const getRuleResultsTooltip = (inference: Inference) => {
    const promptRules = inference.inference_prompt?.prompt_rule_results || [];
    const responseRules = inference.inference_response?.response_rule_results || [];
    
    const allRules = [...promptRules, ...responseRules];
    
    if (allRules.length === 0) {
      return "No rule results available";
    }

    const passedRules = allRules.filter(rule => rule.result === 'Pass');
    const failedRules = allRules.filter(rule => rule.result === 'Fail');
    
    return (
      <div className="space-y-2">
        <div className="font-medium">Rule Results:</div>
        {passedRules.length > 0 && (
          <div>
            <div className="text-green-600 font-medium">Passed ({passedRules.length}):</div>
            {passedRules.map((rule, idx) => (
              <div key={idx} className="text-xs text-green-600">
                • {rule.name} ({rule.rule_type})
              </div>
            ))}
          </div>
        )}
        {failedRules.length > 0 && (
          <div>
            <div className="text-red-600 font-medium">Failed ({failedRules.length}):</div>
            {failedRules.map((rule, idx) => (
              <div key={idx} className="text-xs text-red-600">
                • {rule.name} ({rule.rule_type})
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const getPromptRuleResultsTooltip = (inference: Inference) => {
    const promptRules = inference.inference_prompt?.prompt_rule_results || [];
    
    if (promptRules.length === 0) {
      return "No prompt rule results available";
    }

    const passedRules = promptRules.filter((rule: any) => rule.result === 'Pass');
    const failedRules = promptRules.filter((rule: any) => rule.result === 'Fail');
    
    return (
      <div className="space-y-2">
        <div className="font-medium">Prompt Rule Results:</div>
        {passedRules.length > 0 && (
          <div>
            <div className="text-green-600 font-medium">Passed ({passedRules.length}):</div>
            {passedRules.map((rule: any, idx: number) => (
              <div key={idx} className="text-xs text-green-600">
                • {rule.name} ({rule.rule_type})
              </div>
            ))}
          </div>
        )}
        {failedRules.length > 0 && (
          <div>
            <div className="text-red-600 font-medium">Failed ({failedRules.length}):</div>
            {failedRules.map((rule: any, idx: number) => (
              <div key={idx} className="text-xs text-red-600">
                • {rule.name} ({rule.rule_type})
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const getResponseRuleResultsTooltip = (inference: Inference) => {
    const responseRules = inference.inference_response?.response_rule_results || [];
    
    if (responseRules.length === 0) {
      return "No response rule results available";
    }

    const passedRules = responseRules.filter((rule: any) => rule.result === 'Pass');
    const failedRules = responseRules.filter((rule: any) => rule.result === 'Fail');
    
    return (
      <div className="space-y-2">
        <div className="font-medium">Response Rule Results:</div>
        {passedRules.length > 0 && (
          <div>
            <div className="text-green-600 font-medium">Passed ({passedRules.length}):</div>
            {passedRules.map((rule: any, idx: number) => (
              <div key={idx} className="text-xs text-green-600">
                • {rule.name} ({rule.rule_type})
              </div>
            ))}
          </div>
        )}
        {failedRules.length > 0 && (
          <div>
            <div className="text-red-600 font-medium">Failed ({failedRules.length}):</div>
            {failedRules.map((rule: any, idx: number) => (
              <div key={idx} className="text-xs text-red-600">
                • {rule.name} ({rule.rule_type})
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Real Validation Example Component
  function RealValidationExample() {
    const [promptInput, setPromptInput] = useState('');
    const [llmResponse, setLlmResponse] = useState('');
    const [validationResults, setValidationResults] = useState<{
      prompt: ValidationResult | null;
      response: ValidationResult | null;
    }>({ prompt: null, response: null });
    const [loading, setLoading] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string>('');

    const handleValidateWithLLM = async () => {
      if (!selectedTaskId || !promptInput.trim()) {
        alert('Please select a task and enter a prompt');
        return;
      }

      setLoading(true);
      try {
        // Step 1: Validate the prompt
        const promptResponse = await fetch('/api/arthur/validate-prompt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            taskId: selectedTaskId,
            prompt: promptInput,
            user_id: 'user-123'
          }),
        });

        if (!promptResponse.ok) {
          throw new Error('Prompt validation failed');
        }

        const promptResult = await promptResponse.json();

        // Step 2: Generate LLM response (real LLM call)
        const llmResponse = await fetch('/api/arthur/generate-llm-response', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: promptInput,
            model: 'chat-model'
          }),
        });

        if (!llmResponse.ok) {
          throw new Error('LLM generation failed');
        }

        const llmResult = await llmResponse.json();
        setLlmResponse(llmResult.response);

        // Step 3: Validate the response
        const responseValidation = await fetch('/api/arthur/validate-response', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            taskId: selectedTaskId,
            inferenceId: promptResult.inference_id,
            response: llmResult.response,
            context: promptInput
          }),
        });

        if (!responseValidation.ok) {
          throw new Error('Response validation failed');
        }

        const responseResult = await responseValidation.json();

        setValidationResults({
          prompt: promptResult,
          response: responseResult
        });

      } catch (error) {
        console.error('Validation error:', error);
        alert('Validation failed. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const getRuleDetailsTooltip = (rule: any) => {
      if (!rule.details) {
        return rule.result === 'Pass' ? 'Rule passed successfully' : 'Rule failed';
      }

      let details = [];
      
      // PII Entities
      if (rule.details.pii_entities && rule.details.pii_entities.length > 0) {
        details.push(
          <div key="pii" className="mb-2">
            <div className="font-medium text-red-600">PII Entities Found:</div>
            {rule.details.pii_entities.map((entity: any, idx: number) => (
              <div key={idx} className="text-xs text-red-600 ml-2">
                • {entity.span} ({entity.entity}) - {Math.round((entity.confidence || 0) * 100)}% confidence
              </div>
            ))}
          </div>
        );
      }

      // Keywords
      if (rule.details.keyword_matches && rule.details.keyword_matches.length > 0) {
        details.push(
          <div key="keywords" className="mb-2">
            <div className="font-medium text-red-600">Keywords Found:</div>
            {rule.details.keyword_matches.map((keyword: any, idx: number) => (
              <div key={idx} className="text-xs text-red-600 ml-2">
                • {typeof keyword === 'string' ? keyword : JSON.stringify(keyword)}
              </div>
            ))}
          </div>
        );
      }

      // Toxicity Score
      if (rule.details.score !== undefined && rule.details.score !== null) {
        details.push(
          <div key="toxicity" className="mb-2">
            <div className="font-medium text-red-600">Toxicity Score:</div>
            <div className="text-xs text-red-600 ml-2">
              {Math.round((rule.details.score || 0) * 100)}% (threshold: {Math.round(((rule.details.threshold || 0.5)) * 100)}%)
            </div>
          </div>
        );
      }

      // Hallucination Claims
      if (rule.details.claims && rule.details.claims.length > 0) {
        details.push(
          <div key="claims" className="mb-2">
            <div className="font-medium text-red-600">Claims Analysis:</div>
            {rule.details.claims.map((claim: any, idx: number) => (
              <div key={idx} className="text-xs ml-2">
                <span className={claim.valid ? 'text-green-600' : 'text-red-600'}>
                  • {String(claim.claim || 'Unknown claim')} - {claim.valid ? 'Valid' : 'Invalid'}
                </span>
                {claim.reason && <div className="text-xs text-muted-foreground ml-2">Reason: {String(claim.reason)}</div>}
              </div>
            ))}
          </div>
        );
      }

      // Regex Matches
      if (rule.details.regex_matches && rule.details.regex_matches.length > 0) {
        details.push(
          <div key="regex" className="mb-2">
            <div className="font-medium text-red-600">Regex Matches:</div>
            {rule.details.regex_matches.map((match: any, idx: number) => (
              <div key={idx} className="text-xs text-red-600 ml-2">
                • {String(match || 'Unknown match')}
              </div>
            ))}
          </div>
        );
      }

      // Generic message if no specific details
      if (details.length === 0 && rule.details.message) {
        details.push(
          <div key="message" className="text-xs text-muted-foreground">
            {String(rule.details.message)}
          </div>
        );
      }

      return (
        <div className="space-y-1">
          <div className="font-medium">Rule Details:</div>
          {details.length > 0 ? details : <div className="text-xs text-muted-foreground">No additional details available</div>}
        </div>
      );
    };

    const renderValidationResults = (result: ValidationResult, title: string) => (
      <div>
        <h4 className="font-semibold mb-2">{title}:</h4>
        <div className="space-y-2">
          {result.inference_id && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Inference ID:</span>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                {result.inference_id}
              </code>
            </div>
          )}
          <div className="space-y-2">
            {result.rule_results?.map((rule: any) => (
              <div key={rule.id} className="flex items-center gap-2 p-2 border rounded">
                {rule.result === 'Pass' ? (
                  <CheckCircle2 className="size-4 text-green-600" />
                ) : (
                  <XCircle className="size-4 text-red-600" />
                )}
                <span className="font-medium">{rule.name}</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge 
                      variant={rule.result === 'Pass' ? 'default' : 'destructive'}
                      className="text-xs cursor-help"
                    >
                      {rule.result}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-md">
                    {getRuleDetailsTooltip(rule)}
                  </TooltipContent>
                </Tooltip>
                <span className="text-xs text-muted-foreground">
                  {rule.latency_ms}ms
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="size-5 text-purple-600" />
            LLM Validation (Real Data)
          </CardTitle>
          <CardDescription>
            Test validation with your actual Arthur tasks and rules - includes LLM response generation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {/* Task Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Select Task:</label>
              <select 
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Choose a task...</option>
                {realTasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.name || task.id.slice(0, 8)} ({task.rules?.length || 0} rules)
                  </option>
                ))}
              </select>
            </div>

            {/* Prompt Input */}
            <div>
              <h4 className="font-semibold mb-2">LLM Validation Flow</h4>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Prompt for LLM:</label>
                <textarea
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="Enter a prompt to send to the LLM and validate..."
                  className="w-full p-2 border rounded-md h-20"
                />
              </div>

              <Button 
                onClick={handleValidateWithLLM}
                disabled={loading || !selectedTaskId || !promptInput.trim()}
                className="w-full"
              >
                {loading ? 'Processing...' : 'Generate & Validate'}
              </Button>
            </div>

            {/* Display Results */}
            {llmResponse && (
              <div className="space-y-4">
                <div className="p-3  border  rounded-lg">
                  <div className="text-sm">
                    <strong>Generated Response:</strong>
                    <div className="mt-1 text-muted-foreground">{llmResponse}</div>
                  </div>
                </div>

                <div className="grid gap-4">
                  {validationResults.prompt && renderValidationResults(validationResults.prompt, 'Prompt Validation Results')}
                  {validationResults.response && renderValidationResults(validationResults.response, 'Response Validation Results')}
                </div>
              </div>
            )}

            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm">
                <strong>Note:</strong> This validation uses your actual Arthur tasks and rules with real LLM responses from XAI (x.AI) models.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <Link href="/examples">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="size-4" />
              Back to Examples
            </Button>
          </Link>
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <BarChart3 className="size-8 text-blue-600" />
            Live Arthur Examples
          </h1>
          <p className="text-xl text-muted-foreground">Loading your Arthur instance data...</p>
        </div>

        <div className="space-y-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-96" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-10 w-32" />
                  <div className="space-y-2">
                    {[1, 2, 3].map((j) => (
                      <Skeleton key={j} className="h-16 w-full" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <Link href="/examples">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="size-4" />
              Back to Examples
            </Button>
          </Link>
        </div>
        
        <div className="text-center">
          <AlertCircle className="size-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Error Loading Data</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={loadData} className="flex items-center gap-2">
            <RefreshCw className="size-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={100}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back to Examples Button */}
        <div className="mb-8">
          <Link href="/examples">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="size-4" />
              Back to Examples
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <BarChart3 className="size-8 text-blue-600" />
            Live Arthur Examples
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            Interactive examples using real data from your Arthur GenAI Engine instance
          </p>
          <Button 
            onClick={refreshData} 
            disabled={refreshing}
            variant="outline" 
            className="flex items-center gap-2"
          >
            <RefreshCw className={`size-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </div>

        {/* Interactive Examples with Real Data */}
        <div className="space-y-8">
          {/* Search Tasks with Real Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="size-5 text-blue-600" />
                Search Tasks (Real Data)
              </CardTitle>
              <CardDescription>
                Search through your actual Arthur tasks and view their details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {realTasks.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No tasks found in your Arthur instance
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-4">
                    {realTasks.slice(0, 5).map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h5 className="font-medium">{task.name || task.id}</h5>
                          <p className="text-sm text-muted-foreground">
                            Created: {new Date(task.created_at).toLocaleDateString()}
                            {task.model && ` • Model: ${task.model}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          {task.total_tokens && (
                            <span className="text-sm text-muted-foreground">
                              {new Intl.NumberFormat().format(task.total_tokens)} tokens
                            </span>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewTaskDetails(task)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Showing {Math.min(realTasks.length, 5)} of {realTasks.length} tasks
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Query Inferences with Real Data - Table View */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Table className="size-5 text-green-600" />
                Query Inferences (Real Data)
              </CardTitle>
              <CardDescription>
                View recent inference requests and their validation results
              </CardDescription>
            </CardHeader>
            <CardContent>
              {realInferences.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No inferences found in your Arthur instance
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Inference Results</h4>
                    <Badge variant="outline">
                      Total: {realInferences.length} inferences
                    </Badge>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="text-left p-3 font-medium">ID</th>
                            <th className="text-left p-3 font-medium">Result</th>
                            <th className="text-left p-3 font-medium">Task</th>
                            <th className="text-left p-3 font-medium">Prompt</th>
                            <th className="text-left p-3 font-medium">Response</th>
                            <th className="text-left p-3 font-medium">Created</th>
                            <th className="text-left p-3 font-medium">Tokens</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {realInferences.slice(0, 10).map((inference) => (
                            <tr key={inference.id} className="hover:bg-muted/30">
                              <td className="p-3 font-mono text-xs">
                                {inference.id.slice(0, 8)}...
                              </td>
                              <td className="p-3">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge 
                                      variant={inference.result === 'Pass' ? 'default' : 'destructive'}
                                      className="text-xs cursor-help"
                                    >
                                      {inference.result || 'Unknown'}
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent side="right" className="max-w-md">
                                    {getRuleResultsTooltip(inference)}
                                  </TooltipContent>
                                </Tooltip>
                              </td>
                              <td className="p-3">
                                <div className="text-xs">
                                  <div className="font-medium">{inference.task_name || 'Unknown'}</div>
                                  <div className="text-muted-foreground">
                                    {inference.task_id.slice(0, 8)}...
                                  </div>
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="text-xs max-w-[200px]">
                                  <div className="font-medium truncate">
                                    {inference.inference_prompt?.message || 'No prompt'}
                                  </div>
                                  {inference.inference_prompt?.result && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Badge 
                                          variant={inference.inference_prompt.result === 'Pass' ? 'default' : 'destructive'}
                                          className="text-xs mt-1 cursor-help"
                                        >
                                          {inference.inference_prompt.result}
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent side="right" className="max-w-md">
                                        {getPromptRuleResultsTooltip(inference)}
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="text-xs max-w-[200px]">
                                  {inference.inference_response ? (
                                    <>
                                      <div className="font-medium truncate">
                                        {inference.inference_response.message}
                                      </div>
                                      {inference.inference_response.result && (
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Badge 
                                              variant={inference.inference_response.result === 'Pass' ? 'default' : 'destructive'}
                                              className="text-xs mt-1 cursor-help"
                                            >
                                              {inference.inference_response.result}
                                            </Badge>
                                          </TooltipTrigger>
                                          <TooltipContent side="right" className="max-w-md">
                                            {getResponseRuleResultsTooltip(inference)}
                                          </TooltipContent>
                                        </Tooltip>
                                      )}
                                    </>
                                  ) : (
                                    <span className="text-muted-foreground">No response</span>
                                  )}
                                </div>
                              </td>
                              <td className="p-3 text-xs text-muted-foreground">
                                {new Date(inference.created_at).toLocaleDateString()}
                              </td>
                              <td className="p-3 text-xs text-muted-foreground">
                                <div>
                                  <div>P: {inference.inference_prompt?.tokens || 0}</div>
                                  {inference.inference_response && (
                                    <div>R: {inference.inference_response.tokens || 0}</div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Showing {Math.min(realInferences.length, 10)} of {realInferences.length} inferences
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Token Usage with Real Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="size-5 text-orange-600" />
                Token Usage Analytics (Real Data)
              </CardTitle>
              <CardDescription>
                Monitor actual API usage and costs across your tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              {realTokenUsage.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No token usage data found in your Arthur instance
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-4">
                    {realTokenUsage.map((usage, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">
                            {usage.task_id ? `Task ${usage.task_id.slice(0, 8)}` : 'Default Rules'}
                            {usage.rule_type && ` - ${usage.rule_type}`}
                          </h4>
                          <span className="text-sm font-medium">
                            {new Intl.NumberFormat().format(usage.count.inference)} total tokens
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Inference</div>
                            <div className="font-medium">{new Intl.NumberFormat().format(usage.count.inference)}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Eval Prompt</div>
                            <div className="font-medium">{new Intl.NumberFormat().format(usage.count.eval_prompt)}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Eval Completion</div>
                            <div className="font-medium">{new Intl.NumberFormat().format(usage.count.eval_completion)}</div>
                          </div>
                        </div>
                        {/* Show additional token counts if available */}
                        {(usage.count.user_input > 0 || usage.count.prompt > 0 || usage.count.completion > 0) && (
                          <div className="grid grid-cols-3 gap-4 text-sm mt-2 pt-2 border-t">
                            <div>
                              <div className="text-muted-foreground">User Input</div>
                              <div className="font-medium">{new Intl.NumberFormat().format(usage.count.user_input)}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Prompt</div>
                              <div className="font-medium">{new Intl.NumberFormat().format(usage.count.prompt)}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Completion</div>
                              <div className="font-medium">{new Intl.NumberFormat().format(usage.count.completion)}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm">
                      <strong>Total Tokens:</strong> {new Intl.NumberFormat().format(
                        realTokenUsage.reduce((sum, u) => sum + u.count.inference, 0)
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground text-center">
                    Showing {realTokenUsage.length} usage records
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Validation Example - Real Validation Example Component */}
          <RealValidationExample />
        </div>

        {/* Task Details Modal */}
        <TaskDetailsModal 
          task={selectedTask} 
          isOpen={isModalOpen} 
          onClose={closeModal} 
        />
      </div>
    </TooltipProvider>
  );
} 
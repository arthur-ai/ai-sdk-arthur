'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CodeExample } from '@/components/code-example';
import { Table } from 'lucide-react';

export function QueryInferences() {
  const [inferences, setInferences] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const mockInferences = {
    count: 156,
    inferences: [
      {
        id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        result: "Fail",
        created_at: 1750943399443,
        updated_at: 1750943404263,
        task_id: "task-123-customer-support",
        task_name: "Customer Support Bot",
        conversation_id: "conv-456-session-1",
        inference_prompt: {
          id: "prompt-789-abc-def",
          inference_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
          result: "Pass",
          created_at: 1750943399443,
          updated_at: 1750943399443,
          message: "I need help with my account. My email is john.doe@company.com and my phone is 555-123-4567",
          prompt_rule_results: [
            {
              id: "rule-pii-001",
              name: "PII Protection",
              rule_type: "PIIDataRule",
              scope: "task",
              result: "Fail",
              latency_ms: 45,
              details: {
                pii_entities: [
                  {
                    entity: "EMAIL_ADDRESS",
                    span: "john.doe@company.com",
                    confidence: 0.98
                  },
                  {
                    entity: "PHONE_NUMBER",
                    span: "555-123-4567",
                    confidence: 0.95
                  }
                ]
              }
            },
            {
              id: "rule-toxicity-001",
              name: "Toxicity Check",
              rule_type: "ToxicityRule",
              scope: "task",
              result: "Pass",
              latency_ms: 32,
              details: null
            }
          ],
          tokens: 18
        },
        inference_response: {
          id: "response-789-abc-def",
          inference_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
          result: "Fail",
          created_at: 1750943404243,
          updated_at: 1750943404243,
          message: "I can help you with your account. I found your email john.doe@company.com and will call you at 555-123-4567 to assist.",
          context: "I need help with my account. My email is john.doe@company.com and my phone is 555-123-4567",
          response_rule_results: [
            {
              id: "rule-pii-001",
              name: "PII Protection",
              rule_type: "PIIDataRule",
              scope: "task",
              result: "Fail",
              latency_ms: 38,
              details: {
                pii_entities: [
                  {
                    entity: "EMAIL_ADDRESS",
                    span: "john.doe@company.com",
                    confidence: 0.98
                  },
                  {
                    entity: "PHONE_NUMBER",
                    span: "555-123-4567",
                    confidence: 0.95
                  }
                ]
              }
            }
          ],
          tokens: 25
        },
        inference_feedback: [],
        user_id: "user-123"
      },
      {
        id: "b2c3d4e5-f6g7-8901-bcde-f23456789012",
        result: "Pass",
        created_at: 1750938849617,
        updated_at: 1750938855333,
        task_id: "task-456-financial-advisor",
        task_name: "Financial Advisor",
        conversation_id: "conv-789-session-2",
        inference_prompt: {
          id: "prompt-890-def-ghi",
          inference_id: "b2c3d4e5-f6g7-8901-bcde-f23456789012",
          result: "Pass",
          created_at: 1750938849618,
          updated_at: 1750938849618,
          message: "What are the best investment strategies for retirement planning?",
          prompt_rule_results: [
            {
              id: "rule-keyword-001",
              name: "Sensitive Keywords",
              rule_type: "KeywordRule",
              scope: "task",
              result: "Pass",
              latency_ms: 12,
              details: {
                score: null,
                message: "No keywords found in text.",
                keyword_matches: []
              }
            },
            {
              id: "rule-pii-002",
              name: "PII Detection",
              rule_type: "PIIDataRule",
              scope: "task",
              result: "Pass",
              latency_ms: 28,
              details: {
                pii_entities: []
              }
            }
          ],
          tokens: 12
        },
        inference_response: {
          id: "response-890-def-ghi",
          inference_id: "b2c3d4e5-f6g7-8901-bcde-f23456789012",
          result: "Pass",
          created_at: 1750938855324,
          updated_at: 1750938855324,
          message: "For retirement planning, I recommend a diversified portfolio approach. Consider allocating 60% to stocks, 30% to bonds, and 10% to alternative investments. Start early and contribute regularly to take advantage of compound interest.",
          context: "What are the best investment strategies for retirement planning?",
          response_rule_results: [
            {
              id: "rule-hallucination-001",
              name: "Fact Check",
              rule_type: "ModelHallucinationRuleV2",
              scope: "task",
              result: "Pass",
              latency_ms: 156,
              details: {
                claims: [
                  {
                    claim: "diversified portfolio approach",
                    valid: true,
                    reason: "Common financial advice",
                    order_number: 0
                  },
                  {
                    claim: "60% stocks, 30% bonds, 10% alternatives",
                    valid: true,
                    reason: "Standard allocation strategy",
                    order_number: 1
                  }
                ],
                score: true,
                message: "All claims were supported by the context!"
              }
            }
          ],
          tokens: 45
        },
        inference_feedback: [],
        user_id: "user-456"
      }
    ]
  };

  const handleQueryInferences = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setInferences(mockInferences);
      setLoading(false);
    }, 800);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Table className="size-5 text-indigo-600" />
          Query Inferences
        </CardTitle>
        <CardDescription>
          Query and analyze inference history with detailed rule results
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleQueryInferences} disabled={loading}>
          {loading ? 'Loading...' : 'Query Inferences'}
        </Button>

        {inferences && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Inference Results</h4>
              <Badge variant="outline">
                Total: {inferences.count} inferences
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
                    {inferences.inferences.map((inference: any) => (
                      <tr key={inference.id} className="hover:bg-muted/30">
                        <td className="p-3 font-mono text-xs">
                          {inference.id.slice(0, 8)}...
                        </td>
                        <td className="p-3">
                          <Badge 
                            variant={inference.result === 'Pass' ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {inference.result}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="text-xs">
                            <div className="font-medium">{inference.task_name}</div>
                            <div className="text-muted-foreground">
                              {inference.task_id.slice(0, 8)}...
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="text-xs max-w-[200px]">
                            <div className="font-medium truncate">
                              {inference.inference_prompt.message}
                            </div>
                            <Badge 
                              variant={inference.inference_prompt.result === 'Pass' ? 'default' : 'destructive'}
                              className="text-xs mt-1"
                            >
                              {inference.inference_prompt.result}
                            </Badge>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="text-xs max-w-[200px]">
                            {inference.inference_response ? (
                              <>
                                <div className="font-medium truncate">
                                  {inference.inference_response.message}
                                </div>
                                <Badge 
                                  variant={inference.inference_response.result === 'Pass' ? 'default' : 'destructive'}
                                  className="text-xs mt-1"
                                >
                                  {inference.inference_response.result}
                                </Badge>
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
                            <div>P: {inference.inference_prompt.tokens}</div>
                            {inference.inference_response && (
                              <div>R: {inference.inference_response.tokens}</div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <CodeExample
          code={`// Query inferences with filters
const inferences = await arthurAPI.queryInferences({
  task_ids: ['6f4437e5-552e-47ef-80e2-24c5b830cc06'],
  rule_statuses: ['Pass', 'Fail'],
  start_time: '2024-01-01T00:00:00Z',
  end_time: '2024-12-31T23:59:59Z',
  page_size: 10,
  sort: 'desc'
});

console.log('Total inferences:', inferences.count);
console.log('Inferences:', inferences.inferences);

// Analyze results
const passCount = inferences.inferences.filter(i => i.result === 'Pass').length;
const failCount = inferences.inferences.filter(i => i.result === 'Fail').length;

console.log('Pass rate:', (passCount / inferences.inferences.length * 100).toFixed(1) + '%');
console.log('Fail rate:', (failCount / inferences.inferences.length * 100).toFixed(1) + '%');`}
          language="typescript"
        />
      </CardContent>
    </Card>
  );
} 
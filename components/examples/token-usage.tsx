'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CodeExample } from '@/components/code-example';
import { BarChart3 } from 'lucide-react';

export function TokenUsage() {
  const [tokenUsage, setTokenUsage] = useState<any>(null);
  const [loading, setLoading] = useState(false);

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

  const handleGetTokenUsage = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setTokenUsage(mockTokenUsage);
      setLoading(false);
    }, 600);
  };

  return (
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
  );
} 
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CodeExample } from '@/components/code-example';
import { Shield, CheckCircle2, XCircle } from 'lucide-react';

export function ValidationExample() {
  const [validationInput, setValidationInput] = useState('');
  const [validationResult, setValidationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

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

  const handleValidatePrompt = (shouldFail = false) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const result = shouldFail ? mockValidationResults.failure : mockValidationResults.success;
      setValidationResult(result);
      setLoading(false);
    }, 1200);
  };

  return (
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
  );
} 
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface ValidationResult {
  rule_name: string;
  rule_type: string;
  passed: boolean;
  score?: number;
  details?: string;
}

interface ValidationResultsProps {
  results: ValidationResult[];
  title?: string;
}

export function ValidationResults({ results, title = "Validation Results" }: ValidationResultsProps) {
  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {title}
          <Badge variant={passedCount === totalCount ? "default" : "destructive"}>
            {passedCount}/{totalCount} Passed
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {results.map((result, index) => (
            <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
              {result.passed ? (
                <CheckCircle className="size-5 text-green-600" />
              ) : (
                <XCircle className="size-5 text-red-600" />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{result.rule_name}</span>
                  <Badge variant="outline" className="text-xs">
                    {result.rule_type}
                  </Badge>
                  {result.score !== undefined && (
                    <Badge variant="secondary" className="text-xs">
                      Score: {result.score}
                    </Badge>
                  )}
                </div>
                {result.details && (
                  <p className="text-sm text-muted-foreground mt-1">{result.details}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';

interface Inference {
  id: string;
  task_id: string;
  task_name: string;
  prompt: string;
  response: string;
  validation_results: Array<{
    rule_name: string;
    rule_type: string;
    passed: boolean;
    score?: number;
  }>;
  created_at: string;
  latency_ms: number;
}

interface InferencesTableProps {
  inferences: Inference[];
}

export function InferencesTable({ inferences }: InferencesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Inferences</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Table Header */}
            <div className="grid grid-cols-6 gap-4 p-3 bg-muted/50 rounded-t-lg border-b font-medium text-sm">
              <div>Task</div>
              <div>Prompt</div>
              <div>Response</div>
              <div>Validation</div>
              <div>Latency</div>
              <div>Date</div>
            </div>
            
            {/* Table Body */}
            <div className="divide-y">
              {inferences.map((inference) => {
                const passedCount = inference.validation_results.filter(r => r.passed).length;
                const totalCount = inference.validation_results.length;
                const allPassed = passedCount === totalCount;

                return (
                  <div key={inference.id} className="grid grid-cols-6 gap-4 p-3 hover:bg-muted/30">
                    <div>
                      <div className="font-medium">{inference.task_name}</div>
                      <div className="text-xs text-muted-foreground">{inference.task_id}</div>
                    </div>
                    <div>
                      <div className="max-w-xs truncate" title={inference.prompt}>
                        {inference.prompt}
                      </div>
                    </div>
                    <div>
                      <div className="max-w-xs truncate" title={inference.response}>
                        {inference.response}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        {allPassed ? (
                          <CheckCircle className="size-4 text-green-600" />
                        ) : (
                          <XCircle className="size-4 text-red-600" />
                        )}
                        <Badge variant={allPassed ? "default" : "destructive"} className="text-xs">
                          {passedCount}/{totalCount}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm">{inference.latency_ms}ms</span>
                    </div>
                    <div>
                      <span className="text-sm">
                        {new Date(inference.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 
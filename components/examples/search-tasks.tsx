'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CodeExample } from '@/components/code-example';
import { Search } from 'lucide-react';

interface SearchTasksProps {
  onViewTaskDetails: (task: any) => void;
}

export function SearchTasks({ onViewTaskDetails }: SearchTasksProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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

  return (
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
                    onClick={() => onViewTaskDetails(task)}
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
  );
} 
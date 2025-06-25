# Arthur GenAI Engine API Client

A comprehensive TypeScript client for the Arthur GenAI Engine API, based on OpenAPI specification v2.1.44.

## Features

- **Complete API Coverage**: All non-deprecated endpoints from the Arthur GenAI Engine API
- **TypeScript Support**: Full type safety with comprehensive interfaces
- **Error Handling**: Built-in error handling with descriptive error messages
- **Query Parameter Support**: Full support for all query parameters and filtering options
- **Pagination Support**: Built-in support for paginated responses
- **Authentication**: Automatic Bearer token authentication
- **Next.js Integration**: Proper support for both server-side and client-side usage

## Installation

The API client is included in the project. No additional installation is required.

## Usage Patterns

### Server-Side Usage (API Routes)

For server-side usage in Next.js API routes, use the API client directly:

```typescript
import { createArthurAPI } from "./lib/ai/arthur-api";

const api = createArthurAPI();

// Example API route
export async function GET() {
  try {
    const usage = await api.getTokenUsage({
      start_time: "2024-01-01T00:00:00Z",
      end_time: "2024-01-31T23:59:59Z",
      group_by: ["rule_type", "task"],
    });

    return Response.json(usage);
  } catch (error) {
    return Response.json({ error: "Failed to fetch usage" }, { status: 500 });
  }
}
```

### Client-Side Usage (React Components)

For client-side usage, use the provided React hook:

```typescript
import { useArthurClient } from "@/hooks/useArthurClient";

function MyComponent() {
  const arthurClient = useArthurClient();

  const handleGetUsage = async () => {
    try {
      const usage = await arthurClient.getTokenUsage({
        start_time: "2024-01-01T00:00:00Z",
        end_time: "2024-01-31T23:59:59Z",
        group_by: ["rule_type", "task"],
      });
      console.log("Usage:", usage);
    } catch (error) {
      console.error("Failed to fetch usage:", error);
    }
  };

  return <button onClick={handleGetUsage}>Get Token Usage</button>;
}
```

### Direct API Client Usage

For direct usage in server components or other server-side code:

```typescript
import { createArthurAPI } from "./lib/ai/arthur-api";

// Initialize the API client
const api = createArthurAPI();

// Example: Create a task
const task = await api.createTask({ name: "My Task" });
console.log("Created task:", task);
```

## API Endpoints

### Usage

- `getTokenUsage()` - Get token usage statistics

### Feedback

- `postFeedback()` - Post feedback for an inference
- `queryFeedback()` - Query feedback with filters

### Inferences

- `queryInferences()` - Query inferences with comprehensive filtering

### Rules

- `getDefaultRules()` - Get all default rules
- `createDefaultRule()` - Create a new default rule
- `archiveDefaultRule()` - Archive a default rule
- `searchRules()` - Search for rules with filters

### Tasks

- `createTask()` - Create a new task
- `searchTasks()` - Search for tasks
- `getTask()` - Get a specific task
- `archiveTask()` - Archive a task
- `createTaskRule()` - Create a rule for a specific task
- `updateTaskRule()` - Update a task rule
- `archiveTaskRule()` - Archive a task rule

### Validation

- `validatePrompt()` - Validate a prompt for a task
- `validateResponse()` - Validate a response for a task

### API Keys

- `getAllActiveApiKeys()` - Get all active API keys
- `createApiKey()` - Create a new API key
- `getApiKey()` - Get a specific API key
- `deactivateApiKey()` - Deactivate an API key

### Traces & Spans

- `receiveTraces()` - Receive OpenInference traces
- `querySpans()` - Query spans with filters

## Rule Types

The API supports the following rule types:

- `KeywordRule` - Block specific keywords
- `RegexRule` - Block content matching regex patterns
- `PIIDataRule` - Detect and block PII (Personally Identifiable Information)
- `ToxicityRule` - Detect toxic content
- `PromptInjectionRule` - Detect prompt injection attempts
- `ModelHallucinationRuleV2` - Detect model hallucinations
- `ModelSensitiveDataRule` - Detect sensitive data using examples

## Examples

### Creating a Task with Rules

```typescript
// Create a task
const task = await api.createTask({ name: "Content Moderation" });

// Add a PII detection rule
const piiRule = await api.createTaskRule(task.id, {
  name: "PII Detection",
  type: "PIIDataRule",
  apply_to_prompt: true,
  apply_to_response: true,
  config: {
    disabled_pii_entities: ["EMAIL_ADDRESS", "PHONE_NUMBER"],
    confidence_threshold: 0.5,
    allow_list: ["arthur.ai"],
  },
});

// Add a toxicity rule
const toxicityRule = await api.createTaskRule(task.id, {
  name: "Toxicity Detection",
  type: "ToxicityRule",
  apply_to_prompt: true,
  apply_to_response: true,
  config: { threshold: 0.7 },
});
```

### Validating Content

```typescript
// Validate a prompt
const promptValidation = await api.validatePrompt(task.id, {
  prompt: "What is the customer's credit card number?",
  conversation_id: "conv-123",
  user_id: "user-456",
});

// Validate a response
const responseValidation = await api.validateResponse(
  task.id,
  promptValidation.inference_id!,
  {
    response: "I cannot provide credit card information.",
    context: "Customer asked for sensitive data",
  }
);
```

### Querying Data

```typescript
// Query inferences
const inferences = await api.queryInferences({
  task_ids: [task.id],
  start_time: "2024-01-01T00:00:00Z",
  end_time: "2024-01-31T23:59:59Z",
  rule_statuses: ["Pass", "Fail"],
  page_size: 20,
  sort: "desc",
});

// Query feedback
const feedback = await api.queryFeedback({
  inference_id: promptValidation.inference_id,
  target: "response_results",
  page_size: 10,
});
```

### Providing Feedback

```typescript
// Post feedback
await api.postFeedback(promptValidation.inference_id!, {
  target: "response_results",
  score: 5, // 1-5 scale
  reason: "Excellent safety compliance",
  user_id: "user-456",
});
```

## Error Handling

The API client throws errors for HTTP errors and network issues:

```typescript
try {
  const task = await api.createTask({ name: "My Task" });
} catch (error) {
  console.error("API Error:", error.message);
  // Handle error appropriately
}
```

## Query Parameters

Most query endpoints support comprehensive filtering and pagination:

```typescript
// Example with multiple filters
const results = await api.queryInferences({
  task_ids: ["task-1", "task-2"],
  start_time: "2024-01-01T00:00:00Z",
  end_time: "2024-01-31T23:59:59Z",
  rule_statuses: ["Pass", "Fail"],
  prompt_statuses: ["Pass"],
  response_statuses: ["Pass"],
  include_count: true,
  page_size: 50,
  page: 0,
  sort: "desc",
});
```

## Configuration

The API client automatically uses environment variables. Set these in your `.env.local` file:

```bash
ARTHUR_API_KEY=your_api_key_here
ARTHUR_API_BASE=https://api.arthur.ai  # optional, defaults to https://api.arthur.ai
```

You can also pass parameters explicitly if needed:

```typescript
const api = createArthurAPI(
  "your-api-key",
  "https://custom-arthur-instance.com"
);
```

## TypeScript Support

All API responses and request parameters are fully typed:

```typescript
import type {
  TaskResponse,
  NewTaskRequest,
  RuleResponse,
  ValidationResult,
} from "./lib/ai/arthur-api";

// TypeScript will provide full intellisense and type checking
const task: TaskResponse = await api.createTask({ name: "Typed Task" });
```

## Next.js Integration

### API Routes

The project includes pre-built API routes for common operations:

- `/api/arthur/usage` - Get token usage
- `/api/arthur/client` - General-purpose Arthur API client
- `/api/arthur/task` - Get task information

### React Hook

Use the `useArthurClient` hook for client-side operations:

```typescript
import { useArthurClient } from "@/hooks/useArthurClient";

function MyComponent() {
  const arthurClient = useArthurClient();

  // Use any of the available methods
  const handleCreateTask = async () => {
    const task = await arthurClient.createTask({ name: "New Task" });
    console.log("Created:", task);
  };
}
```

## Complete Examples

See `arthur-api-examples.ts` for comprehensive examples of all API endpoints and common use cases.

## API Reference

For detailed API documentation, refer to the Arthur GenAI Engine OpenAPI specification or the inline documentation in the source code.

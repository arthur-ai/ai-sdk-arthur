/**
 * Arthur GenAI Engine API Client Examples
 * Demonstrates usage of all API endpoints
 */

import { 
  createArthurAPI, 
  type NewTaskRequest,
  type NewRuleRequest,
  type PromptValidationRequest,
  type ResponseValidationRequest,
  type FeedbackRequest,
  type NewApiKeyRequest
} from './arthur-api';

// Initialize the API client (uses environment variables)
const api = createArthurAPI();

// Example 1: Token Usage
async function getTokenUsageExample() {
  try {
    // Get token usage for the current day
    const usage = await api.getTokenUsage();
    console.log('Token usage:', usage);

    // Get token usage for a specific date range
    const usageWithParams = await api.getTokenUsage({
      start_time: '2024-01-01T00:00:00Z',
      end_time: '2024-01-31T23:59:59Z',
      group_by: ['rule_type', 'task']
    });
    console.log('Token usage with params:', usageWithParams);
  } catch (error) {
    console.error('Error getting token usage:', error);
  }
}

// Example 2: Task Management
async function taskManagementExample() {
  try {
    // Create a new task
    const newTask: NewTaskRequest = {
      name: 'Customer Support Chat'
    };
    const task = await api.createTask(newTask);
    console.log('Created task:', task);

    // Search for tasks
    const searchResults = await api.searchTasks(
      { task_name: 'Customer' },
      { page_size: 10, sort: 'desc' }
    );
    console.log('Search results:', searchResults);

    // Get a specific task
    const taskDetails = await api.getTask(task.id);
    console.log('Task details:', taskDetails);

    // Archive a task
    await api.archiveTask(task.id);
    console.log('Task archived');
  } catch (error) {
    console.error('Error in task management:', error);
  }
}

// Example 3: Rule Management
async function ruleManagementExample() {
  try {
    // Get default rules
    const defaultRules = await api.getDefaultRules();
    console.log('Default rules:', defaultRules);

    // Create a new default rule (PII detection)
    const piiRule: NewRuleRequest = {
      name: 'PII Detection Rule',
      type: 'PIIDataRule',
      apply_to_prompt: true,
      apply_to_response: true,
      config: {
        disabled_pii_entities: ['EMAIL_ADDRESS', 'PHONE_NUMBER'],
        confidence_threshold: 0.5,
        allow_list: ['arthur.ai', 'Arthur']
      }
    };
    const createdRule = await api.createDefaultRule(piiRule);
    console.log('Created PII rule:', createdRule);

    // Create a keyword rule for a specific task
    const keywordRule: NewRuleRequest = {
      name: 'Blocked Keywords',
      type: 'KeywordRule',
      apply_to_prompt: true,
      apply_to_response: true,
      config: {
        keywords: ['confidential', 'secret', 'internal']
      }
    };
    const taskId = 'your-task-id';
    const taskRule = await api.createTaskRule(taskId, keywordRule);
    console.log('Created task rule:', taskRule);

    // Search for rules
    const searchResults = await api.searchRules(
      { 
        rule_types: ['PIIDataRule', 'KeywordRule'],
        prompt_enabled: true 
      },
      { page_size: 20, sort: 'desc' }
    );
    console.log('Rule search results:', searchResults);

    // Update a task rule
    await api.updateTaskRule(taskId, taskRule.id, { enabled: false });
    console.log('Task rule disabled');

    // Archive rules
    await api.archiveDefaultRule(createdRule.id);
    await api.archiveTaskRule(taskId, taskRule.id);
    console.log('Rules archived');
  } catch (error) {
    console.error('Error in rule management:', error);
  }
}

// Example 4: Validation
async function validationExample() {
  try {
    const taskId = 'your-task-id';

    // Validate a prompt
    const promptRequest: PromptValidationRequest = {
      prompt: 'What is the customer\'s credit card number?',
      conversation_id: 'conv-123',
      user_id: 'user-456'
    };
    const promptValidation = await api.validatePrompt(taskId, promptRequest);
    console.log('Prompt validation:', promptValidation);

    // Validate a response
    const responseRequest: ResponseValidationRequest = {
      response: 'I cannot provide credit card information as it contains sensitive data.',
      context: 'Customer asked for credit card details'
    };
    const responseValidation = await api.validateResponse(
      taskId, 
      promptValidation.inference_id!, 
      responseRequest
    );
    console.log('Response validation:', responseValidation);
  } catch (error) {
    console.error('Error in validation:', error);
  }
}

// Example 5: Feedback
async function feedbackExample() {
  try {
    const inferenceId = 'inference-123';

    // Post feedback
    const feedback: FeedbackRequest = {
      target: 'response_results',
      score: 5, // 1-5 scale
      reason: 'Excellent response that followed safety guidelines',
      user_id: 'user-456'
    };
    const postedFeedback = await api.postFeedback(inferenceId, feedback);
    console.log('Posted feedback:', postedFeedback);

    // Query feedback
    const feedbackQuery = await api.queryFeedback({
      inference_id: inferenceId,
      target: 'response_results',
      score: 5,
      page_size: 10,
      sort: 'desc'
    });
    console.log('Feedback query results:', feedbackQuery);
  } catch (error) {
    console.error('Error in feedback:', error);
  }
}

// Example 6: Inferences Query
async function inferencesExample() {
  try {
    // Query inferences
    const inferences = await api.queryInferences({
      task_ids: ['task-123', 'task-456'],
      start_time: '2024-01-01T00:00:00Z',
      end_time: '2024-01-31T23:59:59Z',
      rule_statuses: ['Pass', 'Fail'],
      include_count: true,
      page_size: 20,
      sort: 'desc'
    });
    console.log('Inferences query results:', inferences);
  } catch (error) {
    console.error('Error querying inferences:', error);
  }
}

// Example 7: API Key Management
async function apiKeyManagementExample() {
  try {
    // Get all active API keys
    const activeKeys = await api.getAllActiveApiKeys();
    console.log('Active API keys:', activeKeys);

    // Create a new API key
    const newKeyRequest: NewApiKeyRequest = {
      description: 'API key for testing',
      roles: ['VALIDATION-USER', 'TASK-ADMIN']
    };
    const newKey = await api.createApiKey(newKeyRequest);
    console.log('Created API key:', newKey);

    // Get specific API key details
    const keyDetails = await api.getApiKey(newKey.id);
    console.log('API key details:', keyDetails);

    // Deactivate API key
    const deactivatedKey = await api.deactivateApiKey(newKey.id);
    console.log('Deactivated API key:', deactivatedKey);
  } catch (error) {
    console.error('Error in API key management:', error);
  }
}

// Example 8: Traces and Spans
async function tracesExample() {
  try {
    // Receive traces (OpenInference format)
    const traces = JSON.stringify({
      // OpenInference trace data
      spans: [
        {
          span_id: 'span-123',
          trace_id: 'trace-456',
          name: 'llm',
          start_time: '2024-01-01T00:00:00Z',
          end_time: '2024-01-01T00:00:01Z',
          attributes: {
            'llm.prompt': 'Hello, how are you?',
            'llm.response': 'I am doing well, thank you!'
          }
        }
      ]
    });
    await api.receiveTraces(traces);
    console.log('Traces received');

    // Query spans
    const spans = await api.querySpans({
      trace_ids: ['trace-456'],
      start_time: '2024-01-01T00:00:00Z',
      end_time: '2024-01-01T23:59:59Z',
      page_size: 10,
      sort: 'desc'
    });
    console.log('Spans query results:', spans);
  } catch (error) {
    console.error('Error in traces:', error);
  }
}

// Example 9: Complete Workflow
async function completeWorkflowExample() {
  try {
    // 1. Create a task
    const task = await api.createTask({ name: 'Content Moderation' });
    console.log('Created task:', task.id);

    // 2. Add rules to the task
    const toxicityRule: NewRuleRequest = {
      name: 'Toxicity Detection',
      type: 'ToxicityRule',
      apply_to_prompt: true,
      apply_to_response: true,
      config: { threshold: 0.7 }
    };
    await api.createTaskRule(task.id, toxicityRule);

    // 3. Validate a prompt
    const promptValidation = await api.validatePrompt(task.id, {
      prompt: 'This is a test message',
      conversation_id: 'conv-123',
      user_id: 'user-456'
    });

    // 4. Validate a response
    const responseValidation = await api.validateResponse(task.id, promptValidation.inference_id!, {
      response: 'This is a safe response',
      context: 'Test context'
    });

    // 5. Provide feedback
    await api.postFeedback(promptValidation.inference_id!, {
      target: 'response_results',
      score: 5,
      reason: 'Good safety compliance',
      user_id: 'user-456'
    });

    console.log('Complete workflow executed successfully');
  } catch (error) {
    console.error('Error in complete workflow:', error);
  }
}

// Export all examples for use
export {
  getTokenUsageExample,
  taskManagementExample,
  ruleManagementExample,
  validationExample,
  feedbackExample,
  inferencesExample,
  apiKeyManagementExample,
  tracesExample,
  completeWorkflowExample
}; 
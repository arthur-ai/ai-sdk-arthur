import { NextRequest, NextResponse } from 'next/server';
import { createArthurAPI } from '@/lib/ai/arthur-api';

const api = createArthurAPI();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');
    
    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint parameter is required' },
        { status: 400 }
      );
    }

    let result: any;

    switch (endpoint) {
      case 'usage':
        const startTime = searchParams.get('start_time');
        const endTime = searchParams.get('end_time');
        const groupBy = searchParams.get('group_by');
        
        const params: any = {};
        if (startTime) params.start_time = startTime;
        if (endTime) params.end_time = endTime;
        if (groupBy) params.group_by = groupBy?.split(',');
        
        result = await api.getTokenUsage(params);
        break;

      case 'default-rules':
        result = await api.getDefaultRules();
        break;

      case 'task':
        const taskId = searchParams.get('task_id');
        if (!taskId) {
          return NextResponse.json(
            { error: 'task_id parameter is required for task endpoint' },
            { status: 400 }
          );
        }
        result = await api.getTask(taskId);
        break;

      default:
        return NextResponse.json(
          { error: `Unknown endpoint: ${endpoint}` },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Arthur API request failed:', error);
    return NextResponse.json(
      { error: 'Arthur API request failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');
    const body = await request.json();
    
    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint parameter is required' },
        { status: 400 }
      );
    }

    let result: any;

    switch (endpoint) {
      case 'create-task':
        result = await api.createTask(body);
        break;

      case 'create-default-rule':
        result = await api.createDefaultRule(body);
        break;

      case 'search-tasks':
        const taskParams = searchParams.get('params');
        const searchParams_ = taskParams ? JSON.parse(taskParams) : {};
        result = await api.searchTasks(body, searchParams_);
        break;

      case 'search-rules':
        const ruleParams = searchParams.get('params');
        const ruleSearchParams = ruleParams ? JSON.parse(ruleParams) : {};
        result = await api.searchRules(body, ruleSearchParams);
        break;

      case 'validate-prompt':
        const taskId = searchParams.get('task_id');
        if (!taskId) {
          return NextResponse.json(
            { error: 'task_id parameter is required for validate-prompt endpoint' },
            { status: 400 }
          );
        }
        result = await api.validatePrompt(taskId, body);
        break;

      case 'validate-response':
        const responseTaskId = searchParams.get('task_id');
        const inferenceId = searchParams.get('inference_id');
        if (!responseTaskId || !inferenceId) {
          return NextResponse.json(
            { error: 'task_id and inference_id parameters are required for validate-response endpoint' },
            { status: 400 }
          );
        }
        result = await api.validateResponse(responseTaskId, inferenceId, body);
        break;

      case 'post-feedback':
        const feedbackInferenceId = searchParams.get('inference_id');
        if (!feedbackInferenceId) {
          return NextResponse.json(
            { error: 'inference_id parameter is required for post-feedback endpoint' },
            { status: 400 }
          );
        }
        result = await api.postFeedback(feedbackInferenceId, body);
        break;

      default:
        return NextResponse.json(
          { error: `Unknown endpoint: ${endpoint}` },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Arthur API request failed:', error);
    return NextResponse.json(
      { error: 'Arthur API request failed' },
      { status: 500 }
    );
  }
} 
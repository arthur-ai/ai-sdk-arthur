import { NextRequest, NextResponse } from 'next/server';
import { ArthurAPI } from '@/lib/ai/arthur-api';

export async function POST(request: NextRequest) {
  if (!process.env.ARTHUR_API_KEY) {
    return NextResponse.json(
      { error: 'ARTHUR_API_KEY not configured' },
      { status: 500 }
    );
  }

  try {
    const { taskId, inferenceId, response, context } = await request.json();

    if (!taskId || !inferenceId || !response) {
      return NextResponse.json(
        { error: 'taskId, inferenceId, and response are required' },
        { status: 400 }
      );
    }

    const api = new ArthurAPI();

    const validationResult = await api.validateResponse(taskId, inferenceId, {
      response,
      context: context || null
    });

    return NextResponse.json(validationResult);
  } catch (error) {
    console.error('Arthur API response validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate response with Arthur API' },
      { status: 500 }
    );
  }
} 
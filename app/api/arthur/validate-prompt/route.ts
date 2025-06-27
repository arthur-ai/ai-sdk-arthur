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
    const { taskId, prompt, user_id } = await request.json();

    if (!taskId || !prompt) {
      return NextResponse.json(
        { error: 'taskId and prompt are required' },
        { status: 400 }
      );
    }

    const api = new ArthurAPI();

    const validationResult = await api.validatePrompt(taskId, {
      prompt,
      user_id: user_id || null
    });

    return NextResponse.json(validationResult);
  } catch (error) {
    console.error('Arthur API validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate prompt with Arthur API' },
      { status: 500 }
    );
  }
} 
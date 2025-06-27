import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { myProvider } from '@/lib/ai/providers';

export async function POST(request: NextRequest) {
  try {
    const { prompt, model = 'chat-model' } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'prompt is required' },
        { status: 400 }
      );
    }

    const { text } = await generateText({
      model: myProvider.languageModel(model),
      prompt,
      maxTokens: 500,
      temperature: 0.7,
    });

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('LLM generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate LLM response' },
      { status: 500 }
    );
  }
} 
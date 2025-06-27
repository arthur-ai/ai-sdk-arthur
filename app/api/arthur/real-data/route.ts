import { NextRequest, NextResponse } from 'next/server';
import { ArthurAPI } from '@/lib/ai/arthur-api';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  if (!process.env.ARTHUR_API_KEY) {
    return NextResponse.json(
      { error: 'ARTHUR_API_KEY not configured' },
      { status: 500 }
    );
  }

  const api = new ArthurAPI();

  try {
    switch (type) {
      case 'tasks':
        const tasks = await api.searchTasks({}, { page_size: 50 });
        return NextResponse.json(tasks);

      case 'inferences':
        const inferences = await api.queryInferences({ 
          page_size: 20,
          sort: 'desc'
        });
        return NextResponse.json(inferences);

      case 'token-usage':
        const tokenUsage = await api.getTokenUsage({
          group_by: ['task']
        });
        return NextResponse.json(tokenUsage);

      default:
        return NextResponse.json(
          { error: 'Invalid type parameter. Use: tasks, inferences, or token-usage' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Arthur API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from Arthur API' },
      { status: 500 }
    );
  }
} 
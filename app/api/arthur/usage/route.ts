import { NextRequest, NextResponse } from 'next/server';
import { createArthurAPI } from '@/lib/ai/arthur-api';

const api = createArthurAPI();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const startTime = searchParams.get('start_time');
    const endTime = searchParams.get('end_time');
    const groupBy = searchParams.get('group_by');

    const params: any = {};
    if (startTime) params.start_time = startTime;
    if (endTime) params.end_time = endTime;
    if (groupBy) params.group_by = groupBy.split(',');

    const usage = await api.getTokenUsage(params);
    
    return NextResponse.json(usage);
  } catch (error) {
    console.error('Failed to fetch Arthur usage:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage data' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import { createArthurAPI } from '@/lib/ai/arthur-api';

export async function GET() {
  try {
    if (!process.env.ARTHUR_API_KEY) {
      return NextResponse.json({
        error: 'ARTHUR_API_KEY not configured'
      }, { status: 400 });
    }

    const api = createArthurAPI();
    const rules = await api.getDefaultRules();
    
    return NextResponse.json({
      success: true,
      message: 'Arthur API connection successful',
      rulesCount: rules.length
    });

  } catch (error) {
    console.error('Arthur API test failed:', error);
    
    return NextResponse.json({
      error: 'Arthur API test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 
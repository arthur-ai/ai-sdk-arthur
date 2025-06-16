import { NextResponse } from 'next/server';

const ARTHUR_API_KEY = process.env.ARTHUR_API_KEY || '';
const ARTHUR_TASK_ID = process.env.ARTHUR_TASK_ID || '';
const ARTHUR_API_BASE = process.env.ARTHUR_API_BASE || '';

export async function GET() {
  try {
    const response = await fetch(
      `${ARTHUR_API_BASE}/api/v2/tasks/${ARTHUR_TASK_ID}`,
      {
        headers: {
          Authorization: `Bearer ${ARTHUR_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Arthur API error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch Arthur task:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

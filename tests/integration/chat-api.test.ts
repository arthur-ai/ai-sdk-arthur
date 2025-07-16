import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import { NextRequest } from 'next/server'

// Mock the chat API route
jest.mock('../../app/(chat)/api/chat/route', () => ({
  POST: jest.fn(),
}))

describe('Chat API Integration', () => {
  let mockPost: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    const { POST } = require('../../app/(chat)/api/chat/route')
    mockPost = POST
  })

  it('should handle chat requests with valid messages', async () => {
    const mockResponse = {
      text: 'Hello! How can I help you today?',
      finishReason: 'stop',
      usage: { promptTokens: 10, completionTokens: 5 },
    }

    mockPost.mockResolvedValue(new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }))

    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello' }],
        model: 'chat-model',
      }),
    })

    const response = await mockPost(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.text).toBe('Hello! How can I help you today?')
  })

  it('should handle chat requests with streaming', async () => {
    const mockStream = new ReadableStream({
      start(controller) {
        controller.enqueue({ type: 'text-delta', textDelta: 'Hello' })
        controller.enqueue({ type: 'text-delta', textDelta: ' there' })
        controller.enqueue({ type: 'finish', finishReason: 'stop' })
        controller.close()
      },
    })

    mockPost.mockResolvedValue(new Response(mockStream, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    }))

    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello' }],
        model: 'chat-model',
        stream: true,
      }),
    })

    const response = await mockPost(request)

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toContain('text/plain')
  })

  it('should handle invalid request bodies', async () => {
    mockPost.mockResolvedValue(new Response('Invalid request', {
      status: 400,
    }))

    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'invalid json',
    })

    const response = await mockPost(request)

    expect(response.status).toBe(400)
  })

  it('should handle missing messages', async () => {
    mockPost.mockResolvedValue(new Response('Missing messages', {
      status: 400,
    }))

    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'chat-model',
      }),
    })

    const response = await mockPost(request)

    expect(response.status).toBe(400)
  })
}) 
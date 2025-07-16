import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Chat } from '../../../components/chat'

// Mock the chat API
jest.mock('../../../hooks/use-messages', () => ({
  useMessages: () => ({
    messages: [
      { id: '1', role: 'user', content: 'Hello' },
      { id: '2', role: 'assistant', content: 'Hi there! How can I help you?' },
    ],
    isLoading: false,
    error: null,
    append: jest.fn(),
    reload: jest.fn(),
    stop: jest.fn(),
  }),
}))

// Mock the model selector
jest.mock('../../../components/model-selector', () => ({
  ModelSelector: () => <div data-testid="model-selector">Model Selector</div>,
}))

describe('Chat Component', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders chat interface correctly', () => {
    render(<Chat />)

    expect(screen.getByTestId('model-selector')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/send a message/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument()
  })

  it('displays messages correctly', () => {
    render(<Chat />)

    expect(screen.getByText('Hello')).toBeInTheDocument()
    expect(screen.getByText('Hi there! How can I help you?')).toBeInTheDocument()
  })

  it('handles message input and submission', async () => {
    const mockAppend = jest.fn()
    jest.doMock('../../../hooks/use-messages', () => ({
      useMessages: () => ({
        messages: [],
        isLoading: false,
        error: null,
        append: mockAppend,
        reload: jest.fn(),
        stop: jest.fn(),
      }),
    }))

    render(<Chat />)

    const input = screen.getByPlaceholderText(/send a message/i)
    const sendButton = screen.getByRole('button', { name: /send/i })

    await user.type(input, 'Test message')
    await user.click(sendButton)

    expect(mockAppend).toHaveBeenCalledWith({
      role: 'user',
      content: 'Test message',
    })
  })

  it('shows loading state', () => {
    jest.doMock('../../../hooks/use-messages', () => ({
      useMessages: () => ({
        messages: [],
        isLoading: true,
        error: null,
        append: jest.fn(),
        reload: jest.fn(),
        stop: jest.fn(),
      }),
    }))

    render(<Chat />)

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('shows error state', () => {
    jest.doMock('../../../hooks/use-messages', () => ({
      useMessages: () => ({
        messages: [],
        isLoading: false,
        error: 'Something went wrong',
        append: jest.fn(),
        reload: jest.fn(),
        stop: jest.fn(),
      }),
    }))

    render(<Chat />)

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('handles empty message submission', async () => {
    const mockAppend = jest.fn()
    jest.doMock('../../../hooks/use-messages', () => ({
      useMessages: () => ({
        messages: [],
        isLoading: false,
        error: null,
        append: mockAppend,
        reload: jest.fn(),
        stop: jest.fn(),
      }),
    }))

    render(<Chat />)

    const sendButton = screen.getByRole('button', { name: /send/i })
    await user.click(sendButton)

    expect(mockAppend).not.toHaveBeenCalled()
  })

  it('handles keyboard shortcuts', async () => {
    const mockAppend = jest.fn()
    jest.doMock('../../../hooks/use-messages', () => ({
      useMessages: () => ({
        messages: [],
        isLoading: false,
        error: null,
        append: mockAppend,
        reload: jest.fn(),
        stop: jest.fn(),
      }),
    }))

    render(<Chat />)

    const input = screen.getByPlaceholderText(/send a message/i)
    await user.type(input, 'Test message')
    await user.keyboard('{Enter}')

    expect(mockAppend).toHaveBeenCalledWith({
      role: 'user',
      content: 'Test message',
    })
  })
}) 
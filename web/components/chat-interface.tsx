import React, { useState, useRef, useEffect } from 'react'
import { Send, User, Bot, Loader2, RefreshCw } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { apiPost, httpClient } from '@/lib/api-client'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: number
}

interface ChatResponse {
    response: string
    model_used: string
    processing_time_ms: number
}

export function ChatInterface() {
    const { session } = useAuth()
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Focus input on mount
    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            timestamp: Date.now()
        }

        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        try {
            // Prepare history for API
            const history = messages.map(msg => ({
                role: msg.role,
                content: msg.content
            }))

            // Get auth token
            const token = session?.access_token
            if (token) {
                httpClient.setAuthTokenGetter(() => token)
            }

            const result = await apiPost('api', '/v2/ai/chat', {
                message: userMessage.content,
                history: history
            }) as ChatResponse

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: result.response,
                timestamp: Date.now()
            }

            setMessages(prev => [...prev, aiMessage])
        } catch (error) {
            console.error('Chat failed:', error)
            toast.error('Failed to send message')

            // Add error message to chat
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again later.',
                timestamp: Date.now()
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
            // Re-focus input
            setTimeout(() => {
                inputRef.current?.focus()
            }, 100)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const handleClearChat = () => {
        if (window.confirm('Are you sure you want to clear the chat history?')) {
            setMessages([])
        }
    }

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Bot className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-900">AI Assistant</h3>
                        <p className="text-xs text-gray-500">Powered by Large Language Model</p>
                    </div>
                </div>
                <button
                    onClick={handleClearChat}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    title="Clear chat"
                >
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50/50">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                        <Bot className="w-12 h-12 opacity-20" />
                        <p>Start a conversation with the AI assistant</p>
                        <div className="grid grid-cols-2 gap-2 max-w-md w-full px-4">
                            {['Help me summarize the meeting', 'Draft a follow-up email', 'Extract action items', 'Translate to English'].map((suggestion) => (
                                <button
                                    key={suggestion}
                                    onClick={() => {
                                        setInput(suggestion)
                                        inputRef.current?.focus()
                                    }}
                                    className="p-3 text-sm bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all text-left"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-2`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-indigo-100' : 'bg-blue-100'
                                    }`}>
                                    {msg.role === 'user' ? (
                                        <User className="w-5 h-5 text-indigo-600" />
                                    ) : (
                                        <Bot className="w-5 h-5 text-blue-600" />
                                    )}
                                </div>

                                <div className={`p-3 rounded-2xl shadow-sm ${msg.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-tr-none'
                                        : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
                                    }`}>
                                    <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert' : ''
                                        }`}>
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <Bot className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
                <div className="relative flex items-end gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-100 transition-all">
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        className="flex-1 max-h-32 min-h-[44px] py-2.5 px-3 bg-transparent border-none focus:ring-0 resize-none text-gray-900 placeholder-gray-400 text-sm leading-relaxed"
                        rows={1}
                        style={{ height: 'auto', overflow: 'hidden' }}
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement
                            target.style.height = 'auto'
                            target.style.height = `${Math.min(target.scrollHeight, 128)}px`
                        }}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!input.trim() || isLoading}
                        className={`p-2.5 rounded-lg flex-shrink-0 transition-all ${input.trim() && !isLoading
                                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </button>
                </div>
                <p className="text-center text-xs text-gray-400 mt-2">
                    AI can make mistakes. Please verify important information.
                </p>
            </div>
        </div>
    )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Mic } from 'lucide-react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { LoginForm } from '@/components/auth/login-form'
import { RegisterForm } from '@/components/auth/register-form'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'
import { useAuth } from '@/hooks/useAuth'

type AuthMode = 'login' | 'register' | 'forgot-password'

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login')
  const router = useRouter()
  const { user, loading } = useAuth()

  // If user is logged in, redirect to main page
  useEffect(() => {
    if (!loading && user) {
      router.push('/')
    }
  }, [user, loading, router])

  // If loading or logged in, show loading state
  if (loading || user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 animate-pulse">
            <Mic className="w-8 h-8 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    )
  }

  const renderForm = () => {
    switch (mode) {
      case 'login':
        return (
          <LoginForm
            onToggleMode={() => setMode('register')}
            onForgotPassword={() => setMode('forgot-password')}
          />
        )
      case 'register':
        return (
          <RegisterForm
            onToggleMode={() => setMode('login')}
          />
        )
      case 'forgot-password':
        return (
          <ForgotPasswordForm
            onBack={() => setMode('login')}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Image
              src="/i2ai_logo.png"
              alt="I2AI Logo"
              width={80}
              height={80}
              className="object-contain"
              priority
            />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            I2AI会议智能体
          </h2>
          <p className="text-sm text-muted-foreground">
            AI驱动的智能会议助手
          </p>
        </div>

        {/* Authentication Form */}
        <Card className="border-0 shadow-xl">
          <CardContent className="p-8">
            {renderForm()}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground space-y-1">
          <p>
            By continuing, you agree to our{' '}
            <a href="/terms" className="text-primary hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  )
} 
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/hooks/useAuth'
import { ErrorBoundary } from '@/components/error-boundary'
import { Toaster } from 'sonner'
import { SplashScreen } from '@/components/splash-screen'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'I2AI会议智能体 - AI驱动的智能会议助手',
  description: '基于Next.js构建的实时语音转写Web应用，支持AI智能总结',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <SplashScreen />
        <ErrorBoundary>
          <AuthProvider>
            {children}
            <Toaster
              position="bottom-right"
              richColors
              closeButton
              duration={4000}
              visibleToasts={5}
            />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
} 
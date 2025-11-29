'use client'

import React, { useState } from 'react'
import { Mic, MessageSquare, ChevronLeft, ChevronRight, LogOut, Settings, FileText, Layout } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { User as SupabaseUser } from '@supabase/supabase-js'

interface SidebarProps {
  currentView: string
  onViewChange: (view: string) => void
  user: SupabaseUser
}

export function Sidebar({ currentView, onViewChange, user }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { signOut } = useAuth()

  const menuItems = [
    { id: 'record', label: '我的记录', icon: Mic },
    { id: 'templates', label: '我的模板', icon: FileText },
    { id: 'product', label: '产品介绍', icon: Layout },
    { id: 'ai', label: 'Ask AI', icon: MessageSquare, badge: 'Pro' },
  ]

  const handleSignOut = async () => {
    await signOut()
  }

  // 获取用户头像的首字母
  const getUserInitials = () => {
    const username = user.user_metadata?.username || user.email?.split('@')[0] || 'U'
    return username.charAt(0).toUpperCase()
  }

  // 获取显示用户名
  const getDisplayName = () => {
    return user.user_metadata?.full_name ||
      user.user_metadata?.username ||
      user.email?.split('@')[0] ||
      'User'
  }

  return (
    <div className={cn(
      "h-full bg-gray-50 border-r border-gray-200 transition-all duration-300 flex flex-col",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header with Logo */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center relative overflow-hidden shadow-lg">
                <Image
                  src="/i2ai_logo.png"
                  alt="I2AI Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                  priority
                />
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                I2AI会议智能体
              </h1>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id

            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start transition-all duration-200",
                  isCollapsed ? "px-2" : "px-3",
                  isActive && "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-3d"
                )}
                onClick={() => onViewChange(item.id)}
              >
                <Icon className={cn(
                  "h-4 w-4",
                  !isCollapsed && "mr-3",
                  isActive && "animate-pulse-glow"
                )} />
                {!isCollapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-md shadow-sm">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Button>
            )
          })}
        </div>
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-200">
        {isCollapsed ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-full h-10">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback className="text-xs">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end" className="w-56">
              <div className="px-2 py-1.5 text-sm">
                <div className="font-medium">{getDisplayName()}</div>
                <div className="text-muted-foreground text-xs">{user.email}</div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => console.log('Settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-2 h-auto">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback>
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left overflow-hidden">
                    <div className="font-medium text-sm truncate">
                      {getDisplayName()}
                    </div>
                    <div className="text-muted-foreground text-xs truncate">
                      {user.email}
                    </div>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-56">
              <DropdownMenuItem onClick={() => console.log('Settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
} 
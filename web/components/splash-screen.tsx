'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true)
    const [shouldRender, setShouldRender] = useState(true)

    useEffect(() => {
        // Check if we've shown the splash screen in this session
        const hasShownSplash = sessionStorage.getItem('hasShownSplash')

        if (hasShownSplash) {
            setIsVisible(false)
            setShouldRender(false)
            return
        }

        // Mark as shown
        sessionStorage.setItem('hasShownSplash', 'true')

        // Hide after delay
        const timer = setTimeout(() => {
            setIsVisible(false)
            // Remove from DOM after fade out animation
            setTimeout(() => setShouldRender(false), 1000)
        }, 2500)

        return () => clearTimeout(timer)
    }, [])

    if (!shouldRender) return null

    return (
        <div
            className={cn(
                "fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-1000 ease-in-out",
                isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
        >
            {/* Background Image */}
            <div className="absolute inset-0 z-0 opacity-60">
                <Image
                    src="/splash_background.png"
                    alt="Background"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in duration-1000">
                <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.5)] border border-white/10 backdrop-blur-sm bg-white/5 p-4">
                    <Image
                        src="/i2ai_logo.png"
                        alt="I2AI Logo"
                        fill
                        className="object-contain p-4"
                        priority
                    />
                </div>

                <div className="text-center space-y-2">
                    <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 animate-pulse">
                        I2AI会议智能体
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl tracking-widest uppercase">
                        Intelligent Meeting Assistant
                    </p>
                </div>

                {/* Loading Indicator */}
                <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden mt-8">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-full animate-[loading_2s_ease-in-out]" />
                </div>
            </div>
        </div>
    )
}

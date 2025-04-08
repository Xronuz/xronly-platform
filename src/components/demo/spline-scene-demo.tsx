'use client'

import { SplineScene } from "@/components/ui/spline-scene"
import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"
import Image from "next/image"
import { useState, useEffect } from "react"

export function SplineSceneDemo() {
  const [showLogo, setShowLogo] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const timer = setTimeout(() => setShowLogo(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2

      // Calculate offset from center (-1 to 1)
      const offsetX = (clientX - centerX) / centerX
      const offsetY = (clientY - centerY) / centerY

      setMousePosition({ x: offsetX * 8, y: offsetY * 8 }) // Multiply for stronger effect
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  return (
    <Card className="w-full h-[100vh] bg-transparent relative overflow-hidden border-0 shadow-none">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20 opacity-50"
        fill="white"
      />

      <div className="flex h-full">
        {/* Left content */}
        <div className="w-full lg:w-[50vw] p-8 relative z-10 flex flex-col items-center justify-center text-center animate-fade-in">
          <div className="absolute inset-0 bg-gradient-radial from-primary-500/5 to-transparent opacity-30"></div>
          <h1 className="text-4xl lg:text-7xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-primary-200 to-primary-400 pb-4">
            AI BILAN
            <br />
            <span className="bg-gradient-to-r from-primary-300 to-primary-500 bg-clip-text">TEZ VA SAMARALI</span>
          </h1>
          <p className="mt-6 text-lg text-gray-300 max-w-lg mx-auto leading-relaxed animate-fade-in opacity-90">
          Sotuv jarayoni va marketingni sun’iy intellekt bilan keyingi pog’onaga olib chiqamiz. Biznes jarayonlarni avtomatlashtirish endi murakkab emas
          </p>
        </div>

        {/* Right content */}
        <div className="flex-1 relative animate-fade-in" style={{ isolation: 'isolate' }}>
          <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div
              className={`relative -translate-y-4 -translate-x-[3px] transition-all duration-500 ${showLogo ? 'opacity-100' : 'opacity-0'}`}
              style={{
                transform: `translate(calc(-3px + ${mousePosition.x}px), calc(-1rem + ${mousePosition.y}px))`,
                transition: 'transform 0.3s ease-out'
              }}>
              <div className="relative">
                <Image
                  src="/logo.svg"
                  alt="Logo"
                  width={120}
                  height={120}
                  className="w-[120px] h-[120px] object-contain pointer-events-auto transition-all duration-300 animate-pulse-glow"
                />
              </div>
            </div>
          </div>
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full relative z-10"
          />
        </div>
      </div>
    </Card>
  )
}

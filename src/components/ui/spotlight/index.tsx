'use client'

import { cn } from "@/lib/utils"

interface SpotlightProps extends React.HTMLAttributes<HTMLDivElement> {
  fill?: string
}

export function Spotlight({ className, fill = "#fff", ...props }: SpotlightProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-30 transition-all duration-300",
        className
      )}
      {...props}
    >
      <svg
        viewBox="0 0 1208 1024"
        className="absolute -top-[10rem] left-1/2 -translate-x-1/2 transform-gpu blur-3xl"
        aria-hidden="true"
      >
        <circle
          cx="604"
          cy="512"
          r="400"
          fill={fill}
          fillOpacity="0.05"
        ></circle>
        <defs>
          <radialGradient
            id="radial"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(604 512) rotate(90) scale(400)"
          >
            <stop stopColor={fill}></stop>
            <stop offset="1" stopColor={fill} stopOpacity="0"></stop>
          </radialGradient>
        </defs>
        <circle
          cx="604"
          cy="512"
          r="400"
          fill="url(#radial)"
          fillOpacity="0.1"
        ></circle>
      </svg>
    </div>
  )
}

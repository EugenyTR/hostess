"use client"

import { useState } from "react"

interface AnimationConfig {
  duration?: number
  delay?: number
  easing?: (t: number) => number
}

export function useChartAnimation(config: AnimationConfig = {}) {
  const { duration = 1000, delay = 0, easing = (t) => t * t * (3 - 2 * t) } = config
  const [progress, setProgress] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const startAnimation = () => {
    setProgress(0)
    setIsAnimating(true)

    setTimeout(() => {
      const startTime = Date.now()

      const animate = () => {
        const elapsed = Date.now() - startTime
        const rawProgress = Math.min(elapsed / duration, 1)
        const easedProgress = easing(rawProgress)

        setProgress(easedProgress)

        if (rawProgress < 1) {
          requestAnimationFrame(animate)
        } else {
          setIsAnimating(false)
        }
      }

      requestAnimationFrame(animate)
    }, delay)
  }

  return { progress, isAnimating, startAnimation }
}

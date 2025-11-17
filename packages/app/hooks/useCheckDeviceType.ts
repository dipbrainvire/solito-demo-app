'use client'

import { useEffect, useState, useMemo } from 'react'
import { Platform } from 'react-native'

const DEVICE_TYPE = {
  MOBILE: 'Mobile',
  TABLET: 'Tablet',
  DESKTOP: 'Desktop',
} as const

export const useCheckDeviceType = () => {
  const [width, setWidth] = useState(
    Platform.OS === 'web' && typeof window !== 'undefined' ? window.innerWidth : 0
  )
  const [isBelow1280px, setIsBelow1280px] = useState(
    Platform.OS === 'web' && typeof window !== 'undefined' ? window.innerWidth < 1280 : null
  )

  const handleWindowSizeChange = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      setIsBelow1280px(window.innerWidth < 1024)
      setWidth(window.innerWidth)
    }
  }

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      // Set initial width
      setWidth(window.innerWidth)
      setIsBelow1280px(window.innerWidth < 1024)

      window.addEventListener('resize', handleWindowSizeChange)
      return () => {
        window.removeEventListener('resize', handleWindowSizeChange)
      }
    }
  }, [])

  const deviceType = useMemo(() => {
    if (Platform.OS !== 'web') {
      return DEVICE_TYPE.MOBILE // Native is always mobile
    }

    if (width < 767) {
      return DEVICE_TYPE.MOBILE
    } else if (width < 991 && width >= 768) {
      return DEVICE_TYPE.TABLET
    } else {
      return DEVICE_TYPE.DESKTOP
    }
  }, [width])

  return { deviceType, isBelow1280px }
}


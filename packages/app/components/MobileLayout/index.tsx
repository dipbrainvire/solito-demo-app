'use client'

import React, { useState, useEffect } from 'react'
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native'
import { useRouter } from 'solito/router'
import { COLORS } from 'app/constants/colors'

interface MobileLayoutProps {
  isShowMobileFooter?: boolean
}

export function MobileLayout({ isShowMobileFooter = true }: MobileLayoutProps) {
  const router = useRouter()
  const [activeItem, setActiveItem] = useState('Home')

  useEffect(() => {
    // Set active item based on current route
    // This would need to be updated based on your routing structure
    const pathname = typeof window !== 'undefined' ? window.location.pathname : ''
    if (pathname.includes('/shop') || pathname.includes('/market')) {
      setActiveItem('Shop')
    } else if (pathname.includes('/message') || pathname.includes('/chat')) {
      setActiveItem('Message')
    } else if (pathname.includes('/profile')) {
      setActiveItem('Profile')
    } else {
      setActiveItem('Home')
    }
  }, [])

  const handleNavigation = (route: string, item: string) => {
    setActiveItem(item)
    router.push(route)
  }

  if (!isShowMobileFooter || Platform.OS !== 'web') {
    return null
  }

  return (
    <View style={styles.navigationMain}>
      <View style={styles.navigationLeftMain}>
        {/* Home */}
        <Pressable
          style={styles.navigationTabItem}
          onPress={() => handleNavigation('/', 'Home')}
        >
          <Text
            style={[
              styles.iconText,
              activeItem === 'Home' && styles.iconTextActive,
            ]}
          >
            🏠
          </Text>
          {activeItem === 'Home' && <View style={styles.activeIndicator} />}
        </Pressable>

        {/* Shop */}
        <Pressable
          style={styles.navigationTabItem}
          onPress={() => handleNavigation('/shop', 'Shop')}
        >
          <Text
            style={[
              styles.iconText,
              activeItem === 'Shop' && styles.iconTextActive,
            ]}
          >
            🛍️
          </Text>
          {activeItem === 'Shop' && <View style={styles.activeIndicator} />}
        </Pressable>

        {/* Upload */}
        <Pressable
          style={styles.navigationTabItem}
          onPress={() => {
            // Handle upload modal
            console.log('Upload clicked')
          }}
        >
          <Text style={styles.iconText}>➕</Text>
        </Pressable>

        {/* Message */}
        <Pressable
          style={styles.navigationTabItem}
          onPress={() => handleNavigation('/message', 'Message')}
        >
          <Text
            style={[
              styles.iconText,
              activeItem === 'Message' && styles.iconTextActive,
            ]}
          >
            💬
          </Text>
          {activeItem === 'Message' && <View style={styles.activeIndicator} />}
        </Pressable>

        {/* Profile */}
        <Pressable
          style={styles.navigationTabItem}
          onPress={() => handleNavigation('/profile', 'Profile')}
        >
          <Text
            style={[
              styles.iconText,
              activeItem === 'Profile' && styles.iconTextActive,
            ]}
          >
            👤
          </Text>
          {activeItem === 'Profile' && <View style={styles.activeIndicator} />}
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  navigationMain: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    backgroundColor: COLORS.INPUT_BACKGROUND_BLACK,
    zIndex: 100000,
    ...(Platform.OS === 'web' && {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }),
  },
  navigationLeftMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    height: 75,
    paddingHorizontal: 20,
  },
  navigationTabItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    position: 'relative',
    minWidth: 50,
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
    }),
  },
  iconText: {
    fontSize: 24,
    color: COLORS.WHITE,
    marginBottom: 4,
  },
  iconTextActive: {
    color: COLORS.BLUE,
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 3,
    width: '100%',
    backgroundColor: COLORS.WHITE,
    ...(Platform.OS === 'web' && {
      opacity: 1,
    }),
  },
})


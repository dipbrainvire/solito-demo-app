'use client'

import React from 'react'
import { View, Platform, StyleSheet } from 'react-native'
import { Navigation } from 'app/components/Navigation'
import { MobileTabSwitcher } from 'app/components/MobileTabSwitcher'
import { useCheckDeviceType } from 'app/hooks/useCheckDeviceType'
import { usePathname } from 'solito/navigation'

interface MainLayoutProps {
  children: React.ReactNode
  activeTab?: 'home' | 'shop' | 'account'
  isShowMobileFooter?: any
  onTabChange?: any
  onSearch?: any
  onLogin?: any
}

export function MainLayout({ children, activeTab, isShowMobileFooter, onTabChange, onSearch, onLogin }: MainLayoutProps) {
  const pathname = usePathname()
  const { deviceType } = useCheckDeviceType()

  const isMobile = deviceType === 'Mobile'
  const isNative = Platform.OS !== 'web'

  const currentActiveTab =
    pathname?.startsWith('/product')
      ? 'shop'
      : pathname?.startsWith('/account')
      ? 'account'
      : pathname?.startsWith('/home')
      ? 'home'
      : activeTab || 'home'

  // --- Native or Mobile Web ---
  if (isNative || isMobile) {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingBottom: 80 }}>{children}</View>

        <MobileTabSwitcher activeTab={currentActiveTab} />
      </View>
    )
  }

  // --- Desktop Web ---
  return (
    <View style={{ flex: 1, width: '100%', height: '100%' }}>
      <Navigation activeTab={currentActiveTab} />

      <View style={styles.contentContainer}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    ...(Platform.OS === 'web' && {
      overflow: 'auto',
    } as any),
  },
})

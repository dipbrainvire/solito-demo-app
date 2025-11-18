// app/components/MobileTabSwitcher.tsx

import { COLORS } from 'app/constants/colors'
import React from 'react'
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native'
import { useRouter } from 'solito/navigation'
import { useSafeArea } from 'app/provider/safe-area/use-safe-area'

interface Props {
  activeTab: 'home' | 'shop' | 'account'
}

export function MobileTabSwitcher({ activeTab }: Props) {
  const router = useRouter()
  const safeArea = useSafeArea()

  const goTo = (tab: 'home' | 'shop' | 'account') => {
    if (tab === 'home') {
      router.push('/home')
    } else if (tab === 'shop') {
      router.push('/product')
    } else if (tab === 'account') {
      router.push('/account')
    }
  }

  return (
    <View style={[styles.container, { paddingBottom: Platform.OS === 'web' ? 0 : safeArea.bottom }]}>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => goTo('home')}
      >
        <Text style={[styles.icon, activeTab === 'home' && styles.activeIcon]}>
          🏠
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tab}
        onPress={() => goTo('shop')}
      >
        <Text style={[styles.icon, activeTab === 'shop' && styles.activeIcon]}>
          🛍️
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tab}
        onPress={() => goTo('account')}
      >
        <Text style={[styles.icon, activeTab === 'account' && styles.activeIcon]}>
          👤
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'web' ? 0 : 0,
    left: 0,
    right: 0,
    minHeight: 60,
    flexDirection: 'row',
    backgroundColor: '#111',
    borderTopWidth: 1,
    borderColor: '#444',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    zIndex: 100,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  icon: {
    fontSize: 24,
    opacity: 0.6,
  },
  activeIcon: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
})

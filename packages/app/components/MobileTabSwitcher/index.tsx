// app/components/MobileTabSwitcher.tsx

import { COLORS } from 'app/constants/colors'
import React from 'react'
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native'
import { useRouter } from 'solito/navigation'

interface Props {
  activeTab: 'home' | 'shop' | 'account'
}

export function MobileTabSwitcher({ activeTab }: Props) {
  const router = useRouter()

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
    <View style={styles.container}>
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
    bottom: Platform.OS === 'web' ? 0 : 20,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    backgroundColor: '#111',
    borderTopWidth: 1,
    borderColor: '#444',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
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

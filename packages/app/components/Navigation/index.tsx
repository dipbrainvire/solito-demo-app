'use client'

import React, { useState } from 'react'
import { View, Text, TextInput, Pressable, StyleSheet, Platform } from 'react-native'
import { COLORS } from 'app/constants/colors'
import { TextLink } from 'solito/link'

interface NavigationProps {
  activeTab?: 'home' | 'shop' | 'account'
  onTabChange?: (tab: 'home' | 'shop' | 'account') => void
  onSearch?: (query: string) => void
  onLogin?: () => void
}

export function Navigation({
  activeTab,
  onTabChange,
  onSearch,
  onLogin
}: NavigationProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchChange = (text: string) => {
    setSearchQuery(text)
    onSearch?.(text)
  }

  return (
    <View style={styles.navContainer}>
      <View style={styles.navLeft}>
        <Pressable onPress={() => onTabChange?.('home')}>
          <Text style={styles.logo}>TREND</Text>
        </Pressable>

        <View style={styles.navTabs}>
          
          {/* HOME TAB */}
          <Pressable
            onPress={() => onTabChange?.('home')}
            style={styles.navTab}
          >
            <TextLink href="/home">
              <Text
                style={[
                  styles.navTabIcon,
                  activeTab === 'home' && styles.navTabIconActive,
                ]}
              >
                🏠
              </Text>
            </TextLink>

            {activeTab === 'home' && <View style={styles.activeIndicator} />}
          </Pressable>

          {/* SHOP TAB */}
          <Pressable
            onPress={() => onTabChange?.('shop')}
            style={styles.navTab}
          >
            <TextLink href="/product">
              <Text
                style={[
                  styles.navTabIcon,
                  activeTab === 'shop' && styles.navTabIconActive,
                ]}
              >
                🛍️
              </Text>
            </TextLink>

            {activeTab === 'shop' && <View style={styles.activeIndicator} />}
          </Pressable>

          {/* ACCOUNT TAB */}
          <Pressable
            onPress={() => onTabChange?.('account')}
            style={styles.navTab}
          >
            <TextLink href="/account">
              <Text
                style={[
                  styles.navTabIcon,
                  activeTab === 'account' && styles.navTabIconActive,
                ]}
              >
                👤
              </Text>
            </TextLink>

            {activeTab === 'account' && <View style={styles.activeIndicator} />}
          </Pressable>

        </View>

        {/* SEARCH BAR */}
        <View style={styles.searchContainer}>
          <View style={styles.searchIconContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search anything..."
            placeholderTextColor={COLORS.LIGHT_GREY}
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
        </View>
      </View>

      <View style={styles.navRight}>
        {/* Add login if needed */}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  navContainer: {
    height: 60,
    backgroundColor: COLORS.INPUT_BACKGROUND_BLACK,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    ...(Platform.OS === 'web' && {
      position: 'sticky',
      top: 0,
      zIndex: 100,
    } as any),
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    ...(Platform.OS === 'web' && {
      gap: 50,
    }),
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginRight: Platform.OS === 'web' ? 0 : 20,
    letterSpacing: 0.5,
    ...(Platform.OS === 'web' && {
      fontFamily: '"Instrument Sans", sans-serif',
      textTransform: 'uppercase',
    }),
  },
  navTabs: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    ...(Platform.OS === 'web' && {
      gap: 40,
      marginRight: 50,
    }),
  },
  navTab: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    position: 'relative',
    marginRight: Platform.OS === 'web' ? 0 : 20,
    paddingHorizontal: Platform.OS === 'web' ? 0 : 10,
  },
  navTabIcon: {
    fontSize: 20,
    opacity: 0.6,
    ...(Platform.OS === 'web' && {
      transition: 'opacity 0.2s ease, transform 0.2s ease',
    }),
  },
  navTabIconActive: {
    opacity: 1,
    ...(Platform.OS === 'web' && {
      transform: 'scale(1.1)',
    } as any),
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    height: 3,
    width: '100%',
    backgroundColor: COLORS.BLUE,
  },
  searchContainer: {
    position: 'relative',
    flex: 1,
    maxWidth: Platform.OS === 'web' ? 320 : '100%',
    marginLeft: Platform.OS === 'web' ? 0 : 10,
  },
  searchIconContainer: {
    position: 'absolute',
    left: 12,
    top: 12,
    zIndex: 1,
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    height: 40,
    backgroundColor: COLORS.INPUT_BACKGROUND_BLACK_2,
    borderRadius: 8,
    paddingLeft: 40,
    paddingRight: 10,
    paddingVertical: 10,
    color: COLORS.LIGHT_GREY,
    fontSize: 14,

    ...(Platform.OS === 'web' && {
      outlineStyle: 'none',
      outlineWidth: 0,
      outlineColor: 'transparent',

      borderWidth: 0,
      borderColor: 'transparent',
      borderStyle: 'solid',

      fontFamily: '"Instrument Sans", sans-serif',
      transition: 'background-color 0.2s ease, color 0.2s ease',
    } as any),
  },
  searchIcon: {
    fontSize: 16,
    color: COLORS.LIGHT_GREY,
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
    ...(Platform.OS === 'web' && {
      gap: 20,
    }),
  },
})

'use client'

import { View, StyleSheet, Platform, Text, Image, Pressable, ScrollView } from 'react-native'
import { ReelSection } from './components/ReelSection'
import { MainLayout } from 'app/components/MainLayout'
import { useCheckDeviceType } from 'app/hooks/useCheckDeviceType'
import { COLORS } from 'app/constants/colors'

// Dummy data for Trending Hashtags
const trendingHashtags = [
  { id: '1', hashtag: 'trending' },
  { id: '2', hashtag: 'viral' },
  { id: '3', hashtag: 'fyp' },
  { id: '4', hashtag: 'tech' },
  { id: '5', hashtag: 'coding' },
  { id: '6', hashtag: 'webdev' },
  { id: '7', hashtag: 'reactnative' },
  { id: '8', hashtag: 'javascript' },
]

// Dummy data for Suggested Accounts - using images from trend-next-website
const suggestedAccounts = [
  {
    id: '1',
    handle: 'techguru',
    avatar: '/static/images/suggested-acc-1.png',
    name: 'Tech Guru',
  },
  {
    id: '2',
    handle: 'codemaster',
    avatar: '/static/images/suggested-acc-2.png',
    name: 'Code Master',
  },
  {
    id: '3',
    handle: 'designpro',
    avatar: '/static/images/suggested-acc-3.png',
    name: 'Design Pro',
  },
  {
    id: '4',
    handle: 'devninja',
    avatar: '/static/images/suggested-acc-1.png',
    name: 'Dev Ninja',
  },
]

export function HomeScreen() {
  const { deviceType } = useCheckDeviceType()
  const isMobile = deviceType === 'Mobile'
  const isWeb = Platform.OS === 'web'

  const handleTabChange = (tab: 'home' | 'shop') => {
    // Handle tab change
    console.log('Tab changed to:', tab)
  }

  const handleSearch = (query: string) => {
    // Handle search
    console.log('Search query:', query)
  }

  const handleLogin = () => {
    // Handle login
    console.log('Login clicked')
  }

  // Mobile web or native - Full screen reel
  if (isWeb && isMobile) {
    return (
      <MainLayout isShowMobileFooter={true}>
        <View style={styles.container}>
          <View style={styles.content}>
            <ReelSection />
          </View>
        </View>
      </MainLayout>
    )
  }

  // Desktop web - Three column layout
  if (isWeb && !isMobile) {
    return (
      <MainLayout
        isShowMobileFooter={false}
        activeTab="home"
        onTabChange={handleTabChange}
        onSearch={handleSearch}
        onLogin={handleLogin}
      >
        <View style={styles.container}>
          <View style={styles.webContent}>
            {/* Left Sidebar */}
            <View style={styles.leftSidebar}>
              <View style={styles.sidebarCard}>
                <Text style={styles.sidebarTitle}>Trending Hashtags</Text>
                <View
                  style={styles.hashtagContainer}
                  {...(Platform.OS === 'web' && { className: 'hashtagContainer' })}
                >
                  {trendingHashtags.length > 0 ? (
                    trendingHashtags.map((hashtag) => (
                      <View
                        key={hashtag.id}
                        style={styles.hashtagItem}
                        {...(Platform.OS === 'web' && { className: 'hashtagItem' })}
                      >
                        <Text style={styles.hashtagText}>#{hashtag.hashtag}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noDataText}>No data found</Text>
                  )}
                </View>
              </View>
            </View>

            {/* Center Reel Section */}
            <View style={styles.centerSection}>
              <ReelSection />
            </View>

            {/* Right Sidebar */}
            <View style={styles.rightSidebar}>
              <View style={styles.sidebarCard}>
                <Text style={styles.sidebarTitle}>Suggested Accounts</Text>
                <View
                  style={styles.suggestedContainer}
                  {...(Platform.OS === 'web' && { className: 'suggestedContainer' })}
                >
                  {suggestedAccounts.length > 0 ? (
                    suggestedAccounts.map((account) => (
                      <View key={account.id} style={styles.suggestedAccountItem}>
                        <Pressable
                          style={styles.suggestedAccountLeft}
                          {...(Platform.OS === 'web' && { className: 'suggestedAccountLeft' })}
                        >
                          <Image
                            source={{ uri: account.avatar }}
                            style={styles.suggestedAvatar as any}
                            resizeMode="cover"
                          />
                          <View style={styles.suggestedAccountInfo}>
                            <Text style={styles.suggestedAccountHandle}>@{account.handle}</Text>
                            <Text style={styles.suggestedAccountName}>{account.name}</Text>
                          </View>
                        </Pressable>
                        <Pressable
                          style={styles.followButton}
                          {...(Platform.OS === 'web' && { className: 'followButton' })}
                        >
                          <Text style={styles.followButtonText}>Follow</Text>
                        </Pressable>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noDataText}>No data found</Text>
                  )}
                </View>
              </View>
              <View style={styles.loginPromptCard}>
                <Text style={styles.loginPromptText}>
                  Log in to follow creators, like videos, and view comments.
                </Text>
              </View>
              <View style={styles.footerLinks}>
                <Text
                  style={styles.footerLink}
                  {...(Platform.OS === 'web' && { className: 'footerLink' })}
                >
                  Terms and Conditions
                </Text>
                <Text
                  style={styles.footerLink}
                  {...(Platform.OS === 'web' && { className: 'footerLink' })}
                >
                  Privacy Policy
                </Text>
                <Text
                  style={styles.footerLink}
                  {...(Platform.OS === 'web' && { className: 'footerLink' })}
                >
                  EULA
                </Text>
                <Text
                  style={styles.footerLink}
                  {...(Platform.OS === 'web' && { className: 'footerLink' })}
                >
                  Products Disclaimer
                </Text>
                <Text style={styles.footerText}>support@trend.app</Text>
                <Text style={styles.footerText}>Version 1.0.5</Text>
              </View>
            </View>
          </View>
        </View>
      </MainLayout>
    )
  }

  // Native mobile/tablet - Full screen reel
  return (
    <MainLayout
      isShowMobileFooter={true}
      activeTab="home"
      onTabChange={handleTabChange}
      onSearch={handleSearch}
      onLogin={handleLogin}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <ReelSection />
        </View>
      </View>
    </MainLayout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BLACK,
    width: '100%',
    height: '100%',
    ...(Platform.OS === 'web' && {
      overflow: 'hidden',
    }),
  },
  content: {
    flex: 1,
    width: '100%',
    height: '100%',
    ...(Platform.OS === 'web' && {
      overflow: 'hidden',
    }),
  },
  webContent: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.BLACK,
    paddingTop: 20,
    overflow: 'hidden',
    ...(Platform.OS === 'web' && {
      //maxWidth: 1400,
      marginHorizontal: 'auto',
    }),
  },
  leftSidebar: {
    width: '25%',
    paddingHorizontal: 15,
    height: '100%',
    overflow: 'hidden',
    ...(Platform.OS === 'web' && {
      minWidth: 200,
      maxWidth: 300,
      overflowY: 'auto',
      overflowX: 'hidden',
    } as any),
  },
  centerSection: {
    flex: 1,
    width: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    height: '100%',
    ...(Platform.OS === 'web' && {
      minWidth: 400,
      //maxWidth: 600,
      // Ensure reel section can scroll independently
      position: 'relative',
      height: 'calc(100vh - 80px)',
      overflowY: 'auto',
    } as any),
  },
  rightSidebar: {
    width: '25%',
    paddingHorizontal: 15,
    height: '100%',
    overflow: 'hidden',
    ...(Platform.OS === 'web' && {
      minWidth: 200,
      maxWidth: 300,
      overflowY: 'auto',
      overflowX: 'hidden',
    } as any),
  },
  sidebarCard: {
    backgroundColor: COLORS.INPUT_BACKGROUND_BLACK,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  sidebarTitle: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    ...(Platform.OS === 'web' && {
      fontFamily: '"Instrument Sans", sans-serif',
    }),
  },
  hashtagContainer: {
    minHeight: 115,
    maxHeight: 280,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 15,
    ...(Platform.OS === 'web' && {
      overflowY: 'auto',
      scrollbarWidth: 'thin',
      scrollbarColor: `${COLORS.BLACK} ${COLORS.INPUT_BACKGROUND_BLACK}`,
    } as any),
  },
  hashtagItem: {
    backgroundColor: COLORS.GREY_2,
    padding: 10,
    borderRadius: 8,
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    }),
  },
  hashtagText: {
    color: COLORS.WHITE,
    fontSize: 12,
    ...(Platform.OS === 'web' && {
      fontFamily: '"Instrument Sans", sans-serif',
    }),
  },
  suggestedContainer: {
    minHeight: 200,
    maxHeight: 280,
    marginTop: 10,
    ...(Platform.OS === 'web' && {
      // Custom scrollbar styling to match trend-next-website
      overflowY: 'auto',
      scrollbarWidth: 'thin',
      scrollbarColor: `${COLORS.BLACK} ${COLORS.INPUT_BACKGROUND_BLACK}`,
    } as any),
  },
  suggestedAccountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.INPUT_BACKGROUND_BLACK_2,
  },
  suggestedAccountLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    width: '67%',
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      transition: 'opacity 0.2s ease',
    }),
  },
  suggestedAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 0,
  },
  suggestedAccountInfo: {
    flex: 1,
    minWidth: 0, // Allows text truncation
  },
  suggestedAccountHandle: {
    color: COLORS.WHITE,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
    overflow: 'hidden',
    ...(Platform.OS === 'web' && {
      fontFamily: '"Instrument Sans", sans-serif',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    } as any),
  },
  suggestedAccountName: {
    color: COLORS.LIGHT_GREY,
    fontSize: 12,
    overflow: 'hidden',
    ...(Platform.OS === 'web' && {
      fontFamily: '"Instrument Sans", sans-serif',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    } as any),
  },
  followButton: {
    backgroundColor: COLORS.BLUE,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    width: 80,
    height: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      whiteSpace: 'nowrap',
      display: 'flex',
    }),
  },
  followButtonText: {
    color: COLORS.WHITE,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    ...(Platform.OS === 'web' && {
      fontFamily: '"Instrument Sans", sans-serif',
      whiteSpace: 'nowrap',
    }),
  },
  noDataText: {
    color: COLORS.LIGHT_GREY,
    fontSize: 14,
    ...(Platform.OS === 'web' && {
      fontFamily: '"Instrument Sans", sans-serif',
    }),
  },
  loginPromptCard: {
    backgroundColor: COLORS.INPUT_BACKGROUND_BLACK,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  loginPromptText: {
    color: COLORS.WHITE,
    fontSize: 14,
    lineHeight: 20,
    ...(Platform.OS === 'web' && {
      fontFamily: '"Instrument Sans", sans-serif',
    }),
  },
  footerLinks: {
    paddingTop: 20,
  },
  footerLink: {
    color: COLORS.LIGHT_GREY,
    fontSize: 12,
    marginBottom: 8,
    textDecorationLine: 'underline',
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      fontFamily: '"Instrument Sans", sans-serif',
      transition: 'color 0.2s ease',
    }),
  },
  footerText: {
    color: COLORS.LIGHT_GREY,
    fontSize: 12,
    marginTop: 10,
    ...(Platform.OS === 'web' && {
      fontFamily: '"Instrument Sans", sans-serif',
    }),
  },
})

'use client'

import { View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView, Image } from 'react-native'
import { MainLayout } from 'app/components/MainLayout'
import { useCheckDeviceType } from 'app/hooks/useCheckDeviceType'
import { COLORS } from 'app/constants/colors'
import { useRouter } from 'solito/navigation'

export function AccountScreen() {
  const { deviceType } = useCheckDeviceType()
  const isMobile = deviceType === 'Mobile'
  const isWeb = Platform.OS === 'web'
  const router = useRouter()

  const handleTabChange = (tab: 'home' | 'shop' | 'account') => {
    console.log('Tab changed to:', tab)
  }

  const handleSearch = (query: string) => {
    console.log('Search query:', query)
  }

  const handleLogout = () => {
    router.push('/login')
  }

  return (
    <MainLayout
      isShowMobileFooter={isMobile || !isWeb}
      activeTab="account"
      onTabChange={handleTabChange}
      onSearch={handleSearch}
    >
      <View style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}
        >
          <View style={styles.content}>
            {/* Profile Section */}
            <View style={styles.profileSection}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=60',
                  }}
                  style={styles.avatar}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.profileName}>John Doe</Text>
              <Text style={styles.profileEmail}>john.doe@example.com</Text>
            </View>

            {/* Logout Button */}
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.BLACK,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
    backgroundColor: COLORS.BLACK,
    minHeight: '100%',
  },
  content: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: COLORS.BLACK,
    ...(Platform.OS === 'web' && {
      maxWidth: 600,
      marginHorizontal: 'auto',
    } as any),
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.INPUT_BACKGROUND_BLACK,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: COLORS.BLUE,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  profileName: {
    color: COLORS.WHITE,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    ...(Platform.OS === 'web' && {
      fontFamily: '"Instrument Sans", sans-serif',
    }),
  },
  profileEmail: {
    color: COLORS.LIGHT_GREY,
    fontSize: 16,
    ...(Platform.OS === 'web' && {
      fontFamily: '"Instrument Sans", sans-serif',
    }),
  },
  logoutButton: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: COLORS.BLUE,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    }),
  },
  logoutText: {
    color: COLORS.WHITE,
    fontSize: 17,
    fontWeight: '700',
    ...(Platform.OS === 'web' && {
      fontFamily: '"Instrument Sans", sans-serif',
    }),
  },
})


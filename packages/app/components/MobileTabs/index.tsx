import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'solito/navigation'

interface MobileTabsProps {
  activeTab: 'home' | 'shop'
  onTabChange: (tab: 'home' | 'shop') => void
}

export function MobileTabs({ activeTab, onTabChange }: MobileTabsProps) {
  const router = useRouter()

  const handlePress = (tab: 'home' | 'shop') => {
    onTabChange(tab)
    router.push(tab === 'home' ? '/home' : '/product')
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => handlePress('home')}
      >
        <Text style={[styles.tabText, activeTab === 'home' && styles.active]}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tab}
        onPress={() => handlePress('shop')}
      >
        <Text style={[styles.tabText, activeTab === 'shop' && styles.active]}>
          Shop
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    color: '#aaa',
    fontSize: 14,
    textDecorationLine: "none",
  },
  active: {
    color: '#fff',
    fontWeight: '600',
  },
})

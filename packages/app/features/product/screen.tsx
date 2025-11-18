import { MainLayout } from 'app/components/MainLayout'
import React, { useMemo, useState } from 'react'
import {
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import type { DimensionValue, StyleProp, ViewStyle } from 'react-native'

const CARD_HEIGHT = 420

const products = [
  {
    id: 'trend-01',
    title: 'Trend Made Me Buy It',
    price: '$25',
    originalPrice: null,
    image:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=60',
    badge: null,
    subtitle: 'Limited Drop',
  },
  {
    id: 'trend-02',
    title: 'I Started the Trend',
    price: '$25',
    originalPrice: null,
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=60',
    badge: null,
    subtitle: 'Creator Pick',
  },
  {
    id: 'trend-03',
    title: 'TREND Mesh Hat',
    price: '$25',
    originalPrice: null,
    image:
      'https://images.unsplash.com/photo-1521572166131-7a224b1870b8?auto=format&fit=crop&w=800&q=60',
    badge: null,
    subtitle: 'Top Seller',
  },
  {
    id: 'trend-04',
    title: 'How do you like your Chicken',
    price: '$25',
    originalPrice: null,
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=60',
    badge: null,
    subtitle: 'Fan Favorite',
  },
  {
    id: 'trend-05',
    title: "Somebody's watching me It's my anxiety",
    price: '$25',
    originalPrice: null,
    image:
      'https://images.unsplash.com/photo-1521572163523-2d031a0dc66b?auto=format&fit=crop&w=800&q=60',
    badge: null,
    subtitle: 'Cult Classic',
  },
  {
    id: 'trend-06',
    title: 'Cheers Queers - White Peach Champagne Kombucha',
    price: '$43.2',
    originalPrice: null,
    image:
      'https://images.unsplash.com/photo-1468465226960-8899e992537c?auto=format&fit=crop&w=800&q=60',
    badge: 'Low Sugar',
    subtitle: 'Awarded Blend',
  },
  {
    id: 'trend-07',
    title: 'POL Eyelet Flower Pearl Detail Lace Patchwork',
    price: '$55.99',
    originalPrice: '$61.99',
    image:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=60',
    badge: null,
    subtitle: 'Handmade Luxe',
  },
  {
    id: 'trend-08',
    title: 'ADULTalyte Hangover Recovery - Unicorn Candy',
    price: '$19.99',
    originalPrice: '$22.99',
    image:
      'https://images.unsplash.com/photo-1502740479091-635887520276?auto=format&fit=crop&w=800&q=60',
    badge: null,
    subtitle: 'Overnight Fix',
  },
  {
    id: 'trend-09',
    title: 'TREND Oversized Hoodie',
    price: '$48',
    originalPrice: '$58',
    image:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=60',
    badge: 'New',
    subtitle: 'Cozy Layer',
  },
  {
    id: 'trend-10',
    title: 'Minimal Leather Tote Bag',
    price: '$89',
    originalPrice: null,
    image:
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1000&q=60',
    badge: null,
    subtitle: 'Daily Carry',
  },
  {
    id: 'trend-11',
    title: 'Monochrome Sneaker Pack',
    price: '$120',
    originalPrice: '$149',
    image:
      'https://images.unsplash.com/photo-1514986888952-8cd320577b68?auto=format&fit=crop&w=900&q=60',
    badge: 'Hot',
    subtitle: 'Street Ready',
  },
  {
    id: 'trend-12',
    title: 'TREND Ceramic Mug Duo',
    price: '$32',
    originalPrice: '$39',
    image:
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=60',
    badge: null,
    subtitle: 'Warm Glow',
  },
  {
    id: 'trend-13',
    title: 'Glow Serum - Night Repair',
    price: '$64',
    originalPrice: null,
    image:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=60',
    badge: null,
    subtitle: 'Skin Hero',
  },
  {
    id: 'trend-14',
    title: 'Travel Essentials Kit',
    price: '$72',
    originalPrice: '$84',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=60',
    badge: 'Bundle',
    subtitle: 'Travel Mate',
  },
  {
    id: 'trend-15',
    title: 'TREND Signature Candle Set',
    price: '$55',
    originalPrice: null,
    image:
      'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=60',
    badge: null,
    subtitle: 'Soft Light',
  },
  {
    id: 'trend-16',
    title: 'Organic Cotton Throw Blanket',
    price: '$68',
    originalPrice: null,
    image:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=60',
    badge: 'Cozy',
    subtitle: 'Cozy Throw',
  },
  {
    id: 'trend-17',
    title: 'Signature Pour-Over Coffee Set',
    price: '$95',
    originalPrice: '$115',
    image:
      'https://images.unsplash.com/photo-1459257868276-5e65389e2722?auto=format&fit=crop&w=900&q=60',
    badge: null,
    subtitle: 'Brew Ritual',
  },
  {
    id: 'trend-18',
    title: 'Geo Pattern Rug 5x7',
    price: '$130',
    originalPrice: '$160',
    image:
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1000&q=60',
    badge: null,
    subtitle: 'Geo Chic',
  },
  {
    id: 'trend-19',
    title: 'Smart Ambient Lamp',
    price: '$79',
    originalPrice: '$92',
    image:
      'https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=1000&q=60',
    badge: 'New Color',
    subtitle: 'Mood Light',
  },
  {
    id: 'trend-20',
    title: 'Airy Linen Curtain Pair',
    price: '$110',
    originalPrice: null,
    image:
      'https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=1000&q=60',
    badge: null,
    subtitle: 'Fresh Breeze',
  },
]

const trendingItems = [
  {
    id: 'trend-side-01',
    title: 'Minimal Logo Tee',
    price: '$32',
    image:
      'https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&w=600&q=60',
  },
  {
    id: 'trend-side-02',
    title: 'Signature Dad Hat',
    price: '$27',
    image:
      'https://images.unsplash.com/photo-1521572166131-7a224b1870b8?auto=format&fit=crop&w=600&q=60',
  },
  {
    id: 'trend-side-03',
    title: 'Weekend Canvas Tote',
    price: '$45',
    image:
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=60',
  },
  {
    id: 'trend-side-04',
    title: 'Studio Crewneck',
    price: '$58',
    image:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=60',
  },
  {
    id: 'trend-side-05',
    title: 'Daily Brew Kit',
    price: '$72',
    image:
      'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=600&q=60',
  },
  {
    id: 'trend-side-06',
    title: 'Soft Touch Blanket',
    price: '$64',
    image:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=60',
  },
]

function Badge({ label }: { label: string }) {
  if (!label) return null

  return (
    <View
      style={{
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 10,
        paddingVertical: 4,
      }}
    >
      <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>
        {label}
      </Text>
    </View>
  )
}

function ProductCard(props: (typeof products)[number]) {
  const { title, price, originalPrice, image, badge, subtitle } = props
  const isWeb = Platform.OS === 'web'
  const cardMinHeight = Platform.select({
    web: CARD_HEIGHT,
    default: 340,
  })

  return (
    <Pressable
      style={({ hovered }) => [
        {
          backgroundColor: '#1c1c1f',
          borderRadius: 24,
          overflow: 'hidden',
          minHeight: cardMinHeight ?? CARD_HEIGHT,
          shadowColor: '#000',
          shadowOpacity: hovered && isWeb ? 0.4 : isWeb ? 0.2 : 0.25,
          shadowOffset: { width: 0, height: 18 },
          shadowRadius: hovered && isWeb ? 32 : 24,
          elevation: hovered ? 10 : 6,
          transform:
            hovered && isWeb ? [{ translateY: -6 }] : [{ translateY: 0 }],
          borderWidth: 1,
          borderColor: hovered && isWeb ? '#2f2f35' : '#101012',
        },
      ]}
      android_ripple={undefined}
    >
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: image }}
          resizeMode="cover"
          style={{ width: '100%', aspectRatio: 1, backgroundColor: '#2a2a2e' }}
        />
        <Badge label={badge ?? ''} />
      </View>

      <View style={{ padding: 18, flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <View>
            <Text
              style={{
                color: '#f3f4f6',
                fontSize: 16,
                fontWeight: '600',
                marginBottom: 8,
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
            {subtitle ? (
              <Text
                style={{
                  color: '#eab308',
                  fontSize: 12,
                  marginBottom: 6,
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {subtitle}
              </Text>
            ) : null}
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <Text style={{ color: '#22c55e', fontSize: 18, fontWeight: '700' }}>
              {price}
            </Text>
            {originalPrice ? (
              <Text
                style={{
                  color: '#f87171',
                  marginLeft: 8,
                  textDecorationLine: 'line-through',
                  fontSize: 14,
                }}
              >
                {originalPrice}
              </Text>
            ) : null}
          </View>
        </View>

        <View
          style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 4 }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: '#0061ff',
              paddingVertical: 10,
              borderRadius: 999,
              alignItems: 'center',
            }}
            activeOpacity={0.85}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              marginLeft: 12,
              width: 44,
              height: 44,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: '#2f2f35',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            activeOpacity={0.7}
          >
            <Text style={{ color: '#fff', fontSize: 18 }}>♡</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  )
}

function TabSwitcher({
  activeTab,
  onChange,
}: {
  activeTab: 'products' | 'video'
  onChange: (value: 'products' | 'video') => void
}) {
  const isWeb = Platform.OS === 'web'
  const containerWidth: DimensionValue = isWeb ? 260 : '100%'

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: '#111111',
        borderRadius: 16,
        padding: 4,
        marginBottom: 18,
        alignSelf: isWeb ? 'flex-start' : 'stretch',
        width: containerWidth,
      }}
    >
      {(['products', 'video'] as const).map((tab) => {
        const isActive = tab === activeTab
        return (
          <TouchableOpacity
            key={tab}
            activeOpacity={0.85}
            onPress={() => onChange(tab)}
            style={{
              flex: 1,
              borderRadius: 12,
              paddingVertical: 10,
              alignItems: 'center',
              backgroundColor: isActive ? '#0b5fff' : 'transparent',
            }}
          >
            <Text
              style={{
                color: isActive ? '#fff' : '#7c7c84',
                fontWeight: '600',
              }}
            >
              {tab === 'products' ? 'Products' : 'Video'}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

function HeroBanner() {
  return (
    <View
      style={{
        borderRadius: 28,
        overflow: 'hidden',
        backgroundColor: '#101012',
        marginBottom: 12,
        minHeight: 180,
      }}
    >
      <Image
        source={{
          uri: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1400&q=60',
        }}
        resizeMode="cover"
        style={{ width: '100%', height: 220 }}
      />
      <View style={[StyleSheet.absoluteFillObject]} pointerEvents="none">
        <View
          style={{
            position: 'absolute',
            bottom: 24,
            left: 24,
            right: 24,
          }}
        >
          <Text
            style={{
              color: '#fff',
              fontSize: 28,
              fontWeight: '800',
              marginBottom: 8,
            }}
          >
            Squeaky Sticks Comfort Blend
          </Text>
          <Text style={{ color: '#d4d4d8', fontSize: 16 }}>
            Premium all-natural body & foot powder
          </Text>
        </View>
      </View>
    </View>
  )
}

function SliderDots() {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 32,
      }}
    >
      {[0, 1, 2].map((index) => (
        <View
          key={index}
          style={{
            width: 8,
            height: 8,
            borderRadius: 999,
            marginHorizontal: 4,
            backgroundColor: index === 1 ? '#0b5fff' : '#2a2a2e',
          }}
        />
      ))}
    </View>
  )
}

function TrendingPanel({
  items,
  style,
}: {
  items: (typeof trendingItems)[number][]
  style?: StyleProp<ViewStyle>
}) {
  return (
    <View
      style={[
        {
          backgroundColor: '#0f0f11',
          borderRadius: 24,
          padding: 20,
          width: Platform.OS === 'web' ? 360 : '100%',
          borderWidth: 1,
          borderColor: '#1b1b1f',
        },
        style,
      ]}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Text style={{ color: '#f5f5f7', fontSize: 18, fontWeight: '700' }}>
          Trending Products
        </Text>
        <Text style={{ color: '#6d6d76', fontSize: 12 }}>View All</Text>
      </View>

      {items.map((item, index) => (
        <View
          key={item.id}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 18,
            borderBottomWidth: index === items.length - 1 ? 0 : 1,
            borderBottomColor: '#1e1e22',
          }}
        >
          <View
            style={{
              width: 108,
              height: 108,
              borderRadius: 12,
              backgroundColor: '#1c1c1f',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 18,
            }}
          >
            <Image
              source={{ uri: item.image }}
              style={{
                width: 96,
                height: 96,
                borderRadius: 8,
              }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{ color: '#f3f4f6', fontWeight: '600' }}
              numberOfLines={2}
            >
              {item.title}
            </Text>
            <Text style={{ color: '#22c55e', marginTop: 6 }}>{item.price}</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
                marginTop: 12,
              }}
            >
              <TouchableOpacity
                style={{
                  width: 120,
                  backgroundColor: '#0061ff',
                  paddingVertical: 10,
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                activeOpacity={0.85}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  marginLeft: 12,
                  width: 40,
                  height: 40,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: '#3a3a42',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                activeOpacity={0.75}
              >
                <Text style={{ color: '#fff', fontSize: 18 }}>♡</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </View>
  )
}

export function ProductScreen() {
  const [activeTab, setActiveTab] = useState<'products' | 'video'>('products')
  const cardWidth: DimensionValue =
    Platform.select({ web: '23.5%', default: '48%' }) ?? '48%'
  const trendingProducts = useMemo(() => trendingItems, [])
  const visibleProducts = useMemo(
    () => (activeTab === 'products' ? products : products.slice().reverse()),
    [activeTab]
  )
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

  return (
    <MainLayout
      isShowMobileFooter={false}
      activeTab="home"
      onTabChange={handleTabChange}
      onSearch={handleSearch}
      onLogin={handleLogin}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: '#09090b', paddingTop: isWeb ? 0 : 16 }}>
        <StatusBar barStyle="light-content" />
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* <TabSwitcher activeTab={activeTab} onChange={setActiveTab} /> */}
          <View
            style={{
              flexDirection: isWeb ? 'row' : 'column',
              justifyContent: 'space-between',
            }}
          >
            <View
              style={{
                flex: 1,
                marginRight: isWeb ? 24 : 0,
                marginBottom: isWeb ? 0 : 32,
              }}
            >
              <HeroBanner />
              {/* <SliderDots /> */}

              <Text
                style={{
                  color: '#f5f5f7',
                  fontSize: 24,
                  fontWeight: '700',
                  marginBottom: 24,
                }}
              >
                Explore more
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent:
                    Platform.OS === 'web' ? 'flex-start' : 'space-between',
                  marginRight: isWeb ? -18 : 0,
                }}
              >
                {visibleProducts.map((product) => (
                  <View
                    key={`${activeTab}-${product.id}`}
                    style={{
                      width: cardWidth,
                      marginBottom: 18,
                      marginRight: isWeb ? 18 : 0,
                    }}
                  >
                    <ProductCard {...product} />
                  </View>
                ))}
              </View>
            </View>

            <TrendingPanel
              items={trendingProducts}
              style={{
                alignSelf: isWeb ? 'flex-start' : 'stretch',
              }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </MainLayout>
  )
}

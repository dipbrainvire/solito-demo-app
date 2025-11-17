'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import {
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useSafeArea } from 'app/provider/safe-area/use-safe-area'

// Only import expo-av on native - web uses HTML5 video
let Video: any
let ResizeMode: any

if (Platform.OS !== 'web') {
  // Dynamic import only on native to avoid web build issues
  try {
    const expoAv = require('expo-av')
    Video = expoAv.Video
    ResizeMode = expoAv.ResizeMode
  } catch (e) {
    // Silently fail - will use HTML5 video on web
  }
}

const getScreenDimensions = () => Dimensions.get('window')

interface ReelItem {
  id: string
  image: string
  video?: string
  title: string
  user: {
    name: string
    avatar: string
  }
  likes: number
  comments: number
  shares?: number
  favorites?: number
  description?: string
  isLiked?: boolean
  isFollowed?: boolean
  isFavorited?: boolean
}

interface ReelSectionProps {
  reels?: ReelItem[]
}

const defaultReels: ReelItem[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    title: 'Web Development Tips',
    user: {
      name: 'TechGuru',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    likes: 1250,
    comments: 89,
    shares: 45,
    favorites: 120,
    description: 'Learn the latest web development techniques! #coding #webdev',
    isLiked: false,
    isFollowed: false,
    isFavorited: false,
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    title: 'React Native Mastery',
    user: {
      name: 'CodeMaster',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    likes: 2100,
    comments: 156,
    shares: 89,
    favorites: 234,
    description: 'Building amazing mobile apps with React Native',
    isLiked: false,
    isFollowed: false,
    isFavorited: false,
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    title: 'UI/UX Design Principles',
    user: {
      name: 'DesignPro',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    likes: 980,
    comments: 67,
    shares: 34,
    favorites: 89,
    description: 'Creating beautiful user experiences',
    isLiked: false,
    isFollowed: false,
    isFavorited: false,
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    title: 'Data Science Insights',
    user: {
      name: 'DataWiz',
      avatar: 'https://i.pravatar.cc/150?img=4',
    },
    likes: 1750,
    comments: 124,
    shares: 56,
    favorites: 167,
    description: 'Exploring data science and machine learning',
    isLiked: false,
    isFollowed: false,
    isFavorited: false,
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    title: 'Full Stack Development',
    user: {
      name: 'FullStackDev',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    likes: 2300,
    comments: 198,
    shares: 112,
    favorites: 289,
    description: 'Master both frontend and backend development',
    isLiked: false,
    isFollowed: false,
    isFavorited: false,
  },
]

export function ReelSection({ reels = defaultReels }: ReelSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  // Always start with default dimensions to match SSR
  const [dimensions, setDimensions] = useState({ width: 375, height: 667 })
  const [isMounted, setIsMounted] = useState(false)
  const [filter, setFilter] = useState('For You')
  const [muted, setMuted] = useState(false)
  const [playState, setPlayState] = useState<{ [key: number]: boolean }>({ 0: true })
  const flatListRef = useRef<FlatList>(null)
  const videoRefs = useRef<{ [key: number]: any | HTMLVideoElement | null }>({})
  const reelItemRefs = useRef<{ [key: number]: View | null }>({})
  const currentlyPlayingVideo = useRef<HTMLVideoElement | any | null>(null)
  const safeArea = useSafeArea()
  const isWeb = Platform.OS === 'web'
  
  const GRADIENT_COLOR_1 = ['#000000', '#00000033', '#00000000']

  // Set mounted state and dimensions on client only after hydration
  useEffect(() => {
    // Use requestAnimationFrame to ensure this runs after hydration
    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(() => {
        setIsMounted(true)
        setDimensions(getScreenDimensions())
      })
    } else {
      setIsMounted(true)
      setDimensions(getScreenDimensions())
    }
  }, [])

  // Play first video when mounted
  useEffect(() => {
    if (isMounted && videoRefs.current[0]) {
      setTimeout(() => {
        if (isWeb && videoRefs.current[0] instanceof HTMLVideoElement) {
          videoRefs.current[0].play().catch(() => {})
        } else if (videoRefs.current[0] && 'playAsync' in videoRefs.current[0]) {
          (videoRefs.current[0] as any).playAsync().catch(() => {})
        }
      }, 200)
    }
  }, [isMounted, isWeb])

  // IntersectionObserver for web to handle scroll-based play/pause
  useEffect(() => {
    if (!isMounted || !isWeb || typeof window === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute('data-reel-index'))
          const videoElement = videoRefs.current[index] as HTMLVideoElement | null

          if (entry.isIntersecting && entry.intersectionRatio >= 0.8) {
            // Pause currently playing video
            if (currentlyPlayingVideo.current && currentlyPlayingVideo.current !== videoElement) {
              if (currentlyPlayingVideo.current instanceof HTMLVideoElement) {
                currentlyPlayingVideo.current.pause()
              }
            }

            // Play new video
            if (videoElement) {
              videoElement.currentTime = 0
              videoElement.play().catch(() => {})
              currentlyPlayingVideo.current = videoElement
              setCurrentIndex(index)
              setPlayState((prev) => {
                const newState: { [key: number]: boolean } = {}
                Object.keys(prev).forEach((key) => {
                  newState[Number(key)] = false
                })
                newState[index] = true
                return newState
              })
            }
          } else if (videoElement && currentlyPlayingVideo.current === videoElement) {
            videoElement.pause()
            setPlayState((prev) => ({ ...prev, [index]: false }))
          }
        })
      },
      { threshold: 0.8 }
    )

    // Observe all reel items after a delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      Object.keys(reelItemRefs.current).forEach((key) => {
        const element = reelItemRefs.current[Number(key)]
        if (element) {
          // Get the actual DOM element from React Native Web View
          const domElement = (element as any)._nativeNode || 
                           (element as any).__domNode ||
                           (element as any)
          
          if (domElement && domElement.nodeType === 1) {
            // It's a DOM element
            domElement.setAttribute('data-reel-index', key)
            observer.observe(domElement)
          } else if (domElement && domElement.parentElement) {
            // Try parent element
            domElement.parentElement.setAttribute('data-reel-index', key)
            observer.observe(domElement.parentElement)
          }
        }
      })
    }, 300)

    return () => {
      clearTimeout(timeoutId)
      observer.disconnect()
    }
  }, [isMounted, isWeb, reels.length])

  // Handle window resize on web
  useEffect(() => {
    if (!isMounted) return

    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window)
    })

    return () => {
      if (subscription) {
        subscription.remove()
      }
    }
  }, [isMounted])

  // Account for safe area on mobile
  const screenWidth = dimensions.width
  const safeAreaTop = safeArea.top || 0
  const safeAreaBottom = safeArea.bottom || 0
  const reelHeight = dimensions.height - 80 // Full screen height
  const headerTopPadding = safeAreaTop > 0 ? safeAreaTop : (Platform.OS === 'ios' ? moderateScale(40) : 0)

  const previousIndexRef = useRef(0)

  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0 && !isWeb) {
      // Only use this for native platforms, web uses IntersectionObserver
      const newIndex = viewableItems[0].index || 0
      const previousIndex = previousIndexRef.current
      
      // Pause previous video
      if (previousIndex !== newIndex && videoRefs.current[previousIndex]) {
        const prevVideo = videoRefs.current[previousIndex]
        if (prevVideo && 'pauseAsync' in prevVideo) {
          (prevVideo as any).pauseAsync().catch(() => {})
        }
        setPlayState((prev) => ({ ...prev, [previousIndex]: false }))
      }
      
      // Play new video
      setCurrentIndex(newIndex)
      previousIndexRef.current = newIndex
      setPlayState((prev) => {
        const newState: { [key: number]: boolean } = {}
        Object.keys(prev).forEach((key) => {
          newState[Number(key)] = false
        })
        newState[newIndex] = true
        return newState
      })
      
      // Start playing the new video after a small delay
      setTimeout(() => {
        const newVideo = videoRefs.current[newIndex]
        if (newVideo && 'playAsync' in newVideo) {
          (newVideo as any).playAsync().catch(() => {})
        }
      }, 100)
    }
  }, [isWeb])

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current

  const togglePlayPause = useCallback((index: number) => {
    setPlayState((prev) => {
      const newState = { ...prev }
      const isPlaying = !prev[index]
      newState[index] = isPlaying
      
      if (videoRefs.current[index]) {
        if (isPlaying) {
          videoRefs.current[index]?.playAsync()
        } else {
          videoRefs.current[index]?.pauseAsync()
        }
      }
      
      return newState
    })
  }, [])

  const handleMuteToggle = useCallback(() => {
    setMuted((prev) => !prev)
  }, [])

  const renderReelItem = ({ item, index }: { item: ReelItem; index: number }) => {
    return (
      <ReelItem
        reel={item}
        isActive={index === currentIndex}
        isPlaying={playState[index] || false}
        screenWidth={screenWidth}
        reelHeight={reelHeight}
        safeAreaBottom={safeAreaBottom}
        muted={muted}
        onVideoRef={(ref) => {
          videoRefs.current[index] = ref
          if (index === currentIndex && ref && playState[index] && !isWeb) {
            if ('playAsync' in ref) {
              (ref as any).playAsync().catch(() => {})
            }
          }
        }}
        onReelItemRef={(ref) => {
          reelItemRefs.current[index] = ref
        }}
        onTogglePlayPause={() => togglePlayPause(index)}
        onMuteToggle={handleMuteToggle}
      />
    )
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!isMounted) {
    return (
      <View style={[styles.mainContainer, { height: 667, width: 375 }]}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
          <Text style={{ color: '#fff' }}>Loading...</Text>
        </View>
      </View>
    )
  }

  // const renderSocialAndSearchIcon = (
  //   icon: string,
  //   onClick: () => void,
  //   isSelected: boolean = false,
  // ) => {
  //   return (
  //     <TouchableWithoutFeedback onPress={onClick}>
  //       <View style={styles.mediaIcons}>
  //         <View style={[styles.socialMediaCover, isSelected && styles.customSocialMediaCover]}>
  //           <View style={styles.socialMediaOptionWrapper}>
  //             <Text style={styles.iconText}>{icon}</Text>
  //           </View>
  //           {isSelected ? <View style={styles.redDot} /> : null}
  //         </View>
  //       </View>
  //     </TouchableWithoutFeedback>
  //   )
  // }

  // Use fixed dimensions during SSR, then update after mount
  const containerHeight = isMounted ? reelHeight : 667
  const containerWidth = isMounted ? screenWidth : 375

  return (
    <View style={[styles.mainContainer, { height: containerHeight, width: containerWidth }]}>
      <FlatList
        ref={flatListRef}
        data={reels}
        renderItem={renderReelItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={isMounted ? reelHeight : 667}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({
          length: isMounted ? reelHeight : 667,
          offset: (isMounted ? reelHeight : 667) * index,
          index,
        })}
        style={[styles.videoListStyle, { height: containerHeight, width: containerWidth }]}
        contentContainerStyle={{ width: containerWidth }}
      />
      {/* <LinearGradient
        colors={GRADIENT_COLOR_1}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.otherContainerStyle, { paddingTop: headerTopPadding + moderateScale(10) }]}
      >
        <Pressable
          style={styles.forYouWrapper}
          onPress={() => {
            // Handle filter change
            setFilter(filter === 'For You' ? 'Trending' : 'For You')
          }}
        >
          <Text style={styles.filterText}>
            {filter}
          </Text>
          <Text style={styles.iconText}>▼</Text>
        </Pressable>
        <View style={styles.headerSearchWrapper}>
          {renderSocialAndSearchIcon('🔍', () => {
            // Handle search
            console.log('Search pressed')
          })}
          {filter === 'Trending' &&
            renderSocialAndSearchIcon('☰', () => {
              // Handle filter
              console.log('Filter pressed')
            }, false)}
          {renderSocialAndSearchIcon('📹', () => {
            // Handle live stream
            console.log('Live stream pressed')
          })}
        </View>
      </LinearGradient> */}
    </View>
  )
}

interface ReelItemProps {
  reel: ReelItem
  isActive: boolean
  isPlaying: boolean
  screenWidth: number
  reelHeight: number
  safeAreaBottom: number
  muted: boolean
  onVideoRef: (ref: any | HTMLVideoElement | null) => void
  onReelItemRef?: (ref: View | null) => void
  onTogglePlayPause: () => void
  onMuteToggle: () => void
}

function ReelItem({
  reel,
  isActive,
  isPlaying,
  screenWidth,
  reelHeight,
  safeAreaBottom,
  muted,
  onVideoRef,
  onReelItemRef,
  onTogglePlayPause,
  onMuteToggle,
}: ReelItemProps) {
  const [liked, setLiked] = useState(reel.isLiked || false)
  const [followed, setFollowed] = useState(reel.isFollowed || false)
  const [favorited, setFavorited] = useState(reel.isFavorited || false)
  const [likeCount, setLikeCount] = useState(reel.likes)
  const [favoriteCount, setFavoriteCount] = useState(reel.favorites || 0)
  const [showMore, setShowMore] = useState(false)
  const isWeb = Platform.OS === 'web'

  const handleLike = () => {
    setLiked(!liked)
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1))
  }

  const handleFollow = () => {
    setFollowed(!followed)
  }

  const handleFavorite = () => {
    setFavorited(!favorited)
    setFavoriteCount((prev) => (favorited ? prev - 1 : prev + 1))
  }

  const renderActionButton = (
    icon: string,
    count: number | undefined,
    onPress: () => void,
    isSelected: boolean = false,
  ) => {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <View style={styles.actionButtonContainer}>
          <View style={[styles.actionIconWrapper, isSelected && styles.actionIconSelected]}>
            <Text style={styles.actionIcon}>{icon}</Text>
          </View>
          {count !== undefined && count > 0 && (
            <Text style={styles.actionCount}>{count}</Text>
          )}
        </View>
      </TouchableOpacity>
    )
  }

  const videoRef = useRef<any | HTMLVideoElement>(null)
  const reelItemRef = useRef<View>(null)

  useEffect(() => {
    if (videoRef.current) {
      onVideoRef(videoRef.current)
    }
    if (reelItemRef.current && onReelItemRef) {
      onReelItemRef(reelItemRef.current)
    }
    return () => {
      onVideoRef(null)
      if (onReelItemRef) {
        onReelItemRef(null)
      }
    }
  }, [onVideoRef, onReelItemRef])

  useEffect(() => {
    if (!isWeb && videoRef.current && 'playAsync' in videoRef.current) {
      if (isPlaying && isActive) {
        (videoRef.current as any).playAsync().catch(() => {})
      } else {
        (videoRef.current as any).pauseAsync().catch(() => {})
      }
    } else if (isWeb && videoRef.current instanceof HTMLVideoElement) {
      if (isPlaying && isActive) {
        videoRef.current.play().catch(() => {})
      } else {
        videoRef.current.pause()
      }
    }
  }, [isPlaying, isActive, isWeb])

  // Handle muted state for web
  useEffect(() => {
    if (isWeb && videoRef.current instanceof HTMLVideoElement) {
      videoRef.current.muted = muted
    }
  }, [muted, isWeb])

  return (
    <View 
      ref={reelItemRef}
      style={[styles.videoContainerStyle, { width: screenWidth, height: reelHeight }]}
    >
      {reel.video ? (
        <>
          <Image 
            source={{ uri: reel.image }} 
            style={[styles.video as any, { width: screenWidth, height: reelHeight }]} 
          />
          {isWeb ? (
            <video
              ref={videoRef as any}
              src={reel.video}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: screenWidth,
                height: reelHeight,
                objectFit: 'cover' as any,
                backgroundColor: '#000',
              }}
              loop
              muted={muted}
              playsInline
              autoPlay={isPlaying && isActive}
              onClick={onTogglePlayPause}
              poster={reel.image}
            />
          ) : (
            Video && ResizeMode ? (
              <Video
                ref={videoRef as any}
                source={{ uri: reel.video }}
                style={[styles.video, { width: screenWidth, height: reelHeight }]}
                resizeMode={ResizeMode.COVER}
                isLooping
                isMuted={muted}
                shouldPlay={isPlaying && isActive}
                useNativeControls={false}
                posterSource={{ uri: reel.image }}
                usePoster
              />
            ) : null
          )}
        </>
      ) : (
        <Image 
          source={{ uri: reel.image }} 
          style={[styles.video as any, { width: screenWidth, height: reelHeight }]} 
        />
      )}
      
      {/* Content Overlay */}
      <View style={styles.videoActionContainer}>
        <Pressable 
          style={StyleSheet.absoluteFill}
          onPress={onTogglePlayPause}
        />
        <View style={[styles.videoActionInnerContainer, { paddingBottom: Math.max(safeAreaBottom, moderateScale(25)) }]}>
          {/* Left Side - User Info */}
          <View style={styles.userProfilePicWrapper}>
            <View style={styles.userInfoContainerStyle}>
              <View style={styles.rowImageDesc}>
                <Pressable onPress={() => {}}>
                  <View style={styles.imageContainerStyle}>
                    <Image source={{ uri: reel.user.avatar }} style={styles.imageStyle as any} />
                  </View>
                </Pressable>
                <View style={styles.informationContainerStyle}>
                  <Pressable onPress={() => {}}>
                    <Text style={styles.userNameTextStyle} numberOfLines={1}>
                      {reel.user.name}
                    </Text>
                  </Pressable>
                  <View style={styles.customVideoBtnContainer}>
                    <View style={styles.buttonMainContainer}>
                      {!followed && (
                        <TouchableOpacity style={styles.buttonStyle} onPress={handleFollow}>
                          <Text style={styles.buttonTitleStyle}>Follow</Text>
                        </TouchableOpacity>
                      )}
                      <Pressable style={styles.pressableContainer} onPress={onMuteToggle}>
                        <Text style={styles.muteIcon}>{muted ? '🔇' : '🔊'}</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
              {/* Description */}
              <Pressable onPress={() => setShowMore(!showMore)}>
                <Text style={styles.videoDescriptionText} numberOfLines={showMore ? 0 : 1}>
                  {reel.description}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Right Side - Action Buttons */}
          <View style={styles.mediaOptionsWrapper}>
            {renderActionButton(
              liked ? '❤️' : '🤍',
              likeCount,
              handleLike,
              liked,
            )}
            {renderActionButton('💬', reel.comments, () => {})}
            {renderActionButton('📤', reel.shares, () => {})}
            {renderActionButton(
              favorited ? '🔖' : '📑',
              favoriteCount,
              handleFavorite,
              favorited,
            )}
            {renderActionButton('⋮', undefined, () => {})}
          </View>
        </View>
      </View>
    </View>
  )
}

// Helper function to approximate moderateScale
const moderateScale = (size: number) => size * 1.0

const styles = StyleSheet.create({
  mainContainer: {
    margin: 0,
    padding: 0,
    flex: 1,
    backgroundColor: '#000',
    ...(Platform.OS === 'web' && {
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
    } as any),
  },
  videoListStyle: {
    borderWidth: 0,
    flex: 1,
    ...(Platform.OS === 'web' && {
      width: '100%',
      height: '100%',
      overflowY: 'auto',
      scrollSnapType: 'y mandatory',
      WebkitOverflowScrolling: 'touch',
    }),
  },
  videoContainerStyle: {
    backgroundColor: '#000',
    position: 'relative',
    flex: 1,
    ...(Platform.OS === 'web' && {
      width: '100%',
      height: '100%',
      scrollSnapAlign: 'start',
    }),
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    resizeMode: 'cover',
    ...(Platform.OS === 'web' && {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    }),
  },
  videoActionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    zIndex: 5,
  },
  videoActionInnerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 5,
    paddingBottom: 0, // Will be set dynamically for safe area
  },
  userProfilePicWrapper: {
    flexDirection: 'column',
    paddingHorizontal: moderateScale(10),
    justifyContent: 'flex-end',
    width: '70%',
    zIndex: 6,
  },
  userInfoContainerStyle: {
    flexDirection: 'column',
    width: '100%',
    paddingLeft: moderateScale(10),
    paddingTop: moderateScale(25),
    position: 'relative',
    zIndex: 6,
  },
  rowImageDesc: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    minHeight: moderateScale(44),
    width: '100%',
    marginBottom: moderateScale(5),
  },
  imageContainerStyle: {
    height: moderateScale(43),
    width: moderateScale(43),
    borderRadius: moderateScale(30),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(12),
  },
  imageStyle: {
    height: '100%',
    width: '100%',
    borderRadius: moderateScale(50),
    borderWidth: 1,
    borderColor: '#fff',
  },
  informationContainerStyle: {
    paddingHorizontal: moderateScale(5),
    justifyContent: 'space-between',
    width: '100%',
    flexWrap: 'wrap',
    flexDirection: 'row',
    flex: 1,
  },
  userNameTextStyle: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingLeft: moderateScale(3),
    lineHeight: moderateScale(16),
    color: '#fff',
    marginBottom: moderateScale(3),
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    zIndex: 7,
  },
  customVideoBtnContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    flexWrap: 'wrap',
  },
  buttonMainContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: moderateScale(4),
    flex: 1,
    alignItems: 'center',
  },
  buttonStyle: {
    borderRadius: moderateScale(4),
    paddingVertical: moderateScale(5),
    paddingHorizontal: moderateScale(10),
    backgroundColor: '#2563eb',
    marginTop: moderateScale(3),
  },
  buttonTitleStyle: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  videoDescriptionText: {
    fontSize: 12,
    paddingHorizontal: moderateScale(0),
    marginTop: moderateScale(5),
    marginBottom: moderateScale(3),
    width: moderateScale(250),
    textAlign: 'left',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    zIndex: 7,
  },
  mediaOptionsWrapper: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    width: '28%',
    paddingRight: moderateScale(5),
    zIndex: 6,
  },
  actionButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: moderateScale(3),
    zIndex: 7,
  },
  actionIconWrapper: {
    height: moderateScale(44),
    width: moderateScale(44),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(22),
    backgroundColor: 'rgba(211, 211, 211, 0.5)',
    zIndex: 7,
  },
  actionIconSelected: {
    backgroundColor: '#fff',
  },
  actionIcon: {
    fontSize: 20,
    zIndex: 8,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  actionCount: {
    color: '#fff',
    marginVertical: moderateScale(3),
    fontSize: 12,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  otherContainerStyle: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: moderateScale(10),
    zIndex: 10,
    minHeight: moderateScale(60), // Ensure header has minimum height
  },
  forYouWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(10),
    paddingLeft: moderateScale(15),
  },
  filterText: {
    fontSize: 20,
    color: '#fff',
  },
  headerSearchWrapper: {
    flexDirection: 'row',
    marginTop: moderateScale(20),
    gap: moderateScale(24),
    paddingRight: moderateScale(15),
  },
  mediaIcons: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialMediaCover: {
    height: moderateScale(40),
    width: moderateScale(40),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(50),
    backgroundColor: 'rgba(211, 211, 211, 0.5)',
  },
  customSocialMediaCover: {
    backgroundColor: '#fff',
  },
  socialMediaOptionWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 18,
    color: '#fff',
  },
  redDot: {
    height: moderateScale(10),
    width: moderateScale(10),
    borderRadius: moderateScale(5),
    backgroundColor: '#ff0000',
    position: 'absolute',
    marginLeft: moderateScale(20),
    marginBottom: moderateScale(24),
  },
  pressableContainer: {
    padding: moderateScale(5),
    marginLeft: moderateScale(5),
  },
  muteIcon: {
    fontSize: 18,
    color: '#fff',
  },
})


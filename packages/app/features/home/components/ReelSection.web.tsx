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
import { COLORS } from 'app/constants/colors'

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
]

export function ReelSection({ reels = defaultReels }: ReelSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  // Always start with default dimensions to match SSR - will update after mount
  const [dimensions, setDimensions] = useState({ width: 375, height: 667 })
  const [isMounted, setIsMounted] = useState(false)
  const [filter, setFilter] = useState('For You')
  const [muted, setMuted] = useState(false)
  const [playState, setPlayState] = useState<{ [key: number]: boolean }>({ 0: true })
  const flatListRef = useRef<FlatList>(null)
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({})
  const reelItemRefs = useRef<{ [key: number]: View | null }>({})
  const currentlyPlayingVideo = useRef<HTMLVideoElement | null>(null)
  const safeArea = useSafeArea()
  
  const GRADIENT_COLOR_1 = ['#000000', '#00000033', '#00000000'] as const

  // Update dimensions on mount and resize - use useEffect to avoid hydration mismatch
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Use requestAnimationFrame to ensure this runs after hydration
      requestAnimationFrame(() => {
        setIsMounted(true)
        setDimensions(getScreenDimensions())
      })
      
      const handleResize = () => {
        setDimensions(getScreenDimensions())
      }
      
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Auto-play first video when mounted
  useEffect(() => {
    if (isMounted) {
      const playFirstVideo = () => {
        const firstVideo = videoRefs.current[0]
        if (firstVideo && firstVideo instanceof HTMLVideoElement) {
          firstVideo.play().catch((err) => {
            console.warn('First video play failed:', err)
            // Retry after a short delay
            setTimeout(() => {
              firstVideo.play().catch(() => {})
            }, 500)
          })
          currentlyPlayingVideo.current = firstVideo
          setPlayState({ 0: true })
        }
      }
      
      // Try immediately and also after a delay
      playFirstVideo()
      setTimeout(playFirstVideo, 300)
    }
  }, [isMounted])

  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute('data-reel-index'))
          const videoElement = videoRefs.current[index]

          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            // Pause currently playing video
            if (currentlyPlayingVideo.current && currentlyPlayingVideo.current !== videoElement) {
              currentlyPlayingVideo.current.pause()
            }

            // Play the visible video
            if (videoElement) {
              videoElement.currentTime = 0
              videoElement.play().catch((err) => {
                console.warn('Video play failed:', err)
              })
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
            // Pause video when it goes out of view
            videoElement.pause()
            setPlayState((prev) => ({ ...prev, [index]: false }))
          }
        })
      },
      { threshold: 0.5, rootMargin: '0px' }
    )

    // Setup observer for video elements
    const setupObserver = () => {
      Object.keys(videoRefs.current).forEach((key) => {
        const videoElement = videoRefs.current[Number(key)]
        if (videoElement && videoElement instanceof HTMLVideoElement) {
          // Find the parent container
          let container = videoElement.parentElement
          while (container && !container.hasAttribute('data-reel-index')) {
            container = container.parentElement
          }
          
          if (container) {
            container.setAttribute('data-reel-index', key)
            observer.observe(container)
          } else {
            // Fallback: observe the video element directly
            videoElement.setAttribute('data-reel-index', key)
            observer.observe(videoElement)
          }
        }
      })
    }

    // Try to setup immediately, then retry after a delay
    setupObserver()
    const timeoutId = setTimeout(setupObserver, 500)

    return () => {
      clearTimeout(timeoutId)
      observer.disconnect()
    }
  }, [isMounted, reels.length])

  useEffect(() => {
    if (!isMounted) return

    const subscription = Dimensions.addEventListener('change', ({ window }: { window: { width: number; height: number } }) => {
      setDimensions(window)
    })

    return () => {
      if (subscription) {
        subscription.remove()
      }
    }
  }, [isMounted])

  // Ensure we always have valid dimensions
  // For web, use container dimensions instead of window dimensions
  // Account for navbar height (60px) on desktop web, but not on mobile web (mobile has bottom nav)
  const isDesktopWeb = Platform.OS === 'web' && typeof window !== 'undefined' && window.innerWidth >= 767
  const navbarHeight = isDesktopWeb ? 60 : 0
  const screenWidth = dimensions.width || (typeof window !== 'undefined' ? window.innerWidth : 375)
  const safeAreaTop = safeArea.top || 0
  const safeAreaBottom = safeArea.bottom || 0
  // For mobile web, account for bottom nav (75px), for desktop account for top nav (60px)
  const mobileBottomNavHeight = Platform.OS === 'web' && typeof window !== 'undefined' && window.innerWidth < 767 ? 75 : 0
  const reelHeight = (dimensions.height || (typeof window !== 'undefined' ? window.innerHeight : 667)) - navbarHeight - mobileBottomNavHeight
  const headerTopPadding = safeAreaTop > 0 ? safeAreaTop : moderateScale(20)

  // Use IntersectionObserver for better scroll detection on web
  useEffect(() => {
    if (!isMounted || reelHeight <= 0) return

    const observers: IntersectionObserver[] = []

    // Create IntersectionObserver for each reel item
    reels.forEach((_, index) => {
      const reelItemElement = reelItemRefs.current[index]
      if (!reelItemElement) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
              // This video is now visible
              if (index !== currentIndex) {
                setCurrentIndex(index)
                
                // Pause all videos
                Object.values(videoRefs.current).forEach((video) => {
                  if (video && video instanceof HTMLVideoElement) {
                    video.pause()
                  }
                })
                
                // Play the visible video
                const video = videoRefs.current[index]
                if (video && video instanceof HTMLVideoElement) {
                  video.currentTime = 0
                  video.play().catch(() => {})
                  currentlyPlayingVideo.current = video
                  setPlayState((prev) => {
                    const newState: { [key: number]: boolean } = {}
                    Object.keys(prev).forEach((key) => {
                      newState[Number(key)] = false
                    })
                    newState[index] = true
                    return newState
                  })
                }
              }
            }
          })
        },
        {
          threshold: [0, 0.5, 1],
          rootMargin: '0px',
        }
      )

      // Get the actual DOM element from the View ref
      const domElement = (reelItemElement as any)?._nativeNode || 
                        (reelItemElement as any)?.current ||
                        reelItemElement

      if (domElement) {
        observer.observe(domElement)
        observers.push(observer)
      }
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [isMounted, reelHeight, currentIndex, reels.length])

  // Also handle scroll events as fallback
  useEffect(() => {
    if (!isMounted || !flatListRef.current || reelHeight <= 0) return

    // Try multiple ways to get the scrollable element
    const getScrollableElement = () => {
      const ref = flatListRef.current as any
      if (!ref) return null

      // Try different internal ref paths
      const paths = [
        () => ref._listRef?._scrollMetrics?.getNode?.(),
        () => ref._scrollRef?.getNode?.(),
        () => ref._component?.getScrollableNode?.(),
        () => ref._listRef?.getScrollableNode?.(),
        () => {
          // Try to find scrollable element in the DOM
          const container = document.querySelector('[data-testid="flatlist-container"]')
          if (container) return container
          // Find by class or style
          const scrollable = document.querySelector('[style*="overflow-y"]')
          return scrollable
        },
      ]

      for (const getPath of paths) {
        try {
          const element = getPath()
          if (element && element.scrollTop !== undefined) {
            return element
          }
        } catch (e) {
          // Continue to next path
        }
      }

      return null
    }

    const flatListElement = getScrollableElement()
    if (!flatListElement) {
      // If we can't find the scrollable element, use IntersectionObserver only
      return
    }

    let scrollTimeout: ReturnType<typeof setTimeout>
    let lastScrollTop = flatListElement.scrollTop || 0

    const handleScroll = () => {
      clearTimeout(scrollTimeout)
      
      scrollTimeout = setTimeout(() => {
        const scrollTop = flatListElement.scrollTop || 0
        const scrollDelta = Math.abs(scrollTop - lastScrollTop)
        
        if (scrollDelta > 10) {
          // Calculate which video should be visible
          const newIndex = Math.round(scrollTop / reelHeight)
          if (newIndex !== currentIndex && newIndex >= 0 && newIndex < reels.length) {
            setCurrentIndex(newIndex)
            
            // Pause current video
            if (currentlyPlayingVideo.current) {
              currentlyPlayingVideo.current.pause()
            }
            
            // Play new video
            const newVideo = videoRefs.current[newIndex]
            if (newVideo && newVideo instanceof HTMLVideoElement) {
              newVideo.currentTime = 0
              newVideo.play().catch(() => {})
              currentlyPlayingVideo.current = newVideo
              setPlayState((prev) => {
                const newState: { [key: number]: boolean } = {}
                Object.keys(prev).forEach((key) => {
                  newState[Number(key)] = false
                })
                newState[newIndex] = true
                return newState
              })
            }
          }
        }
        
        lastScrollTop = scrollTop
      }, 50) // Reduced timeout for more responsive scrolling
    }

    // Use multiple event types for better compatibility
    flatListElement.addEventListener('scroll', handleScroll, { passive: true })
    flatListElement.addEventListener('wheel', handleScroll, { passive: true })
    flatListElement.addEventListener('touchmove', handleScroll, { passive: true })

    return () => {
      clearTimeout(scrollTimeout)
      flatListElement.removeEventListener('scroll', handleScroll)
      flatListElement.removeEventListener('wheel', handleScroll)
      flatListElement.removeEventListener('touchmove', handleScroll)
    }
  }, [isMounted, reelHeight, currentIndex, reels.length])

  const togglePlayPause = useCallback((index: number) => {
    const video = videoRefs.current[index]
    if (video) {
      if (video.paused) {
        video.play().catch(() => {})
        setPlayState((prev) => ({ ...prev, [index]: true }))
      } else {
        video.pause()
        setPlayState((prev) => ({ ...prev, [index]: false }))
      }
    }
  }, [])

  const handleMuteToggle = useCallback(() => {
    setMuted((prev) => !prev)
    Object.values(videoRefs.current).forEach((video) => {
      if (video) {
        video.muted = !muted
      }
    })
  }, [muted])

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
        index={index}
        currentIndex={currentIndex}
        onVideoRef={(ref) => {
          videoRefs.current[index] = ref
        }}
        onReelItemRef={(ref) => {
          reelItemRefs.current[index] = ref
        }}
        onTogglePlayPause={() => togglePlayPause(index)}
        onMuteToggle={handleMuteToggle}
      />
    )
  }

  // Always render, but use default dimensions until mounted
  // This prevents hydration mismatch while still showing content

  const renderSocialAndSearchIcon = (
    icon: string,
    onClick: () => void,
    isSelected: boolean = false,
  ) => {
    return (
      <TouchableWithoutFeedback onPress={onClick}>
        <View style={styles.mediaIcons}>
          <View style={[styles.socialMediaCover, isSelected && styles.customSocialMediaCover]}>
            <View style={styles.socialMediaOptionWrapper}>
              <Text style={styles.iconText}>{icon}</Text>
            </View>
            {isSelected ? <View style={styles.redDot} /> : null}
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  // Use fixed dimensions during SSR, then actual dimensions after mount
  const containerHeight = isMounted ? reelHeight : 667
  const containerWidth = isMounted ? screenWidth : 375

  // Prevent page scroll when scrolling reel
  useEffect(() => {
    if (!isMounted || Platform.OS !== 'web') return

    const preventPageScroll = (e: WheelEvent) => {
      const target = e.target as HTMLElement
      // Check if the scroll is happening within the reel container
      const reelContainer = target.closest('[data-reel-container]') || 
                           target.closest('[style*="overflow-y"]')
      
      if (reelContainer) {
        // Allow scroll within reel, prevent page scroll
        const scrollableElement = reelContainer as HTMLElement
        const { scrollTop, scrollHeight, clientHeight } = scrollableElement
        
        // Check if we're at the top or bottom of the reel
        const isAtTop = scrollTop === 0
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1
        
        // Prevent page scroll if we're scrolling within bounds
        if (!isAtTop && !isAtBottom) {
          e.stopPropagation()
        } else if (isAtTop && e.deltaY < 0) {
          // At top and scrolling up - prevent page scroll
          e.stopPropagation()
        } else if (isAtBottom && e.deltaY > 0) {
          // At bottom and scrolling down - prevent page scroll
          e.stopPropagation()
        }
      }
    }

    document.addEventListener('wheel', preventPageScroll, { passive: false })
    
    return () => {
      document.removeEventListener('wheel', preventPageScroll)
    }
  }, [isMounted])

  return (
    <View style={styles.mainContainer} {...(Platform.OS === 'web' && { 'data-reel-container': true })}>
      <FlatList
        ref={flatListRef}
        data={reels}
        renderItem={renderReelItem}
        keyExtractor={(item: ReelItem) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={isMounted ? reelHeight : 667}
        snapToAlignment="start"
        decelerationRate="fast"
        style={styles.videoListStyle}
        contentContainerStyle={{ 
          width: containerWidth,
          height: (isMounted ? reelHeight : 667) * reels.length,
        }}
        getItemLayout={(_: any, index: number) => ({
          length: isMounted ? reelHeight : 667,
          offset: (isMounted ? reelHeight : 667) * index,
          index,
        })}
        onScrollToIndexFailed={(info: { index: number; highestMeasuredFrameIndex: number; averageItemLength: number }) => {
          // Handle scroll to index failures
          const wait = new Promise((resolve) => setTimeout(resolve, 500))
          wait.then(() => {
            flatListRef.current?.scrollToIndex({ index: info.index, animated: true })
          })
        }}
        onScroll={(event: any) => {
          // Handle scroll event directly from FlatList
          const offsetY = event?.nativeEvent?.contentOffset?.y || 0
          const newIndex = Math.round(offsetY / reelHeight)
          if (newIndex !== currentIndex && newIndex >= 0 && newIndex < reels.length) {
            setCurrentIndex(newIndex)
            
            // Pause current video
            if (currentlyPlayingVideo.current) {
              currentlyPlayingVideo.current.pause()
            }
            
            // Play new video
            const newVideo = videoRefs.current[newIndex]
            if (newVideo && newVideo instanceof HTMLVideoElement) {
              newVideo.currentTime = 0
              newVideo.play().catch(() => {})
              currentlyPlayingVideo.current = newVideo
              setPlayState((prev: { [key: number]: boolean }) => {
                const newState: { [key: number]: boolean } = {}
                Object.keys(prev).forEach((key) => {
                  newState[Number(key)] = false
                })
                newState[newIndex] = true
                return newState
              })
            }
          }
        }}
        scrollEventThrottle={16}
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
            console.log('Search pressed')
          })}
          {filter === 'Trending' &&
            renderSocialAndSearchIcon('☰', () => {
              console.log('Filter pressed')
            }, false)}
          {renderSocialAndSearchIcon('📹', () => {
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
  index: number
  currentIndex: number
  onVideoRef: (ref: HTMLVideoElement | null) => void
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
  index,
  currentIndex,
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

  const videoRef = useRef<HTMLVideoElement>(null)
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

  // Handle click on video element directly
  const handleVideoClick = useCallback((e: React.MouseEvent<HTMLVideoElement>) => {
    e.stopPropagation()
    onTogglePlayPause()
  }, [onTogglePlayPause])

  useEffect(() => {
    if (videoRef.current && videoRef.current instanceof HTMLVideoElement) {
      if (isPlaying && isActive) {
        const playPromise = videoRef.current.play()
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.warn('Video play error:', error)
            // Retry after a short delay
            setTimeout(() => {
              if (videoRef.current && isPlaying && isActive) {
                videoRef.current.play().catch(() => {})
              }
            }, 300)
          })
        }
      } else {
        videoRef.current.pause()
      }
    }
  }, [isPlaying, isActive])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = muted
    }
  }, [muted])

  return (
    <View 
      ref={reelItemRef}
      style={[
        styles.videoContainerStyle, 
        { 
          width: screenWidth, 
          height: reelHeight,
          minHeight: reelHeight,
          maxHeight: reelHeight,
        }
      ]}
    >
      {reel.video ? (
        <>
          <Image 
            source={{ uri: reel.image }} 
            style={[styles.video, { width: screenWidth, height: reelHeight }]} 
          />
          <video
            ref={videoRef}
            src={reel.video}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: screenWidth,
              height: reelHeight,
              objectFit: 'cover',
              backgroundColor: COLORS.BLACK,
              zIndex: 1,
              cursor: 'pointer',
            }}
            loop
            muted={muted}
            playsInline
            autoPlay={index === 0 && isActive}
            onClick={handleVideoClick}
            onLoadedData={() => {
              // Ensure video plays when loaded if it's the active one
              if (videoRef.current && isActive && isPlaying) {
                videoRef.current.play().catch(() => {})
              }
            }}
            onPlay={() => {
              // Video started playing
            }}
            onPause={() => {
              // Video paused
            }}
            poster={reel.image}
          />
        </>
      ) : (
        <Image 
          source={{ uri: reel.image }} 
          style={[styles.video, { width: screenWidth, height: reelHeight }]} 
        />
      )}
      
      <View style={styles.videoActionContainer}>
        <Pressable 
          style={StyleSheet.absoluteFill}
          onPress={onTogglePlayPause}
        />
        <LinearGradient
          colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.7)'] as const}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={[styles.videoActionInnerContainer, { paddingBottom: Math.max(safeAreaBottom, moderateScale(25)) }]}
        >
          <View style={styles.userProfilePicWrapper}>
            <View style={styles.userInfoContainerStyle}>
              <View style={styles.rowImageDesc}>
                <Pressable onPress={() => {}}>
                  <View style={styles.imageContainerStyle}>
                    <Image source={{ uri: reel.user.avatar }} style={styles.imageStyle} />
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
              <Pressable onPress={() => setShowMore(!showMore)}>
                <Text style={styles.videoDescriptionText} numberOfLines={showMore ? 0 : 1}>
                  {reel.description}
                </Text>
              </Pressable>
            </View>
          </View>

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
        </LinearGradient>
      </View>
    </View>
  )
}

const moderateScale = (size: number) => size * 1.0

const styles = StyleSheet.create({
  mainContainer: {
    margin: 0,
    padding: 0,
    flex: 1,
    backgroundColor: COLORS.BLACK,
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoListStyle: {
    borderWidth: 0,
    flex: 1,
    width: '100%',
    height: '100%',
    overflowY: 'auto',
    overflowX: 'hidden',
    scrollSnapType: 'y mandatory',
    scrollSnapStop: 'always',
    WebkitOverflowScrolling: 'touch',
    scrollBehavior: 'smooth',
    // Ensure smooth scrolling on web
    overscrollBehavior: 'contain',
    ...(Platform.OS === 'web' && {
      // Prevent scroll from propagating to body
      touchAction: 'pan-y',
      // Hide scrollbar but keep functionality
      scrollbarWidth: 'none', /* Firefox */
      msOverflowStyle: 'none', /* IE and Edge */
    }),
  },
  videoContainerStyle: {
    backgroundColor: COLORS.BLACK,
    position: 'relative',
    flex: 1,
    width: '100%',
    height: '100%',
    scrollSnapAlign: 'start',
    scrollSnapStop: 'always',
    flexShrink: 0,
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
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
    paddingBottom: 0,
    padding: 10,
    ...(Platform.OS === 'web' && {
      background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%)',
    }),
  },
  userProfilePicWrapper: {
    flexDirection: 'column',
    paddingHorizontal: 0,
    justifyContent: 'flex-end',
    width: '70%',
    zIndex: 6,
    gap: 2,
  },
  userInfoContainerStyle: {
    flexDirection: 'column',
    width: '100%',
    paddingLeft: 0,
    paddingTop: 0,
    position: 'relative',
    zIndex: 6,
    gap: 2,
    display: 'flex',
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
    height: 50,
    width: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#fff',
    overflow: 'hidden',
  },
  imageStyle: {
    height: '100%',
    width: '100%',
    borderRadius: 50,
    borderWidth: 0,
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
    fontWeight: '600',
    paddingLeft: moderateScale(3),
    lineHeight: moderateScale(16),
    color: COLORS.WHITE,
    marginBottom: moderateScale(3),
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    zIndex: 7,
    fontFamily: Platform.OS === 'web' ? '"Instrument Sans", sans-serif' : undefined,
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
    backgroundColor: COLORS.BLUE,
    marginTop: moderateScale(3),
  },
  buttonTitleStyle: {
    fontSize: 10,
    color: COLORS.WHITE,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
    fontFamily: Platform.OS === 'web' ? '"Instrument Sans", sans-serif' : undefined,
  },
  videoDescriptionText: {
    fontSize: 12,
    paddingHorizontal: 0,
    marginTop: 0,
    marginBottom: 0,
    width: 180,
    textAlign: 'left',
    color: COLORS.WHITE,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    zIndex: 7,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'block',
    fontFamily: Platform.OS === 'web' ? '"Instrument Sans", sans-serif' : undefined,
  },
  mediaOptionsWrapper: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    width: 'auto',
    paddingRight: 0,
    position: 'absolute',
    right: 20,
    bottom: 100,
    zIndex: 6,
    gap: 12,
  },
  actionButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
    zIndex: 7,
    display: 'flex',
    flexDirection: 'column',
  },
  actionIconWrapper: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: COLORS.INPUT_BACKGROUND_BLACK_3,
    zIndex: 7,
    display: 'flex',
  },
  actionIconSelected: {
    backgroundColor: COLORS.WHITE,
  },
  actionIcon: {
    fontSize: 24,
    zIndex: 8,
    includeFontPadding: false,
    textAlignVertical: 'center',
    color: COLORS.WHITE,
  },
  actionCount: {
    color: COLORS.WHITE,
    marginVertical: 3,
    fontSize: 12,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    marginTop: 4,
    fontFamily: Platform.OS === 'web' ? '"Instrument Sans", sans-serif' : undefined,
  },
  otherContainerStyle: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 30,
    left: 15,
    right: 0,
    paddingHorizontal: 0,
    zIndex: 999,
    minHeight: 60,
    alignItems: 'center',
  },
  forYouWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(10),
    paddingLeft: moderateScale(15),
  },
  filterText: {
    fontSize: 20,
    color: COLORS.WHITE,
  },
  headerSearchWrapper: {
    flexDirection: 'row',
    marginTop: 0,
    gap: moderateScale(15),
    alignItems: 'center',
  },
  mediaIcons: {
    marginRight: moderateScale(5),
  },
  socialMediaCover: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: COLORS.INPUT_BACKGROUND_BLACK_3,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  customSocialMediaCover: {
    backgroundColor: COLORS.WHITE,
  },
  socialMediaOptionWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 18,
    color: COLORS.WHITE,
  },
  redDot: {
    height: moderateScale(10),
    width: moderateScale(10),
    borderRadius: moderateScale(5),
    backgroundColor: COLORS.RED_2,
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
    color: COLORS.WHITE,
  },
})


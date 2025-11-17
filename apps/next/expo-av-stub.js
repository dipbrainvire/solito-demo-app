// Stub for expo-av on web - we use HTML5 video instead
// This prevents Turbopack from trying to resolve expo-av imports on web

export const Video = class VideoStub {
  constructor() {
    // Stub implementation - not used on web
  }
}

export const ResizeMode = {
  COVER: 'cover',
  CONTAIN: 'contain',
  STRETCH: 'stretch',
}

export const AVPlaybackStatus = {}

export default {
  Video,
  ResizeMode,
  AVPlaybackStatus,
}
import { observable } from '@nx-js/observer-util'
import { Dimensions } from 'react-native'
import { batch } from 'startupjs'
import debounce from 'lodash/debounce'
import media from './../const/media'

const { mobile, ...MEDIA } = media // mobile is DEPRECATED
const DIMENSIONS_UPDATE_DELAY = 200
const mediaFlags = observable({})

const debouncedUpdateMedia = debounce(
  updateMediaFlags,
  DIMENSIONS_UPDATE_DELAY,
  { leading: false, trailing: true }
)

listenForMediaUpdates()

export default function useMedia () {
  return mediaFlags
}

function updateMediaFlags ({ window }) {
  batch(() => {
    for (const breakpoint of Object.keys(MEDIA).reverse()) {
      if (window.width >= MEDIA[breakpoint]) {
        if (!mediaFlags[breakpoint]) mediaFlags[breakpoint] = true
      } else {
        if (mediaFlags[breakpoint]) mediaFlags[breakpoint] = false
      }
    }
  })
}

function listenForMediaUpdates () {
  updateMediaFlags({ window: Dimensions.get('window') })
  Dimensions.addEventListener('change', debouncedUpdateMedia)
}

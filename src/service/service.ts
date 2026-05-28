import { useStore } from './store'
import { TrackService } from './track'

export const S = {
  Store: useStore(),
  Track: TrackService.getInstance()
}

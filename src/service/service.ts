import { useStore } from './store'
import { TrackService } from './track'

export const S = {
  get Store() {
    return useStore()
  },
  Track: TrackService.getInstance()
}

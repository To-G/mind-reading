import { Singleton } from './singleton'

export class TrackService extends Singleton {
  private static instance: TrackService

  static getInstance(): TrackService {
    return super.getInstance('TrackService', () => new TrackService())
  }

  init() {
    console.log('Track initialized')
  }

  track(eventName: string, data?: Record<string, unknown>) {
    console.log('Track event:', eventName, data)
  }
}

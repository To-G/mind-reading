export const IDE = {
  version: '1.0.0',
  name: 'Mind Reading',
  
  getPlatform(): string {
    if (typeof window !== 'undefined') {
      const userAgent = navigator.userAgent
      if (userAgent.includes('Android')) return 'android'
      if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'ios'
      return 'pc'
    }
    return 'unknown'
  },

  getVersion(): string {
    return this.version
  }
}

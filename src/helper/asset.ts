export const Asset = {
  getVoicePath(num: number): string {
    return `/mind-reading/assets/${num}.mp3`
  },

  getImagePath(name: string): string {
    return `/mind-reading/assets/${name}.png`
  },

  getPublicPath(name: string): string {
    return `/mind-reading/mind-reading/${name}.png`
  }
}

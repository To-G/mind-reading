export class MessageService {
  static showToast(message: string, duration = 2000) {
    const toast = document.createElement('div')
    toast.style.cssText = `
      position: fixed;
      bottom: 50px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 9999;
      animation: fadeInUp 0.3s ease;
    `
    toast.textContent = message
    document.body.appendChild(toast)

    setTimeout(() => {
      toast.style.animation = 'fadeOutDown 0.3s ease'
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 300)
    }, duration)
  }
}

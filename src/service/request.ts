import { Config } from './config'

export class RequestService {
  static async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const query = params ? new URLSearchParams(params as Record<string, string>).toString() : ''
    const fullUrl = query ? `${Config.api.baseUrl}${url}?${query}` : `${Config.api.baseUrl}${url}`
    const response = await fetch(fullUrl)
    return response.json()
  }

  static async post<T>(url: string, data?: unknown): Promise<T> {
    const response = await fetch(`${Config.api.baseUrl}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    return response.json()
  }
}

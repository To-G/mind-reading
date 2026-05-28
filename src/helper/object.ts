export const ObjectUtil = {
  deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') return obj
    if (obj instanceof Array) return [...obj] as unknown as T
    return { ...obj } as T
  },

  isEmpty(obj: unknown): boolean {
    if (obj === null || obj === undefined) return true
    if (obj instanceof Array) return obj.length === 0
    if (typeof obj === 'object') return Object.keys(obj as object).length === 0
    return false
  },

  merge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
    return { ...target, ...source }
  }
}

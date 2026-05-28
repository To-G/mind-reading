export class Singleton {
  private static instances: Map<string, unknown> = new Map()

  protected constructor() {}

  protected static getInstance<T>(className: string, creator: () => T): T {
    if (!Singleton.instances.has(className)) {
      Singleton.instances.set(className, creator())
    }
    return Singleton.instances.get(className) as T
  }
}

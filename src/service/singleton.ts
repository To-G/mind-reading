
interface ISingleton<T> {
    new (...params: any[]): T
}

export class Singleton {

    static instances: Map<string, any> = new Map()

    static make<T>(name, instance: ISingleton<T>): T {
        this.instances.has(name) || this.instances.set(name, new instance())
        return this.instances.get(name)
    }

}
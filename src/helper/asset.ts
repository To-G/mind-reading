export const AssetURL = (path: string) => {
    const base = import.meta.env.BASE_URL
    return `${base}${path}`.replace(/\/{2,}/g, '/')
}
declare module "*.vue" {
    import { Component, ComponentOptions } from "vue";
    const component: {
        name?: string;
    };
    export default component;
}

declare module "*.png"
declare module "*.mp3"
declare module "*.webp"
declare module "*.wav"
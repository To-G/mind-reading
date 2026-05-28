import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { 
        path: '/', 
        component: () => import('./MindReadingPage.vue'),
    },
]

export const Router = createRouter({
    history: createWebHistory('/mind-reading/'),
    routes,
})

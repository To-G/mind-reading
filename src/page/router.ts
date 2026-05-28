import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { 
        path: '/mind-reading', 
        component: () => import('./MindReadingPage.vue'),
    },
]

export const Router = createRouter({
    history: createWebHistory('/'),
    routes,
})
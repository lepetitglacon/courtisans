import { createRouter, createWebHistory } from 'vue-router'
import Home from "@/components/home/Home.vue";
import Games from "@/components/games/Games.vue";
import GameView from './components/game/Game.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/games', component: Games },
    { path: '/games/:id', component: GameView },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from) => {
    if (from.fullPath.startsWith('/games/')) {
        return window.confirm(
            'Êtes-vous sûr de vouloir quitter la partie ? Vous ne pourrez pas la rejoindre de nouveau.'
        )
    }
})

export {
    router,
    routes
}
import { createRouter, createWebHistory } from 'vue-router'
import Home from "@/components/home/Home.vue";
import Games from "@/components/games/Games.vue";
import GameView from '@/components/game/Game.vue'
import Scores from "@/components/Scores.vue";
import Rules from "@/components/Rules.vue";

const routes = [
    { path: '/', component: Home },
    { path: '/règles', component: Rules },
    { path: '/scores', component: Scores },
    { path: '/games', component: Games },
    { path: '/games/:id', component: GameView },
    { path: '/login', component: Rules },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    linkActiveClass: 'active',
    linkExactActiveClass: 'active-exact'
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
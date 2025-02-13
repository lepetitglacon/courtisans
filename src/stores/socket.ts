import { defineStore } from "pinia";
import {computed, ref} from "vue";
import {useChatStore} from "@/stores/chat.ts";
import {Manager, Socket} from "socket.io-client";

export const useSocketStore = defineStore("socket", () => {
    const chatStore = useChatStore()

    const socket = ref<Socket|null>(null)

    const isConnected = ref(false)
    const game = ref<{
        state: String,
        started: Boolean,
        users: [],
        cards: [],
        familyCards: [],
        userTurnId: String,
        userActionsToPlay: [],
        infos: {
            FAMILIES: {},
            POWERS: {}
        },
        score: Number
    }|null>(null)

    const currentPlayer = computed(() => {
        const user = game.value?.users?.filter(user => user.socket.id === socket.value.id)
        return user?.length > 0 ? user[0] : null
    })

    const isYourTurn = computed(() => {
        return socket.value.id === game.value?.userTurnId
    })

    function on(type, cb) {
        socket.value.on(type, cb);
    }
    function off(type, cb) {
        socket.value.off(type, cb);
    }

    function bindEvents() {
        socket.value.on("connect", () => {
            isConnected.value = true;

        });
        socket.value.on("disconnect", () => {
            isConnected.value = false;
        });

        socket.value.on("game:update", (data) => {
            // game.value = {}
            game.value = data
        });
    }

    function emit(type: string, data: any = null) {
        chatStore.postMessage(`[debug][emit] ${type} ${data}`)
        socket.value.emit(type, data);
    }

    function connect() {
        socket.value.connect();
    }

    function getPlayableFamilies() {
        return Object.entries(game.value.infos.FAMILIES).filter(([key, value]) => {
            return value.id !== 'assassin'
        })
    }

    function findUserBySocket(socketId) {
        // return game.value.users
    }

    return {
        socket,
        isConnected,
        game,
        currentPlayer,
        isYourTurn,
        getPlayableFamilies,
        emit,
        bindEvents,
        on,
        off,
        connect
    }
});
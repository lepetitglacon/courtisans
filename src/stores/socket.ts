import { defineStore } from "pinia";
import {computed, ref} from "vue";
import {useChatStore} from "@/stores/chat.ts";
import {Manager, Socket} from "socket.io-client";
import {useGameStore} from "@/stores/game.ts";
import {useSoundStore} from "@/stores/sound.ts";

export const useSocketStore = defineStore("socket", () => {
    const chatStore = useChatStore()
    const gameStore = useGameStore()

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

    const otherPlayers = computed(() => {
        return game.value?.users?.filter(user => user.socket.id !== currentPlayer.value?.socket?.id)
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
            const lastHand = currentPlayer?.value?.handCards?.length

            // game.value = {}
            game.value = data

            if (currentPlayer.value?.handCards?.length === 3 && currentPlayer.value?.handCards?.length !== lastHand) {
                useSoundStore().sounds.get('draw').play()
            }
        });
    }

    function emit(type: string, data: any = null) {
        socket.value.emit(type, data);
    }

    function playAction(additionalData: any = null) {
        const data = {
            action: gameStore.holdenCardAction,
            cardId: gameStore.holdenCard?.id,
            userId: socket?.id,
            ...additionalData
        }
        socket.value.emit('client/play', data);
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
        otherPlayers,
        isYourTurn,
        getPlayableFamilies,
        emit,
        playAction,
        bindEvents,
        on,
        off,
        connect
    }
});
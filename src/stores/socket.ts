import { defineStore } from "pinia";
import { socket } from "@/socket.ts";
import {computed, ref} from "vue";
import {useChatStore} from "@/stores/chat.ts";

export const useConnectionStore = defineStore("socket", () => {
    const chatStore = useChatStore()

    const isConnected = ref(false)
    const game = ref({})

    const currentPlayer = computed(() => {
        const user = game.value?.users?.filter(user => user.socket === socket.id)
        return user?.length > 0 ? user[0] : null
    })

    const isYourTurn = computed(() => {
        return currentPlayer.value?.socket === game.value?.userTurnId
    })

    function bindEvents() {
        socket.on("connect", () => {
            isConnected.value = true;
        });
        socket.on("disconnect", () => {
            isConnected.value = false;
        });

        socket.on("game:update", (data) => {
            // game.value = {}
            game.value = data
        });
    }

    function emit(type: string, data: any = null) {
        chatStore.postMessage(`[debug][emit] ${type} ${data}`)
        socket.emit(type, data);
    }

    function connect() {
        socket.connect();
    }

    return {
        isConnected,
        game,
        currentPlayer,
        isYourTurn,
        emit,
        bindEvents,
        connect
    }
});
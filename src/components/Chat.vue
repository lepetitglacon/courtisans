<script setup lang="ts">
import {useChatStore} from "@/stores/chat.ts";
import {nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import {useSocketStore} from "@/stores/socket.ts";

const socketStore = useSocketStore()
const chatStore = useChatStore()
const textareaValue = ref()
const messagesDivRef = ref<HTMLDivElement>()

function sendMessage() {
  const message = textareaValue.value
  socketStore.emit('client/message', {
    user: socketStore?.socket?.id,
    message: message
  })
  chatStore.postMessage(message)
  textareaValue.value = null
}

watch(chatStore.messages, (newValue) => {
  nextTick(() => {
    messagesDivRef.value.scrollTop = messagesDivRef.value.scrollHeight
  })
})

watch(() => socketStore.game?.state, (newValue) => {
  chatStore.postMessage(`[ORDI] -> ${newValue}`)
})

onMounted(() => {
  socketStore.on('message', (e) => {
    chatStore.postMessage(`${e.user}: ${e.message}`)
  })
})
onUnmounted(() => {
  chatStore.messages.length = 0
})

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault()
    sendMessage()
  }
}
</script>

<template>

  <div class="d-flex flex-column w-100 h-100">

	  <div ref="messagesDivRef" class="messages">
		  <div v-for="message of chatStore.messages">{{ message }}</div>
	  </div>

	  <div class="d-flex w-100 form">
		  <textarea @keydown="onKeyDown" class="w-100" v-model="textareaValue"></textarea>
		  <button class="btn btn-game" @click="sendMessage">Send</button>
	  </div>
  </div>

</template>

<style scoped>
.messages {
  overflow-y: scroll;
  height: 100%;

	font-size: .8em;
}

.form {
	height: 20%;
}

::-webkit-scrollbar {
	width: 15px;
}

/* Track */
::-webkit-scrollbar-track {
	box-shadow: inset 0 0 5px grey;
	border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
	background-color: rgb(169, 122, 0);
	box-shadow: inset 0 0 5px rgb(237, 192, 70);
	border-radius: 5px;
	width: 2px;
	max-width: 2px;
	transition: background-color .2s linear;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
	background-color: rgb(237, 192, 70);
}
</style>
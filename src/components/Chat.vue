<script setup lang="ts">
import {useChatStore} from "@/stores/chat.ts";
import {nextTick, ref, watch} from "vue";
import {useSocketStore} from "@/stores/socket.ts";

const socketStore = useSocketStore()
const chatStore = useChatStore()
const textareaValue = ref()
const messagesDivRef = ref<HTMLDivElement>()

function sendMessage() {
  chatStore.postMessage(textareaValue.value)
  textareaValue.value = null
}

watch(chatStore.messages, (newValue) => {
  nextTick(() => {
    messagesDivRef.value.scrollTop = messagesDivRef.value.scrollHeight
  })
})

watch(() => socketStore.game?.state, (newValue) => {
  chatStore.postMessage(`[STATE] -> ${newValue}`)
})
</script>

<template>

  <div class="d-flex flex-column w-100 h-100">

	  <div ref="messagesDivRef" class="messages">
		  <p v-for="message of chatStore.messages">{{ message }}</p>
	  </div>

	  <div class="d-flex">
		  <textarea v-model="textareaValue"></textarea>
		  <button @click="sendMessage">Send</button>
	  </div>
  </div>

</template>

<style scoped>
.messages {
  overflow-y: scroll;
  max-height: 100%;
}
</style>
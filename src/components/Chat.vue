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
  console.log(newValue)
  chatStore.postMessage(`[STATE] -> ${newValue}`)
})
</script>

<template>

  <div class="chat-container">

    <div ref="messagesDivRef" class="messages">
      <p v-for="message of chatStore.messages">{{ message }}</p>
    </div>

    <textarea v-model="textareaValue"></textarea>
    <button @click="sendMessage">Send</button>
  </div>

</template>

<style scoped>
.messages {
  overflow-y: scroll;
  max-height: 20vh;
}
</style>
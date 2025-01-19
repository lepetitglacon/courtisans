<script setup lang="ts">
import {useChatStore} from "@/stores/chat.ts";
import {ref, watch} from "vue";

const chatStore = useChatStore()
const textareaValue = ref()
const messagesDivRef = ref<HTMLDivElement>()

function sendMessage() {
  chatStore.postMessage(textareaValue.value)
  textareaValue.value = null
}

watch(chatStore.messages, (newValue) => {
  messagesDivRef.value.scrollTop = messagesDivRef.value.scrollHeight
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
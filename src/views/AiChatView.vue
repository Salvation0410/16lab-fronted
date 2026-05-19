<template>
  <div class="ai-layout">
    <aside class="panel conversation-list">
      <div class="page-header">
        <h1 class="page-title">AI助手</h1>
        <button class="icon-button" title="新对话" @click="createConversation"><Plus :size="18" /></button>
      </div>
      <div class="list">
        <button
          v-for="item in conversations"
          :key="item.id"
          :class="['list-item', activeId === item.id ? 'active-conversation' : '']"
          @click="openConversation(item.id)"
        >
          <strong>{{ item.title }}</strong>
          <span class="muted">{{ item.mbtiUsed || '未选择MBTI' }}</span>
        </button>
      </div>
    </aside>

    <section class="panel chat-panel">
      <div class="toolbar">
        <select v-model="mbtiUsed" class="form-control">
          <option value="">选择MBTI</option>
          <option v-for="type in mbtiTypes" :key="type" :value="type">{{ type }}</option>
        </select>
      </div>
      <div class="message-list">
        <div v-for="message in messages" :key="message.id" :class="['message', message.role === 'USER' ? 'mine' : 'assistant']">
          {{ message.content }}
        </div>
      </div>
      <form class="chat-input" @submit.prevent="send">
        <input v-model="content" class="form-control" placeholder="和适配你 MBTI 的助手聊聊" />
        <button class="primary-button" type="submit"><Send :size="18" />发送</button>
      </form>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Plus, Send } from 'lucide-vue-next'
import { aiApi } from '../api'

const mbtiTypes = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP']
const conversations = ref([])
const messages = ref([])
const activeId = ref(null)
const content = ref('')
const mbtiUsed = ref('')

async function loadConversations() {
  conversations.value = await aiApi.conversations()
  if (!activeId.value && conversations.value.length) {
    await openConversation(conversations.value[0].id)
  }
}

async function createConversation() {
  const conversation = await aiApi.createConversation({ title: '新的AI对话', mbtiUsed: mbtiUsed.value })
  activeId.value = conversation.id
  await loadConversations()
  await openConversation(conversation.id)
}

async function openConversation(id) {
  activeId.value = id
  messages.value = await aiApi.messages(id)
  const current = conversations.value.find((item) => item.id === id)
  mbtiUsed.value = current?.mbtiUsed || mbtiUsed.value
}

async function send() {
  if (!content.value.trim()) return
  if (!activeId.value) {
    await createConversation()
  }
  await aiApi.chat(activeId.value, { content: content.value, mbtiUsed: mbtiUsed.value })
  content.value = ''
  await openConversation(activeId.value)
  await loadConversations()
}

onMounted(loadConversations)
</script>

<style scoped>
.ai-layout {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 16px;
  max-width: 1120px;
  margin: 0 auto;
}

.conversation-list {
  align-self: start;
}

.conversation-list button {
  text-align: left;
  border: 0;
}

.active-conversation {
  outline: 2px solid #ef4f6d;
}

.chat-panel {
  min-height: 680px;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 14px;
}

.message-list {
  display: grid;
  align-content: start;
  gap: 10px;
  overflow: auto;
}

.message {
  max-width: 72%;
  padding: 12px 14px;
  border-radius: 8px;
  line-height: 1.7;
  white-space: pre-wrap;
}

.message.mine {
  justify-self: end;
  background: #ef4f6d;
  color: white;
}

.message.assistant {
  justify-self: start;
  background: #f1f3f7;
}

.chat-input {
  display: grid;
  grid-template-columns: 1fr 110px;
  gap: 10px;
}

@media (max-width: 820px) {
  .ai-layout,
  .chat-input {
    grid-template-columns: 1fr;
  }
}
</style>

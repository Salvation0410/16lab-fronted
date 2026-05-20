<template>
  <section class="ai-chat-page">
    <div class="chat-layout">
      <aside class="left-rail">
        <section class="left-panel new-chat-panel">
          <button type="button" class="new-chat-button" @click="startConversation">
            <Plus :size="18" />
            <span>新建会话</span>
          </button>
        </section>

        <section class="left-panel session-panel">
          <div
            v-for="group in groupedSessions"
            :key="group.label"
            class="session-group"
          >
            <h2>{{ group.label }}</h2>

            <button
              v-for="item in group.items"
              :key="item.id"
              type="button"
              class="session-item"
              :class="{ active: activeConversationId === item.id }"
              @click="activeConversationId = item.id"
            >
              <div class="session-dot"></div>
              <div class="session-copy">
                <div class="session-row">
                  <strong>{{ item.title }}</strong>
                  <span>{{ item.time }}</span>
                </div>
                <p>{{ item.preview }}</p>
              </div>
            </button>
          </div>

          <button type="button" class="load-more-button">加载更多会话</button>
        </section>

        <section class="left-panel usage-panel">
          <div class="usage-head">
            <strong>对话使用量</strong>
            <span>{{ usageText }}</span>
          </div>

          <div class="usage-bar">
            <span :style="{ width: `${usagePercent}%` }"></span>
          </div>

          <div class="usage-foot">
            <small>本月重置时间：06-01</small>
            <button type="button">升级无限畅聊</button>
          </div>
        </section>
      </aside>

      <main class="chat-main">
        <header class="chat-topline">
          <div>
            <span class="chat-label">当前会话</span>
            <h1>{{ activeConversation.title }}</h1>
          </div>
          <button type="button" class="rename-button">
            <PencilLine :size="16" />
          </button>
        </header>

        <section class="context-card">
          <div class="context-copy">
            <span>当前 MBTI 上下文</span>
            <div class="context-title-row">
              <div>
                <strong>{{ activePersonality.variants?.[0] || activePersonality.code }}</strong>
                <h2>{{ activePersonality.name }}</h2>
              </div>
              <button type="button" class="type-switch-button">
                <span>切换类型</span>
                <ChevronDown :size="16" />
              </button>
            </div>

            <div class="context-tags">
              <span
                v-for="tag in activeConversation.contextTags"
                :key="tag"
                class="context-tag"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <div class="context-art" aria-hidden="true">
            <div class="light-ring"></div>
            <div class="lighthouse">
              <span class="tower"></span>
              <span class="roof"></span>
              <span class="base"></span>
              <span class="water"></span>
            </div>
          </div>
        </section>

        <section class="message-thread">
          <article
            v-for="message in activeConversation.messages"
            :key="message.id"
            class="message-row"
            :class="message.role"
          >
            <div v-if="message.role === 'assistant'" class="message-avatar assistant-avatar">
              <Bot :size="20" />
            </div>

            <div class="message-bubble">
              <template v-if="message.role === 'assistant'">
                <div class="message-rich-text">
                  <p
                    v-for="(paragraph, index) in message.paragraphs"
                    :key="`${message.id}-${index}`"
                  >
                    {{ paragraph }}
                  </p>

                  <ol v-if="message.list?.length">
                    <li v-for="item in message.list" :key="item">{{ item }}</li>
                  </ol>
                </div>

                <div class="message-actions">
                  <button type="button" aria-label="点赞">
                    <ThumbsUp :size="16" />
                  </button>
                  <button type="button" aria-label="点踩">
                    <ThumbsDown :size="16" />
                  </button>
                  <button type="button" aria-label="复制">
                    <Copy :size="16" />
                  </button>
                </div>
              </template>

              <template v-else>
                <p>{{ message.content }}</p>
                <div class="message-meta">
                  <span>{{ message.time }}</span>
                  <CheckCheck :size="14" />
                </div>
              </template>
            </div>

            <div v-if="message.role === 'user'" class="message-avatar user-avatar">
              <span>U</span>
            </div>
          </article>

          <article
            v-if="isGenerating && generatingConversationId === activeConversation.id"
            class="message-row assistant"
          >
            <div class="message-avatar assistant-avatar">
              <Bot :size="20" />
            </div>
            <div class="message-bubble typing-bubble">
              <p>{{ streamingReply }}</p>
              <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </article>
        </section>

        <section class="quick-topic-strip">
          <button
            v-for="chip in bottomSuggestions"
            :key="chip"
            type="button"
            class="topic-chip"
            @click="applyPrompt(chip)"
          >
            <CircleDot :size="14" />
            <span>{{ chip }}</span>
          </button>
        </section>

        <form class="composer" @submit.prevent="sendMessage">
          <div class="composer-box">
            <textarea
              v-model="draft"
              maxlength="2000"
              placeholder="输入你的问题，Enter 发送，Shift + Enter 换行"
              @keydown.enter.exact.prevent="sendMessage"
            ></textarea>

            <button
              type="submit"
              class="send-button"
              :disabled="!draft.trim() || isGenerating"
              aria-label="发送"
            >
              <Send :size="20" />
            </button>
          </div>

          <div class="composer-foot">
            <small>AI 回答仅供参考，重要决策请结合自身情况</small>
            <span>{{ draft.length }} / 2000</span>
          </div>
        </form>
      </main>

      <aside class="right-rail">
        <section class="right-card personality-card">
          <span class="right-card-label">我的 MBTI</span>

          <div class="personality-card-body">
            <div>
              <strong>{{ activePersonality.variants?.[0] || activePersonality.code }}</strong>
              <h2>{{ activePersonality.name }}</h2>
              <RouterLink
                class="detail-link"
                :to="`/personalities/${activePersonality.code}`"
              >
                查看详情
                <ArrowRight :size="15" />
              </RouterLink>
            </div>

            <div class="mini-lighthouse" aria-hidden="true">
              <span class="mini-ring"></span>
              <span class="mini-tower"></span>
            </div>
          </div>
        </section>

        <section class="right-card setting-card">
          <button
            type="button"
            class="card-header-button"
            @click="settingsExpanded = !settingsExpanded"
          >
            <strong>会话设置</strong>
            <ChevronDown :size="16" :class="{ expanded: settingsExpanded }" />
          </button>

          <div v-if="settingsExpanded" class="setting-list">
            <label v-for="setting in settings" :key="setting.key" class="setting-item">
              <div>
                <span>{{ setting.label }}</span>
                <small>{{ setting.note }}</small>
              </div>

              <button
                type="button"
                class="toggle"
                :class="{ on: setting.enabled }"
                @click="toggleSetting(setting.key)"
              >
                <span></span>
              </button>
            </label>
          </div>
        </section>

        <section class="right-card quick-question-card">
          <div class="card-header-row">
            <strong>快捷问题</strong>
            <button type="button" class="switch-button" @click="rotateQuestions">
              <RefreshCw :size="14" />
              <span>换一换</span>
            </button>
          </div>

          <button
            v-for="question in visibleQuickQuestions"
            :key="question"
            type="button"
            class="quick-question"
            @click="applyPrompt(question)"
          >
            {{ question }}
          </button>

          <button type="button" class="more-link" @click="applyPrompt('给我更多适合 INTJ 的问题建议')">
            更多问题...
          </button>
        </section>

        <section class="right-card upgrade-card">
          <div class="upgrade-copy">
            <div>
              <strong>升级会员</strong>
              <p>解锁无限对话、深度分析、专属建议等更多功能</p>
            </div>
            <Crown :size="28" />
          </div>
          <button type="button" class="upgrade-button">立即升级</button>
        </section>

        <section class="right-card feedback-card">
          <strong>对回答满意吗？</strong>
          <p>你的反馈能帮助我们做得更好</p>
          <div class="feedback-actions">
            <button type="button" aria-label="满意">
              <ThumbsUp :size="16" />
            </button>
            <button type="button" aria-label="不满意">
              <ThumbsDown :size="16" />
            </button>
          </div>
        </section>
      </aside>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import {
  ArrowRight,
  Bot,
  CheckCheck,
  ChevronDown,
  CircleDot,
  Copy,
  Crown,
  PencilLine,
  Plus,
  RefreshCw,
  Send,
  ThumbsDown,
  ThumbsUp
} from 'lucide-vue-next'
import { getPersonalityByCode } from '../data/personalityAtlas'

const conversationGroups = ref([
  {
    label: '今天',
    items: [
      {
        id: 'career-choice',
        title: '职业选择困惑',
        preview: '我最近在考虑转行，但不知道自己适合什么方向。',
        time: '14:32',
        mbti: 'INTJ',
        contextTags: ['独立思考', '追求卓越', '战略规划'],
        messages: [
          {
            id: 'career-user-1',
            role: 'user',
            content: '我最近在考虑转行，但不知道自己适合什么方向。',
            time: '14:32'
          },
          {
            id: 'career-assistant-1',
            role: 'assistant',
            paragraphs: [
              '如果你是 INTJ，选方向时通常更看重长期成长空间，而不是眼前热闹不热闹。',
              '你现在对数据分析和策略规划更感兴趣，这其实很贴近你的优势：你擅长拆问题，也愿意为一个更好的结论先做足准备。'
            ],
            list: [
              '优先看能不能持续积累专业判断，而不是只做重复执行。',
              '尽量选择目标清楚、决策空间大的岗位。',
              '如果团队节奏很乱，你可能会消耗得比别人更快。',
              '先从你做得最顺、最有成就感的任务里找线索。'
            ]
          },
          {
            id: 'career-user-2',
            role: 'user',
            content: '我对数据分析和策略规划比较感兴趣，但担心自己不够外向，适合做管理吗？',
            time: '14:32'
          },
          {
            id: 'career-assistant-2',
            role: 'assistant',
            paragraphs: [
              '管理并不一定靠外向。对 INTJ 来说，真正有优势的往往是判断力、结构感和长期规划能力。',
              '如果你愿意把沟通当成一种可以训练的能力，而不是把“外向”当门槛，你其实很可能适合做偏策略型、带方向感的管理角色。'
            ],
            list: [
              '先从项目负责人或小团队协作开始，别急着一下跳到纯人际型管理。',
              '练的是表达清楚预期、给到判断依据、稳定推进节奏。',
              '适合你的管理方式，更像清晰、克制、可信，而不是时时刻刻高能输出。'
            ]
          }
        ]
      },
      {
        id: 'emotion-helper',
        title: '情绪管理小助手',
        preview: '最近压力有点大，容易焦虑，脑子停不下来。',
        time: '11:07',
        mbti: 'INFJ',
        contextTags: ['高敏感', '情绪整理', '自我修复'],
        messages: [
          {
            id: 'emotion-user-1',
            role: 'user',
            content: '最近压力有点大，容易焦虑，脑子停不下来。',
            time: '11:07'
          },
          {
            id: 'emotion-assistant-1',
            role: 'assistant',
            paragraphs: [
              '先别急着把自己拉回“正常状态”。很多时候，焦虑只是身体在提醒你已经绷太久了。',
              '你可以先做一件很小的事，把注意力从脑内循环切回现实，比如去接一杯水，或者把此刻最担心的事写成一句完整的话。'
            ]
          }
        ]
      },
      {
        id: 'execution',
        title: '如何提升执行力',
        preview: '总是拖延怎么办？有没有更适合我的办法？',
        time: '09:45',
        mbti: 'ENTP',
        contextTags: ['目标拆解', '抗拖延', '节奏管理'],
        messages: [
          {
            id: 'execution-user-1',
            role: 'user',
            content: '总是拖延怎么办？有没有更适合我的办法？',
            time: '09:45'
          },
          {
            id: 'execution-assistant-1',
            role: 'assistant',
            paragraphs: [
              '先别把自己定义成“执行力差”。很多拖延，其实是任务太模糊，或者你根本不想按原来的方式做。',
              '如果你更偏 ENTP，可以把任务改成“带反馈的小实验”，而不是一口气做到底的长跑。'
            ]
          }
        ]
      }
    ]
  },
  {
    label: '昨天',
    items: [
      {
        id: 'relationship',
        title: '恋爱中的沟通问题',
        preview: '和伴侣总因为小事吵架，我到底该怎么说？',
        time: '昨天',
        mbti: 'ISFJ',
        contextTags: ['关系修复', '表达边界', '情绪沟通'],
        messages: [
          {
            id: 'relationship-user-1',
            role: 'user',
            content: '和伴侣总因为小事吵架，我到底该怎么说？',
            time: '昨天'
          },
          {
            id: 'relationship-assistant-1',
            role: 'assistant',
            paragraphs: [
              '先别急着找“最正确的话术”。你们真正卡住的，通常不是措辞，而是一个人想被理解，另一个人忙着自证没有错。'
            ]
          }
        ]
      },
      {
        id: 'growth',
        title: 'INTJ 的成长建议',
        preview: '作为一个 INTJ，我想知道近阶段最该补什么。',
        time: '昨天',
        mbti: 'INTJ',
        contextTags: ['成长路径', '人际协作', '表达训练'],
        messages: [
          {
            id: 'growth-user-1',
            role: 'user',
            content: '作为一个 INTJ，我想知道近阶段最该补什么。',
            time: '昨天'
          },
          {
            id: 'growth-assistant-1',
            role: 'assistant',
            paragraphs: [
              '如果你已经有判断力和规划能力，下一步通常不是更会想，而是让别人更容易跟上你的想法。',
              '把“我已经想清楚了”翻译成“别人也能快速理解并执行”，这一步很值钱。'
            ]
          }
        ]
      }
    ]
  },
  {
    label: '更早',
    items: [
      {
        id: 'energy',
        title: '社交能量管理',
        preview: '参加聚会后总要缓很久，是不是我太不合群了？',
        time: '周六',
        mbti: 'INFP',
        contextTags: ['能量恢复', '边界感', '节奏选择'],
        messages: [
          {
            id: 'energy-user-1',
            role: 'user',
            content: '参加聚会后总要缓很久，是不是我太不合群了？',
            time: '周六'
          },
          {
            id: 'energy-assistant-1',
            role: 'assistant',
            paragraphs: [
              '这不等于你不合群，更像是你的恢复方式和别人不一样。',
              '有些人聚会后会充电，有些人会掉电。知道自己是哪一种，本身就是很有用的信息。'
            ]
          }
        ]
      },
      {
        id: 'balance',
        title: '如何平衡理想与现实',
        preview: '理想很多，现实很骨感，我该怎么落地？',
        time: '周五',
        mbti: 'ENFP',
        contextTags: ['理想落地', '行动设计', '优先级'],
        messages: [
          {
            id: 'balance-user-1',
            role: 'user',
            content: '理想很多，现实很骨感，我该怎么落地？',
            time: '周五'
          },
          {
            id: 'balance-assistant-1',
            role: 'assistant',
            paragraphs: [
              '别想着一次把全部理想都拎起来。先挑一个你最愿意持续投入的方向，让它真的开始发生。'
            ]
          }
        ]
      }
    ]
  }
])

const usage = ref({ used: 12, total: 50 })
const settings = ref([
  { key: 'remember', label: '记住我的 MBTI 上下文', note: '对话会沿用当前类型设定', enabled: true },
  { key: 'personalized', label: '使用个性化回复', note: '优先给出更贴近人格特征的表达', enabled: true },
  { key: 'process', label: '显示思考过程', note: '当前以简洁回答为主', enabled: false }
])

const quickQuestionPages = [
  [
    'INTJ 如何选择适合自己的职业？',
    '如何提升 INTJ 的人际沟通能力？',
    'INTJ 在团队中如何更好地协作？',
    'INTJ 如何管理自己的完美主义？',
    '给 INTJ 的情绪管理建议'
  ],
  [
    'INTJ 适合创业还是进大公司？',
    'INTJ 怎么建立稳定的亲密关系？',
    'INTJ 怎样避免过度内耗？',
    'INTJ 做管理时最该补哪块能力？',
    'INTJ 如何提高表达说服力？'
  ]
]

const bottomSuggestions = [
  '职业发展建议',
  '人际关系分析',
  '情绪管理技巧',
  '学习效率提升',
  '更多建议'
]

const replyPool = [
  {
    paragraphs: [
      '如果你现在更担心“我是不是不适合”，那我们可以先别急着给自己下结论。',
      '对 INTJ 来说，很多不舒服并不是能力不够，而是环境和你的工作方式不匹配。先看任务本身是不是值得你长期投入，会比单纯判断自己行不行更有用。'
    ],
    list: [
      '把你最投入、最有掌控感的任务列出来。',
      '再看这些任务背后共通的能力要求。',
      '优先找那些既能发挥判断力，又有成长空间的岗位。'
    ]
  },
  {
    paragraphs: [
      '这个问题问得很准。你其实不是没有方向，而是想在行动前先确认方向足够值得。',
      '我们可以把它拆成两步：先确认你在意什么，再看现实里哪些路径最接近这个标准。这样会比一上来就逼自己选答案轻松很多。'
    ]
  },
  {
    paragraphs: [
      '如果是站在你现在的状态看，我会更建议你先做小范围验证。',
      '先拿一周到两周做低成本尝试，比在脑子里反复推演更容易得到真实反馈。你不需要一下子决定未来几年，先让下一步更清楚就够了。'
    ]
  }
]

const activeConversationId = ref('career-choice')
const draft = ref('')
const isGenerating = ref(false)
const generatingConversationId = ref(null)
const streamingReply = ref('')
const settingsExpanded = ref(true)
const quickQuestionPageIndex = ref(0)
let replySeed = 0

const sessions = computed(() => conversationGroups.value.flatMap((group) => group.items))

const groupedSessions = computed(() => conversationGroups.value)

const activeConversation = computed(() => {
  return sessions.value.find((item) => item.id === activeConversationId.value) || sessions.value[0]
})

const activePersonality = computed(() => {
  return getPersonalityByCode(activeConversation.value?.mbti || 'INTJ') || {
    code: 'INTJ',
    name: '建筑师',
    variants: ['INTJ-A']
  }
})

const visibleQuickQuestions = computed(() => quickQuestionPages[quickQuestionPageIndex.value])

const usagePercent = computed(() => Math.min(100, Math.round((usage.value.used / usage.value.total) * 100)))
const usageText = computed(() => `${usage.value.used} / ${usage.value.total} 条`)

function startConversation() {
  const nextId = `new-${Date.now()}`
  const newSession = {
    id: nextId,
    title: '新的 AI 对话',
    preview: '从一个你最想聊的问题开始。',
    time: '刚刚',
    mbti: activePersonality.value.code,
    contextTags: ['个性探索', '方向梳理', '即时提问'],
    messages: [
      {
        id: `${nextId}-assistant`,
        role: 'assistant',
        paragraphs: ['我们可以从你现在最想解决的一个问题开始。你直接说重点就行，我来陪你一起拆。']
      }
    ]
  }

  const todayGroup = conversationGroups.value.find((group) => group.label === '今天')
  if (todayGroup) {
    todayGroup.items.unshift(newSession)
  } else {
    conversationGroups.value.unshift({
      label: '今天',
      items: [newSession]
    })
  }
  activeConversationId.value = nextId
  draft.value = ''
}

function toggleSetting(key) {
  settings.value = settings.value.map((item) =>
    item.key === key ? { ...item, enabled: !item.enabled } : item
  )
}

function rotateQuestions() {
  quickQuestionPageIndex.value = (quickQuestionPageIndex.value + 1) % quickQuestionPages.length
}

function applyPrompt(text) {
  draft.value = text
}

function sendMessage() {
  const content = draft.value.trim()
  if (!content || isGenerating.value) return

  const targetGroup = conversationGroups.value.find((group) =>
    group.items.some((item) => item.id === activeConversationId.value)
  )
  const conversation = targetGroup?.items.find((item) => item.id === activeConversationId.value)
  if (!conversation) return

  conversation.messages.push({
    id: `${conversation.id}-user-${Date.now()}`,
    role: 'user',
    content,
    time: '刚刚'
  })
  conversation.preview = content
  conversation.time = '刚刚'
  draft.value = ''

  const reply = replyPool[replySeed % replyPool.length]
  replySeed += 1
  isGenerating.value = true
  generatingConversationId.value = conversation.id
  streamingReply.value = '我在整理一个更适合你的回答...'

  window.setTimeout(() => {
    conversation.messages.push({
      id: `${conversation.id}-assistant-${Date.now()}`,
      role: 'assistant',
      paragraphs: reply.paragraphs,
      list: reply.list || []
    })
    isGenerating.value = false
    generatingConversationId.value = null
    streamingReply.value = ''
  }, 900)
}
</script>

<style scoped>
.ai-chat-page {
  width: min(100%, 1570px);
  margin: 0 auto;
  color: #16233f;
}

.chat-layout {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr) 292px;
  gap: 22px;
  align-items: start;
}

.left-rail,
.chat-main,
.right-rail {
  min-width: 0;
}

.left-rail,
.right-rail {
  display: grid;
  align-content: start;
  gap: 18px;
}

.left-rail {
  position: sticky;
  top: 96px;
}

.right-rail {
  position: sticky;
  top: 96px;
}

.left-panel,
.right-card,
.context-card,
.message-bubble,
.composer,
.chat-topline {
  border: 1px solid rgba(223, 230, 240, .92);
  border-radius: 8px;
  background: rgba(255, 255, 255, .96);
  box-shadow: 0 18px 40px rgba(46, 67, 104, .07);
}

.new-chat-panel,
.session-panel,
.usage-panel,
.right-card {
  padding: 14px;
}

.new-chat-button {
  width: 100%;
  min-height: 54px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 0;
  border-radius: 8px;
  color: #fff;
  background: linear-gradient(135deg, #3289ea, #2d73d5);
  box-shadow: 0 14px 26px rgba(47, 116, 216, .22);
  font-weight: 900;
}

.session-panel {
  display: grid;
  gap: 20px;
}

.session-group {
  display: grid;
  gap: 10px;
}

.session-group h2 {
  margin: 0;
  color: #71819a;
  font-size: 13px;
  font-weight: 800;
}

.session-item {
  width: 100%;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 10px;
  padding: 14px 12px;
  border: 1px solid transparent;
  border-radius: 8px;
  text-align: left;
  background: #fbfcfe;
}

.session-item.active {
  border-color: #acd0fa;
  background: #f1f7ff;
  box-shadow: inset 0 0 0 1px rgba(47, 116, 216, .05);
}

.session-dot {
  width: 10px;
  height: 10px;
  margin-top: 4px;
  border-radius: 50%;
  background: #d9e4f2;
}

.session-item.active .session-dot {
  background: #3d83e3;
}

.session-copy {
  min-width: 0;
}

.session-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
}

.session-row strong {
  min-width: 0;
  color: #1c2a46;
  font-size: 15px;
  line-height: 1.4;
}

.session-row span {
  flex: 0 0 auto;
  color: #8090a7;
  font-size: 12px;
  font-weight: 700;
}

.session-copy p {
  margin: 6px 0 0;
  color: #76859d;
  font-size: 13px;
  line-height: 1.55;
}

.load-more-button {
  min-height: 40px;
  border: 1px solid #e1e8f2;
  border-radius: 8px;
  color: #5f7088;
  background: #f9fbfd;
  font-weight: 800;
}

.usage-head,
.usage-foot,
.card-header-row,
.upgrade-copy,
.feedback-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.usage-head strong,
.right-card strong {
  color: #1c2945;
}

.usage-head span {
  color: #5f6f87;
  font-weight: 900;
}

.usage-bar {
  height: 8px;
  margin-top: 16px;
  overflow: hidden;
  border-radius: 999px;
  background: #ebf1f8;
}

.usage-bar span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(135deg, #47a0ff, #2d73d5);
}

.usage-foot {
  margin-top: 14px;
}

.usage-foot small,
.composer-foot small,
.setting-item small,
.feedback-card p {
  color: #8795aa;
}

.usage-foot button {
  border: 0;
  color: #3385ff;
  background: transparent;
  font-weight: 800;
}

.chat-main {
  display: grid;
  gap: 18px;
}

.chat-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 18px 20px;
}

.chat-label {
  display: inline-block;
  color: #7b8aa0;
  font-size: 13px;
  font-weight: 800;
}

.chat-topline h1 {
  margin: 8px 0 0;
  color: #152240;
  font-size: 30px;
  line-height: 1.15;
}

.rename-button {
  width: 38px;
  height: 38px;
  display: inline-grid;
  place-items: center;
  border: 1px solid #e0e7f1;
  border-radius: 10px;
  color: #65748b;
  background: #fff;
}

.context-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px;
  gap: 20px;
  overflow: hidden;
  padding: 24px;
  background:
    linear-gradient(135deg, rgba(248, 251, 255, .98), rgba(255, 253, 249, .96)),
    #fff;
}

.context-copy > span,
.right-card-label {
  color: #72829a;
  font-size: 13px;
  font-weight: 800;
}

.context-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-top: 12px;
}

.context-title-row strong,
.personality-card strong {
  display: block;
  color: #2d76d6;
  font-size: 42px;
  line-height: 1;
  font-weight: 900;
}

.context-title-row h2,
.personality-card h2 {
  margin: 8px 0 0;
  color: #152240;
  font-size: 28px;
  line-height: 1.15;
}

.type-switch-button {
  min-height: 38px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  border: 1px solid #dfe7f1;
  border-radius: 10px;
  color: #627189;
  background: #fff;
  font-weight: 800;
}

.context-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.context-tag {
  min-height: 30px;
  display: inline-flex;
  align-items: center;
  padding: 0 12px;
  border-radius: 999px;
  color: #3d83e3;
  background: #eef6ff;
  font-size: 13px;
  font-weight: 800;
}

.context-art {
  position: relative;
  min-height: 174px;
}

.light-ring {
  position: absolute;
  inset: 8px 16px 18px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(211, 230, 250, .95), rgba(240, 246, 255, .2));
}

.lighthouse {
  position: absolute;
  inset: 0;
}

.tower {
  position: absolute;
  left: 50%;
  top: 30px;
  width: 42px;
  height: 118px;
  border-radius: 10px 10px 5px 5px;
  background: repeating-linear-gradient(180deg, #fbfdff 0 18px, #2d76d6 18px 36px);
  transform: translateX(-50%);
}

.roof {
  position: absolute;
  left: 50%;
  top: 8px;
  width: 60px;
  height: 34px;
  border-radius: 14px 14px 6px 6px;
  background: linear-gradient(145deg, #2d76d6, #1d416b);
  transform: translateX(-50%);
}

.base {
  position: absolute;
  left: 50%;
  bottom: 24px;
  width: 146px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(145deg, #8dbbef, #3f83e3);
  transform: translateX(-50%);
}

.water {
  position: absolute;
  left: 22px;
  right: 22px;
  bottom: 0;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(145deg, rgba(126, 184, 244, .75), rgba(61, 131, 227, .34));
}

.message-thread {
  display: grid;
  gap: 18px;
}

.message-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.message-row.user {
  justify-content: flex-end;
}

.message-avatar {
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  border-radius: 50%;
}

.assistant-avatar {
  color: #2d76d6;
  background: #edf5ff;
}

.user-avatar {
  color: #fff;
  background: linear-gradient(145deg, #f7a860, #ff7f61);
  font-size: 13px;
  font-weight: 900;
}

.message-bubble {
  max-width: min(760px, calc(100% - 54px));
  padding: 18px 20px;
}

.message-row.user .message-bubble {
  max-width: min(620px, calc(100% - 54px));
  background: linear-gradient(180deg, #eaf4ff, #eff7ff);
}

.message-rich-text p,
.message-bubble > p {
  margin: 0;
  color: #33445f;
  line-height: 1.9;
}

.message-rich-text p + p {
  margin-top: 14px;
}

.message-rich-text ol {
  margin: 14px 0 0;
  padding-left: 22px;
  color: #33445f;
  line-height: 1.9;
}

.message-meta {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  color: #7f8ea5;
  font-size: 12px;
  font-weight: 700;
}

.message-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid #edf2f7;
}

.message-actions button,
.feedback-actions button {
  width: 30px;
  height: 30px;
  display: inline-grid;
  place-items: center;
  border: 0;
  border-radius: 8px;
  color: #6d7b91;
  background: transparent;
}

.typing-bubble {
  display: grid;
  gap: 12px;
}

.typing-dots {
  display: flex;
  gap: 6px;
}

.typing-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #c4d2e2;
  animation: pulse 1.3s ease-in-out infinite;
}

.typing-dots span:nth-child(2) {
  animation-delay: .15s;
}

.typing-dots span:nth-child(3) {
  animation-delay: .3s;
}

.quick-topic-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.topic-chip {
  min-height: 38px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 14px;
  border: 1px solid #dfe7f1;
  border-radius: 999px;
  color: #556680;
  background: #fff;
  font-weight: 800;
}

.topic-chip svg {
  color: #3d83e3;
}

.composer {
  padding: 16px 16px 14px;
}

.composer-box {
  position: relative;
  min-height: 132px;
  border: 2px solid #64a8f4;
  border-radius: 14px;
  background: #fff;
}

.composer textarea {
  width: 100%;
  min-height: 132px;
  padding: 18px 72px 18px 18px;
  border: 0;
  outline: 0;
  resize: vertical;
  color: #20304d;
  line-height: 1.8;
  background: transparent;
}

.composer textarea::placeholder {
  color: #8c98ab;
}

.send-button {
  position: absolute;
  right: 16px;
  bottom: 16px;
  width: 46px;
  height: 46px;
  display: inline-grid;
  place-items: center;
  border: 0;
  border-radius: 50%;
  color: #fff;
  background: linear-gradient(135deg, #3289ea, #2d73d5);
  box-shadow: 0 12px 24px rgba(47, 116, 216, .22);
}

.send-button:disabled {
  cursor: not-allowed;
  opacity: .55;
}

.composer-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 12px;
}

.composer-foot span {
  color: #8b98ab;
  font-size: 13px;
  font-weight: 800;
}

.personality-card-body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 104px;
  gap: 12px;
  align-items: center;
  margin-top: 18px;
}

.detail-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 18px;
  color: #3385ff;
  font-weight: 800;
}

.mini-lighthouse {
  position: relative;
  height: 104px;
  border-radius: 24px;
  overflow: hidden;
  background: linear-gradient(145deg, #eff6ff, #dcecff);
}

.mini-ring {
  position: absolute;
  inset: 12px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(204, 226, 249, .95), rgba(232, 242, 255, .25));
}

.mini-tower {
  position: absolute;
  left: 50%;
  top: 20px;
  width: 26px;
  height: 60px;
  border-radius: 6px;
  background: repeating-linear-gradient(180deg, #fff 0 10px, #2d76d6 10px 20px);
  transform: translateX(-50%);
}

.card-header-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 0;
  padding: 0;
  color: #1c2945;
  background: transparent;
}

.card-header-button svg.expanded {
  transform: rotate(180deg);
}

.setting-list {
  display: grid;
  gap: 16px;
  margin-top: 16px;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.setting-item span,
.quick-question,
.more-link {
  color: #32425d;
  font-weight: 800;
}

.setting-item small {
  display: block;
  margin-top: 4px;
  line-height: 1.45;
}

.toggle {
  width: 46px;
  height: 26px;
  flex: 0 0 auto;
  padding: 3px;
  border: 0;
  border-radius: 999px;
  background: #dce3ed;
}

.toggle span {
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  transition: transform .18s ease;
}

.toggle.on {
  background: linear-gradient(135deg, #5aaeff, #2d73d5);
}

.toggle.on span {
  transform: translateX(20px);
}

.switch-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 0;
  color: #7a8aa1;
  background: transparent;
  font-weight: 800;
}

.quick-question-card {
  display: grid;
  gap: 10px;
}

.quick-question {
  width: 100%;
  min-height: 50px;
  border: 0;
  border-top: 1px solid #edf2f7;
  padding: 14px 0 0;
  text-align: left;
  background: transparent;
  line-height: 1.55;
}

.quick-question:first-of-type {
  border-top: 0;
  padding-top: 0;
}

.more-link {
  justify-self: start;
  border: 0;
  padding: 0;
  color: #3385ff;
  background: transparent;
}

.upgrade-card {
  padding: 18px;
  background:
    linear-gradient(135deg, rgba(255, 249, 242, .98), rgba(255, 255, 255, .95)),
    #fff;
}

.upgrade-copy p {
  margin: 8px 0 0;
  color: #7a889e;
  line-height: 1.65;
}

.upgrade-copy svg {
  flex: 0 0 auto;
  color: #f3b34f;
}

.upgrade-button {
  width: 100%;
  min-height: 44px;
  margin-top: 16px;
  border: 0;
  border-radius: 10px;
  color: #fff;
  background: linear-gradient(180deg, #ff8867, #ff654d);
  box-shadow: 0 14px 26px rgba(255, 106, 83, .22);
  font-weight: 900;
}

.feedback-card p {
  margin: 10px 0 0;
  line-height: 1.6;
}

.feedback-actions {
  justify-content: flex-start;
  margin-top: 16px;
}

@keyframes pulse {
  0%,
  100% {
    opacity: .35;
    transform: translateY(0);
  }

  50% {
    opacity: 1;
    transform: translateY(-2px);
  }
}

@media (max-width: 1320px) {
  .chat-layout {
    grid-template-columns: 240px minmax(0, 1fr);
  }

  .right-rail {
    position: static;
    grid-column: 1 / -1;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 1040px) {
  .chat-layout {
    grid-template-columns: 1fr;
  }

  .left-rail,
  .right-rail {
    position: static;
  }

  .left-rail {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
  }

  .session-panel {
    grid-column: 1 / -1;
  }
}

@media (max-width: 760px) {
  .context-card,
  .personality-card-body,
  .left-rail,
  .right-rail {
    grid-template-columns: 1fr;
  }

  .chat-topline,
  .context-title-row,
  .card-header-row,
  .upgrade-copy,
  .usage-head,
  .usage-foot {
    flex-direction: column;
    align-items: flex-start;
  }

  .message-bubble,
  .message-row.user .message-bubble {
    max-width: calc(100% - 54px);
  }
}

@media (max-width: 560px) {
  .ai-chat-page {
    width: 100%;
  }

  .chat-topline,
  .context-card,
  .composer,
  .new-chat-panel,
  .session-panel,
  .usage-panel,
  .right-card {
    padding: 16px;
  }

  .chat-topline h1 {
    font-size: 24px;
  }

  .context-title-row strong,
  .personality-card strong {
    font-size: 32px;
  }

  .context-title-row h2,
  .personality-card h2 {
    font-size: 22px;
  }

  .quick-topic-strip {
    gap: 8px;
  }

  .topic-chip {
    width: 100%;
    justify-content: center;
  }
}
</style>

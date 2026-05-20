<template>
  <section v-if="personality" class="personality-detail-page">
    <div class="detail-layout">
      <div class="detail-main">
        <nav class="crumbs" aria-label="面包屑">
          <RouterLink to="/personalities">人格图鉴</RouterLink>
          <span>></span>
          <span>{{ personality.camp.name }}</span>
          <span>></span>
          <span>{{ personality.variants?.[0] || personality.code }} {{ personality.name }}</span>
        </nav>

        <section class="hero-panel surface-panel" :class="personality.camp.tone">
          <div class="hero-header">
            <div class="hero-title">
              <p>{{ personality.variants?.join(' / ') || personality.code }}</p>
              <h1>{{ personality.name }}</h1>
              <div class="hero-tags">
                <span class="pill active">{{ personality.camp.name }}</span>
                <span class="pill">{{ personality.nickname || '理性规划者' }}</span>
              </div>
            </div>

            <div class="hero-actions">
              <button type="button" class="ghost-action">
                <Share2 :size="16" />
                <span>分享</span>
              </button>
              <button type="button" class="ghost-action">
                <Star :size="16" />
                <span>收藏 {{ personality.shareCount || '1.2k' }}</span>
              </button>
            </div>
          </div>

          <div class="hero-body">
            <div class="hero-copy">
              <p class="description">{{ personality.description }}</p>
              <p class="description secondary">{{ personality.longDescription || personality.description }}</p>
            </div>

            <div class="hero-art" :class="personality.camp.tone" aria-hidden="true">
              <div class="art-orb"></div>
              <div class="lighthouse">
                <span class="tower"></span>
                <span class="light-top"></span>
                <span class="base"></span>
                <span class="water"></span>
              </div>
            </div>
          </div>

          <div class="meta-strip">
            <article v-for="item in metaItems" :key="item.label" class="meta-item">
              <component :is="item.icon" :size="16" />
              <div>
                <span>{{ item.label }}</span>
                <strong>{{ item.value }}</strong>
              </div>
            </article>
          </div>
        </section>

        <section class="variant-switch">
          <article class="variant-card active">
            <div class="variant-mark">A</div>
            <div>
              <h2>{{ personality.assertiveTitle || `${personality.code}-A` }}</h2>
              <p>{{ personality.assertiveText || '更从容自信，抗压能力更强。' }}</p>
            </div>
          </article>

          <article class="variant-card">
            <div class="variant-mark muted">T</div>
            <div>
              <h2>{{ personality.turbulentTitle || `${personality.code}-T` }}</h2>
              <p>{{ personality.turbulentText || '更能留意未完成处，也更自我审视。' }}</p>
            </div>
          </article>
        </section>

        <div class="trait-grid">
          <section class="surface-panel trait-card">
            <div class="card-head">
              <Gem :size="18" />
              <h3>优势</h3>
            </div>
            <ul>
              <li v-for="item in personality.strengths || []" :key="item">{{ item }}</li>
            </ul>
            <button type="button" class="expand-link">展开全部 <ArrowRight :size="15" /></button>
          </section>

          <section class="surface-panel trait-card">
            <div class="card-head weak">
              <CircleAlert :size="18" />
              <h3>弱点</h3>
            </div>
            <ul>
              <li v-for="item in personality.weaknesses || []" :key="item">{{ item }}</li>
            </ul>
            <button type="button" class="expand-link">展开全部 <ArrowRight :size="15" /></button>
          </section>

          <section class="surface-panel trait-card">
            <div class="card-head social">
              <MessageCircleMore :size="18" />
              <h3>社交风格</h3>
            </div>
            <ul>
              <li v-for="item in personality.socialStyle || []" :key="item">{{ item }}</li>
            </ul>
            <button type="button" class="expand-link">展开全部 <ArrowRight :size="15" /></button>
          </section>

          <section class="surface-panel trait-card">
            <div class="card-head work">
              <BriefcaseBusiness :size="18" />
              <h3>工作风格</h3>
            </div>
            <ul>
              <li v-for="item in personality.workStyle || []" :key="item">{{ item }}</li>
            </ul>
            <button type="button" class="expand-link">展开全部 <ArrowRight :size="15" /></button>
          </section>

          <section class="surface-panel trait-card">
            <div class="card-head relation">
              <Heart :size="18" />
              <h3>关系风格</h3>
            </div>
            <ul>
              <li v-for="item in personality.relationshipStyle || []" :key="item">{{ item }}</li>
            </ul>
            <button type="button" class="expand-link">展开全部 <ArrowRight :size="15" /></button>
          </section>

          <section class="surface-panel trait-card career-card">
            <div class="card-head career">
              <Sparkles :size="18" />
              <h3>适合领域</h3>
            </div>
            <div class="career-tags">
              <span v-for="item in personality.careers || []" :key="item">{{ item }}</span>
            </div>
            <button type="button" class="career-link">查看更多职业建议 <ArrowRight :size="15" /></button>
          </section>
        </div>

        <section class="communities-panel">
          <div class="section-row">
            <div>
              <h2>关联社区</h2>
              <p>你可以在这些社区里，遇到和你节奏相近的人。</p>
            </div>
            <RouterLink class="view-all" to="/square">查看全部社区</RouterLink>
          </div>

          <div class="community-grid">
            <article
              v-for="community in personality.communities || []"
              :key="community.name"
              class="surface-panel community-card"
            >
              <div class="community-art" :class="community.tone"></div>
              <div class="community-copy">
                <strong>{{ community.name }}</strong>
                <p>{{ personality.code }} 向社区，适合继续聊成长、协作和长期主义。</p>
                <small>{{ community.members }} · {{ community.posts }}</small>
              </div>
              <div class="community-actions">
                <button type="button">+ 加入</button>
                <button type="button">+ 关注</button>
              </div>
            </article>
          </div>
        </section>

        <section class="footer-banner surface-panel">
          <div>
            <strong>每一种人格都独一无二</strong>
            <p>理解自己，也理解别人。在 16Lab 里，图鉴不是终点，它更像你认识自己的起点。</p>
          </div>
          <RouterLink class="footer-button" to="/square">去社区聊聊</RouterLink>
        </section>
      </div>

      <aside class="detail-rail">
        <section class="surface-panel profile-card">
          <RouterLink class="back-link" to="/personalities">
            <ArrowLeft :size="16" />
            <span>返回人格图鉴</span>
          </RouterLink>

          <div class="rail-identity">
            <div>
              <h2>{{ personality.variants?.[0] || personality.code }}</h2>
              <strong>{{ personality.name }}</strong>
            </div>
            <div class="rail-portrait" :class="personality.camp.tone"></div>
          </div>

          <div class="hero-tags rail-tags">
            <span class="pill active">{{ personality.camp.name }}</span>
            <span class="pill">{{ personality.nickname || '独立思考者' }}</span>
          </div>

          <p class="rail-summary">{{ personality.description }}</p>

          <div class="rail-metrics">
            <article v-for="item in metaItems.slice(0, 3)" :key="`rail-${item.label}`">
              <span>{{ item.label }}</span>
              <strong>{{ item.value }}</strong>
            </article>
          </div>

          <div class="mini-variants">
            <button type="button" class="mini-variant active">A 自信型</button>
            <button type="button" class="mini-variant">T 谨慎型</button>
          </div>
        </section>

        <section class="surface-panel accordion-card">
          <button v-for="item in railSections" :key="item" type="button" class="accordion-row">
            <span>{{ item }}</span>
            <ChevronDown :size="16" />
          </button>
        </section>

        <section class="surface-panel quote-card">
          <Quote :size="18" />
          <p>{{ personality.quote }}</p>
          <strong>— {{ personality.quoteAuthor }}</strong>
        </section>

        <section class="surface-panel side-community-card">
          <div class="section-row side">
            <h3>关联社区</h3>
            <RouterLink class="view-all" to="/square">查看全部</RouterLink>
          </div>

          <article class="single-community">
            <div class="community-art blue"></div>
            <div>
              <strong>{{ personality.communities?.[0]?.name }}</strong>
              <p>{{ personality.code }} 向成长与协作社区。</p>
              <small>{{ personality.communities?.[0]?.members }} · {{ personality.communities?.[0]?.posts }}</small>
            </div>
          </article>

          <button type="button" class="join-button">+ 加入</button>
        </section>
      </aside>
    </div>
  </section>

  <section v-else class="missing-page surface-panel">
    <h1>这个人格暂时还没有准备好</h1>
    <p>先回到图鉴页看看别的类型，或者回社区继续逛逛。</p>
    <div class="missing-actions">
      <RouterLink to="/personalities">返回图鉴</RouterLink>
      <RouterLink to="/square">去社区</RouterLink>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  ChevronDown,
  CircleAlert,
  Gem,
  Heart,
  MessageCircleMore,
  Quote,
  Share2,
  Sparkles,
  Star,
  UserRound,
  VenetianMask
} from 'lucide-vue-next'
import { getPersonalityByCode } from '../data/personalityAtlas'

const route = useRoute()

const personality = computed(() => getPersonalityByCode(route.params.code))

const metaItems = computed(() => {
  if (!personality.value) return []
  return [
    { label: '人口比例', value: personality.value.population || '2.1%', icon: UserRound },
    { label: '代表色', value: personality.value.color || '湛蓝色', icon: Sparkles },
    { label: '能量来源', value: personality.value.energy || '内向 (I)', icon: VenetianMask },
    { label: '信息处理', value: personality.value.mind || '直觉 (N)', icon: Sparkles },
    { label: '决策方式', value: personality.value.nature || '思考 (T)', icon: Sparkles },
    { label: '生活方式', value: personality.value.tactics || '判断 (J)', icon: Sparkles }
  ]
})

const railSections = ['优势', '弱点', '社交风格', '工作风格', '关系风格', '适合领域']
</script>

<style scoped>
.personality-detail-page {
  width: min(100%, 1420px);
  margin: 0 auto;
  color: #13203a;
}

.detail-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 330px;
  gap: 20px;
  align-items: start;
}

.detail-main {
  display: grid;
  gap: 20px;
}

.detail-rail {
  position: sticky;
  top: 96px;
  display: grid;
  gap: 18px;
}

.surface-panel {
  border: 1px solid rgba(225, 232, 241, .95);
  border-radius: 8px;
  background: rgba(255, 255, 255, .95);
  box-shadow: 0 18px 42px rgba(47, 67, 102, .08);
}

.crumbs {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #7e8aa0;
  font-size: 13px;
  font-weight: 700;
}

.crumbs a {
  color: #5f6e85;
}

.hero-panel {
  padding: 28px;
  background:
    radial-gradient(circle at 10% 18%, rgba(193, 224, 255, .3), transparent 22%),
    linear-gradient(135deg, rgba(247, 251, 255, .98), rgba(255, 252, 248, .96));
}

.hero-header,
.section-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.hero-title p {
  margin: 0;
  color: #2f74d8;
  font-size: 34px;
  font-weight: 900;
}

.hero-title h1 {
  margin: 8px 0 0;
  font-size: 54px;
  line-height: 1.05;
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.pill {
  min-height: 30px;
  display: inline-flex;
  align-items: center;
  padding: 0 12px;
  border-radius: 999px;
  color: #69778f;
  background: #f3f6fa;
  font-size: 13px;
  font-weight: 800;
}

.pill.active {
  color: #2f74d8;
  background: #edf5ff;
}

.hero-actions {
  display: flex;
  gap: 10px;
}

.ghost-action {
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 14px;
  border: 1px solid #e2e8f1;
  border-radius: 10px;
  color: #5b6980;
  background: #fff;
  font-weight: 800;
}

.hero-body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 26px;
  align-items: center;
  margin-top: 24px;
}

.description {
  margin: 0;
  color: #53637b;
  line-height: 1.9;
  font-size: 17px;
}

.description.secondary {
  margin-top: 14px;
  color: #74839b;
}

.hero-art {
  position: relative;
  height: 300px;
}

.art-orb {
  position: absolute;
  inset: 10px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(211, 231, 251, .9), rgba(242, 248, 255, .2));
}

.lighthouse {
  position: absolute;
  inset: 0;
}

.tower {
  position: absolute;
  left: 50%;
  top: 48px;
  width: 56px;
  height: 180px;
  border-radius: 12px 12px 6px 6px;
  background:
    repeating-linear-gradient(
      180deg,
      #fdfefe 0 22px,
      #2f74d8 22px 44px
    );
  transform: translateX(-50%);
  box-shadow: 0 18px 38px rgba(47, 116, 216, .18);
}

.light-top {
  position: absolute;
  left: 50%;
  top: 20px;
  width: 78px;
  height: 52px;
  border-radius: 18px 18px 8px 8px;
  background: linear-gradient(145deg, #2f74d8, #17375f);
  transform: translateX(-50%);
}

.base {
  position: absolute;
  left: 50%;
  bottom: 44px;
  width: 190px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(145deg, #78abeb, #2f74d8);
  transform: translateX(-50%);
}

.water {
  position: absolute;
  left: 34px;
  right: 34px;
  bottom: 10px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(145deg, rgba(113, 175, 244, .7), rgba(47, 116, 216, .36));
}

.meta-strip {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 12px;
  margin-top: 26px;
}

.meta-item {
  display: grid;
  grid-template-columns: 16px minmax(0, 1fr);
  gap: 10px;
  align-items: start;
  padding: 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, .8);
}

.meta-item svg {
  color: #2f74d8;
}

.meta-item span,
.meta-item strong {
  display: block;
}

.meta-item span {
  color: #7a8699;
  font-size: 12px;
  font-weight: 700;
}

.meta-item strong {
  margin-top: 6px;
  color: #21304b;
  font-size: 14px;
}

.variant-switch {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.variant-card {
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr);
  gap: 16px;
  align-items: center;
  padding: 22px;
  border: 1px solid #e2e9f2;
  border-radius: 12px;
  background: #fff;
}

.variant-card.active {
  border-color: #bbd7fb;
  background: #f3f8ff;
}

.variant-mark {
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  color: #2f74d8;
  background: #e8f2ff;
  font-size: 28px;
  font-weight: 900;
}

.variant-mark.muted {
  color: #baa58e;
  background: #f5efe8;
}

.variant-card h2 {
  margin: 0;
  font-size: 24px;
}

.variant-card p {
  margin: 8px 0 0;
  color: #728097;
  line-height: 1.7;
}

.trait-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.trait-card {
  padding: 22px;
}

.card-head {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #2f74d8;
}

.card-head.weak {
  color: #f08d53;
}

.card-head.social {
  color: #42a26a;
}

.card-head.work {
  color: #4d84d8;
}

.card-head.relation {
  color: #d17e54;
}

.card-head.career {
  color: #3183e8;
}

.card-head h3 {
  margin: 0;
  font-size: 22px;
}

.trait-card ul {
  display: grid;
  gap: 12px;
  margin: 18px 0 0;
  padding: 0;
  list-style: none;
}

.trait-card li {
  position: relative;
  padding-left: 24px;
  color: #5f6d83;
  line-height: 1.75;
}

.trait-card li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 8px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #d3e6ff;
}

.expand-link,
.career-link,
.view-all {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 18px;
  color: #4a5a73;
  font-weight: 800;
}

.career-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.career-tags span {
  min-height: 34px;
  display: inline-flex;
  align-items: center;
  padding: 0 12px;
  border-radius: 999px;
  color: #5e6d84;
  background: #f4f7fb;
  font-weight: 800;
}

.communities-panel {
  display: grid;
  gap: 18px;
}

.section-row h2,
.section-row h3 {
  margin: 0;
}

.section-row p {
  margin: 8px 0 0;
  color: #728199;
}

.community-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 16px;
}

.community-card {
  overflow: hidden;
}

.community-art {
  height: 116px;
  border-radius: 8px;
  background: linear-gradient(145deg, #bdd7f6, #6ea2de);
}

.community-art.gold {
  background: linear-gradient(145deg, #f1d9a0, #d9a556);
}

.community-art.slate {
  background: linear-gradient(145deg, #d8e2ef, #95aec7);
}

.community-art.indigo {
  background: linear-gradient(145deg, #9fb5ec, #587ecf);
}

.community-art.amber {
  background: linear-gradient(145deg, #f3d5a1, #cf9d58);
}

.community-copy {
  margin-top: 14px;
}

.community-copy strong,
.community-copy p,
.community-copy small {
  display: block;
}

.community-copy strong {
  color: #172542;
  font-size: 18px;
}

.community-copy p {
  margin: 8px 0 0;
  color: #708099;
  line-height: 1.65;
}

.community-copy small {
  margin-top: 10px;
  color: #8390a3;
}

.community-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 16px;
}

.community-actions button,
.join-button {
  min-height: 40px;
  border: 1px solid #dbe3ee;
  border-radius: 10px;
  color: #52627a;
  background: #fff;
  font-weight: 800;
}

.footer-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 24px 26px;
  background:
    linear-gradient(135deg, rgba(240, 247, 255, .96), rgba(255, 248, 242, .95)),
    #fff;
}

.footer-banner strong {
  color: #ff6f5e;
  font-size: 24px;
}

.footer-banner p {
  max-width: 760px;
  margin: 10px 0 0;
  color: #718199;
  line-height: 1.8;
}

.footer-button {
  min-width: 146px;
  min-height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  color: #fff;
  background: linear-gradient(180deg, #ff8668, #ff634e);
  box-shadow: 0 14px 28px rgba(255, 103, 78, .22);
  font-weight: 900;
}

.profile-card,
.accordion-card,
.quote-card,
.side-community-card {
  padding: 22px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #6d7b91;
  font-weight: 800;
}

.rail-identity {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 104px;
  gap: 14px;
  align-items: center;
  margin-top: 20px;
}

.rail-identity h2 {
  margin: 0;
  color: #2f74d8;
  font-size: 34px;
  line-height: 1;
}

.rail-identity strong {
  display: block;
  margin-top: 8px;
  font-size: 30px;
}

.rail-portrait {
  height: 104px;
  border-radius: 26px;
  background: linear-gradient(145deg, #bdd7f6, #6ea2de);
}

.rail-tags {
  margin-top: 18px;
}

.rail-summary {
  margin: 18px 0 0;
  color: #607089;
  line-height: 1.8;
}

.rail-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}

.rail-metrics article span,
.rail-metrics article strong {
  display: block;
}

.rail-metrics article span {
  color: #7b879b;
  font-size: 12px;
}

.rail-metrics article strong {
  margin-top: 6px;
  color: #21304b;
}

.mini-variants {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 18px;
}

.mini-variant {
  min-height: 40px;
  border: 1px solid #e2e8f1;
  border-radius: 10px;
  color: #5b6980;
  background: #fff;
  font-weight: 800;
}

.mini-variant.active {
  border-color: #bbd7fb;
  color: #2f74d8;
  background: #f3f8ff;
}

.accordion-card {
  display: grid;
  gap: 8px;
}

.accordion-row {
  min-height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 0;
  border-bottom: 1px solid #edf2f7;
  color: #33445f;
  background: transparent;
  font-weight: 800;
}

.quote-card svg {
  color: #85b2e8;
}

.quote-card p {
  margin: 12px 0 0;
  color: #5f6f88;
  line-height: 1.9;
}

.quote-card strong {
  display: block;
  margin-top: 14px;
  color: #73829a;
}

.section-row.side {
  align-items: center;
}

.single-community {
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr);
  gap: 12px;
  align-items: center;
  margin-top: 16px;
}

.single-community strong,
.single-community p,
.single-community small {
  display: block;
}

.single-community strong {
  color: #182541;
  font-size: 18px;
}

.single-community p {
  margin: 8px 0 0;
  color: #6c7a92;
  line-height: 1.7;
}

.single-community small {
  margin-top: 10px;
  color: #8390a3;
}

.join-button {
  width: 100%;
  margin-top: 16px;
}

.missing-page {
  width: min(100%, 720px);
  margin: 40px auto 0;
  padding: 28px;
  text-align: center;
}

.missing-page h1 {
  margin: 0;
}

.missing-page p {
  margin: 14px 0 0;
  color: #73829a;
}

.missing-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 22px;
}

.missing-actions a {
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 18px;
  border: 1px solid #dbe3ee;
  border-radius: 10px;
  color: #53637b;
  background: #fff;
  font-weight: 800;
}

@media (max-width: 1240px) {
  .detail-layout {
    grid-template-columns: 1fr;
  }

  .detail-rail {
    position: static;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
  }

  .community-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 920px) {
  .hero-header,
  .hero-body,
  .variant-switch,
  .trait-grid,
  .detail-rail {
    grid-template-columns: 1fr;
  }

  .hero-header,
  .hero-actions,
  .footer-banner {
    flex-direction: column;
    align-items: flex-start;
  }

  .meta-strip {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .community-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .footer-button {
    width: 100%;
  }
}

@media (max-width: 680px) {
  .hero-panel,
  .profile-card,
  .accordion-card,
  .quote-card,
  .side-community-card,
  .trait-card,
  .footer-banner {
    padding: 18px;
  }

  .hero-title p {
    font-size: 24px;
  }

  .hero-title h1 {
    font-size: 38px;
  }

  .hero-body {
    grid-template-columns: 1fr;
  }

  .hero-art {
    height: 220px;
  }

  .meta-strip {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .community-grid,
  .detail-rail {
    grid-template-columns: 1fr;
  }

  .rail-identity,
  .single-community {
    grid-template-columns: 1fr;
  }
}
</style>

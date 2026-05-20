<template>
  <section class="personality-atlas-page">
    <div class="atlas-layout">
      <div class="atlas-main">
        <section class="atlas-hero surface-card">
          <div class="hero-copy">
            <h1>16 型人格图鉴</h1>
            <p class="hero-lead">认识你自己，也更懂他人。</p>
            <p class="hero-body">
              MBTI 将人格分成 16 种类型，分属于四大阵营。探索你的典型特质、行为风格与成长建议，也看看别人的世界是怎么运转的。
            </p>
          </div>

          <div class="hero-scene" aria-hidden="true">
            <div class="hero-person blue">
              <span class="person-head"></span>
              <span class="person-body"></span>
            </div>
            <div class="hero-person cream">
              <span class="person-head"></span>
              <span class="person-body"></span>
            </div>
            <div class="hero-person green">
              <span class="person-head"></span>
              <span class="person-body"></span>
            </div>
            <div class="hero-person orange">
              <span class="person-head"></span>
              <span class="person-body"></span>
            </div>
          </div>

          <div class="hero-features">
            <article v-for="item in heroFeatures" :key="item.title" class="hero-feature">
              <component :is="item.icon" :size="18" />
              <div>
                <strong>{{ item.title }}</strong>
                <span>{{ item.text }}</span>
              </div>
            </article>
          </div>
        </section>

        <section class="camp-section">
          <div class="section-topline">
            <div>
              <h2>四大阵营</h2>
              <p>从分析风格、价值取向到行动节奏，16 型人格会自然聚成四组。</p>
            </div>
            <button type="button" class="compare-button">
              <Scale :size="16" />
              <span>对比类型</span>
            </button>
          </div>

          <div class="camp-tabs">
            <button
              v-for="camp in camps"
              :key="camp.key"
              type="button"
              class="camp-tab"
              :class="[camp.tone, { active: activeCamp === camp.key }]"
              @click="activeCamp = camp.key"
            >
              <component :is="camp.icon" :size="18" />
              <span>{{ camp.name }}</span>
            </button>
          </div>
        </section>

        <section
          v-for="camp in visibleCampSections"
          :key="camp.key"
          class="camp-detail"
        >
          <div class="camp-header" :class="camp.tone">
            <h3>{{ camp.name }}</h3>
            <p>{{ camp.description }}</p>
          </div>

          <div class="type-grid">
            <article
              v-for="type in camp.types"
              :key="type.code"
              class="type-card surface-card"
              :class="camp.tone"
            >
              <div class="type-card-top">
                <div>
                  <div class="type-code">{{ type.code }}</div>
                  <h4>{{ type.name }}</h4>
                  <p>{{ type.brief }}</p>
                </div>

                <div class="type-illustration" :class="camp.tone" aria-hidden="true">
                  <span class="halo"></span>
                  <span class="avatar"></span>
                  <span class="prop"></span>
                </div>
              </div>

              <dl class="type-meta">
                <div>
                  <dt>代表色</dt>
                  <dd>
                    {{ type.color }}
                    <i :style="{ background: type.dot }"></i>
                  </dd>
                </div>
              </dl>

              <RouterLink class="type-link" :to="`/personalities/${type.code}`">查看详情</RouterLink>
            </article>
          </div>
        </section>

        <section class="atlas-footer surface-card">
          <div>
            <strong>每一种人格都独一无二</strong>
            <p>了解自己的性格方式，也能反过来帮你理解别人。比起贴标签，我更愿意把它看成认识自己的起点。</p>
          </div>
          <RouterLink class="footer-action" to="/square">去社区聊聊</RouterLink>
        </section>
      </div>

      <aside class="atlas-rail">
        <section class="surface-card rail-intro">
          <h2>16 型人格图鉴</h2>
          <p>认识你自己，也更懂他人。</p>
          <p class="rail-copy">
            MBTI 将人格分为 16 种类型，分属于四大阵营。探索你的典型特质、行为风格与成长建议，也看看别人的世界是怎么运转的。
          </p>

          <div class="rail-scene" aria-hidden="true">
            <span class="mini-figure blue"></span>
            <span class="mini-figure cream"></span>
            <span class="mini-figure green"></span>
            <span class="mini-figure orange"></span>
          </div>

          <div class="rail-feature-row">
            <span v-for="item in heroFeatures" :key="item.title">
              <component :is="item.icon" :size="15" />
              {{ item.title }}
            </span>
          </div>
        </section>

        <section class="surface-card rail-camps">
          <div class="rail-topline">
            <h2>四大阵营</h2>
            <button type="button" class="rail-compare">对比类型</button>
          </div>

          <div class="rail-camp-grid">
            <button
              v-for="camp in camps"
              :key="camp.key"
              type="button"
              class="rail-camp-chip"
              :class="[camp.tone, { active: activeCamp === camp.key }]"
              @click="activeCamp = camp.key"
            >
              <component :is="camp.icon" :size="16" />
              <span>{{ camp.name }}</span>
            </button>
          </div>
        </section>

        <section
          v-for="camp in camps"
          :key="`${camp.key}-rail`"
          class="surface-card rail-group"
          :class="camp.tone"
        >
          <div class="rail-group-head">
            <div>
              <h3>{{ camp.name }}</h3>
              <p>{{ camp.short }}</p>
            </div>
          </div>

          <div class="rail-type-list">
            <article
              v-for="type in camp.types.slice(0, 2)"
              :key="`${camp.key}-${type.code}`"
              class="rail-type-card"
            >
              <div class="rail-type-art" :class="camp.tone"></div>
              <div>
                <strong>{{ type.code }}</strong>
                <span>{{ type.name }}</span>
                <small>{{ type.brief }}</small>
              </div>
            </article>
          </div>

          <button type="button" class="rail-expand">展开全部 <ArrowRight :size="15" /></button>
        </section>

        <section class="surface-card rail-note">
          <strong>每一种人格都独一无二</strong>
          <p>没有更好的类型，只有更适合自己的生活方式。把图鉴当参考，再慢慢长成你自己。</p>
          <RouterLink class="rail-action" to="/square">去社区聊聊</RouterLink>
        </section>
      </aside>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowRight, Scale } from 'lucide-vue-next'
import { camps, heroFeatures } from '../data/personalityAtlas'

const activeCamp = ref('analysts')

const visibleCampSections = computed(() => {
  const current = camps.find((camp) => camp.key === activeCamp.value)
  return current ? [current, ...camps.filter((camp) => camp.key !== activeCamp.value)] : camps
})
</script>

<style scoped>
.personality-atlas-page {
  width: min(100%, 1420px);
  margin: 0 auto;
  color: #13203a;
}

.atlas-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 330px;
  gap: 20px;
  align-items: start;
}

.atlas-main {
  display: grid;
  gap: 20px;
}

.atlas-rail {
  position: sticky;
  top: 96px;
  display: grid;
  gap: 18px;
}

.surface-card {
  border: 1px solid rgba(225, 232, 241, .95);
  border-radius: 8px;
  background: rgba(255, 255, 255, .95);
  box-shadow: 0 18px 42px rgba(47, 67, 102, .08);
}

.atlas-hero {
  overflow: hidden;
  padding: 32px;
  background:
    radial-gradient(circle at 14% 26%, rgba(177, 214, 255, .35), transparent 22%),
    radial-gradient(circle at 88% 16%, rgba(255, 214, 176, .28), transparent 18%),
    linear-gradient(135deg, rgba(245, 249, 255, .98), rgba(255, 252, 248, .96));
}

.hero-copy {
  max-width: 460px;
}

.hero-copy h1 {
  margin: 0;
  font-size: 58px;
  line-height: 1.04;
}

.hero-lead {
  margin: 16px 0 0;
  color: #2d4668;
  font-size: 24px;
  font-weight: 800;
}

.hero-body {
  max-width: 540px;
  margin: 18px 0 0;
  color: #68788f;
  font-size: 17px;
  line-height: 1.9;
}

.hero-scene {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  align-items: end;
  min-height: 240px;
  margin-top: 22px;
  padding: 0 24px;
}

.hero-person {
  position: relative;
  height: 208px;
  display: grid;
  justify-items: center;
}

.person-head,
.person-body,
.mini-figure,
.avatar,
.prop,
.halo,
.rail-type-art {
  display: block;
}

.person-head {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: #f2c8a8;
}

.person-body {
  position: absolute;
  bottom: 0;
  width: 120px;
  height: 156px;
  border-radius: 34px 34px 18px 18px;
}

.hero-person.blue .person-body {
  background: linear-gradient(145deg, #4b7ec5, #79a9e8);
}

.hero-person.cream .person-body {
  background: linear-gradient(145deg, #f0d8c1, #fbefe6);
}

.hero-person.green .person-body {
  background: linear-gradient(145deg, #7eb06c, #98cb87);
}

.hero-person.orange .person-body {
  background: linear-gradient(145deg, #ff9d4a, #f07b31);
}

.hero-features {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 26px;
}

.hero-feature {
  min-height: 86px;
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr);
  gap: 12px;
  align-items: start;
  padding: 20px 16px;
  border-radius: 8px;
  background: rgba(255, 255, 255, .78);
}

.hero-feature svg,
.rail-feature-row svg {
  color: #3385ff;
}

.hero-feature strong,
.rail-note strong {
  display: block;
}

.hero-feature strong {
  color: #1a2844;
  font-size: 15px;
}

.hero-feature span {
  display: block;
  margin-top: 6px;
  color: #79869a;
  font-size: 13px;
  line-height: 1.5;
}

.camp-section,
.camp-detail {
  display: grid;
  gap: 18px;
}

.section-topline {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
}

.section-topline h2,
.camp-header h3,
.rail-intro h2,
.rail-camps h2,
.rail-group h3 {
  margin: 0;
}

.section-topline h2 {
  font-size: 30px;
}

.section-topline p,
.camp-header p,
.rail-intro p,
.rail-group p,
.rail-note p {
  color: #73819a;
}

.section-topline p {
  margin: 10px 0 0;
  line-height: 1.7;
}

.compare-button,
.rail-compare {
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid #e0e7f1;
  border-radius: 10px;
  color: #53637b;
  background: #fff;
  font-weight: 800;
}

.compare-button {
  min-width: 112px;
  padding: 0 14px;
}

.camp-tabs {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.camp-tab {
  min-height: 50px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid #e4ebf4;
  border-radius: 12px;
  background: #fff;
  font-weight: 900;
}

.camp-tab.blue {
  color: #2e76d4;
}

.camp-tab.green {
  color: #3f9f68;
}

.camp-tab.gold {
  color: #d79b2b;
}

.camp-tab.orange {
  color: #eb7d35;
}

.camp-tab.active.blue {
  border-color: #99c4f7;
  background: #f3f8ff;
}

.camp-tab.active.green {
  border-color: #a8dfbf;
  background: #f1fbf5;
}

.camp-tab.active.gold {
  border-color: #f3d28d;
  background: #fffaf0;
}

.camp-tab.active.orange {
  border-color: #ffc29a;
  background: #fff5ee;
}

.camp-header h3 {
  font-size: 28px;
}

.camp-header p {
  margin: 8px 0 0;
  line-height: 1.7;
}

.camp-header.blue h3 {
  color: #2d76d6;
}

.camp-header.green h3 {
  color: #41a36c;
}

.camp-header.gold h3 {
  color: #d89c2b;
}

.camp-header.orange h3 {
  color: #ec7d36;
}

.type-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.type-card {
  padding: 18px;
}

.type-card.blue {
  border-color: #cfe3fb;
}

.type-card.green {
  border-color: #cdeed7;
}

.type-card.gold {
  border-color: #f3e0b7;
}

.type-card.orange {
  border-color: #ffd8bf;
}

.type-card-top {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 108px;
  gap: 10px;
  align-items: center;
}

.type-code {
  font-size: 42px;
  line-height: 1;
  font-weight: 900;
}

.type-card.blue .type-code,
.type-card.blue h4 {
  color: #2d76d6;
}

.type-card.green .type-code,
.type-card.green h4 {
  color: #3ea16a;
}

.type-card.gold .type-code,
.type-card.gold h4 {
  color: #d89c2b;
}

.type-card.orange .type-code,
.type-card.orange h4 {
  color: #ec7d36;
}

.type-card h4 {
  margin: 8px 0 0;
  font-size: 24px;
}

.type-card p {
  margin: 10px 0 0;
  color: #73819a;
  line-height: 1.7;
}

.type-illustration {
  position: relative;
  height: 96px;
}

.type-illustration .halo {
  position: absolute;
  inset: 6px 8px 18px;
  border-radius: 50%;
}

.type-illustration .avatar {
  position: absolute;
  left: 24px;
  right: 24px;
  bottom: 12px;
  height: 56px;
  border-radius: 24px 24px 14px 14px;
}

.type-illustration .prop {
  position: absolute;
  bottom: 10px;
  right: 8px;
  width: 22px;
  height: 36px;
  border-radius: 10px;
}

.type-illustration.blue .halo {
  background: radial-gradient(circle, rgba(193, 224, 255, .95), rgba(226, 241, 255, .4));
}

.type-illustration.blue .avatar,
.rail-type-art.blue {
  background: linear-gradient(145deg, #84b7ef, #4c7fd0);
}

.type-illustration.blue .prop {
  background: #2d76d6;
}

.type-illustration.green .halo {
  background: radial-gradient(circle, rgba(208, 244, 219, .95), rgba(235, 252, 240, .4));
}

.type-illustration.green .avatar,
.rail-type-art.green {
  background: linear-gradient(145deg, #9bd2a5, #4ea76d);
}

.type-illustration.green .prop {
  background: #3ea16a;
}

.type-illustration.gold .halo {
  background: radial-gradient(circle, rgba(255, 236, 189, .95), rgba(255, 247, 222, .4));
}

.type-illustration.gold .avatar,
.rail-type-art.gold {
  background: linear-gradient(145deg, #efc56c, #d8a23f);
}

.type-illustration.gold .prop {
  background: #cf9331;
}

.type-illustration.orange .halo {
  background: radial-gradient(circle, rgba(255, 221, 195, .95), rgba(255, 243, 231, .4));
}

.type-illustration.orange .avatar,
.rail-type-art.orange {
  background: linear-gradient(145deg, #ffad6d, #ec7d36);
}

.type-illustration.orange .prop {
  background: #ec7d36;
}

.type-meta {
  margin: 16px 0 0;
}

.type-meta div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.type-meta dt,
.type-meta dd {
  margin: 0;
  color: #6d7b91;
  font-size: 13px;
  font-weight: 700;
}

.type-meta dd {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.type-meta i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.type-link {
  width: 100%;
  min-height: 42px;
  margin-top: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e4ebf4;
  border-radius: 10px;
  color: #35455e;
  background: #fff;
  font-weight: 800;
}

.atlas-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 24px 26px;
  background:
    linear-gradient(135deg, rgba(240, 247, 255, .96), rgba(255, 248, 242, .95)),
    #fff;
}

.atlas-footer strong {
  color: #ff6f5e;
  font-size: 24px;
}

.atlas-footer p {
  max-width: 760px;
  margin: 10px 0 0;
  color: #718199;
  line-height: 1.8;
}

.footer-action,
.rail-action {
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

.rail-intro,
.rail-camps,
.rail-group,
.rail-note {
  padding: 22px;
}

.rail-intro h2 {
  font-size: 34px;
  line-height: 1.12;
}

.rail-intro p {
  margin: 10px 0 0;
}

.rail-copy {
  line-height: 1.8;
}

.rail-scene {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-top: 18px;
}

.mini-figure {
  height: 82px;
  border-radius: 22px 22px 14px 14px;
}

.mini-figure.blue {
  background: linear-gradient(145deg, #7caee7, #4c7fd0);
}

.mini-figure.cream {
  background: linear-gradient(145deg, #f4dfc8, #efd2b7);
}

.mini-figure.green {
  background: linear-gradient(145deg, #a0cf96, #5daa72);
}

.mini-figure.orange {
  background: linear-gradient(145deg, #ffb270, #ec7d36);
}

.rail-feature-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 18px;
}

.rail-feature-row span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #5e6d84;
  font-size: 12px;
  font-weight: 800;
}

.rail-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.rail-camp-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 18px;
}

.rail-camp-chip {
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid #e5ebf4;
  border-radius: 10px;
  background: #fff;
  font-weight: 800;
}

.rail-camp-chip.blue {
  color: #2d76d6;
}

.rail-camp-chip.green {
  color: #3ea16a;
}

.rail-camp-chip.gold {
  color: #d89c2b;
}

.rail-camp-chip.orange {
  color: #ec7d36;
}

.rail-camp-chip.active.blue {
  background: #f2f8ff;
  border-color: #cde0fa;
}

.rail-camp-chip.active.green {
  background: #f2fbf6;
  border-color: #caebd5;
}

.rail-camp-chip.active.gold {
  background: #fffaf1;
  border-color: #f2dfb8;
}

.rail-camp-chip.active.orange {
  background: #fff5ee;
  border-color: #ffd9c1;
}

.rail-group.blue {
  border-color: #cfe3fb;
}

.rail-group.green {
  border-color: #cdeed7;
}

.rail-group.gold {
  border-color: #f3e0b7;
}

.rail-group.orange {
  border-color: #ffd8bf;
}

.rail-group p {
  margin: 8px 0 0;
  line-height: 1.7;
  font-size: 13px;
}

.rail-type-list {
  display: grid;
  gap: 12px;
  margin-top: 16px;
}

.rail-type-card {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  gap: 12px;
  align-items: center;
  padding: 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, .76);
}

.rail-type-art {
  height: 72px;
  border-radius: 18px;
}

.rail-type-card strong,
.rail-type-card span,
.rail-type-card small {
  display: block;
}

.rail-type-card strong {
  color: #172542;
  font-size: 24px;
  line-height: 1;
}

.rail-type-card span {
  margin-top: 6px;
  color: #31435f;
  font-weight: 800;
}

.rail-type-card small {
  margin-top: 6px;
  color: #79869a;
  line-height: 1.5;
}

.rail-expand {
  width: 100%;
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 14px;
  border: 1px solid #e4ebf4;
  border-radius: 10px;
  color: #4d5d76;
  background: #fff;
  font-weight: 800;
}

.rail-note strong {
  color: #ff6f5e;
  font-size: 24px;
}

.rail-note p {
  margin: 12px 0 0;
  line-height: 1.8;
}

.rail-action {
  width: 100%;
  margin-top: 20px;
}

@media (max-width: 1240px) {
  .atlas-layout {
    grid-template-columns: 1fr;
  }

  .atlas-rail {
    position: static;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
  }

  .type-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 920px) {
  .hero-copy h1 {
    font-size: 44px;
  }

  .hero-features,
  .type-grid,
  .atlas-rail {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .camp-tabs {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .atlas-footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .footer-action {
    width: 100%;
  }
}

@media (max-width: 680px) {
  .atlas-hero,
  .rail-intro,
  .rail-camps,
  .rail-group,
  .rail-note,
  .type-card,
  .atlas-footer {
    padding: 18px;
  }

  .hero-copy h1 {
    font-size: 36px;
  }

  .hero-lead {
    font-size: 20px;
  }

  .hero-body {
    font-size: 15px;
  }

  .hero-scene,
  .hero-features,
  .type-grid,
  .atlas-rail,
  .camp-tabs,
  .rail-camp-grid,
  .rail-feature-row {
    grid-template-columns: 1fr;
  }

  .section-topline {
    flex-direction: column;
    align-items: flex-start;
  }

  .type-card-top {
    grid-template-columns: 1fr;
  }

  .type-illustration {
    height: 78px;
  }

  .rail-intro h2 {
    font-size: 28px;
  }
}
</style>

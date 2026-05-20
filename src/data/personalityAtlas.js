import {
  BookCopy,
  Compass,
  HeartHandshake,
  RefreshCcw,
  Shield,
  Sparkles,
  Target,
  Telescope
} from 'lucide-vue-next'

export const heroFeatures = [
  { title: '专业内容', text: '基于 MBTI 官方理论', icon: BookCopy },
  { title: '通俗易懂', text: '用生活化语言来讲清楚', icon: Compass },
  { title: '持续更新', text: '社区共创与持续修订', icon: RefreshCcw },
  { title: '多维视角', text: '认识自己，也理解他人', icon: HeartHandshake }
]

export const camps = [
  {
    key: 'analysts',
    name: '分析家',
    short: '理性思考，善于拆解问题。',
    tone: 'blue',
    icon: Telescope,
    description: '理性思考，追求真理，擅长分析与创新。',
    types: [
      {
        code: 'INTJ',
        variants: ['INTJ-A', 'INTJ-T'],
        name: '建筑师',
        brief: '独立思考，善于统筹全局。',
        color: '湛蓝色',
        dot: '#2f74d8',
        shareCount: '1.2k',
        population: '2.1%',
        nickname: '独立思考者',
        energy: '内向 (I)',
        mind: '直觉 (N)',
        nature: '思考 (T)',
        tactics: '判断 (J)',
        description:
          '建筑师通常是极致理性的规划者。他们擅长从复杂信息里找到主线，把一个还很模糊的目标慢慢拆成可执行的设计。',
        longDescription:
          'INTJ 经常先想清楚方向，再决定怎么行动。他们对效率、逻辑和长期价值很敏感，愿意为了更好的结果多花一点时间做准备。',
        assertiveTitle: '自信型 (INTJ-A)',
        assertiveText: '更从容自信，抗压能力更强。',
        turbulentTitle: '谨慎型 (INTJ-T)',
        turbulentText: '更能留意未完成处，也更自我审视。',
        strengths: ['战略规划', '独立自主', '理性客观', '追求卓越'],
        weaknesses: ['过于理性', '完美主义', '不善表达', '容易固执'],
        socialStyle: ['慢热谨慎', '深度交流', '圈子较小', '尊重边界'],
        workStyle: ['目标导向', '系统思维', '独立高效', '创新驱动'],
        relationshipStyle: ['真诚长久', '理性支持', '需要空间', '表达含蓄'],
        careers: ['科技研发', '数据分析', '战略规划', '金融投资', '学术研究', '产品设计'],
        quote: '你无法提前追逐未来的点，只有在回望时，才能把它们连成一线。',
        quoteAuthor: '史蒂夫·乔布斯',
        communities: [
          { name: 'INTJ 研究所', members: '3.2k 成员', posts: '856 帖子', tone: 'blue' },
          { name: '理性思维实验室', members: '2.1k 成员', posts: '542 帖子', tone: 'gold' },
          { name: '独立成长计划', members: '1.8k 成员', posts: '452 帖子', tone: 'slate' },
          { name: '战略与系统思维', members: '2.6k 成员', posts: '823 帖子', tone: 'indigo' },
          { name: 'INTJ 职业发展圈', members: '1.9k 成员', posts: '309 帖子', tone: 'amber' }
        ]
      },
      {
        code: 'INTP',
        variants: ['INTP-A', 'INTP-T'],
        name: '逻辑学家',
        brief: '好奇心强，擅长抽象分析。',
        color: '浅雾蓝',
        dot: '#70a9f0'
      },
      {
        code: 'ENTJ',
        variants: ['ENTJ-A', 'ENTJ-T'],
        name: '指挥官',
        brief: '目标明确，推进力很强。',
        color: '星幕紫',
        dot: '#7050c9'
      },
      {
        code: 'ENTP',
        variants: ['ENTP-A', 'ENTP-T'],
        name: '辩论家',
        brief: '点子很多，喜欢挑战旧规则。',
        color: '雾紫',
        dot: '#8d67df'
      }
    ]
  },
  {
    key: 'diplomats',
    name: '外交家',
    short: '共情力强，重视关系和意义。',
    tone: 'green',
    icon: Sparkles,
    description: '共情力强，善于沟通，追求和谐与意义。',
    types: [
      { code: 'INFJ', variants: ['INFJ-A', 'INFJ-T'], name: '提倡者', brief: '理想主义，真诚温和，也有力量。', color: '森林绿', dot: '#43a66a' },
      { code: 'INFP', variants: ['INFP-A', 'INFP-T'], name: '调停者', brief: '温和细腻，外柔内韧。', color: '清草绿', dot: '#79c597' },
      { code: 'ENFJ', variants: ['ENFJ-A', 'ENFJ-T'], name: '主人公', brief: '善于鼓励别人，愿意带动氛围。', color: '晨叶绿', dot: '#58ba7e' },
      { code: 'ENFP', variants: ['ENFP-A', 'ENFP-T'], name: '竞选者', brief: '热情鲜活，常常能点亮一群人。', color: '薄荷绿', dot: '#82d4a2' }
    ]
  },
  {
    key: 'sentinels',
    name: '守护者',
    short: '务实可靠，重视秩序和责任。',
    tone: 'gold',
    icon: Shield,
    description: '务实可靠，注重秩序，守护确定感与安全。',
    types: [
      { code: 'ISTJ', variants: ['ISTJ-A', 'ISTJ-T'], name: '物流师', brief: '稳妥克制，做事讲章法。', color: '浅金色', dot: '#d8b25a' },
      { code: 'ISFJ', variants: ['ISFJ-A', 'ISFJ-T'], name: '守卫者', brief: '细心体贴，愿意默默照顾别人。', color: '暖杏色', dot: '#efc875' },
      { code: 'ESTJ', variants: ['ESTJ-A', 'ESTJ-T'], name: '总经理', brief: '执行力强，擅长推进规则落地。', color: '麦穗金', dot: '#d7a33a' },
      { code: 'ESFJ', variants: ['ESFJ-A', 'ESFJ-T'], name: '执政官', brief: '重视关系，也很会维持秩序。', color: '柔金色', dot: '#ebb95f' }
    ]
  },
  {
    key: 'explorers',
    name: '探险家',
    short: '热爱体验，行动快，反应也快。',
    tone: 'orange',
    icon: Target,
    description: '热爱自由，行动导向，追求新鲜体验与成长。',
    types: [
      { code: 'ISTP', variants: ['ISTP-A', 'ISTP-T'], name: '鉴赏家', brief: '冷静灵活，动手能力很强。', color: '橙棕色', dot: '#eb8b42' },
      { code: 'ISFP', variants: ['ISFP-A', 'ISFP-T'], name: '探险家', brief: '感受力细腻，也保有自己的节奏。', color: '暖橙色', dot: '#f0a661' },
      { code: 'ESTP', variants: ['ESTP-A', 'ESTP-T'], name: '企业家', brief: '反应快，敢试，也很会带动现场。', color: '明亮橙', dot: '#f27f32' },
      { code: 'ESFP', variants: ['ESFP-A', 'ESFP-T'], name: '表演者', brief: '外向热烈，把活力带到人群里。', color: '珊瑚橙', dot: '#ff8f4c' }
    ]
  }
]

export function getPersonalityByCode(code) {
  const target = String(code || '').toUpperCase()
  for (const camp of camps) {
    const found = camp.types.find((type) => type.code === target)
    if (found) {
      return {
        ...found,
        camp: {
          key: camp.key,
          name: camp.name,
          short: camp.short,
          tone: camp.tone,
          description: camp.description
        }
      }
    }
  }
  return null
}


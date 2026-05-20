export const currentUser = {
  id: 16,
  username: '16lab-user',
  nickname: '小海盐',
  role: 'USER',
  avatarUrl: '',
  mbti: 'INTJ-A',
  bio: '喜欢把复杂问题慢慢拆开，也喜欢在社区里遇见同频的人。',
  followingCount: 126,
  followerCount: 342,
  likeCount: '1.2k'
}

export const communities = [
  {
    id: 1,
    name: 'INTJ 研究所',
    short: 'IN',
    type: 'MBTI',
    tone: 'blue',
    members: '3.2k',
    posts: 856,
    joined: true,
    description: '聊长期主义、职业选择、边界感，以及那些不太想解释但又很在意的事。'
  },
  {
    id: 2,
    name: '情绪整理小屋',
    short: 'EQ',
    type: '成长',
    tone: 'green',
    members: '2.8k',
    posts: 641,
    joined: true,
    description: '给压力、敏感和自我修复留一个安静的位置。'
  },
  {
    id: 3,
    name: '恋爱沟通实验室',
    short: '爱',
    type: '关系',
    tone: 'rose',
    members: '5.1k',
    posts: 1204,
    joined: false,
    description: '把难开口的话说清楚一点，把关系里的误会拆小一点。'
  },
  {
    id: 4,
    name: 'ENTP 灵感角',
    short: 'EN',
    type: 'MBTI',
    tone: 'lavender',
    members: '2.1k',
    posts: 512,
    joined: false,
    description: '点子很多的人聚在一起，偶尔认真，常常好玩。'
  },
  {
    id: 5,
    name: '职业转向计划',
    short: '职',
    type: '职业',
    tone: 'gold',
    members: '4.4k',
    posts: 989,
    joined: true,
    description: '适合正在换方向、找定位、想重新规划工作节奏的人。'
  },
  {
    id: 6,
    name: 'INFP 慢速电台',
    short: '慢',
    type: 'MBTI',
    tone: 'mint',
    members: '3.6k',
    posts: 778,
    joined: false,
    description: '不急着变成谁，先把自己听清楚。'
  }
]

export const posts = [
  {
    id: 101,
    title: 'INTJ 转行做数据分析，最先补哪块能力？',
    author: '林间计划',
    authorMbti: 'INTJ',
    communityId: 1,
    communityName: 'INTJ 研究所',
    content: '我发现自己喜欢拆问题和做判断，但真正开始准备转行时，又有点不知道从哪里下手。',
    tags: ['职业选择', 'INTJ', '数据分析'],
    likes: 284,
    comments: 48,
    views: '3.1k',
    time: '20 分钟前',
    previewTone: 'paper'
  },
  {
    id: 102,
    title: '高敏感不是麻烦，我只是需要更清楚的边界',
    author: '海边便利店',
    authorMbti: 'INFJ',
    communityId: 2,
    communityName: '情绪整理小屋',
    content: '以前总觉得自己太容易被影响，后来才发现，很多时候我只是需要提前说清楚自己的节奏。',
    tags: ['高敏感', '情绪管理'],
    likes: 519,
    comments: 76,
    views: '6.4k',
    time: '1 小时前',
    previewTone: 'rain'
  },
  {
    id: 103,
    title: '和伴侣吵架时，怎么把“你不懂我”说得更具体？',
    author: '橘子汽水',
    authorMbti: 'ENFP',
    communityId: 3,
    communityName: '恋爱沟通实验室',
    content: '我想练习不攻击对方，但又不想把自己的委屈吞回去。',
    tags: ['亲密关系', '沟通'],
    likes: 361,
    comments: 92,
    views: '4.8k',
    time: '昨天',
    previewTone: 'coral'
  },
  {
    id: 104,
    title: '拖延不一定是懒，可能是任务太没有入口',
    author: '半杯冰美式',
    authorMbti: 'ENTP',
    communityId: 4,
    communityName: 'ENTP 灵感角',
    content: '我试着把任务拆成 15 分钟小实验，反而比完整计划更容易开始。',
    tags: ['执行力', '拖延'],
    likes: 198,
    comments: 31,
    views: '2.2k',
    time: '周一',
    previewTone: 'blue'
  }
]

export const notifications = [
  { id: 1, type: 'reply', title: '你的帖子收到了新回复', content: '有人分享了自己的转行经历，可能对你有帮助。', read: false, time: '刚刚' },
  { id: 2, type: 'like', title: '有人点赞了你的评论', content: '“管理不一定靠外向”这句话被 18 人点赞。', read: false, time: '12 分钟前' },
  { id: 3, type: 'system', title: '人格图鉴已更新', content: 'INTJ、INFJ 页面补充了更多成长建议。', read: true, time: '昨天' }
]

export const mbtiQuestions = [
  {
    id: 1,
    title: '当你需要做一个重要决定时，你通常会先做什么？',
    options: [
      { id: 'A', label: 'A', content: '先收集信息，尽量把逻辑想清楚。' },
      { id: 'B', label: 'B', content: '先问问自己的感受和身边人的想法。' },
      { id: 'C', label: 'C', content: '先试一小步，边做边修正。' },
      { id: 'D', label: 'D', content: '先列计划，把风险和步骤排出来。' }
    ]
  },
  {
    id: 2,
    title: '一段高质量的社交结束后，你更常见的状态是？',
    options: [
      { id: 'A', label: 'A', content: '需要独处一会儿，把能量补回来。' },
      { id: 'B', label: 'B', content: '被点燃了，还想继续聊点别的。' },
      { id: 'C', label: 'C', content: '会复盘刚才有没有说得不够好。' },
      { id: 'D', label: 'D', content: '没太多波动，事情结束就翻篇。' }
    ]
  },
  {
    id: 3,
    title: '面对一个模糊的新任务，你更容易被什么吸引？',
    options: [
      { id: 'A', label: 'A', content: '背后的规律和长期价值。' },
      { id: 'B', label: 'B', content: '它能不能解决真实的问题。' },
      { id: 'C', label: 'C', content: '有没有新鲜、有趣的可能性。' },
      { id: 'D', label: 'D', content: '有没有清楚的交付标准。' }
    ]
  },
  {
    id: 4,
    title: '别人评价你时，哪句话最接近？',
    options: [
      { id: 'A', label: 'A', content: '看起来安静，但想法很多。' },
      { id: 'B', label: 'B', content: '很会照顾气氛，也愿意帮忙。' },
      { id: 'C', label: 'C', content: '反应快，点子来得很突然。' },
      { id: 'D', label: 'D', content: '靠谱，答应的事基本会做到。' }
    ]
  }
]

export const userHistories = [
  { mbti: 'INTJ-A', startTime: '2026-05-20', endTime: '现在', note: '更关注长期规划和独立判断。' },
  { mbti: 'INFJ-T', startTime: '2026-03-18', endTime: '2026-05-19', note: '对关系和意义感更敏感。' }
]

export const adminStats = [
  { label: '注册用户', value: '12,840', trend: '+8.2%' },
  { label: '社区帖子', value: '36,291', trend: '+12.4%' },
  { label: '待处理举报', value: '18', trend: '-4' },
  { label: 'AI 对话', value: '92,104', trend: '+21.6%' }
]

export const adminRows = {
  users: [
    { id: 1, name: '小海盐', role: 'USER', status: '正常', createdAt: '2026-05-12' },
    { id: 2, name: '林间计划', role: 'USER', status: '正常', createdAt: '2026-05-10' },
    { id: 3, name: '内容管理员', role: 'ADMIN', status: '正常', createdAt: '2026-05-01' }
  ],
  posts: posts.map((post) => ({
    id: post.id,
    title: post.title,
    author: post.author,
    status: '已发布',
    createdAt: post.time
  })),
  reports: [
    { id: 1, target: '帖子 #103', reason: '争议内容', status: '待处理', createdAt: '今天' },
    { id: 2, target: '评论 #882', reason: '人身攻击', status: '已处理', createdAt: '昨天' }
  ],
  communities: communities.map((item) => ({
    id: item.id,
    name: item.name,
    type: item.type,
    members: item.members,
    status: '开放'
  }))
}

export function findPost(id) {
  return posts.find((post) => String(post.id) === String(id)) || posts[0]
}

export function findCommunity(id) {
  return communities.find((community) => String(community.id) === String(id)) || communities[0]
}

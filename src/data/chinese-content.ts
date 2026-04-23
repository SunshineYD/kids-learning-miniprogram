import type { ChineseLesson, AncientPoem, ReadingArticle, ChineseCommonSense, Grade } from '@/types'

export const chineseLessons: ChineseLesson[] = [
  {
    id: 'g1-s1-u1-l1',
    grade: 1,
    semester: 1,
    unit: 1,
    lesson: 1,
    title: '天地人',
    characters: [
      { id: 'g1-s1-u1-l1-1', character: '天', pinyin: 'tiān', meaning: '天空', strokes: 4, radicals: '一', example: '天空很蓝' },
      { id: 'g1-s1-u1-l1-2', character: '地', pinyin: 'dì', meaning: '大地', strokes: 6, radicals: '土', example: '大地回春' },
      { id: 'g1-s1-u1-l1-3', character: '人', pinyin: 'rén', meaning: '人类', strokes: 2, radicals: '人', example: '人们在唱歌' },
      { id: 'g1-s1-u1-l1-4', character: '你', pinyin: 'nǐ', meaning: '你好', strokes: 7, radicals: '亻', example: '你好吗' },
      { id: 'g1-s1-u1-l1-5', character: '我', pinyin: 'wǒ', meaning: '我们', strokes: 7, radicals: '戈', example: '我是小学生' },
      { id: 'g1-s1-u1-l1-6', character: '他', pinyin: 'tā', meaning: '他们', strokes: 5, radicals: '亻', example: '他在看书' }
    ],
    words: [
      { id: 'g1-s1-u1-l1-w1', word: '天地', pinyin: 'tiān dì', meaning: '天空和大地', example: '天地广阔' },
      { id: 'g1-s1-u1-l1-w2', word: '你我', pinyin: 'nǐ wǒ', meaning: '你和我', example: '你我都是好朋友' },
      { id: 'g1-s1-u1-l1-w3', word: '人们', pinyin: 'rén men', meaning: '许多人', example: '人们在公园里' }
    ],
    sentences: [
      { id: 'g1-s1-u1-l1-s1', sentence: '天空很蓝', pinyin: 'tiān kōng hěn lán', meaning: 'The sky is very blue' },
      { id: 'g1-s1-u1-l1-s2', sentence: '你好吗', pinyin: 'nǐ hǎo ma', meaning: 'How are you' }
    ]
  },
  {
    id: 'g1-s1-u1-l2',
    grade: 1,
    semester: 1,
    unit: 1,
    lesson: 2,
    title: '金木水火土',
    characters: [
      { id: 'g1-s1-u1-l2-1', character: '金', pinyin: 'jīn', meaning: '金子', strokes: 8, radicals: '金', example: '金色的太阳' },
      { id: 'g1-s1-u1-l2-2', character: '木', pinyin: 'mù', meaning: '树木', strokes: 4, radicals: '木', example: '大树很高' },
      { id: 'g1-s1-u1-l2-3', character: '水', pinyin: 'shuǐ', meaning: '流水', strokes: 4, radicals: '水', example: '河水很清' },
      { id: 'g1-s1-u1-l2-4', character: '火', pinyin: 'huǒ', meaning: '大火', strokes: 4, radicals: '火', example: '火苗在跳动' },
      { id: 'g1-s1-u1-l2-5', character: '土', pinyin: 'tǔ', meaning: '土地', strokes: 3, radicals: '土', example: '土地很肥沃' }
    ],
    words: [
      { id: 'g1-s1-u1-l2-w1', word: '金木水火土', pinyin: 'jīn mù shuǐ huǒ tǔ', meaning: 'five elements', example: '金木水火土是五行' },
      { id: 'g1-s1-u1-l2-w2', word: '树木', pinyin: 'shù mù', meaning: 'tree', example: '山上有很多树木' }
    ],
    sentences: [
      { id: 'g1-s1-u1-l2-s1', sentence: '金木水火土', pinyin: 'jīn mù shuǐ huǒ tǔ', meaning: 'Five elements' },
      { id: 'g1-s1-u1-l2-s2', sentence: '河水很清', pinyin: 'hé shuǐ hěn qīng', meaning: 'The river is very clear' }
    ]
  },
  {
    id: 'g2-s1-u1-l1',
    grade: 2,
    semester: 1,
    unit: 1,
    lesson: 1,
    title: '秋天的图画',
    characters: [
      { id: 'g2-s1-u1-l1-1', character: '秋', pinyin: 'qiū', meaning: '秋天', strokes: 9, radicals: '禾', example: '秋天来了' },
      { id: 'g2-s1-u1-l1-2', character: '画', pinyin: 'huà', meaning: '图画', strokes: 8, radicals: '一', example: '这是一幅画' },
      { id: 'g2-s1-u1-l1-3', character: '梨', pinyin: 'lí', meaning: '梨子', strokes: 11, radicals: '木', example: '梨子很香甜' },
      { id: 'g2-s1-u1-l1-4', character: '苹', pinyin: 'píng', meaning: '苹果', strokes: 8, radicals: '艹', example: '苹果红红的' },
      { id: 'g2-s1-u1-l1-5', character: '浪', pinyin: 'làng', meaning: '波浪', strokes: 10, radicals: '氵', example: '海面上有波浪' }
    ],
    words: [
      { id: 'g2-s1-u1-l1-w1', word: '秋天', pinyin: 'qiū tiān', meaning: 'autumn', example: '秋天是丰收的季节' },
      { id: 'g2-s1-u1-l1-w2', word: '图画', pinyin: 'tú huà', meaning: 'picture', example: '我喜欢画画' },
      { id: 'g2-s1-u1-l1-w3', word: '苹果', pinyin: 'píng guǒ', meaning: 'apple', example: '苹果很好吃' }
    ],
    sentences: [
      { id: 'g2-s1-u1-l1-s1', sentence: '秋天来了', pinyin: 'qiū tiān lái le', meaning: 'Autumn is coming' },
      { id: 'g2-s1-u1-l1-s2', sentence: '苹果红红的', pinyin: 'píng guǒ hóng hóng de', meaning: 'The apples are red' }
    ]
  },
  {
    id: 'g3-s1-u1-l1',
    grade: 3,
    semester: 1,
    unit: 1,
    lesson: 1,
    title: '我们的民族小学',
    characters: [
      { id: 'g3-s1-u1-l1-1', character: '民', pinyin: 'mín', meaning: '民族', strokes: 5, radicals: '乙', example: '五十六个民族' },
      { id: 'g3-s1-u1-l1-2', character: '族', pinyin: 'zú', meaning: '家族', strokes: 11, radicals: '方', example: '汉族是最大的民族' },
      { id: 'g3-s1-u1-l1-3', character: '铜', pinyin: 'tóng', meaning: '铜钟', strokes: 11, radicals: '钅', example: '这是一个铜钟' },
      { id: 'g3-s1-u1-l1-4', character: '钟', pinyin: 'zhōng', meaning: '钟表', strokes: 9, radicals: '钅', example: '钟表在滴答响' },
      { id: 'g3-s1-u1-l1-5', character: '戴', pinyin: 'dài', meaning: '穿戴', strokes: 17, radicals: '戈', example: '他戴着帽子' }
    ],
    words: [
      { id: 'g3-s1-u1-l1-w1', word: '民族', pinyin: 'mín zú', meaning: 'nation', example: '我们是一个多民族国家' },
      { id: 'g3-s1-u1-l1-w2', word: '铜钟', pinyin: 'tóng zhōng', meaning: 'bronze bell', example: '古老的铜钟' },
      { id: 'g3-s1-u1-l1-w3', word: '穿戴', pinyin: 'chuān dài', meaning: 'wear', example: '穿戴整齐' }
    ],
    sentences: [
      { id: 'g3-s1-u1-l1-s1', sentence: '我们的民族小学', pinyin: 'wǒ men de mín zú xiǎo xué', meaning: 'Our ethnic primary school' },
      { id: 'g3-s1-u1-l1-s2', sentence: '铜钟在敲响', pinyin: 'tóng zhōng zài qiāo xiǎng', meaning: 'The bronze bell is ringing' }
    ]
  },
  {
    id: 'g4-s1-u1-l1',
    grade: 4,
    semester: 1,
    unit: 1,
    lesson: 1,
    title: '观潮',
    characters: [
      { id: 'g4-s1-u1-l1-1', character: '潮', pinyin: 'cháo', meaning: '潮水', strokes: 15, radicals: '氵', example: '钱塘江大潮' },
      { id: 'g4-s1-u1-l1-2', character: '据', pinyin: 'jù', meaning: '根据', strokes: 11, radicals: '扌', example: '据我所知' },
      { id: 'g4-s1-u1-l1-3', character: '堤', pinyin: 'dī', meaning: '河堤', strokes: 12, radicals: '土', example: '河堤很高' },
      { id: 'g4-s1-u1-l1-4', character: '阔', pinyin: 'kuò', meaning: '宽阔', strokes: 12, radicals: '门', example: '宽阔的马路' },
      { id: 'g4-s1-u1-l1-5', character: '盼', pinyin: 'pàn', meaning: '盼望', strokes: 9, radicals: '目', example: '我盼望着放假' }
    ],
    words: [
      { id: 'g4-s1-u1-l1-w1', word: '潮水', pinyin: 'cháo shuǐ', meaning: 'tide', example: '潮水涌过来了' },
      { id: 'g4-s1-u1-l1-w2', word: '宽阔', pinyin: 'kuān kuò', meaning: 'wide', example: '宽阔的江面' },
      { id: 'g4-s1-u1-l1-w3', word: '盼望', pinyin: 'pàn wàng', meaning: 'hope', example: '盼望新年的到来' }
    ],
    sentences: [
      { id: 'g4-s1-u1-l1-s1', sentence: '钱塘江大潮', pinyin: 'qián táng jiāng dà cháo', meaning: 'Qiantang River tide' },
      { id: 'g4-s1-u1-l1-s2', sentence: '宽阔的江面', pinyin: 'kuān kuò de jiāng miàn', meaning: 'Wide river surface' }
    ]
  }
]

export const ancientPoems: AncientPoem[] = [
  {
    id: 'poem-1',
    title: '静夜思',
    author: '李白',
    dynasty: '唐',
    content: [
      '床前明月光，',
      '疑是地上霜。',
      '举头望明月，',
      '低头思故乡。'
    ],
    translation: '明亮的月光洒在床前的窗户纸上，好像地上泛起了一层白霜。我禁不住抬起头来，看那天窗外空中的一轮明月，不由得低头沉思，想起远方的家乡。',
    appreciation: '这是写远客思乡之情的诗，诗以明白如话的语言雕琢出明静醉人的秋夜的意境。',
    grade: 1,
    semester: 1
  },
  {
    id: 'poem-2',
    title: '春晓',
    author: '孟浩然',
    dynasty: '唐',
    content: [
      '春眠不觉晓，',
      '处处闻啼鸟。',
      '夜来风雨声，',
      '花落知多少。'
    ],
    translation: '春日里贪睡不知不觉天已破晓，搅乱我酣眠的是那啁啾的小鸟。昨天夜里风声雨声一直不断，那娇美的春花不知被吹落了多少？',
    appreciation: '诗人抓住春天的早晨刚刚醒来时的一瞬间展开联想，描绘了一幅春天早晨绚丽的图景。',
    grade: 1,
    semester: 2
  },
  {
    id: 'poem-3',
    title: '登鹳雀楼',
    author: '王之涣',
    dynasty: '唐',
    content: [
      '白日依山尽，',
      '黄河入海流。',
      '欲穷千里目，',
      '更上一层楼。'
    ],
    translation: '夕阳依傍着西山慢慢地沉没，滔滔黄河朝着东海汹涌奔流。若想把千里的风光景物看够，那就要登上更高的一层城楼。',
    appreciation: '这首诗写诗人在登高望远中表现出来的不凡的胸襟抱负，反映了盛唐时期人们积极向上的进取精神。',
    grade: 2,
    semester: 1
  },
  {
    id: 'poem-4',
    title: '望庐山瀑布',
    author: '李白',
    dynasty: '唐',
    content: [
      '日照香炉生紫烟，',
      '遥看瀑布挂前川。',
      '飞流直下三千尺，',
      '疑是银河落九天。'
    ],
    translation: '香炉峰在阳光的照射下生起紫色烟霞，远远望见瀑布似白色绢绸悬挂在山前。高崖上飞腾直落的瀑布好像有几千尺，让人恍惚以为银河从天上泻落到人间。',
    appreciation: '这首诗极其成功地运用了比喻、夸张和想象，构思奇特，语言生动形象、洗炼明快。',
    grade: 2,
    semester: 2
  },
  {
    id: 'poem-5',
    title: '山行',
    author: '杜牧',
    dynasty: '唐',
    content: [
      '远上寒山石径斜，',
      '白云生处有人家。',
      '停车坐爱枫林晚，',
      '霜叶红于二月花。'
    ],
    translation: '山石小路远上山巅弯弯又斜斜，白云生发之处隐隐约约有几户人家。只因爱那枫林晚景我把马车停下，霜染的枫叶胜过鲜艳二月的花。',
    appreciation: '这是一首描写和赞美深秋山林景色的七言绝句，诗人描绘了一幅由山路、人家、白云、红叶构成的山林秋色图。',
    grade: 3,
    semester: 1
  },
  {
    id: 'poem-6',
    title: '赠汪伦',
    author: '李白',
    dynasty: '唐',
    content: [
      '李白乘舟将欲行，',
      '忽闻岸上踏歌声。',
      '桃花潭水深千尺，',
      '不及汪伦送我情。'
    ],
    translation: '李白坐上小船刚刚要离开，忽然听到岸上传来告别的歌声。即使桃花潭水有一千尺那么深，也不及汪伦送别我的一片情深。',
    appreciation: '此诗前两句叙事，后两句抒情，赞美了汪伦对诗人的敬佩和喜爱，也表达了李白对汪伦的深厚情谊。',
    grade: 3,
    semester: 2
  },
  {
    id: 'poem-7',
    title: '黄鹤楼送孟浩然之广陵',
    author: '李白',
    dynasty: '唐',
    content: [
      '故人西辞黄鹤楼，',
      '烟花三月下扬州。',
      '孤帆远影碧空尽，',
      '唯见长江天际流。'
    ],
    translation: '老朋友向我频频挥手，告别了黄鹤楼，在这柳絮如烟、繁花似锦的阳春三月去扬州远游。友人的孤船帆影渐渐地远去，消失在碧空的尽头，只看见一线长江，向邈远的天际奔流。',
    appreciation: '这是一首送别诗，寓离情于写景。诗人用绚烂的春色和浩瀚的长江作为背景，烘托出送别时的依依惜别之情。',
    grade: 4,
    semester: 1
  },
  {
    id: 'poem-8',
    title: '饮湖上初晴后雨',
    author: '苏轼',
    dynasty: '宋',
    content: [
      '水光潋滟晴方好，',
      '山色空蒙雨亦奇。',
      '欲把西湖比西子，',
      '淡妆浓抹总相宜。'
    ],
    translation: '晴天，西湖水波荡漾，在阳光照耀下，光彩熠熠，美极了。下雨时，远处的山笼罩在烟雨之中，时隐时现，眼前一片迷茫，这朦胧的景色也是非常漂亮的。如果把美丽的西湖比作美人西施，那么淡妆也好，浓妆也罢，总能很好地烘托出她的天生丽质和迷人神韵。',
    appreciation: '这首诗概括性很强，它不是描写西湖的一处之景、一时之景，而是对西湖美景的全面评价。',
    grade: 4,
    semester: 2
  }
]

export const readingArticles: ReadingArticle[] = [
  {
    id: 'reading-1',
    title: '春天来了',
    content: '春天来了，小草从地下探出头来，那是春天的眉毛吧？早开的野花一朵两朵，那是春天的眼睛吧？树木吐出点点嫩芽，那是春天的音符吧？解冻的小溪叮叮咚咚，那是春天的琴声吧？',
    grade: 1,
    questions: [
      { id: 'r1-q1', question: '小草像春天的什么？', options: ['眼睛', '眉毛', '音符', '琴声'], answer: 1, explanation: '文中说"小草从地下探出头来，那是春天的眉毛吧？"' },
      { id: 'r1-q2', question: '野花像春天的什么？', options: ['眼睛', '眉毛', '音符', '琴声'], answer: 0, explanation: '文中说"早开的野花一朵两朵，那是春天的眼睛吧？"' },
      { id: 'r1-q3', question: '小溪发出什么声音？', options: ['哗哗', '叮叮咚咚', '滴滴答答', '淅淅沥沥'], answer: 1, explanation: '文中说"解冻的小溪叮叮咚咚"' }
    ]
  },
  {
    id: 'reading-2',
    title: '美丽的夏天',
    content: '夏天来了，池塘里的荷花盛开了，粉红色的花瓣像小姑娘的笑脸。荷叶圆圆的，绿绿的，像一把把小伞。青蛙在荷叶上唱歌，蜻蜓在荷花间飞舞。夏天真美丽！',
    grade: 2,
    questions: [
      { id: 'r2-q1', question: '荷花是什么颜色的？', options: ['白色', '黄色', '粉红色', '紫色'], answer: 2, explanation: '文中说"粉红色的花瓣像小姑娘的笑脸"' },
      { id: 'r2-q2', question: '荷叶像什么？', options: ['小船', '小伞', '盘子', '月亮'], answer: 1, explanation: '文中说"荷叶圆圆的，绿绿的，像一把把小伞"' },
      { id: 'r2-q3', question: '谁在荷叶上唱歌？', options: ['小鸟', '蜻蜓', '青蛙', '蝉'], answer: 2, explanation: '文中说"青蛙在荷叶上唱歌"' }
    ]
  },
  {
    id: 'reading-3',
    title: '秋天的雨',
    content: '秋天的雨，是一把钥匙。它带着清凉和温柔，轻轻地，轻轻地，趁你没留意，把秋天的大门打开了。秋天的雨，有一盒五彩缤纷的颜料。你看，它把黄色给了银杏树，黄黄的叶子像一把把小扇子，扇哪扇哪，扇走了夏天的炎热。',
    grade: 3,
    questions: [
      { id: 'r3-q1', question: '秋天的雨是什么？', options: ['一把钥匙', '一盒颜料', '一把扇子', '一阵风'], answer: 0, explanation: '文中说"秋天的雨，是一把钥匙"' },
      { id: 'r3-q2', question: '秋天的雨把黄色给了谁？', options: ['枫树', '银杏树', '松树', '梧桐树'], answer: 1, explanation: '文中说"它把黄色给了银杏树"' },
      { id: 'r3-q3', question: '银杏叶子像什么？', options: ['小船', '小伞', '小扇子', '小手掌'], answer: 2, explanation: '文中说"黄黄的叶子像一把把小扇子"' }
    ]
  },
  {
    id: 'reading-4',
    title: '冬天的雪',
    content: '冬天来了，雪花从天空中飘落下来，像一只只白色的蝴蝶在空中飞舞。不一会儿，地上白了，树上白了，房子上也白了，整个世界变成了银白色的海洋。小朋友们在雪地里堆雪人、打雪仗，玩得可开心了！',
    grade: 4,
    questions: [
      { id: 'r4-q1', question: '雪花像什么？', options: ['白色的花朵', '白色的蝴蝶', '白色的羽毛', '白色的纸片'], answer: 1, explanation: '文中说"雪花从天空中飘落下来，像一只只白色的蝴蝶在空中飞舞"' },
      { id: 'r4-q2', question: '雪后世界变成了什么颜色？', options: ['金色', '绿色', '银白色', '蓝色'], answer: 2, explanation: '文中说"整个世界变成了银白色的海洋"' },
      { id: 'r4-q3', question: '小朋友们在雪地里做什么？', options: ['滑雪', '滑冰', '堆雪人、打雪仗', '跑步'], answer: 2, explanation: '文中说"小朋友们在雪地里堆雪人、打雪仗"' }
    ]
  }
]

export const chineseCommonSenses: ChineseCommonSense[] = [
  { id: 'cs-1', question: '中国的首都是哪里？', options: ['上海', '北京', '广州', '深圳'], answer: 1, explanation: '中国的首都是北京' },
  { id: 'cs-2', question: '中国有多少个民族？', options: ['55个', '56个', '57个', '58个'], answer: 1, explanation: '中国有56个民族' },
  { id: 'cs-3', question: '一年有多少个季节？', options: ['3个', '4个', '5个', '6个'], answer: 1, explanation: '一年有春夏秋冬四个季节' },
  { id: 'cs-4', question: '一星期有多少天？', options: ['5天', '6天', '7天', '8天'], answer: 2, explanation: '一星期有七天' },
  { id: 'cs-5', question: '端午节是为了纪念谁？', options: ['李白', '杜甫', '屈原', '苏轼'], answer: 2, explanation: '端午节是为了纪念屈原' },
  { id: 'cs-6', question: '春节是农历的哪一天？', options: ['正月初一', '正月十五', '八月十五', '九月初九'], answer: 0, explanation: '春节是农历正月初一' },
  { id: 'cs-7', question: '月亮在什么时候最圆？', options: ['初一', '十五', '三十', '每天都圆'], answer: 1, explanation: '月亮在农历十五最圆' },
  { id: 'cs-8', question: '我们的国旗是什么颜色的？', options: ['蓝色', '绿色', '红色', '黄色'], answer: 2, explanation: '我们的国旗是红色的' },
  { id: 'cs-9', question: '中国的国旗叫什么名字？', options: ['五星红旗', '太阳旗', '星条旗', '米字旗'], answer: 0, explanation: '中国的国旗叫五星红旗' },
  { id: 'cs-10', question: '我国最长的河流是什么？', options: ['黄河', '长江', '珠江', '淮河'], answer: 1, explanation: '我国最长的河流是长江' },
  { id: 'cs-11', question: '我们的母亲河是哪条河？', options: ['长江', '黄河', '珠江', '淮河'], answer: 1, explanation: '我们的母亲河是黄河' },
  { id: 'cs-12', question: '我国的国宝是什么动物？', options: ['老虎', '狮子', '熊猫', '大象'], answer: 2, explanation: '我国的国宝是熊猫' },
  { id: 'cs-13', question: '下面哪个不是四大发明？', options: ['火药', '指南针', '造纸术', '丝绸'], answer: 3, explanation: '四大发明是火药、指南针、造纸术、印刷术' },
  { id: 'cs-14', question: '中秋节吃什么传统食品？', options: ['饺子', '粽子', '月饼', '汤圆'], answer: 2, explanation: '中秋节吃月饼' },
  { id: 'cs-15', question: '我国古代的四大名著不包括？', options: ['西游记', '红楼梦', '西厢记', '三国演义'], answer: 2, explanation: '四大名著是西游记、红楼梦、三国演义、水浒传' }
]

export function getLessonsByGrade(grade: Grade): ChineseLesson[] {
  return chineseLessons.filter(lesson => lesson.grade === grade)
}

export function getPoemsByGrade(grade: Grade): AncientPoem[] {
  return ancientPoems.filter(poem => poem.grade === grade)
}

export function getReadingByGrade(grade: Grade): ReadingArticle[] {
  return readingArticles.filter(article => article.grade === grade)
}

export function getRandomCommonSense(count: number = 5): ChineseCommonSense[] {
  const shuffled = [...chineseCommonSenses].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

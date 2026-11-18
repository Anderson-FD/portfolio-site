import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, Camera, ChevronLeft, ChevronRight, Handshake, Mail, Menu, Palette, PenTool, Phone, Sparkles, X } from 'lucide-react';
/* 名片换成 ProfileCard 之后，BorderGlow 在这个站里就没有使用处了，导入一并去掉
   （组件文件还在 components/ 里，想回到那版直接接回来即可）。 */
import AccordionGallery from './components/AccordionGallery';
import ProfileCard from './components/ProfileCard';
import './index.css';

// 首屏背景视频。当前只有一条（"废墟花园"）；数组结构保留，方便以后恢复多条轮播。
// 注意：换片子必须同步复核 index.css 里 .video-bg video 的 filter 与 .video-bg::after 的遮罩——
// 一是为了画面本身好看，二是为了压在它上面的白字仍然达标（实测口径见 _portfolio-work 的对比度脚本）。
// 原三条（平均亮度 34%–46%，属高亮抽象光效）：
//   WATER WAVE   .../hf_20260629_030107_874273ea-684a-4e90-bb96-8fdfde48d53d.mp4
//   GRIDWAVE     .../hf_20260629_032424_3c9c2a9d-807b-4482-80e6-dd6d9dfd4545.mp4
//   LIGHT TUNNEL .../hf_20260627_094019_4214ea73-b963-46a4-8327-61489192de99.mp4
const VIDEO_HOST = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/';
const HERO_VIDEOS = [
  { label: 'GARDEN RUIN', src: VIDEO_HOST + 'hf_20260422_112520_ee819691-f2e8-4c54-bb77-3fb72c84eaa5.mp4' },
] as const;

/* 封面统一是 /covers/xxx.jpg（能取 4:3 的裁切，原图是竖版长图）。
   作品原图已经从 png/jpg 换成 webp，这个正则必须认 webp，
   否则会推出 /covers/xxx.webp 这种不存在的地址。 */
const coverOf = (src: string) => '/covers/' + (src.split('/').pop() ?? '').replace(/\.(png|jpe?g|webp)$/i, '.jpg');

const profile = {
  name: '冯家豪',
  englishName: 'Anderson',
  role: '视觉设计师 / 平面设计师',
  phone: '15769200733',
  email: '1296815396@qq.com',
};

type WorkImage = {
  src: string;
  alt: string;
  title: string;
  meta: string;
};

type Project = {
  title: string;
  type: string;
  scope: string;
  summary: string;
  tone: string;
  hidden?: boolean;
  images?: WorkImage[];
};

const allProjects: Project[] = [
  {
    title: '节日与节气海报',
    type: 'Seasonal Posters',
    scope: '传统节日 / 节气主题 / 品牌节日问候',
    summary: '围绕节日节点与节气主题，建立兼顾品牌问候、画面情绪与传播效率的一组海报系统。',
    tone: 'warm',
    images: [
      { src: '/works/seasonal-posters/intercontinental-summer-solstice.webp', alt: '洲际夏至节气海报', title: '洲际夏至节气海报', meta: '二十四节气 / 品牌问候' },
      { src: '/works/seasonal-posters/dragon-boat-concept.webp', alt: '端午节概念海报', title: '端午节概念海报', meta: '传统节日 / 概念视觉' },
      { src: '/works/seasonal-posters/childrens-day-concept.webp', alt: '儿童节概念海报', title: '儿童节概念海报', meta: '节日海报 / 概念视觉' },
      { src: '/works/seasonal-posters/intercontinental-grain-in-ear.webp', alt: '洲际芒种节气海报', title: '洲际芒种节气海报', meta: '二十四节气 / 品牌海报' },
      { src: '/works/seasonal-posters/holiday-grain-in-ear.webp', alt: '假日芒种节气海报', title: '假日芒种节气海报', meta: '二十四节气 / 品牌海报' },
      { src: '/works/seasonal-posters/intercontinental-grain-buds.webp', alt: '洲际小满节气海报', title: '洲际小满节气海报', meta: '二十四节气 / 节气主题' },
      { src: '/works/seasonal-posters/intercontinental-start-of-summer.webp', alt: '洲际立夏节气海报', title: '洲际立夏节气海报', meta: '二十四节气 / 节气主题' },
      { src: '/works/seasonal-posters/intercontinental-major-cold.webp', alt: '洲际大寒节气海报', title: '洲际大寒节气海报', meta: '二十四节气 / 冬日主题' },
      { src: '/works/seasonal-posters/intercontinental-winter-solstice.webp', alt: '洲际冬至节气海报', title: '洲际冬至节气海报', meta: '二十四节气 / 冬至主题' },
      { src: '/works/seasonal-posters/intercontinental-qixi.webp', alt: '洲际七夕节海报', title: '洲际七夕节海报', meta: '传统节日 / 节日海报' },
      { src: '/works/seasonal-posters/intercontinental-national-day.webp', alt: '洲际国庆海报', title: '洲际国庆海报', meta: '国庆节 / 节日海报' },
      { src: '/works/seasonal-posters/intercontinental-mid-autumn.webp', alt: '洲际中秋海报', title: '洲际中秋海报', meta: '中秋节 / 节日海报' },
      { src: '/works/seasonal-posters/intercontinental-double-ninth.webp', alt: '洲际重阳节海报', title: '洲际重阳节海报', meta: '重阳节 / 节日海报' },
      { src: '/works/seasonal-posters/concept-520.webp', alt: '520概念海报', title: '520概念海报', meta: '节日节点 / 概念视觉' },
      { src: '/works/seasonal-posters/concept-valentine.webp', alt: '情人节概念海报', title: '情人节概念海报', meta: '节日节点 / 概念视觉' },
    ],
  },
  {
    title: '餐厅推广视觉',
    type: 'Restaurant Promo',
    scope: '新品套餐 / 饮品推广 / 餐饮传播物料',
    summary: '以餐饮消费场景为核心，完成新品、套餐与单品推广所需的主视觉和传播物料设计。',
    tone: 'green',
    images: [
      { src: '/works/restaurant-promo/char-single-set-menu.webp', alt: 'CHAR单人套餐推广海报', title: 'CHAR单人套餐', meta: '餐厅推广 / 单人套餐' },
      { src: '/works/restaurant-promo/garden-afternoon-tea.webp', alt: '洲际大堂吧花园秘境下午茶推广海报', title: '花园秘境下午茶', meta: '大堂吧推广 / 餐饮视觉' },
      { src: '/works/restaurant-promo/steakhouse-poster-2.webp', alt: '扒房推广海报', title: '扒房主题海报', meta: '餐厅主视觉 / 菜单推广' },
      { src: '/works/restaurant-promo/iced-coffee.webp', alt: '冰咖推广海报', title: '冰咖推广海报', meta: '夏季饮品 / 单品推广' },
      { src: '/works/restaurant-promo/oriental-afternoon-tea.webp', alt: '国风双人下午茶推广海报', title: '国风双人下午茶', meta: '下午茶套餐 / 餐饮推广' },
      { src: '/works/restaurant-promo/winter-brews.webp', alt: '暖冬饮萃推广海报', title: '暖冬饮萃', meta: '冬季饮品 / 节令推广' },
      { src: '/works/restaurant-promo/autumn-encounter.webp', alt: '邂逅金秋推广海报', title: '邂逅金秋', meta: '秋季主题 / 餐饮推广' },
    ],
  },
  {
    title: '主题活动推广视觉',
    type: 'Event Campaigns',
    scope: '节日节点 / 套餐推广 / 活动主视觉',
    summary: '面向节日营销与活动传播，输出更适合酒店品牌表达的主题主视觉和活动推广画面。',
    tone: 'gold',
    images: [
      { src: '/works/event-campaigns/intercontinental-qixi-poster.webp', alt: '洲际七夕海报', title: '洲际七夕海报', meta: '七夕节点 / 节日海报' },
      { src: '/works/event-campaigns/intercontinental-mothers-day.webp', alt: '洲际母亲节主题活动推广海报', title: '洲际母亲节主题海报', meta: '节日推广 / 酒店套餐' },
      { src: '/works/event-campaigns/easter-campaign.webp', alt: '复活节主题活动推广海报', title: '复活节主题活动海报', meta: '亲子活动 / 节日体验' },
      { src: '/works/event-campaigns/intercontinental-valentine.webp', alt: '洲际情人节主题活动推广海报', title: '洲际情人节主题海报', meta: '节日套餐 / 活动视觉' },
      { src: '/works/event-campaigns/fathers-day-banquet.webp', alt: '父亲节承肩之宴主题活动海报', title: '父亲节承肩之宴', meta: '父亲节 / 餐饮活动' },
      { src: '/works/event-campaigns/teacher-appreciation-banquet.webp', alt: '洲际谢师宴活动推广海报', title: '洲际谢师宴', meta: '升学宴 / 活动推广' },
      { src: '/works/event-campaigns/intercontinental-520.webp', alt: '洲际520主题活动海报', title: '洲际520主题海报', meta: '520节点 / 节日推广' },
      { src: '/works/event-campaigns/intercontinental-halloween.webp', alt: '洲际万圣节主题活动海报', title: '洲际万圣节海报', meta: '万圣节 / 节日活动' },
      { src: '/works/event-campaigns/intercontinental-womens-day.webp', alt: '洲际妇女节主题活动海报', title: '洲际妇女节海报', meta: '妇女节 / 节日推广' },
    ],
  },
  {
    /* 这一组没有甲方：题目是自己出的，所以卡片名不按"什么活"取，按"什么性质"取。
       上面四张卡都是接来的活（节日 / 餐厅 / 活动 / 摄影），这张是自命题，
       叫「个人创作」一眼就能跟前面四张区分开。
       八个文件其实是三个系列：「无形之神」四张（01 时间 / 02 记忆 / 03 欲望 / 04 梦境）、
       「王冠之重」两张（I 之王 / II 王后）、另外山野和建筑各一张。
       系列顺序照原海报上的编号排，没按视觉强弱重排。 */
    title: '个人创作',
    type: 'Self-Initiated',
    scope: '概念海报 / 神话与王权 / 空间与自然',
    summary: '没有委托方的自命题海报。题材从神话塑像、王权肖像延伸到建筑与山野，重心放在图像、字体与版式之间的关系。',
    tone: 'ink',
    images: [
      { src: '/works/self-initiated/hour-keeper.webp', alt: '流沙之身概念海报', title: '流沙之身', meta: '无形之神 01 / 时间' },
      { src: '/works/self-initiated/memory-palace.webp', alt: '记忆宫殿概念海报', title: '记忆宫殿', meta: '无形之神 02 / 记忆' },
      { src: '/works/self-initiated/gilded-hunger.webp', alt: '鎏金之欲概念海报', title: '鎏金之欲', meta: '无形之神 03 / 欲望' },
      { src: '/works/self-initiated/sleeping-sky.webp', alt: '眠于群星概念海报', title: '眠于群星', meta: '无形之神 04 / 梦境' },
      { src: '/works/self-initiated/crown-of-iron.webp', alt: '国王铁誓概念海报', title: '铁誓 · 之王', meta: '王冠之重 I / 王权' },
      { src: '/works/self-initiated/crown-of-silence.webp', alt: '王后缄默概念海报', title: '缄默 · 王后', meta: '王冠之重 II / 王权' },
      { src: '/works/self-initiated/passages-of-a-year.webp', alt: '山有四季概念海报', title: '山有四季', meta: '风景研究 / 四季' },
      { src: '/works/self-initiated/between-angles.webp', alt: '折光概念海报', title: '折光', meta: '空间研究 / 建筑与光' },
    ],
  },
  {
    /* 现挂起。整个 entry 原样留着，把 hidden 去掉就回到作品区，
       不用重写数据。折页、计数器、整组弹层都从下面那个过滤后的 projects 读，
       所以 4 张卡和 04/04 的编号会自己跟上，别处不用改。 */
    title: '摄影作品',
    type: 'Photography',
    scope: '风景摄影 / 菜品拍摄 / 空间与产品记录',
    summary: '记录空间、菜品与场景细节，补足视觉传播中对素材质感、光线控制和画面完整度的要求。',
    tone: 'silver',
    hidden: true,
    images: [
      { src: '/works/photography/landscape-photo.webp', alt: '风景摄影作品', title: '', meta: '' },
      { src: '/works/photography/dessert-photo-2.webp', alt: '甜品摄影作品二', title: '', meta: '' },
      { src: '/works/photography/dessert-photo-1.webp', alt: '甜品摄影作品一', title: '', meta: '' },
      { src: '/works/photography/dish-photo-1.webp', alt: '菜品摄影作品一', title: '', meta: '' },
      { src: '/works/photography/dish-photo-2.webp', alt: '菜品摄影作品二', title: '', meta: '' },
      { src: '/works/photography/dish-photo-3.webp', alt: '菜品摄影作品三', title: '', meta: '' },
    ],
  },
];

/* 作品区只读这一份。带 hidden 的组还留在上面，只是不进列表——
   删数据容易，想加回来要重录一遍，所以挂起而不是删除。 */
const projects = allProjects.filter((project) => !project.hidden);

const strengths = [
  { icon: Palette, title: '品牌视觉表达', text: '围绕品牌调性完成海报、展板、卡券、菜单等物料设计，让视觉风格保持统一。' },
  { icon: Camera, title: '摄影后期处理', text: '熟悉产品及菜品修图、调色、抠图与合成流程，让素材更适合传播和落地。' },
  { icon: PenTool, title: '多场景物料延展', text: '将主视觉延展为海报、菜单、台卡及不同尺寸的宣传物料，并完成规范的完稿输出。' },
  { icon: Handshake, title: '沟通协作与项目交付', text: '能够对接市场、运营及餐饮部门，在多项目并行和紧急节点下推进修改、定稿与交付。' },
];

const heroHighlights = [
  '4年设计相关经验',
  '酒店活动推广',
  '餐饮视觉物料',
  '摄影后期处理',
];

const aboutFacts = [
  { label: '工作方向', value: '酒店活动推广 / 餐饮视觉 / 品牌传播物料' },
  { label: '相关经验', value: '4年设计经验，参与多个商业传播项目' },
  { label: '核心能力', value: '海报设计 / 物料延展 / 摄影后期' },
  { label: '常用工具', value: 'Adobe Photoshop / Illustrator / Premiere' },
];

const glowDefaults = {
  edgeSensitivity: 18,
  glowColor: '36 32 46',
  backgroundColor: '#fffdf8',
  glowRadius: 64,
  glowIntensity: 0.5,
  coneSpread: 18,
  fillOpacity: 0.18,
  colors: ['#e6d3ac', '#c9a26b', '#a8865a'],
};

const glowThemes = {
  portrait: {
    glowColor: '36 32 46',
    backgroundColor: '#fffdf8',
    colors: ['#e6d3ac', '#c9a26b', '#a8865a'],
    fillOpacity: 0.22,
  },
  stats: {
    glowColor: '36 32 46',
    backgroundColor: '#fffdf8',
    colors: ['#e6d3ac', '#c9a26b', '#a8865a'],
    fillOpacity: 0.2,
  },
  strengths: {
    glowColor: '36 32 46',
    backgroundColor: '#fffdf8',
    colors: ['#e6d3ac', '#c9a26b', '#a8865a'],
    fillOpacity: 0.22,
  },
  warm: {
    glowColor: '36 32 46',
    backgroundColor: '#fffdf8',
    colors: ['#e6d3ac', '#c9a26b', '#a8865a'],
    fillOpacity: 0.2,
  },
  green: {
    glowColor: '36 32 46',
    backgroundColor: '#fffdf8',
    colors: ['#e6d3ac', '#c9a26b', '#a8865a'],
    fillOpacity: 0.2,
  },
  gold: {
    glowColor: '36 32 46',
    backgroundColor: '#fffdf8',
    colors: ['#e6d3ac', '#c9a26b', '#a8865a'],
    fillOpacity: 0.22,
  },
  silver: {
    glowColor: '36 32 46',
    backgroundColor: '#fffdf8',
    colors: ['#e6d3ac', '#c9a26b', '#a8865a'],
    fillOpacity: 0.18,
  },
} as const;

function Magnet({
  children,
  className,
  amplitude = 9,
  padding = 90,
}: {
  children: React.ReactNode;
  className?: string;
  amplitude?: number;
  padding?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    const onMove = (event: MouseEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = el.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        const inside = Math.abs(dx) <= rect.width / 2 + padding && Math.abs(dy) <= rect.height / 2 + padding;
        if (!inside) {
          if (el.dataset.magnet !== 'off') { el.dataset.magnet = 'off'; el.style.transform = ''; }
          return;
        }
        const k = amplitude / (Math.max(rect.width, rect.height) / 2);
        el.dataset.magnet = 'on';
        el.style.transform = 'translate3d(' + (dx * k).toFixed(2) + 'px, ' + (dy * k).toFixed(2) + 'px, 0)';
      });
    };
    const reset = () => { el.dataset.magnet = 'off'; el.style.transform = ''; };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('blur', reset);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('blur', reset);
    };
  }, [amplitude, padding]);

  return <div ref={ref} className={className} data-magnet="off">{children}</div>;
}
function App() {
  const [ready, setReady] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [activeHeroVideo, setActiveHeroVideo] = useState(0);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeImage, setActiveImage] = useState<WorkImage | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const start = vh * 0.5;
      const end = vh * 1.05;
      const t = Math.min(1, Math.max(0, 1 - (window.scrollY - start) / (end - start)));
      root.style.setProperty('--video-fade', t.toFixed(3));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 80);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // 只有一条视频时不必开轮播定时器（否则每 7s 白跑一次 setState）
    if (HERO_VIDEOS.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveHeroVideo((index) => (index + 1) % HERO_VIDEOS.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > window.innerHeight * 0.72);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const blocks = document.querySelectorAll<HTMLElement>('.reveal-block');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -80px' });

    blocks.forEach((block) => observer.observe(block));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // 原选择器里还有 .primary-cta / .text-cta / .nav-pill a / .header-link，
    // 那是旧版头部的元素，当前组件树里已不存在（CSS 侧同步删除了对应规则），一并移除。
    const hoverTargets = document.querySelectorAll<HTMLElement>('.mobile-menu-toggle, .contact-list a, .contact-actions a');
    const enter = (event: Event) => (event.currentTarget as HTMLElement).classList.add('is-hovered');
    const leave = (event: Event) => (event.currentTarget as HTMLElement).classList.remove('is-hovered');

    hoverTargets.forEach((target) => {
      target.addEventListener('pointerenter', enter);
      target.addEventListener('pointerleave', leave);
    });

    return () => {
      hoverTargets.forEach((target) => {
        target.removeEventListener('pointerenter', enter);
        target.removeEventListener('pointerleave', leave);
      });
    };
  }, []);

  useEffect(() => {
    const isViewingWorks = activeProject || activeImage;
    document.body.classList.toggle('is-viewing-work', Boolean(isViewingWorks));
    return () => document.body.classList.remove('is-viewing-work');
  }, [activeProject, activeImage]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (activeImage) setActiveImage(null);
        else if (activeProject) setActiveProject(null);
        return;
      }
      /* 海报放大状态下左右键翻页。跟弹层里那两个箭头按钮同一套逻辑（含头尾相接），
         只是键盘更快：一份作品动辄十几二十张，用鼠标点箭头要挪很远。 */
      if (!activeImage || !activeProject?.images?.length) return;
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      const list = activeProject.images;
      const at = list.findIndex((item) => item.src === activeImage.src);
      if (at < 0) return;
      event.preventDefault();
      setActiveImage(list[(at + (event.key === 'ArrowRight' ? 1 : -1) + list.length) % list.length]);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImage, activeProject]);

  return (
    <main className="site-shell">
      <div className="video-bg" aria-hidden="true">
        {/* 只给激活的一条挂 src：三条同时挂会同时下载并解码，实测首屏原本要拉 38.87MB */}
        {HERO_VIDEOS.map((video, index) => {
          const isActive = index === activeHeroVideo;
          return (
            <video
              className={isActive ? 'is-active' : ''}
              src={isActive ? video.src : undefined}
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              key={video.src}
            />
          );
        })}
      </div>
      <div className="page-grain" aria-hidden="true" />

      <Header scrolled={navScrolled} />
      <Hero readyClass={ready ? 'is-ready' : ''} />
      <div className="front-sequence">
        <About />
        <Works
          onOpen={(project, image) => {
            setActiveProject(project);
            setActiveImage(image);
          }}
        />
      </div>
      <Strengths />
      <Contact />
      <WorkGallery project={activeProject} activeImage={activeImage} onClose={() => setActiveProject(null)} onOpenImage={setActiveImage} onCloseImage={() => setActiveImage(null)} />
    </main>
  );
}

function Header({ scrolled }: { scrolled: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [clock, setClock] = useState('00:00:00');

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Shanghai',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const updateClock = () => setClock(formatter.format(new Date()));
    updateClock();
    const timer = window.setInterval(updateClock, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const closeMenu = () => setMenuOpen(false);
    window.addEventListener('resize', closeMenu);
    window.addEventListener('scroll', closeMenu, { passive: true });
    return () => {
      window.removeEventListener('resize', closeMenu);
      window.removeEventListener('scroll', closeMenu);
    };
  }, [menuOpen]);

  const navItems = [
    ['个人介绍', '#about'],
    ['作品展示', '#projects'],
    ['个人优势', '#strengths'],
    ['联系信息', '#contact'],
  ];

  return (
    <header className={'site-header' + (scrolled ? ' is-scrolled' : '') + (menuOpen ? ' menu-open' : '')}>
      <nav className="hero-nav" aria-label="主导航">
        {navItems.map(([label, href], index) => (
          <a className="hero-nav-link" href={href} key={label} onClick={() => setMenuOpen(false)}>
            <small>{String(index + 1).padStart(2, '0')} /</small>
            <span>{label}</span>
          </a>
        ))}
      </nav>
      <div className="header-meta">
        <a href={'mailto:' + profile.email}>{profile.email}</a>
        <time dateTime={clock}>CN {clock}</time>
      </div>
      <button
        className="mobile-menu-toggle"
        type="button"
        aria-label={menuOpen ? '关闭导航' : '打开导航'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? <X size={17} /> : <Menu size={17} />}
      </button>
    </header>
  );
}

function Hero({ readyClass }: { readyClass: string }) {
  return (
    // 原为 'hero-section section-screen hero-theme-' + activeIndex，但 CSS 里从无 .hero-theme-* 规则，
    // 是个从未实现的死类名，已移除。
    <section id="top" className="hero-section section-screen">
      <div className={'hero-layout ' + readyClass}>
        {/* 标题和说明原来是左右两栏：大字在两列之外，右边那段小字自成一块，
            左边线各对各的，看完标题视线要往右上跳。现在改成同一列往下排，
            标题 / 说明 / 按钮共用一条左边缘。 */}
        <div className="hero-identity-row">
          <div className="hero-title-mask">
            <h1>
              <span>为品牌塑造视觉，</span>
              <span>为场景增添质感。</span>
            </h1>
          </div>
          <div className="hero-intro">
            <p>4年视觉设计相关经验，主要参与酒店活动推广、餐饮视觉及品牌宣传物料等项目，可独立完成需求梳理、版式设计、图片后期、物料延展与完稿输出。</p>
            <a className="hero-project-cta" href="#projects">查看作品</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* 板块标题组。
   原来是反的：把「一句长话」当 h2、把「个人介绍」压成 14px+字距的眉标。
   语义上「个人介绍」才是板块名，长句是它的说明；视觉上却反过来，
   读者先读到一句观点，认不出这是哪一块。而且那个 14px/600 的标签，
   比正文（13px）还大还粗，caption 压过了 body。
   现在：h2 = 板块名，长句 = 16px 的一句说明，英文名缩到板块名右侧同一基线上。 */
function SectionHeading({ name, latin, lead }: { name: string; latin?: string; lead?: string }) {
  return (
    <div className="section-heading reveal-block">
      <div className="section-heading-meta">
        <h2>{name}</h2>
        {latin && <span>{latin}</span>}
      </div>
      {lead && <p className="section-heading-lead">{lead}</p>}
    </div>
  );
}

function About() {
  /* 名片换成了 React Bits 的 ProfileCard（倾斜 + 全息箔 + 跟随光标的高光）。
     它的 intro 是「出现时扫一次光」，只在挂载那一刻播。
     这张卡在首屏之下，直接挂上来这束光会在屏幕外面放完，等滚到这儿只剩一张静止的卡。
     所以等它进视口再挂——同一时刻 reveal-block 的淡入也才开始，两下叠在一起才算进场。
     （占位不用留高度：这一行的高度由右边那张介绍卡撑着，名片挂上来不会顶动它。） */
  const [idcardReady, setIdcardReady] = useState(false);
  const idcardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (idcardReady) return;
    const el = idcardRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) setIdcardReady(true);
      },
      { rootMargin: '0px 0px -18% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [idcardReady]);

  return (
    <section id="about" className="section-block about-section">
      <SectionHeading name="个人介绍" latin="Profile" lead="不只完成画面，也关注信息是否清楚、物料能否落地。" />
      <div className="about-grid">
        <div className="about-idcard reveal-block" ref={idcardRef} style={{ '--stagger': '90ms' } as React.CSSProperties}>
          {idcardReady && (
            <ProfileCard
              avatarUrl="/works/profile/profile-portrait.webp"
              name="Anderson"
              title="Visual Designer"
              /* handle 必须显式传空：它的默认值是占位的 @javicodes，不传就会印在卡上。 */
              handle=""
              status="平面视觉 / 摄影后期 / 品牌物料"
              statusColor="#9a7b4f"
              contactText="联系我"
              onContactClick={() => document.getElementById('contact')?.scrollIntoView({ block: 'start' })}
              theme="light"
              radius={15}
              /* 全息箔在这张浅色照片上走 multiply，铺满整块图时会把亮部压暗、显脏。
                 0.6 是「动起来能看见、停住不脏」的位置；真要更明显得给它配一张
                 iconUrl 图案（箔只从图案里透出来），那是另一个设计决定了。 */
              holo={0.6}
              glare={0.5}
              tiltStrength={10}
              parallax={10}
            />
          )}
        </div>
        <div className="about-sheet reveal-block" style={{ '--stagger': '150ms' } as React.CSSProperties}>
          <div className="about-sheet-head">
            <div className="about-sheet-title">
              <p>Profile</p>
              <h3>关于我</h3>
            </div>
            <span className="about-badge">About Me</span>
          </div>
          <div className="about-sheet-copy">
            <p>我是{profile.name}，英文名 {profile.englishName}，{profile.role}。具备约 4 年设计相关经验，主要参与酒店活动推广与餐饮视觉相关项目，能够围绕品牌调性完成画面设计、物料延展与内容呈现。</p>
            <p>我更关注设计是否能被真实使用：信息是否清楚、视觉是否统一、物料是否能顺利交付。对我来说，高级感不是复杂，而是克制、准确，并且经得起落地。</p>
          </div>
          <div className="about-fact-grid">
            {aboutFacts.map((item) => (
              <article className="about-fact-card" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </article>
            ))}
          </div>
          <div className="contact-list about-contact-list">
            <a href={'tel:' + profile.phone}><Phone size={15} />{profile.phone}</a>
            <a href={'mailto:' + profile.email}><Mail size={15} />{profile.email}</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* 作品区：四组分类各一张封面，横向折页（AccordionGallery / GSAP）。
   前一版是居中一张 960 宽的画框，标题左对齐、画框居中，左右留白对不上；
   这一版整块跟标题的下边线同宽，四张卡平铺满，到边到角都是齐的。

   图用 covers/ 那批 1200×900 宽版——它跟作品原图（1080×2340 竖版）
   是两套构图，宽版是专门排过的，内容落在纵向 18%–86%，所以卡片做扁做方都不切内容。 */
function Works({ onOpen }: { onOpen: (project: Project, image: WorkImage) => void }) {
  const items = useMemo(
    () =>
      projects.map(project => ({
        /* 原来这里把 coverOf 的规则又抄了一遍（只认 png/jpg）。原图换成 webp 之后
           这一份没跟着改，封面地址就成了 /covers/xxx.webp——404。
           现在直接调 coverOf，只剩一处规则。 */
        image: coverOf(project.images?.[0]?.src ?? ''),
        label: project.title,
        alt: project.title,
      })),
    [],
  );

  /* 窄屏横着切四片会只剩几十像素宽，什么都看不出来。760 以下改成竖折——
     组件自带的 520 断点会把列布局拍平成等高列表（height:auto 时 flexGrow 不生效，
     展开那张撑不开），所以那边不用它的断点，改成这里的定高竖折。 */
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 760px)');
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const [current, setCurrent] = useState(0);
  const openProject = (index: number) => {
    const project = projects[index];
    const image = project?.images?.[0];
    if (project && image) onOpen(project, image);
  };

  return (
    <section id="projects" className="section-block projects-section">
      <SectionHeading name="作品展示" latin="Selected Works" lead="真实项目中的视觉判断与执行" />
      <div className="works-stage">
        <AccordionGallery
          items={items}
          defaultIndex={0}
          orientation={narrow ? 'vertical' : 'horizontal'}
          /* height 只在首帧量出宽度之前兜底，量完就由 mediaRatio 接管：
             展开那张的宽 = (整块宽 - 3×12) × 0.44，高按 4/3 反算，
             1440 下是 576×432。原来死给 620，等于一个 576×620 的竖框装 4:3 的横图，
             cover 横裁 15%，面板再只露 82%，最后海报只剩中间七成、被放大 1.43 倍。
             竖折同一个道理，只是反过来由宽度反算高度（390 下 354×265，原来是 354×328、
             横裁 19%）。 */
          height={narrow ? 488 : 620}
          mediaRatio={4 / 3}
          expandRatio={0.44}
          gap={12}
          radius={16}
          parallax={0.5}
          /* 倾斜会让左右两侧的视宽不一样（透视压扁），四条缝看着就宽窄不齐。
             这里要的是齐，所以关掉 3D 倾斜，只留图内的位移。 */
          tilt={0}
          accentColor="#c9a26b"
          overlayColor="#171208"
          trigger="hover"
          /* 卡内那行分类标签关掉了。原来卡片是海报的一段裁切，左下角是空的，
             标签叠上去没事；现在卡片正好是一整张海报，左下角就是海报自己的版面——
             「餐厅推广视觉」那张实测直接被这行字压住食材清单「炭火前味 & 沙拉」。
             分类名也没丢：下面那行写着「02 / 04 · 7 件 · 新品套餐 / 饮品推广」，
             右边按钮是「查看「餐厅推广视觉」整组」，两处都在说同一件事。 */
          showLabels={false}
          onIndexChange={setCurrent}
          onSelect={openProject}
        />
      </div>
      <div className="works-actions">
        <span className="works-count">
          {String(current + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
          <i />
          {projects[current]?.images?.length} 件 · {projects[current]?.scope}
        </span>
        <button className="works-open" type="button" onClick={() => openProject(current)}>
          查看「{projects[current]?.title}」整组 <ArrowUpRight size={13} />
        </button>
      </div>
    </section>
  );
}

function WorkGallery({ project, activeImage, onClose, onOpenImage, onCloseImage }: {
  project: Project | null;
  activeImage: WorkImage | null;
  onClose: () => void;
  onOpenImage: (image: WorkImage) => void;
  onCloseImage: () => void;
}) {
  if (!project?.images) return null;

  const images = project.images;
  const total = images.length;
  /* 当前是这一组的第几张：按 src 找回下标，而不是让外面再传一个 index。
     折页那张卡是直接带着 images[0] 进来的，外面并没有"第几张"这个概念。 */
  const index = activeImage ? images.findIndex((item) => item.src === activeImage.src) : -1;
  const canStep = index >= 0 && total > 1;
  /* 头尾接上：在最后一张按「下一张」回到第一张。这一组 16 张，
     翻到头按钮没反应会让人以为坏了。 */
  const step = (delta: number) => {
    if (!canStep) return;
    onOpenImage(images[(index + delta + total) % total]);
  };

  return (
    <div className={'work-gallery-shell' + (activeImage ? ' has-lightbox' : '')} aria-modal="true" role="dialog" aria-label={project.title}>
      <button className="gallery-backdrop" type="button" aria-label="关闭作品集" onClick={onClose} />
      <div className="gallery-panel">
        <div className="gallery-orbit" aria-hidden="true" />
        <div className="gallery-head">
          <div>
            <p>{project.scope}</p>
            <h2>{project.title}</h2>
          </div>
          <button className="gallery-close" type="button" aria-label="关闭作品集" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="gallery-stage">
          {project.images.map((image, index) => (
            <button
              className="gallery-poster"
              data-gallery-tone={project.tone}
              type="button"
              key={image.src}
              style={{ '--gallery-stagger': `${index * 90}ms` } as React.CSSProperties}
              onClick={() => onOpenImage(image)}
              aria-label={'放大查看' + (image.title || image.alt)}
            >
              <div className="gallery-poster-media">
                {/* lazy：整组一打开就是 15 张全下，一屏只看得到八九张，
                    剩下的等滚到再拉。配上 webp（每组从 40MB 级降到 2MB 级），
                    这一下就是原来慢的主因。前两张给 high，它们是进组第一眼。 */}
                <img
                  src={image.src}
                  alt={image.alt}
                  loading={index < 2 ? 'eager' : 'lazy'}
                  fetchPriority={index < 2 ? 'high' : 'auto'}
                  decoding="async"
                />
              </div>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div className="gallery-poster-caption">
                <strong>{image.title}</strong>
                <small>{image.meta}</small>
              </div>
            </button>
          ))}
        </div>
      </div>
      {activeImage && (
        <div className="poster-lightbox" role="dialog" aria-modal="true" aria-label={activeImage.title}>
          <button className="lightbox-backdrop" type="button" aria-label="关闭放大预览" onClick={onCloseImage} />
          {/* 原来图和图注直接放在 figure 里，figure 自己是 828×812 的盒子，
              而图只占左边 486、图注只有 320×112 落在右下角——中间那一大片空盒子
              仍然接住点击，于是"点海报旁边的空白"关不掉，只有点到 figure 外面才行。
              现在外面套一层 .lightbox-shell，shell 和 figure 都设成 pointer-events:none，
              只有图、图注、两个翻页按钮能接点击，其余全部穿透到最底下的 backdrop。 */}
          <div className="lightbox-shell">
            {canStep && (
              <button className="lightbox-nav is-prev" type="button" aria-label="上一张作品" onClick={() => step(-1)}>
                <ChevronLeft size={20} strokeWidth={1.75} />
              </button>
            )}
            <figure className="lightbox-frame">
              <img src={activeImage.src} alt={activeImage.alt} decoding="async" fetchPriority="high" />
              <figcaption>
                <strong>{activeImage.title}</strong>
                <span>{activeImage.meta}</span>
                {canStep && (
                  <em className="lightbox-count">
                    {String(index + 1).padStart(2, '0')}
                    <i>/</i>
                    {String(total).padStart(2, '0')}
                  </em>
                )}
              </figcaption>
            </figure>
            {canStep && (
              <button className="lightbox-nav is-next" type="button" aria-label="下一张作品" onClick={() => step(1)}>
                <ChevronRight size={20} strokeWidth={1.75} />
              </button>
            )}
          </div>
          <button className="lightbox-close" type="button" aria-label="关闭放大预览" onClick={onCloseImage}><X size={18} /></button>
        </div>
      )}
    </div>
  );
}

function Strengths() {
  return (
    <section id="strengths" className="section-block strengths-section">
      <SectionHeading name="个人优势" latin="Capability" lead="从需求理解到文件交付，独立推进完整设计流程。" />
      <div className="strength-grid">
        {strengths.map((item, index) => {
          const Icon = item.icon;
          return (
            <article className="strength-card strength-panel reveal-block" key={item.title} style={{ '--stagger': `${index * 80}ms` } as React.CSSProperties}>
              {/* 原来是 <div class="icon-box"> 44×44 圆角方块压在 h3 上方。
                  检测器点名的就是这个形状：任何生成器都会输出的"图标块 + 标题 + 说明"功能卡。
                  现在图标跟标题并排，图标没有自己的容器，也不再顶开一段 42px 的空白。 */}
              <div className="strength-head">
                <Icon className="strength-icon" size={19} strokeWidth={1.5} aria-hidden="true" />
                <h3>{item.title}</h3>
              </div>
              <p>{item.text}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="section-screen contact-section">
      <div className="contact-shell reveal-block">
        <div className="contact-copy">
          {/* 这块原本是手写的一份「小标签 + 大长句」，跟上面三个板块同一个毛病：
              板块名 14px、观点 34px。这里没有复用 SectionHeading，因为联系区
              是两栏（左边文案 + 右边二维码）、也没有那条下边线，套进来会错位。 */}
          <div className="contact-heading-meta">
            <h2>联系信息</h2>
            <span>Contact</span>
          </div>
          <p className="contact-lead">如果我的经验与你们正在寻找的方向匹配，欢迎与我联系。</p>
          <p className="contact-text">手机号、邮箱和微信都保留在这里，方便你选择更顺手的方式联系我。</p>
          <div className="contact-actions">
            <a className="liquid-glass" href={'tel:' + profile.phone}><Phone size={16} />{profile.phone}</a>
            <a className="liquid-glass" href={'mailto:' + profile.email}><Mail size={16} />{profile.email}</a>
          </div>
        </div>
        <div className="contact-qr-card">
          <div className="contact-qr-frame">
            <img src="/assets/wechat-qr-black.png" alt="Anderson 微信二维码" />
          </div>
          <div className="contact-qr-meta">
            <strong>微信沟通</strong>
            <span>扫码添加微信，进一步沟通岗位与作品。</span>
          </div>
        </div>
      </div>
      <div className="contact-footer reveal-block">
        <span className="contact-footer-name">Anderson</span>
        <span className="contact-footer-note">平面视觉设计 · 摄影后期 · 品牌与活动物料</span>
        <a className="contact-footer-top" href="#top">回到顶部 <ArrowUpRight size={13} /></a>
      </div>
    </section>
  );
}

createRoot(document.getElementById('root')!).render(<App />);

import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, Camera, Handshake, Mail, Menu, Palette, PenTool, Phone, Sparkles, X } from 'lucide-react';
import BorderGlow from './components/BorderGlow';
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

const coverOf = (src: string) => '/covers/' + (src.split('/').pop() ?? '').replace(/\.(png|jpe?g)$/i, '.jpg');

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
  images?: WorkImage[];
};

const projects: Project[] = [
  {
    title: '节日与节气海报',
    type: 'Seasonal Posters',
    scope: '传统节日 / 节气主题 / 品牌节日问候',
    summary: '围绕节日节点与节气主题，建立兼顾品牌问候、画面情绪与传播效率的一组海报系统。',
    tone: 'warm',
    images: [
      { src: '/works/seasonal-posters/intercontinental-summer-solstice.png', alt: '洲际夏至节气海报', title: '洲际夏至节气海报', meta: '二十四节气 / 品牌问候' },
      { src: '/works/seasonal-posters/dragon-boat-concept.png', alt: '端午节概念海报', title: '端午节概念海报', meta: '传统节日 / 概念视觉' },
      { src: '/works/seasonal-posters/childrens-day-concept.png', alt: '儿童节概念海报', title: '儿童节概念海报', meta: '节日海报 / 概念视觉' },
      { src: '/works/seasonal-posters/intercontinental-grain-in-ear.png', alt: '洲际芒种节气海报', title: '洲际芒种节气海报', meta: '二十四节气 / 品牌海报' },
      { src: '/works/seasonal-posters/holiday-grain-in-ear.png', alt: '假日芒种节气海报', title: '假日芒种节气海报', meta: '二十四节气 / 品牌海报' },
      { src: '/works/seasonal-posters/intercontinental-grain-buds.png', alt: '洲际小满节气海报', title: '洲际小满节气海报', meta: '二十四节气 / 节气主题' },
      { src: '/works/seasonal-posters/intercontinental-start-of-summer.png', alt: '洲际立夏节气海报', title: '洲际立夏节气海报', meta: '二十四节气 / 节气主题' },
      { src: '/works/seasonal-posters/intercontinental-major-cold.png', alt: '洲际大寒节气海报', title: '洲际大寒节气海报', meta: '二十四节气 / 冬日主题' },
      { src: '/works/seasonal-posters/intercontinental-winter-solstice.png', alt: '洲际冬至节气海报', title: '洲际冬至节气海报', meta: '二十四节气 / 冬至主题' },
      { src: '/works/seasonal-posters/intercontinental-qixi.png', alt: '洲际七夕节海报', title: '洲际七夕节海报', meta: '传统节日 / 节日海报' },
      { src: '/works/seasonal-posters/intercontinental-national-day.png', alt: '洲际国庆海报', title: '洲际国庆海报', meta: '国庆节 / 节日海报' },
      { src: '/works/seasonal-posters/intercontinental-mid-autumn.png', alt: '洲际中秋海报', title: '洲际中秋海报', meta: '中秋节 / 节日海报' },
      { src: '/works/seasonal-posters/intercontinental-double-ninth.png', alt: '洲际重阳节海报', title: '洲际重阳节海报', meta: '重阳节 / 节日海报' },
      { src: '/works/seasonal-posters/concept-520.png', alt: '520概念海报', title: '520概念海报', meta: '节日节点 / 概念视觉' },
      { src: '/works/seasonal-posters/concept-valentine.png', alt: '情人节概念海报', title: '情人节概念海报', meta: '节日节点 / 概念视觉' },
    ],
  },
  {
    title: '餐厅推广视觉',
    type: 'Restaurant Promo',
    scope: '新品套餐 / 饮品推广 / 餐饮传播物料',
    summary: '以餐饮消费场景为核心，完成新品、套餐与单品推广所需的主视觉和传播物料设计。',
    tone: 'green',
    images: [
      { src: '/works/restaurant-promo/char-single-set-menu.png', alt: 'CHAR单人套餐推广海报', title: 'CHAR单人套餐', meta: '餐厅推广 / 单人套餐' },
      { src: '/works/restaurant-promo/garden-afternoon-tea.png', alt: '洲际大堂吧花园秘境下午茶推广海报', title: '花园秘境下午茶', meta: '大堂吧推广 / 餐饮视觉' },
      { src: '/works/restaurant-promo/steakhouse-poster-2.png', alt: '扒房推广海报', title: '扒房主题海报', meta: '餐厅主视觉 / 菜单推广' },
      { src: '/works/restaurant-promo/iced-coffee.png', alt: '冰咖推广海报', title: '冰咖推广海报', meta: '夏季饮品 / 单品推广' },
      { src: '/works/restaurant-promo/oriental-afternoon-tea.png', alt: '国风双人下午茶推广海报', title: '国风双人下午茶', meta: '下午茶套餐 / 餐饮推广' },
      { src: '/works/restaurant-promo/winter-brews.png', alt: '暖冬饮萃推广海报', title: '暖冬饮萃', meta: '冬季饮品 / 节令推广' },
      { src: '/works/restaurant-promo/autumn-encounter.png', alt: '邂逅金秋推广海报', title: '邂逅金秋', meta: '秋季主题 / 餐饮推广' },
    ],
  },
  {
    title: '主题活动推广视觉',
    type: 'Event Campaigns',
    scope: '节日节点 / 套餐推广 / 活动主视觉',
    summary: '面向节日营销与活动传播，输出更适合酒店品牌表达的主题主视觉和活动推广画面。',
    tone: 'gold',
    images: [
      { src: '/works/event-campaigns/intercontinental-qixi-poster.png', alt: '洲际七夕海报', title: '洲际七夕海报', meta: '七夕节点 / 节日海报' },
      { src: '/works/event-campaigns/intercontinental-mothers-day.png', alt: '洲际母亲节主题活动推广海报', title: '洲际母亲节主题海报', meta: '节日推广 / 酒店套餐' },
      { src: '/works/event-campaigns/easter-campaign.png', alt: '复活节主题活动推广海报', title: '复活节主题活动海报', meta: '亲子活动 / 节日体验' },
      { src: '/works/event-campaigns/intercontinental-valentine.png', alt: '洲际情人节主题活动推广海报', title: '洲际情人节主题海报', meta: '节日套餐 / 活动视觉' },
      { src: '/works/event-campaigns/fathers-day-banquet.png', alt: '父亲节承肩之宴主题活动海报', title: '父亲节承肩之宴', meta: '父亲节 / 餐饮活动' },
      { src: '/works/event-campaigns/teacher-appreciation-banquet.png', alt: '洲际谢师宴活动推广海报', title: '洲际谢师宴', meta: '升学宴 / 活动推广' },
      { src: '/works/event-campaigns/intercontinental-520.png', alt: '洲际520主题活动海报', title: '洲际520主题海报', meta: '520节点 / 节日推广' },
      { src: '/works/event-campaigns/intercontinental-halloween.png', alt: '洲际万圣节主题活动海报', title: '洲际万圣节海报', meta: '万圣节 / 节日活动' },
      { src: '/works/event-campaigns/intercontinental-womens-day.png', alt: '洲际妇女节主题活动海报', title: '洲际妇女节海报', meta: '妇女节 / 节日推广' },
    ],
  },
  {
    title: '摄影作品',
    type: 'Photography',
    scope: '风景摄影 / 菜品拍摄 / 空间与产品记录',
    summary: '记录空间、菜品与场景细节，补足视觉传播中对素材质感、光线控制和画面完整度的要求。',
    tone: 'silver',
    images: [
      { src: '/works/photography/landscape-photo.jpg', alt: '风景摄影作品', title: '', meta: '' },
      { src: '/works/photography/dessert-photo-2.png', alt: '甜品摄影作品二', title: '', meta: '' },
      { src: '/works/photography/dessert-photo-1.png', alt: '甜品摄影作品一', title: '', meta: '' },
      { src: '/works/photography/dish-photo-1.png', alt: '菜品摄影作品一', title: '', meta: '' },
      { src: '/works/photography/dish-photo-2.png', alt: '菜品摄影作品二', title: '', meta: '' },
      { src: '/works/photography/dish-photo-3.png', alt: '菜品摄影作品三', title: '', meta: '' },
    ],
  },
];

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
      if (event.key !== 'Escape') return;
      if (activeImage) setActiveImage(null);
      else if (activeProject) setActiveProject(null);
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
        <Projects onOpenProject={setActiveProject} />
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
        <div className="hero-identity-row">
          <div className="hero-title-mask">
            <h1>
              <span>从视觉构思到完稿交付，</span>
              <span>让设计落到真实场景。</span>
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

function SectionHeading({ kicker, title, text }: { kicker: string; title: string; text?: string }) {
  return (
    <div className="section-heading reveal-block">
      <div className="section-heading-meta">
        <p>{kicker}</p>
        {text && <span>{text}</span>}
      </div>
      <h2>{title}</h2>
    </div>
  );
}

function About() {
  return (
    <section id="about" className="section-block about-section">
      <SectionHeading kicker="个人介绍" title="不只完成画面，也关注信息是否清楚、物料能否落地。" text="Profile" />
      <div className="about-grid">
        <BorderGlow className="portrait-card reveal-block" borderRadius={28} animated {...glowDefaults} {...glowThemes.portrait} style={{ '--stagger': '90ms' } as React.CSSProperties}>
          <Magnet className="portrait-art portrait-photo" amplitude={9} padding={90}>
            <img src="/works/profile/profile-portrait.jpg" alt="Anderson 个人照片" />
            <span>Anderson</span>
            <small>Visual Designer</small>
          </Magnet>
          <div className="portrait-meta"><Sparkles size={16} />平面视觉 / 摄影后期 / 品牌物料</div>
        </BorderGlow>
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

function Projects({ onOpenProject }: { onOpenProject: (project: Project) => void }) {
  return (
    <section id="projects" className="section-block projects-section">
      <SectionHeading kicker="作品展示" title="真实项目中的视觉判断与执行" text="Selected Works" />
      <div className="compact-project-grid">
        {projects.map((project, index) => (
            <BorderGlow
              className={'compact-project-card reveal-block tone-' + project.tone}
              borderRadius={16}
              glowRadius={38}
              glowIntensity={0.5}
              fillOpacity={0.16}
              animated={false}
              key={project.title}
              role={project.images ? 'button' : undefined}
              tabIndex={project.images ? 0 : undefined}
              aria-label={project.images ? '打开' + project.title : undefined}
              onClick={() => project.images && onOpenProject(project)}
              onKeyDown={(event) => {
                if (!project.images) return;
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onOpenProject(project);
                }
              }}
              {...glowDefaults}
              {...glowThemes[project.tone as keyof typeof glowThemes]}
              style={{ '--stagger': `${index * 90}ms` } as React.CSSProperties}
            >
              <div className="compact-project-visual">
                <img src={project.images?.[0] ? coverOf(project.images[0].src) : undefined} alt={project.images?.[0]?.alt} loading="lazy" />
              </div>
              <div className="compact-project-head">
                <div>
                  <span>{project.type}</span>
                  <h3>{project.title}</h3>
                </div>
                <small>{project.images?.length} 件作品</small>
              </div>
              <div className="compact-project-copy">
                <p>{project.summary}</p>
                <b>查看项目 <ArrowUpRight size={13} /></b>
              </div>
            </BorderGlow>
        ))}
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
                <img src={image.src} alt={image.alt} />
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
          <figure className="lightbox-frame">
            <img src={activeImage.src} alt={activeImage.alt} />
            <figcaption>
              <strong>{activeImage.title}</strong>
              <span>{activeImage.meta}</span>
            </figcaption>
          </figure>
          <button className="lightbox-close" type="button" aria-label="关闭放大预览" onClick={onCloseImage}><X size={18} /></button>
        </div>
      )}
    </div>
  );
}

function Strengths() {
  return (
    <section id="strengths" className="section-block strengths-section">
      <SectionHeading kicker="个人优势" title="从需求理解到文件交付，独立推进完整设计流程。" text="Capability" />
      <div className="strength-grid">
        {strengths.map((item, index) => {
          const Icon = item.icon;
          return (
            <article className="strength-card strength-panel reveal-block" key={item.title} style={{ '--stagger': `${index * 80}ms` } as React.CSSProperties}>
              <div className="icon-box"><Icon size={22} strokeWidth={1.6} /></div>
              <h3>{item.title}</h3>
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
          <div className="contact-heading-meta">
            <p>联系信息</p>
            <span>Contact</span>
          </div>
          <h2>如果我的经验与你们正在寻找的方向匹配，欢迎与我联系。</h2>
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

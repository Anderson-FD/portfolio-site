import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, Camera, Mail, Palette, PenTool, Phone, Sparkles, Video, X } from 'lucide-react';
import gsap from 'gsap';
import BorderGlow from './components/BorderGlow';
import './index.css';

const VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260510_060007_60275ce7-030c-4668-a160-8f364ec537d3.mp4';

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
  tone: string;
  images?: WorkImage[];
};

const projects: Project[] = [
  {
    title: '节日与节气海报',
    type: 'Seasonal Posters',
    scope: '传统节日 / 节气主题 / 品牌节日问候',
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
    tone: 'green',
    images: [
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
    tone: 'gold',
    images: [
      { src: '/works/event-campaigns/intercontinental-mothers-day.png', alt: '洲际母亲节主题活动推广海报', title: '洲际母亲节主题海报', meta: '节日推广 / 酒店套餐' },
      { src: '/works/event-campaigns/easter-campaign.png', alt: '复活节主题活动推广海报', title: '复活节主题活动海报', meta: '亲子活动 / 节日体验' },
      { src: '/works/event-campaigns/intercontinental-valentine.png', alt: '洲际情人节主题活动推广海报', title: '洲际情人节主题海报', meta: '节日套餐 / 活动视觉' },
      { src: '/works/event-campaigns/fathers-day-banquet.png', alt: '父亲节承肩之宴主题活动海报', title: '父亲节承肩之宴', meta: '父亲节 / 餐饮活动' },
      { src: '/works/event-campaigns/teacher-appreciation-banquet.png', alt: '洲际谢师宴活动推广海报', title: '洲际谢师宴', meta: '升学宴 / 活动推广' },
      { src: '/works/event-campaigns/intercontinental-520.png', alt: '洲际520主题活动海报', title: '洲际520主题海报', meta: '520节点 / 节日推广' },
      { src: '/works/event-campaigns/intercontinental-qixi-campaign.png', alt: '洲际七夕主题活动海报', title: '洲际七夕主题海报', meta: '七夕节点 / 活动推广' },
      { src: '/works/event-campaigns/intercontinental-halloween.png', alt: '洲际万圣节主题活动海报', title: '洲际万圣节海报', meta: '万圣节 / 节日活动' },
      { src: '/works/event-campaigns/intercontinental-womens-day.png', alt: '洲际妇女节主题活动海报', title: '洲际妇女节海报', meta: '妇女节 / 节日推广' },
    ],
  },
  {
    title: '摄影作品',
    type: 'Photography',
    scope: '风景摄影 / 菜品拍摄 / 空间与产品记录',
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
  { icon: PenTool, title: '平面物料落地', text: '理解线上传播与线下印刷差异，能输出清晰、稳定、可执行的设计文件。' },
  { icon: Video, title: '基础视频剪辑', text: '可进行活动素材剪辑与画面整理，为推广内容补足动态视觉表达。' },
];

const glowDefaults = {
  edgeSensitivity: 18,
  glowColor: '46 82 86',
  backgroundColor: '#0d0c13',
  glowRadius: 64,
  glowIntensity: 1.25,
  coneSpread: 18,
  fillOpacity: 0.26,
  colors: ['#fff1b8', '#b7c8ff', '#b987ff'],
};

const glowThemes = {
  portrait: {
    glowColor: '40 78 78',
    backgroundColor: '#111019',
    colors: ['#f5ddb5', '#8cd5ff', '#d2b0ff'],
    fillOpacity: 0.22,
  },
  stats: {
    glowColor: '192 78 74',
    backgroundColor: '#101119',
    colors: ['#9ed8f3', '#c7e8ff', '#f1d3a2'],
    fillOpacity: 0.2,
  },
  strengths: {
    glowColor: '182 66 70',
    backgroundColor: '#0d1017',
    colors: ['#8fd3dc', '#d9c2a4', '#9db7ff'],
    fillOpacity: 0.22,
  },
  warm: {
    glowColor: '28 84 76',
    backgroundColor: '#161018',
    colors: ['#f2bf85', '#f2d7a6', '#9ad2f1'],
    fillOpacity: 0.2,
  },
  green: {
    glowColor: '170 66 72',
    backgroundColor: '#0d1316',
    colors: ['#7dcfb6', '#dce7b5', '#8fc6ff'],
    fillOpacity: 0.2,
  },
  gold: {
    glowColor: '42 78 78',
    backgroundColor: '#151117',
    colors: ['#f2d08d', '#f0b7a4', '#9bc3ff'],
    fillOpacity: 0.22,
  },
  silver: {
    glowColor: '210 38 80',
    backgroundColor: '#11131a',
    colors: ['#dbe6f4', '#b9c7da', '#f1dcc2'],
    fillOpacity: 0.18,
  },
} as const;

function App() {
  const videoWrapRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeImage, setActiveImage] = useState<WorkImage | null>(null);

  useEffect(() => {
    const videoBg = videoWrapRef.current;
    if (!videoBg) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      targetX = ((event.clientX - cx) / cx) * 20;
      targetY = ((event.clientY - cy) / cy) * 20;
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      gsap.set(videoBg, { x: currentX, y: currentY });
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 80);
    return () => window.clearTimeout(timer);
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
    const hoverTargets = document.querySelectorAll<HTMLElement>('.primary-cta, .text-cta, .nav-pill a, .header-link, .contact-list a, .contact-actions a');
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
      <div ref={videoWrapRef} className="video-bg" aria-hidden="true">
        <video
          src={VIDEO_URL}
          autoPlay
          muted
          loop
          playsInline
          onLoadedMetadata={(event) => {
            event.currentTarget.playbackRate = 1.25;
          }}
        />
      </div>
      <div className="page-atmosphere" aria-hidden="true" />
      <div className="page-grain" aria-hidden="true" />

      <Header scrolled={navScrolled} />
      <Hero readyClass={ready ? 'is-ready' : ''} />
      <About />
      <Projects onOpenProject={setActiveProject} />
      <Strengths />
      <Contact />
      <WorkGallery project={activeProject} activeImage={activeImage} onClose={() => setActiveProject(null)} onOpenImage={setActiveImage} onCloseImage={() => setActiveImage(null)} />
    </main>
  );
}

function Header({ scrolled }: { scrolled: boolean }) {
  const navItems = [
    ['个人介绍', '#about'],
    ['作品展示', '#projects'],
    ['个人优势', '#strengths'],
    ['联系信息', '#contact'],
  ];

  return (
    <header className={'site-header' + (scrolled ? ' is-scrolled' : '')}>
      <a href="#top" className="wordmark">Anderson</a>
      <nav className="liquid-glass nav-pill" aria-label="主导航">
        {navItems.map(([label, href]) => <a href={href} key={label}>{label}</a>)}
      </nav>
      <a className="liquid-glass header-link" href="#projects">先看作品</a>
    </header>
  );
}

function Hero({ readyClass }: { readyClass: string }) {
  return (
    <section id="top" className="hero-section section-screen">
      <div className={'hero-copy ' + readyClass}>
        <p className="eyebrow">视觉设计师作品集 / Portfolio 2026</p>
        <h1>
          <span>让视觉没有边界。</span>
          <span>让品牌被敏锐看见。</span>
        </h1>
        <p className="hero-text">我用清晰的视觉系统回应商业需求：品牌调性、传播节奏、画面质感和落地执行。每一次设计，都尽量让信息更准确、画面更高级、品牌更容易被记住。</p>
        <div className="hero-actions">
          <a className="primary-cta" href="#projects">查看作品</a>
          <a className="text-cta" href="#about">了解 Anderson <ArrowUpRight size={16} /></a>
        </div>
      </div>
      <div className="scroll-cue liquid-glass">向下浏览完整作品集</div>
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
      <SectionHeading kicker="01 / 个人介绍" title="在商业目标与视觉质感之间，建立稳定的表达。" text="Profile" />
      <div className="about-grid">
        <BorderGlow className="portrait-card reveal-block" borderRadius={28} animated {...glowDefaults} {...glowThemes.portrait} style={{ '--stagger': '90ms' } as React.CSSProperties}>
          <div className="portrait-art portrait-photo">
            <img src="/works/profile/profile-portrait.jpg" alt="Anderson 个人照片" />
            <span>Anderson</span>
          </div>
          <div className="portrait-meta"><Sparkles size={16} />平面视觉 / 摄影后期 / 品牌物料</div>
        </BorderGlow>
        <div className="about-copy liquid-glass reveal-block" style={{ '--stagger': '150ms' } as React.CSSProperties}>
          <p>我是{profile.name}，英文名 {profile.englishName}，{profile.role}。具备约 4 年设计相关经验，主要参与酒店活动推广与餐饮视觉相关项目，能够围绕品牌调性完成画面设计、物料延展与内容呈现。</p>
          <p>我更关注设计是否能被真实使用：信息是否清楚、视觉是否统一、物料是否能顺利交付。对我来说，高级感不是复杂，而是克制、准确，并且经得起落地。</p>
          <div className="contact-list">
            <a href={'tel:' + profile.phone}><Phone size={15} />{profile.phone}</a>
            <a href={'mailto:' + profile.email}><Mail size={15} />{profile.email}</a>
          </div>
        </div>
        <div className="stats-grid">
          <BorderGlow className="stat-card reveal-block" borderRadius={22} animated {...glowDefaults} {...glowThemes.stats} style={{ '--stagger': '210ms' } as React.CSSProperties}><strong>4年</strong><span>设计相关经验</span></BorderGlow>
          <BorderGlow className="stat-card reveal-block" borderRadius={22} {...glowDefaults} {...glowThemes.stats} style={{ '--stagger': '270ms' } as React.CSSProperties}><strong>5</strong><span>商业工作经历</span></BorderGlow>
          <BorderGlow className="stat-card reveal-block" borderRadius={22} {...glowDefaults} {...glowThemes.stats} style={{ '--stagger': '330ms' } as React.CSSProperties}><strong>20+</strong><span>常见物料类型</span></BorderGlow>
          <BorderGlow className="stat-card reveal-block" borderRadius={22} {...glowDefaults} {...glowThemes.stats} style={{ '--stagger': '390ms' } as React.CSSProperties}><strong>Adobe</strong><span>PS / AI / PR</span></BorderGlow>
        </div>
      </div>
    </section>
  );
}

function Projects({ onOpenProject }: { onOpenProject: (project: Project) => void }) {
  return (
    <section id="projects" className="section-block projects-section">
      <SectionHeading kicker="02 / 作品展示" title="精选项目方向" text="Selected Works" />
      <div className="project-grid project-grid-vertical">
        {projects.map((project, index) => (
          <BorderGlow
            className={'project-card reveal-block tone-' + project.tone}
            borderRadius={30}
            animated={index === 0}
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
            <div className="project-visual">
              <div className="project-visual-sheen" aria-hidden="true" />
              {project.images && (
                <div className={'poster-stack poster-count-' + Math.min(project.images.length, 3)} aria-label={project.title + '作品'}>
                  {project.images.slice(0, 3).map((image) => (
                    <img src={image.src} alt={image.alt} key={image.src} loading="lazy" />
                  ))}
                </div>
              )}
              <span className="project-index">0{index + 1}</span>
              <i>{project.type}</i>
              <div className="project-info project-info-overlay">
                <h3>{project.title}</h3>
                <p>{project.scope}</p>
                {project.images && <em>{project.images.length} 张精选作品 / Collection</em>}
              </div>
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
              onDoubleClick={() => onOpenImage(image)}
              aria-label={'双击放大查看' + image.title}
            >
              <img src={image.src} alt={image.alt} />
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
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
      <SectionHeading kicker="03 / 个人优势" title="把审美、执行和沟通放在同一个工作流里。" text="Capability" />
      <div className="strength-grid">
        {strengths.map((item, index) => {
          const Icon = item.icon;
          return (
            <BorderGlow className="strength-card reveal-block" borderRadius={26} key={item.title} animated={index === 0} {...glowDefaults} {...glowThemes.strengths} style={{ '--stagger': `${index * 80}ms` } as React.CSSProperties}>
              <div className="icon-box"><Icon size={22} strokeWidth={1.6} /></div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </BorderGlow>
          );
        })}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="section-screen contact-section">
      <div className="contact-inner reveal-block">
        <p className="eyebrow">04 / 联系信息</p>
        <h2>如果你已经看过我的作品，进一步沟通会更自然。</h2>
        <div className="contact-actions">
          <a className="liquid-glass" href={'tel:' + profile.phone}><Phone size={16} />{profile.phone}</a>
          <a className="liquid-glass" href={'mailto:' + profile.email}><Mail size={16} />{profile.email}</a>
        </div>
      </div>
    </section>
  );
}

createRoot(document.getElementById('root')!).render(<App />);

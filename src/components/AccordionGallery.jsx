'use client';

import { useRef, useEffect, useLayoutEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';

import './AccordionGallery.css';

const DEFAULT_ITEMS = [
  { image: 'https://picsum.photos/id/1015/900/1200', label: 'Canyon', link: '#' },
  { image: 'https://picsum.photos/id/1018/900/1200', label: 'Ridgeline', link: '#' },
  { image: 'https://picsum.photos/id/1039/900/1200', label: 'Falls', link: '#' },
  { image: 'https://picsum.photos/id/1043/900/1200', label: 'Harbour', link: '#' },
  { image: 'https://picsum.photos/id/1044/900/1200', label: 'Skyline', link: '#' }
];

const AccordionGallery = ({
  items = DEFAULT_ITEMS,
  defaultIndex = 2,
  accentColor = '#ffffff',
  overlayColor = '#060010',
  textColor = '#ffffff',
  height = 460,
  gap = 10,
  radius = 16,
  expandRatio = 0.52,
  mediaRatio = 0,
  orientation = 'horizontal',
  duration = 0.6,
  ease = 'power3.out',
  parallax = 0.5,
  tilt = 8,
  stagger = 0.06,
  trigger = 'hover',
  showLabels = true,
  grayscale = true,
  className = '',
  onIndexChange,
  onSelect
}) => {
  const rootRef = useRef(null);
  const panelRefs = useRef([]);
  const mediaRefs = useRef([]);
  const barRefs = useRef([]);
  const textRefs = useRef([]);
  const tlRef = useRef(null);
  const firstRunRef = useRef(true);
  const mediaSizeRef = useRef(320);

  const vertical = orientation === 'vertical';
  const count = items.length;
  const [active, setActive] = useState(Math.min(Math.max(defaultIndex, 0), count - 1));

  /* 原组件把 active 关在自己里面：外面既拿不到"现在是哪一张"（下面那行
     件数 / 入口文案要跟着它走），也没法在"点已经展开的那张"时做别的动作
     （它只在 i !== active 时才处理点击）。补两个出口，不改原有行为。 */
  const indexCbRef = useRef(onIndexChange);
  indexCbRef.current = onIndexChange;
  const selectCbRef = useRef(onSelect);
  selectCbRef.current = onSelect;
  useEffect(() => {
    indexCbRef.current?.(active);
  }, [active]);

  const prefersReduced =
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  const applyLayout = useCallback(
    animate => {
      const panels = panelRefs.current;
      if (!panels.length) return;

      const r = Math.min(Math.max(expandRatio, 0.2), 0.9);
      const grow = count > 1 ? (r * (count - 1)) / (1 - r) : 1;
      const mediaSize = mediaSizeRef.current;

      tlRef.current?.kill();
      const dur = animate && !prefersReduced ? duration : 0;
      const tl = gsap.timeline();

      panels.forEach((panel, i) => {
        if (!panel) return;
        const isActive = i === active;
        const media = mediaRefs.current[i];
        const bar = barRefs.current[i];
        const text = textRefs.current[i];

        const rot = isActive ? 0 : i < active ? tilt : -tilt;
        const rotProp = vertical ? { rotateX: -rot } : { rotateY: rot };

        tl.to(panel, { flexGrow: isActive ? grow : 1, ...rotProp, duration: dur, ease }, 0);

        if (media) {
          const drift = Math.max(-1.5, Math.min(1.5, active - i));
          const shift = drift * parallax * mediaSize * 0.06;
          const gray = grayscale ? (isActive ? 0 : 1) : 0;
          tl.to(
            media,
            {
              xPercent: -50,
              yPercent: -50,
              x: vertical ? 0 : isActive ? 0 : shift,
              y: vertical ? (isActive ? 0 : shift) : 0,
              '--ag-gray': gray,
              '--ag-dim': isActive ? 0 : 0.35,
              duration: dur,
              ease
            },
            0
          );
        }

        if (showLabels && bar && text) {
          if (isActive) {
            tl.to([bar, text], { opacity: 1, x: 0, duration: dur, ease, stagger: prefersReduced ? 0 : stagger }, 0);
          } else {
            tl.to([bar, text], { opacity: 0, x: -14, duration: dur * 0.6, ease }, 0);
          }
        }
      });

      tlRef.current = tl;
    },
    [
      active,
      count,
      expandRatio,
      duration,
      ease,
      vertical,
      tilt,
      parallax,
      grayscale,
      showLabels,
      stagger,
      prefersReduced
    ]
  );

  /* useLayoutEffect 而不是 useEffect：高度现在是量完宽度再算的，第一次要在绘制前
     就把 620 改成 432。放在 useEffect 里会先按兜底值画一帧，然后整块缩短 188px，
     它下面所有内容跟着窜一下——刷新页面时正好能看到这一次。 */
  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const ratio = Math.min(Math.max(expandRatio, 0.2), 0.9);
      const gaps = gap * (count - 1);
      /* 原来这里乘了 1.22：媒体框比展开那张大 22%，多出来的给视差位移留余量。
         代价是海报被放大 1.22 倍、永远露不全——占位图（picsum 竖图）看不出来，
         换成 4:3 的成品海报就很明显：整张图只剩中间七成，还得再被面板切一刀。
         现在不乘了。视差位移只在收起状态生效（展开时 x 是 0），
         收起那几张的媒体框本来就比面板宽 2.4 倍，不缺这点余量。 */
      let size = Math.max(140, Math.max((vertical ? rect.height : rect.width) - gaps, 120) * ratio);
      let rootH = 0;

      /* 给了 mediaRatio 就把整块的短边也交给宽度算，让展开那张正好是这个比例。
         横折：面板宽 =(块宽-缝)×r，面板高 = 块高（stretch）→ 块高 = 面板宽 / ratio
         竖折：面板宽 = 块宽，面板高 =(块高-缝)×r        → 块高 = (块宽/ratio)/r + 缝
         竖折这条不能读 rect.height：块高正是它要算的东西，读了就是循环。 */
      if (mediaRatio > 0) {
        if (vertical) {
          size = rect.width / mediaRatio;
          rootH = Math.round(size / ratio + gaps);
        } else {
          rootH = Math.round(size / mediaRatio);
        }
      }

      mediaSizeRef.current = size;
      el.style.setProperty('--ag-media-size', `${size}px`);
      /* 用自定义属性而不是 el.style.height：组件每次重渲染都会重刷 style 对象里的
         height，直接改的话一个 hover 就被旧值盖回去；自定义属性不在 React 管的对象里，
         写上就留着。CSS 那边 height: var(--ag-root-h, …) 兜底。 */
      if (rootH) el.style.setProperty('--ag-root-h', `${rootH}px`);
      applyLayout(!firstRunRef.current);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [applyLayout, gap, count, expandRatio, vertical, mediaRatio]);

  useEffect(() => {
    applyLayout(!firstRunRef.current);
    firstRunRef.current = false;
  }, [applyLayout]);

  useEffect(
    () => () => {
      tlRef.current?.kill();
    },
    []
  );

  const handleEnter = i => {
    if (trigger === 'hover') setActive(i);
  };

  const handleClick = (i, e) => {
    if (i !== active) {
      e.preventDefault();
      setActive(i);
      return;
    }
    /* 已经展开的那张再点一下 = 打开整组；给了 link 就照旧走链接 */
    if (!e.currentTarget.getAttribute('href')) {
      e.preventDefault();
      selectCbRef.current?.(i);
    }
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i + 1) % count);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i - 1 + count) % count);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      /* 用 active 而不是 i：方向键只移动展开状态、不移动焦点，按完右箭头焦点还在
         原来那张上，用 i 会打开上一张。 */
      selectCbRef.current?.(active);
    }
  };

  return (
    <div
      ref={rootRef}
      className={`accordion-gallery${vertical ? ' accordion-gallery--vertical' : ''}${className ? ` ${className}` : ''}`}
      style={{
        '--ag-accent': accentColor,
        '--ag-overlay': overlayColor,
        '--ag-text': textColor,
        '--ag-gap': `${gap}px`,
        '--ag-radius': `${radius}px`,
        /* --ag-root-h 由 measure() 按宽度算出来后写在元素上；没算出来之前
           （首帧、或者没传 mediaRatio）用 height 兜底。mediaRatio 的说明见文件上方。 */
        height: vertical
          ? `var(--ag-root-h, ${Math.round(height * 1.6)}px)`
          : `var(--ag-root-h, ${height}px)`
      }}
      role="list"
      aria-label="Image accordion gallery"
    >
      {items.map((item, i) => {
        const isActive = i === active;
        const Tag = item.link ? 'a' : 'div';
        return (
          <Tag
            key={i}
            ref={el => (panelRefs.current[i] = el)}
            className={`ag-panel${isActive ? ' ag-panel--active' : ''}`}
            style={{ borderRadius: `${radius}px` }}
            href={item.link || undefined}
            onClick={e => handleClick(i, e)}
            onMouseEnter={() => handleEnter(i)}
            onFocus={() => setActive(i)}
            onKeyDown={e => handleKeyDown(i, e)}
            role="listitem"
            tabIndex={0}
            aria-current={isActive ? 'true' : undefined}
            aria-label={item.label}
          >
            <span className="ag-panel__frame">
              <span className="ag-panel__media" ref={el => (mediaRefs.current[i] = el)}>
                <img src={item.image} alt={item.alt || item.label || ''} draggable="false" />
              </span>
              <span className="ag-panel__overlay" aria-hidden="true" />
            </span>
            {showLabels && (
              <span className="ag-panel__label" aria-hidden="true">
                <span className="ag-panel__bar" ref={el => (barRefs.current[i] = el)} />
                <span className="ag-panel__text" ref={el => (textRefs.current[i] = el)}>
                  {item.label}
                </span>
              </span>
            )}
          </Tag>
        );
      })}
    </div>
  );
};

export default AccordionGallery;

import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import './GooeyNav.css';

export interface GooeyNavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

interface GooeyNavProps {
  items: GooeyNavItem[];
  sidebarOpen?: boolean;
  animationTime?: number;
  particleCount?: number;
  particleDistances?: [number, number];
  particleR?: number;
  timeVariance?: number;
  colors?: string[];
  initialActiveIndex?: number;
}

const GooeyNav: React.FC<GooeyNavProps> = ({
  items,
  sidebarOpen = true,
  animationTime = 400,
  particleCount = 10,
  particleDistances = [50, 5],
  particleR = 50,
  timeVariance = 150,
  colors = ['#B58B63', '#3D4D55', '#C9C0B9'], // Copper, Teal, Beige particles
  initialActiveIndex = 0
}) => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLUListElement | null>(null);
  const filterRef = useRef<HTMLSpanElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);

  const noise = (n = 1) => n / 2 - Math.random() * n;

  const getXY = (distance: number, pointIndex: number, totalPoints: number) => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };

  const createParticle = (i: number, t: number, d: [number, number], r: number) => {
    const rotate = noise(r / 10);
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(7), particleCount - i, particleCount),
      time: t,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10
    };
  };

  const makeParticles = (element: HTMLElement) => {
    const d = particleDistances;
    const r = particleR;
    const bubbleTime = animationTime * 2 + timeVariance;
    element.style.setProperty('--time', `${bubbleTime}ms`);

    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2);
      const p = createParticle(i, t, d, r);
      element.classList.remove('active');

      setTimeout(() => {
        const particle = document.createElement('span');
        const point = document.createElement('span');
        particle.classList.add('particle');
        particle.style.setProperty('--start-x', `${p.start[0]}px`);
        particle.style.setProperty('--start-y', `${p.start[1]}px`);
        particle.style.setProperty('--end-x', `${p.end[0]}px`);
        particle.style.setProperty('--end-y', `${p.end[1]}px`);
        particle.style.setProperty('--time', `${p.time}ms`);
        particle.style.setProperty('--scale', `${p.scale}`);
        particle.style.setProperty('--color', p.color);
        particle.style.setProperty('--rotate', `${p.rotate}deg`);

        point.classList.add('point');
        particle.appendChild(point);
        element.appendChild(particle);
        requestAnimationFrame(() => {
          element.classList.add('active');
        });
        setTimeout(() => {
          try {
            element.removeChild(particle);
          } catch {
            // Do nothing
          }
        }, t);
      }, 30);
    }
  };

  const updateEffectPosition = (element: HTMLElement) => {
    if (!containerRef.current || !filterRef.current || !textRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const pos = element.getBoundingClientRect();

    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`
    };
    Object.assign(filterRef.current.style, styles);
    Object.assign(textRef.current.style, styles);
    
    // Copy the text label if the sidebar is expanded
    if (sidebarOpen) {
      textRef.current.innerText = element.innerText;
      textRef.current.style.display = 'flex';
    } else {
      textRef.current.innerText = '';
      textRef.current.style.display = 'none';
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, index: number, to: string) => {
    e.preventDefault();
    const liEl = e.currentTarget.parentElement;
    if (!liEl) return;

    if (activeIndex === index) return;

    setActiveIndex(index);
    updateEffectPosition(liEl);
    navigate(to);

    if (filterRef.current) {
      const particles = filterRef.current.querySelectorAll('.particle');
      particles.forEach(p => filterRef.current!.removeChild(p));
    }

    if (textRef.current) {
      textRef.current.classList.remove('active');
      void textRef.current.offsetWidth;
      textRef.current.classList.add('active');
    }

    if (filterRef.current) {
      makeParticles(filterRef.current);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>, index: number, to: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const liEl = e.currentTarget.parentElement;
      if (liEl) {
        // Mock click event structure
        const mockEvent = {
          preventDefault: () => {},
          currentTarget: e.currentTarget
        } as unknown as React.MouseEvent<HTMLAnchorElement>;
        handleClick(mockEvent, index, to);
      }
    }
  };

  useEffect(() => {
    if (!navRef.current || !containerRef.current) return;
    const activeLi = navRef.current.querySelectorAll('li')[activeIndex];
    if (activeLi) {
      updateEffectPosition(activeLi);
      textRef.current?.classList.add('active');
    }

    const resizeObserver = new ResizeObserver(() => {
      const currentActiveLi = navRef.current?.querySelectorAll('li')[activeIndex];
      if (currentActiveLi) {
        updateEffectPosition(currentActiveLi);
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [activeIndex, sidebarOpen]);

  // Sync active index if navigation occurs externally (e.g. initial load)
  useEffect(() => {
    const currentPath = window.location.pathname;
    const matchedIndex = items.findIndex(item => item.to === currentPath || currentPath.startsWith(item.to + '/'));
    if (matchedIndex !== -1 && matchedIndex !== activeIndex) {
      setActiveIndex(matchedIndex);
    }
  }, [items]);

  return (
    <div className="gooey-nav-container" ref={containerRef}>
      <nav>
        <ul ref={navRef}>
          {items.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeIndex === index;
            return (
              <li key={index} className={isActive ? 'active' : ''}>
                <a
                  href={item.to}
                  onClick={e => handleClick(e, index, item.to)}
                  onKeyDown={e => handleKeyDown(e, index, item.to)}
                  className="group relative"
                >
                  <Icon
                    size={18}
                    className={`flex-shrink-0 relative z-10 transition-colors ${
                      isActive ? 'text-[#1A1A1A]' : 'text-[#A79E9C] group-hover:text-[#C9C0B9]'
                    }`}
                  />
                  {sidebarOpen ? (
                    <span className="relative z-10 truncate">{item.label}</span>
                  ) : (
                    <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-[#253035] text-[#C9C0B9] text-xs rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                      {item.label}
                    </div>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
      {/* Hide the visual gooey blobs when the sidebar is collapsed to keep it tidy */}
      {sidebarOpen && (
        <>
          <span className="effect filter" ref={filterRef} />
          <span className="effect text animate-fade-in" ref={textRef} />
        </>
      )}
    </div>
  );
};

export default GooeyNav;

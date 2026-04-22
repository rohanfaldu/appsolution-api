import React, { useEffect, useRef, useState } from 'react';

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  delayMs?: number;
};

const Reveal: React.FC<RevealProps> = ({ children, className = '', as = 'div', delayMs = 0 }) => {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const Tag = as as any;
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? 'reveal-in' : ''} ${className}`}
      style={delayMs ? ({ transitionDelay: `${delayMs}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
};

export default Reveal;


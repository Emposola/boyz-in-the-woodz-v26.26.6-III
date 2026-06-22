/* ============================================================
   HERO SLIDESHOW — Crossfading video/image background
   Cycles: boots video → men retreat video → campfire image → loop
   5 seconds per slide, 1s crossfade, muted autoplay
   ============================================================ */
import React, { useState, useEffect, useRef, useCallback } from 'react';

const SLIDES = [
  { type: 'video', src: '/videos/hero/boots-trail.mp4' },
  { type: 'video', src: '/videos/hero/men-retreat.mp4' },
  { type: 'image', src: '/images/unsplash/forest-campfire.webp' },
];

const SLIDE_DURATION = 5000;
const CROSSFADE_DURATION = 1000;

export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef(null);
  const videoRefs = useRef([]);

  const advance = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
      setIsTransitioning(false);
    }, CROSSFADE_DURATION);
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(advance, SLIDE_DURATION);
    return () => clearInterval(timerRef.current);
  }, [advance]);

  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (SLIDES[i].type !== 'video') return;
      if (i === current) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [current]);

  return (
    <div className="absolute inset-0">
      {SLIDES.map((slide, i) => {
        const isActive = i === current;
        const opacity = isActive ? (isTransitioning ? 0 : 1) : 0;
        const zIndex = isActive ? 1 : 0;

        if (slide.type === 'video') {
          return (
            <video
              key={i}
              ref={(el) => { videoRefs.current[i] = el; }}
              src={slide.src}
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                opacity,
                zIndex,
                transition: `opacity ${CROSSFADE_DURATION}ms ease-in-out`,
                willChange: 'opacity',
              }}
            />
          );
        }

        return (
          <div
            key={i}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${slide.src})`,
              opacity,
              zIndex,
              transition: `opacity ${CROSSFADE_DURATION}ms ease-in-out`,
              willChange: 'opacity',
              transform: 'scale(1.05)',
            }}
          />
        );
      })}
    </div>
  );
}

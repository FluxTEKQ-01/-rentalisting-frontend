import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface HeroBackgroundSliderProps {
  images: string[];
  autoSlideInterval?: number;
}

const slideVariants: Variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      x: { type: 'spring', stiffness: 260, damping: 30 },
      opacity: { duration: 0.6 },
    },
  },
  exit: (dir: number) => ({
    x: dir < 0 ? '100%' : '-100%',
    opacity: 0,
    transition: {
      x: { type: 'spring', stiffness: 260, damping: 30 },
      opacity: { duration: 0.6 },
    },
  }),
};

export default function HeroBackgroundSlider({
  images,
  autoSlideInterval = 4500,
}: HeroBackgroundSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  // Auto-slide effect
  useEffect(() => {
    if (!images || images.length <= 1) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, autoSlideInterval);

    return () => clearInterval(timer);
  }, [images, autoSlideInterval]);

  if (!images || images.length === 0) return null;

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden select-none bg-slate-950">
      {/* Background Sliding Images */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          alt="Category Hero Background"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      </AnimatePresence>

      {/* High Visibility Light Overlay & Vignette */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#030814]/70 via-[#030814]/35 to-transparent pointer-events-none z-10"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#030814]/80 via-transparent to-black/20 pointer-events-none z-10"></div>

      {/* Interactive Controls & Slide Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-6 right-6 z-30 flex items-center gap-3 bg-slate-900/60 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/10 shadow-lg">
          <button
            onClick={handlePrev}
            className="flex h-7 w-7 items-center justify-center rounded-full text-white/70 hover:bg-white/20 hover:text-white transition-colors"
            aria-label="Previous Slide"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-1.5">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? 'w-6 bg-[#F58220]'
                    : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex h-7 w-7 items-center justify-center rounded-full text-white/70 hover:bg-white/20 hover:text-white transition-colors"
            aria-label="Next Slide"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

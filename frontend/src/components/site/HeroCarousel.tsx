import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import banner1 from "@/assets/banner/bn1.jpeg";
import banner2 from "@/assets/banner/bn2.jpeg";
import banner3 from "@/assets/banner/bn3..jpeg";
import banner4 from "@/assets/banner/bn4.jpeg";
import banner5 from "@/assets/banner/bn5.jpeg";
import banner6 from "@/assets/banner/bn6.jpeg";

// Banner Data structure
interface BannerData {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
  tabLabel: string;
}

const BANNERS: BannerData[] = [
  // Banner 1: FRESH FLOWERS & PREMIUM GARLANDS
  {
    id: 1,
    badge: "FRESHLY HANDCRAFTED DAILY · DUVIX EXCLUSIVE",
    title: "FRESH FLOWERS & PREMIUM GARLANDS",
    subtitle: "Freshly handcrafted flowers and beautiful garlands from DUVIX.",
    ctaText: "SHOP NOW",
    ctaLink: "/garlands",
    backgroundImage: banner1,
    tabLabel: "Fresh Garlands",
  },
  // Banner 2: ELEGANT WEDDING GARLANDS
  {
    id: 2,
    badge: "ROYAL BRIDAL VARMALA & WEDDING SETS",
    title: "ELEGANT WEDDING GARLANDS",
    subtitle: "Handcrafted with fresh flowers for your special day.",
    ctaText: "EXPLORE WEDDING COLLECTION",
    ctaLink: "/collections/wedding",
    backgroundImage: banner2,
    tabLabel: "Wedding Garlands",
  },
  // Banner 3: FLOWERS & DJ PROPERTIES
  {
    id: 3,
    badge: "FLOWERS & DJ PROPERTIES",
    title: "FLOWERS & DJ PROPERTIES",
    subtitle: "Flowers for every moment, Beats for every celebration.",
    ctaText: "EXPLORE DJ & SOUNDS",
    ctaLink: "/collections/dj-sound-system",
    backgroundImage: banner3,
    tabLabel: "DJ & Sounds",
  },
  // Banner 4: CUSTOM GIFTS & BOUQUET
  {
    id: 4,
    badge: "CUSTOM GIFTS & BEAUTIFUL BOUQUETS",
    title: "CUSTOM GIFTS & BOUQUETS",
    subtitle: "Thoughtful Gifts. Beautiful Bouquets. Made for Every Occasion.",
    ctaText: "SHOP FLOWERS",
    ctaLink: "/flowers",
    backgroundImage: banner4,
    tabLabel: "Gifts & Bouquets",
  },
  // Banner 5: CATERING
  {
    id: 5,
    badge: "FRESH INGREDIENTS & PROFESSIONAL SERVICE",
    title: "DUVIX CATERING",
    subtitle: "Delicious Moments, Made for Every Occasion. Veg & Non-Veg Available.",
    ctaText: "EXPLORE CATERING",
    ctaLink: "/collections/wedding",
    backgroundImage: banner5,
    tabLabel: "Catering",
  },
  // Banner 6: EVENTS DECORATION & MORE
  {
    id: 6,
    badge: "COMPLETE EVENT DECORATION & CELEBRATION SERVICES",
    title: "EVENTS DECORATION & MORE",
    subtitle: "Decor for every celebration, Memories for a lifetime.",
    ctaText: "PLAN YOUR EVENT",
    ctaLink: "/custom",
    backgroundImage: banner6,
    tabLabel: "Events & Decor",
  },
];

const AUTOPLAY_INTERVAL = 5000; // 5 seconds per slide
const TICK_INTERVAL = 50;

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTickTimeRef = useRef<number>(Date.now());

  const currentBanner = BANNERS[currentIndex];

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex((index + BANNERS.length) % BANNERS.length);
    setProgress(0);
    lastTickTimeRef.current = Date.now();
  }, []);

  const nextSlide = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [currentIndex, goToSlide]);

  // Autoplay loop
  useEffect(() => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }

    lastTickTimeRef.current = Date.now();

    progressTimerRef.current = setInterval(() => {
      if (isPaused || isHovered) {
        lastTickTimeRef.current = Date.now();
        return;
      }

      const now = Date.now();
      const delta = now - lastTickTimeRef.current;
      lastTickTimeRef.current = now;

      setProgress((prev) => {
        const nextVal = prev + (delta / AUTOPLAY_INTERVAL) * 100;
        if (nextVal >= 100) {
          nextSlide();
          return 0;
        }
        return nextVal;
      });
    }, TICK_INTERVAL);

    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
    };
  }, [currentIndex, isPaused, isHovered, nextSlide]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prevSlide();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      nextSlide();
    } else if (e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      setIsPaused((p) => !p);
    }
  };

  // Touch Swipe handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diffX = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 40; // pixels
    if (diffX > minSwipeDistance) {
      nextSlide();
    } else if (diffX < -minSwipeDistance) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="DUVIX Flowers & Events Promotional Banners"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full overflow-hidden bg-stone-950 text-white outline-none select-none"
    >
      {/* Live Region for Screen Readers */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Slide {currentIndex + 1} of {BANNERS.length}: {currentBanner.title} {currentBanner.subtitle}
      </div>

      {/* Main Slides Container with 16:9 Aspect Ratio for perfect display on Mobile & Desktop */}
      <div className="relative w-full aspect-[16/9] max-h-[640px] overflow-hidden bg-black">
        {BANNERS.map((banner, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={banner.id}
              aria-hidden={!isActive}
              className={`absolute inset-0 h-full w-full transition-opacity duration-700 ease-in-out ${
                isActive
                  ? "opacity-100 z-10 pointer-events-auto"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <Link
                to={banner.ctaLink}
                className="block h-full w-full relative cursor-pointer"
              >
                {/* 16:9 Graphic Banner */}
                <img
                  src={banner.backgroundImage}
                  alt={banner.title}
                  className="h-full w-full object-contain sm:object-cover object-center"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </Link>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrow Controls */}
      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-20 flex items-center justify-between px-1.5 sm:px-3 md:px-5">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          aria-label="Previous Slide"
          className="pointer-events-auto flex h-7 w-7 sm:h-9 sm:w-9 md:h-11 md:w-11 items-center justify-center rounded-full border border-white/30 bg-black/50 text-white shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/80 hover:border-[#d4af37] active:scale-95"
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          aria-label="Next Slide"
          className="pointer-events-auto flex h-7 w-7 sm:h-9 sm:w-9 md:h-11 md:w-11 items-center justify-center rounded-full border border-white/30 bg-black/50 text-white shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/80 hover:border-[#d4af37] active:scale-95"
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 inset-x-0 z-20 flex items-center justify-center gap-1.5 sm:gap-2">
        {BANNERS.map((banner, index) => (
          <button
            key={banner.id}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goToSlide(index);
            }}
            aria-label={`Go to slide ${index + 1}`}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? "w-4 sm:w-6 h-1 sm:h-1.5 bg-[#d4af37] shadow-sm"
                : "w-1 sm:w-1.5 h-1 sm:h-1.5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

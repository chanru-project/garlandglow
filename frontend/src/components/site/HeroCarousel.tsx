import { useEffect, useState, useRef, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Clock,
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
  badgeIcon: "crown" | "heart" | "flower" | "party";
  title: string;
  titleHighlight?: string;
  subtitle: string;
  features: Array<{ text: string; icon: string }>;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  backgroundImage: string;
  tabLabel: string;
  floatingBadge?: {
    icon: string;
    title: string;
    subtitle: string;
  };
  accentColor: string; // for theme styling
}

const BANNERS: BannerData[] = [
  // Banner 1: FRESH FLOWERS & PREMIUM GARLANDS
  {
    id: 1,
    badge: "FRESHLY HANDCRAFTED DAILY · DUVIX EXCLUSIVE",
    badgeIcon: "crown",
    title: "FRESH FLOWERS &",
    titleHighlight: "PREMIUM GARLANDS",
    subtitle: "Freshly handcrafted flowers and beautiful garlands from DUVIX.",
    features: [
      { text: "Freshly Handcrafted Daily", icon: "🌸" },
      { text: "100% Farm-Fresh Blooms", icon: "🌿" },
      { text: "Chilled Doorstep Delivery", icon: "🚚" },
    ],
    ctaText: "SHOP NOW",
    ctaLink: "/garlands",
    secondaryCtaText: "View Catalog",
    secondaryCtaLink: "/collections",
    backgroundImage: banner1,
    tabLabel: "Fresh Garlands",
    floatingBadge: {
      icon: "⭐",
      title: "4.9 Rating",
      subtitle: "Trusted by 10,000+ Customers",
    },
    accentColor: "gold",
  },
  // Banner 2: ELEGANT WEDDING GARLANDS
  {
    id: 2,
    badge: "ROYAL BRIDAL VARMALA & WEDDING SETS",
    badgeIcon: "heart",
    title: "ELEGANT WEDDING",
    titleHighlight: "GARLANDS",
    subtitle: "Handcrafted with fresh flowers for your special day.",
    features: [
      { text: "Royal Bridal Varmala", icon: "💍" },
      { text: "Custom Attire Matching", icon: "🎨" },
      { text: "Venue Direct Delivery", icon: "🏛️" },
    ],
    ctaText: "EXPLORE WEDDING COLLECTION",
    ctaLink: "/collections/wedding",
    secondaryCtaText: "Custom Order",
    secondaryCtaLink: "/custom",
    backgroundImage: banner2,
    tabLabel: "Wedding Garlands",
    floatingBadge: {
      icon: "👑",
      title: "Hand-Stitched Luxury",
      subtitle: "Pure Rose & Jasmine Weave",
    },
    accentColor: "blush",
  },
  // Banner 3: FLOWERS FOR EVERY MOMENT
  {
    id: 3,
    badge: "CELEBRATION BLOOMS & POOJA FLOWERS",
    badgeIcon: "flower",
    title: "FLOWERS FOR",
    titleHighlight: "EVERY MOMENT",
    subtitle: "Beautiful flowers for birthdays, engagements, housewarmings and celebrations.",
    features: [
      { text: "Daily Pooja & Ritual Flowers", icon: "🌺" },
      { text: "Hand-Tied Bouquets", icon: "💐" },
      { text: "Cold-Chain Chilled Storage", icon: "❄️" },
    ],
    ctaText: "SHOP FLOWERS",
    ctaLink: "/flowers",
    secondaryCtaText: "All Collections",
    secondaryCtaLink: "/collections",
    backgroundImage: banner4,
    tabLabel: "Celebration Flowers",
    floatingBadge: {
      icon: "🌿",
      title: "Morning Harvest",
      subtitle: "Delivered Crisp & Fragrant",
    },
    accentColor: "emerald",
  },
  // Banner 4: MAKE EVERY EVENT BEAUTIFUL
  {
    id: 4,
    badge: "COMPLETE EVENT DECORATION & CELEBRATION SERVICES",
    badgeIcon: "party",
    title: "MAKE EVERY EVENT",
    titleHighlight: "BEAUTIFUL",
    subtitle: "Wedding decoration, stage decor, balloons, lighting, DJ & complete event services.",
    features: [
      { text: "Grand Stage & Mandap Decor", icon: "🎭" },
      { text: "Ambient & Lighting FX", icon: "💡" },
      { text: "Live DJ & Sound Systems", icon: "🎵" },
    ],
    ctaText: "PLAN YOUR EVENT",
    ctaLink: "/custom",
    secondaryCtaText: "Contact Planner",
    secondaryCtaLink: "/contact",
    backgroundImage: banner6,
    tabLabel: "Events & Decor",
    floatingBadge: {
      icon: "✨",
      title: "Full-Service Production",
      subtitle: "Weddings, Receptions & Galas",
    },
    accentColor: "amber",
  },
  {
    id: 5,
    badge: "CUSTOM GIFTS & BEAUTIFUL BOUQUETS",
    badgeIcon: "heart",
    title: "THOUGHTFUL GIFTS",
    titleHighlight: "FOR EVERY OCCASION",
    subtitle: "Beautiful bouquets and personalized gifts made with care.",
    features: [
      { text: "Fresh Flower Bouquets", icon: "💐" },
      { text: "Personalized Hampers", icon: "🎁" },
      { text: "On-Time Delivery", icon: "🚚" },
    ],
    ctaText: "SHOP GIFTS",
    ctaLink: "/collections",
    secondaryCtaText: "Contact Us",
    secondaryCtaLink: "/contact",
    backgroundImage: banner3,
    tabLabel: "Gifts & Bouquets",
    floatingBadge: {
      icon: "🎁",
      title: "Made With Love",
      subtitle: "Thoughtful Gifts, Beautiful Moments",
    },
    accentColor: "blush",
  },
  {
    id: 6,
    badge: "FRESH INGREDIENTS & PROFESSIONAL SERVICE",
    badgeIcon: "flower",
    title: "DELICIOUS MOMENTS",
    titleHighlight: "MADE FOR EVERY OCCASION",
    subtitle: "Authentic cuisines, custom menus, and service made with care.",
    features: [
      { text: "Wide Variety of Cuisines", icon: "🍽️" },
      { text: "Hygienic & Fresh", icon: "🌿" },
      { text: "Custom Menu Options", icon: "✨" },
    ],
    ctaText: "EXPLORE CATERING",
    ctaLink: "/collections",
    secondaryCtaText: "Contact Planner",
    secondaryCtaLink: "/contact",
    backgroundImage: banner5,
    tabLabel: "Catering",
    floatingBadge: {
      icon: "🍽️",
      title: "Served With Love",
      subtitle: "Fresh Ingredients, Memorable Events",
    },
    accentColor: "amber",
  },
];

// const AUTOPLAY_INTERVAL = 5000; // Exactly 20 seconds
// const TICK_INTERVAL = 40; // smooth 40ms tick for progress bar
const MIN_AUTOPLAY_INTERVAL = 1000;  // 9 seconds
const MAX_AUTOPLAY_INTERVAL = 2000; // 11 seconds
const TICK_INTERVAL = 40;

const getNextAutoplayInterval = () =>
  Math.floor(
    Math.random() * (MAX_AUTOPLAY_INTERVAL - MIN_AUTOPLAY_INTERVAL + 1)
  ) + MIN_AUTOPLAY_INTERVAL;

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

  // Autoplay 20-Second loop & progress tracking
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
        const nextVal = prev + (delta / getNextAutoplayInterval()) * 100;
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
    const minSwipeDistance = 45; // pixels
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

      {/* Main Slides Container with Fixed Responsive Height */}
      <div className="relative h-[560px] sm:h-[600px] md:h-[640px] lg:h-[680px] w-full overflow-hidden">
        {BANNERS.map((banner, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={banner.id}
              aria-hidden={!isActive}
              className={`absolute inset-0 h-full w-full transition-all duration-1000 ease-in-out ${
                isActive
                  ? "opacity-100 z-10 pointer-events-auto scale-100"
                  : "opacity-0 z-0 pointer-events-none scale-105"
              }`}
            >
              {/* Full-bleed Background Image */}
              <img
                src={banner.backgroundImage}
                alt={banner.title}
                className="absolute inset-0 h-full w-full object-cover object-center transform transition-transform duration-10000 ease-out scale-100 group-hover:scale-105"
                loading={index === 0 ? "eager" : "lazy"}
              />


            </div>
          );
        })}
      </div>

      {/* Navigation Arrow Controls */}
      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-20 flex items-center justify-between px-2 sm:px-4 md:px-6">
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="pointer-events-auto flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white shadow-xl backdrop-blur-md transition-all hover:scale-110 hover:bg-black/70 hover:border-[#d4af37] focus-visible:ring-2 focus-visible:ring-[#d4af37]"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next Slide"
          className="pointer-events-auto flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white shadow-xl backdrop-blur-md transition-all hover:scale-110 hover:bg-black/70 hover:border-[#d4af37] focus-visible:ring-2 focus-visible:ring-[#d4af37]"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      </div>

    </section>
  );
}

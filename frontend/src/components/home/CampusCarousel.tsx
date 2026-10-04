'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play, Pause, Shield, MapPin, Sparkles } from 'lucide-react';

interface CampusSlide {
  id: number;
  src: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  location: string;
}

const slides: CampusSlide[] = [
  {
    id: 1,
    src: '/carousel/campus-1.jpg',
    title: 'Academic Avenue & Faculty Complexes',
    subtitle: 'Debre Berhan University Campus',
    description:
      'Lush green pine avenues and modern educational lecture halls protected by high-speed digital gate clearance.',
    badge: 'Main Campus Zone',
    location: 'Central Academic Quad',
  },
  {
    id: 2,
    src: '/carousel/campus-2.jpg',
    title: 'Evening Gate & Perimeter Security',
    subtitle: '24/7 Monitored Twilight Perimeter',
    description:
      'Automated dusk-to-dawn illumination and biometric checkpoint terminals securing university entryways.',
    badge: 'Active Gate Terminal',
    location: 'South Perimeter Checkpoint',
  },
  {
    id: 3,
    src: '/carousel/campus-3.jpg',
    title: 'Night Operations & Residence Halls',
    subtitle: 'Student & Faculty Safety 24/7',
    description:
      'Illuminated residential blocks and real-time electronic laptop and asset verification at dormitory gates.',
    badge: 'Night Patrol Active',
    location: 'Student Residence Complex',
  },
  {
    id: 4,
    src: '/carousel/campus-4.jpg',
    title: 'Panoramic Campus Grounds & Lawns',
    subtitle: 'Clean & Guarded University Environment',
    description:
      'Open green spaces and administrative blocks monitored with synchronized cloud checkpoint databases.',
    badge: 'Administrative Sector',
    location: 'North Campus Grounds',
  },
  {
    id: 5,
    src: '/carousel/campus-5.jpg',
    title: 'Architectural Pavilion & Stone Plaza',
    subtitle: 'Iconic DBU Heritage Centerpiece',
    description:
      'Historic circular assembly hall and traditional stone walkways under real-time security management.',
    badge: 'Campus Landmark',
    location: 'Assembly Hall Plaza',
  },
];

export default function CampusCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isPlaying, nextSlide]);

  return (
    <div
      className="relative w-full max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-cyan-500/30 bg-[#041a2e]/80 backdrop-blur-xl group"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Top Banner Tag */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#031c30]/80 backdrop-blur-md text-cyan-300 text-xs font-bold border border-cyan-400/40 shadow-lg shadow-cyan-950/40">
          <Shield className="w-3.5 h-3.5 text-cyan-400" />
          <span>DBU Campus Gateways</span>
        </span>
        <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-950/80 backdrop-blur-md text-[11px] font-semibold text-cyan-200 border border-cyan-500/30">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          Live Campus Views
        </span>
      </div>

      {/* Play/Pause Control Button */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          className="p-2 rounded-full bg-[#031c30]/80 hover:bg-cyan-950/90 text-cyan-300 hover:text-white border border-cyan-500/40 backdrop-blur-md transition-all shadow-md"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Slide Stage */}
      <div className="relative h-[420px] sm:h-[500px] lg:h-[560px] w-full overflow-hidden">
        {slides.map((slide, index) => {
          const isActive = index === current;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.title}
                fill
                priority={index === 0}
                className="object-cover object-center transform scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />

              {/* Water Blue Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#021424] via-[#041d33]/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#021424]/90 via-[#031d33]/40 to-transparent sm:max-w-[70%]" />

              {/* Caption Overlay */}
              <div className="absolute bottom-16 sm:bottom-20 left-0 right-0 p-6 sm:p-10 z-20 max-w-3xl">
                <div className="space-y-3 animate-fadeIn">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{slide.location}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span className="text-white/80">{slide.badge}</span>
                  </div>

                  <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-md leading-tight">
                    {slide.title}
                  </h3>

                  <p className="text-sm sm:text-base text-cyan-100/90 max-w-xl leading-relaxed drop-shadow">
                    {slide.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#031c30]/80 hover:bg-cyan-600/90 text-cyan-200 hover:text-white border border-cyan-400/40 backdrop-blur-md flex items-center justify-center transition-all shadow-lg hover:scale-110 active:scale-95"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#031c30]/80 hover:bg-cyan-600/90 text-cyan-200 hover:text-white border border-cyan-400/40 backdrop-blur-md flex items-center justify-center transition-all shadow-lg hover:scale-110 active:scale-95"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Bottom Bar: Thumbnails & Progress Indicators */}
      <div className="absolute bottom-3 left-0 right-0 z-20 px-6 flex items-center justify-between">
        {/* Slide Counter */}
        <div className="font-mono text-xs font-bold text-cyan-300 bg-[#031c30]/80 px-3 py-1 rounded-full border border-cyan-500/30 backdrop-blur-md shadow">
          <span>0{current + 1}</span> / <span>0{slides.length}</span>
        </div>

        {/* Thumbnail Selector Dots / Bars */}
        <div className="flex items-center gap-2">
          {slides.map((slide, idx) => {
            const isSel = idx === current;
            return (
              <button
                key={slide.id}
                onClick={() => setCurrent(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  isSel
                    ? 'w-8 sm:w-10 h-2.5 bg-gradient-to-r from-cyan-400 to-sky-400 shadow-md shadow-cyan-400/50'
                    : 'w-2.5 h-2.5 bg-white/30 hover:bg-cyan-300/60'
                }`}
              />
            );
          })}
        </div>

        {/* Status text */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-cyan-200/80 bg-[#031c30]/80 px-3 py-1 rounded-full border border-cyan-500/30 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Debre Berhan University</span>
        </div>
      </div>
    </div>
  );
}

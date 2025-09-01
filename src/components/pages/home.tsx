"use client"

import React from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'
import { Button } from '../ui/button'
import Hero from './landing-page/hero'
import { useRef } from 'react'
import { useEffect } from 'react'
import Navigation from './landing-page/navigations'
export default function Home() {
    const {signOut} = useAuth()
      const parallaxRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      parallaxRefs.current.forEach((element) => {
        if (element) {
          const speed = 0.5;
          const yPos = -(scrolled * speed);
          element.style.transform = `translateY(${yPos}px)`;
        }
      });
    };

    const handleScrollThrottled = () => {
      requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', handleScrollThrottled);
    return () => window.removeEventListener('scroll', handleScrollThrottled);
  }, []);

  const addParallaxRef = (el: HTMLElement | null) => {
    if (el && !parallaxRefs.current.includes(el)) {
      parallaxRefs.current.push(el);
    }
  };

  return (
    <div>
      <Navigation />
    <Hero addParallaxRef={addParallaxRef} />
    </div>
  )
}

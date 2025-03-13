"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HeroSection = () => {
  const imageRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensures the component only runs client-side

    if (typeof window !== "undefined") {
      const imageElement = imageRef.current;

      const handleScroll = () => {
        if (!imageElement) return;
        const scrollPosition = window.scrollY;
        const scrollThreshold = 100;

        if (scrollPosition > scrollThreshold) {
          imageElement.classList.add("scrolled");
        } else {
          imageElement.classList.remove("scrolled");
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <section className="px-4 pt-40 pb-20">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl md:text-8xl lg:text-[105px] pb-6 gradient-title">
          Manage Your Finances <br /> with Intelligence
        </h1>
        <p className="max-w-2xl mx-auto mb-8 text-xl text-gray-600">
          An AI-powered financial management platform that helps you track,
          analyze, and optimize your spending with real-time insights.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/dashboard">
            <Button size="lg" className="px-8">
              Get Started
            </Button>
          </Link>
          <Link href="https://www.hardik-dev.tech">
            <Button size="lg" variant="outline" className="px-8">
              Watch Demo
            </Button>
          </Link>
        </div>
        <div className="mt-5 hero-image-wrapper md:mt-0">
          <div ref={imageRef} className="hero-image">
            {isClient && (
              <Image
                src="/banner.jpeg"
                width={1280}
                height={720}
                alt="Dashboard Preview"
                className="mx-auto border rounded-lg shadow-2xl"
                priority
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

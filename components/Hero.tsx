"use client";

import Link from "next/link";
import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import FAQSection from "@/components/FAQSection";
import HowItWorks from "@/components/HowItWorks";
import OnlineProgram from "@/components/OnlineProgram";
import About from "./About";

export default function Hero() {
  const aboutRef = useRef<HTMLDivElement | null>(null);
  const faqRef = useRef<HTMLDivElement | null>(null);
  const howItWorksRef = useRef<HTMLDivElement | null>(null);
  const onlineProgramRef = useRef<HTMLDivElement | null>(null);

  const scrollToSection = (hash: string) => {
    let target: HTMLDivElement | null = null;
    if (hash === "#about") target = aboutRef.current;
    if (hash === "#faq") target = faqRef.current;
    // if (hash === "#how-it-works") target = howItWorksRef.current;
    // if (hash === "#online-program") target = onlineProgramRef.current;

    if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    }
  };

  useEffect(() => {
    const handleScroll = () => scrollToSection(window.location.hash);
    handleScroll();
    window.addEventListener("hashchange", handleScroll);
    return () => window.removeEventListener("hashchange", handleScroll);
  }, []);

  const fruits = [
    {
      src: "/images/fruits/broccoli.png",
      size: "w-14 sm:w-16 md:w-20 lg:w-24",
    },
    { src: "/images/fruits/apple.png", size: "w-10 sm:w-12 md:w-16 lg:w-18" },
    { src: "/images/fruits/carrot.png", size: "w-8 sm:w-10 md:w-14 lg:w-16" },
    {
      src: "/images/fruits/cucumber.png",
      size: "w-12 sm:w-14 md:w-18 lg:w-20",
    },
    {
      src: "/images/fruits/bellpeper.png",
      size: "w-11 sm:w-13 md:w-17 lg:w-19",
    },
    { src: "/images/fruits/tomato.png", size: "w-9 sm:w-11 md:w-15 lg:w-17" },
    {
      src: "/images/fruits/eggplant.png",
      size: "w-13 sm:w-15 md:w-19 lg:w-22",
    },
  ];

  return (
    <section className="relative flex flex-col items-center justify-center text-center overflow-hidden">
      {/* --- Hanging Fruits Section (WOW Animation) --- */}
      <div className="relative w-full flex justify-center mt-2 sm:mt-3 z-20 overflow-visible">
        <div className="flex justify-center items-start gap-3 sm:gap-6 md:gap-10">
          {[
            {
              src: "/images/fruits/broccoli.png",
              size: "w-14 sm:w-16 md:w-24 lg:w-24",
            },
            {
              src: "/images/fruits/apple.png",
              size: "w-12 sm:w-14 md:w-18 lg:w-23",
            },
            {
              src: "/images/fruits/carrot.png",
              size: "w-20 sm:w-20 md:w-26 lg:w-38",
            },
            {
              src: "/images/fruits/cucumber.png",
              size: "w-14 sm:w-16 md:w-20 lg:w-22",
            },
            {
              src: "/images/fruits/bellpeper.png",
              size: "w-20 sm:w-25 md:w-30 lg:w-31",
            },
            {
              src: "/images/fruits/tomato.png",
              size: "w-11 sm:w-13 md:w-17 lg:w-19",
            },
            {
              src: "/images/fruits/eggplant.png",
              size: "w-14 sm:w-16 md:w-20 lg:w-32",
            },
          ].map((fruit, i) => {
            const delay = i * 0.2 + Math.random() * 0.5; // staggered entry
            const duration = 3 + Math.random() * 1.5;
            const threadHeights = [
              "h-10",
              "h-12",
              "h-14",
              "h-16",
              "h-12",
              "h-10",
              "h-14",
            ];
            const threadClass = threadHeights[i % threadHeights.length];

            return (
              <motion.div
                key={i}
                className="relative flex flex-col items-center"
                initial={{ y: -80, opacity: 0, rotate: 0 }}
                animate={{
                  y: [0, -10, 0, 10, 0, -5, 0],
                  rotate: [0, 3, -3, 2, -2, 0],
                  opacity: 1,
                }}
                transition={{
                  y: {
                    repeat: Infinity,
                    duration: 5 + Math.random() * 3,
                    ease: "easeInOut",
                  },
                  rotate: {
                    repeat: Infinity,
                    duration: 4 + Math.random() * 3,
                    ease: "easeInOut",
                  },
                  opacity: { delay, duration: 0.8, ease: "easeOut" },
                }}
              >
                {/* Animated curved thread */}
                <motion.svg
                  width="2"
                  height="100"
                  viewBox="0 0 2 100"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`${threadClass}`}
                  animate={{
                    rotate: [0, 5, 0, -5, 0],
                    x: [0, 1, -1, 0],
                  }}
                  transition={{
                    duration: duration + 1,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <path
                    d="M1 0 C 1.5 30, 0.5 70, 1 100"
                    stroke="#a0a0a0"
                    strokeWidth="2"
                    fill="transparent"
                  />
                </motion.svg>

                {/* Animated Fruit */}
                <motion.img
                  src={fruit.src}
                  alt="fruit"
                  className={`${fruit.size} select-none pointer-events-none -mt-2 sm:-mt-3`}
                  animate={{
                    y: [0, 8, -5, 4, -2, 0],
                    rotate: [0, 8, -6, 4, -2, 0],
                    scale: [1, 1.05, 1, 1.03, 1],
                  }}
                  transition={{
                    duration: 6 + Math.random() * 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay,
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* --- Background --- */}
      <div className="absolute inset-0 bg-linear-to-b from-white/90 via-white/75 to-transparent" />

      {/* --- Hero Content --- */}
      <div className="relative z-10 flex flex-col items-center justify-start min-h-[70vh] sm:min-h-[60vh] px-6 max-w-3xl text-center ">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-extrabold text-5xl sm:text-6xl md:text-7xl text-slate-900 leading-tight tracking-tight mb-4"
        >
          Heal with{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-[#7fb77e] via-[#82c6a8] to-[#6aa6d9]">
            Nutrition
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-slate-600 text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl"
        >
          Personalized nutrition & lifestyle guidance designed to help you feel
          better, live stronger, and achieve lasting wellness — simply and
          scientifically.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Link
            href="/services?from=hero"
            className="inline-block rounded-full bg-linear-to-r from-[#7fb77e] via-[#6fbb9c] to-[#64a0c8] text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl hover:brightness-105 active:scale-95 transition-all duration-200"
          >
            Book an Appointment
          </Link>
        </motion.div>
      </div>

      {/* --- About Section --- */}
      <motion.div
        id="about"
        ref={aboutRef}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="relative z-20 mt-6 w-full max-w-4xl mx-auto px-6"
      >
        <About />
      </motion.div>

      {/* Other sections */}
      <motion.div
        id="how-it-works"
        ref={howItWorksRef}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="relative z-20 w-full mt-28"
      >
        <HowItWorks />
      </motion.div>

      <motion.div
        id="online-program"
        ref={onlineProgramRef}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="relative z-20 w-full mt-28"
      >
        <OnlineProgram />
      </motion.div>

      <motion.div
        id="faq"
        ref={faqRef}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="relative z-20 w-full mt-28"
      >
        <FAQSection />
      </motion.div>

      <div className="h-24 sm:h-36 md:h-40" />
    </section>
  );
}

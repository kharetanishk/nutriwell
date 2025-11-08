"use client";

import Link from "next/link";
import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function Hero() {
  const aboutRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#about" && aboutRef.current) {
        aboutRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };
    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden bg-neutral-50 dark:bg-neutral-950">
      {/* Soft background overlay */}
      <div className="absolute inset-0 bg-[url('/images/heroposter.png')] bg-cover bg-center opacity-1  5 dark:opacity-100" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-white dark:from-black/70 dark:via-black/60 dark:to-black/80" />

      {/* --- Hero Content --- */}
      <div className="relative z-10 flex flex-col items-center px-6 max-w-3xl text-center">
        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-extrabold text-5xl sm:text-6xl md:text-7xl text-gray-900 dark:text-white leading-tight tracking-tight mb-4"
        >
          Heal with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-600 to-green-700 dark:from-emerald-400 dark:via-teal-300 dark:to-green-200">
            Nutrition
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-gray-700 dark:text-gray-300 text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl"
        >
          Personalized nutrition & lifestyle guidance designed to help you feel
          better, live stronger, and achieve lasting wellness — simply and
          scientifically.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Link
            href="/services?from=hero"
            className="inline-block rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-8 py-3 text-lg font-semibold shadow-md hover:shadow-lg hover:opacity-95 active:scale-95 transition-all duration-200 dark:from-emerald-400 dark:to-teal-300 dark:text-black"
          >
            Book an Appointment
          </Link>
        </motion.div>
      </div>

      {/* --- Divider & About Section --- */}
      <motion.div
        id="about"
        ref={aboutRef}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="relative z-20 mt-32 w-full max-w-4xl mx-auto px-6"
      >
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg px-10 py-14 border border-gray-200 dark:border-gray-800 backdrop-blur-sm">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900 dark:text-white text-center">
            Meet Dr. Anubha
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed text-center">
            I’m Dr.Anubha — a certified nutritionist dedicated to helping you
            restore balance, energy, and health through mindful, personalized
            nutrition. <br />
            <br />
            My philosophy blends science with empathy, empowering you to make
            smarter everyday choices. Whether it’s weight management, lifestyle
            correction, or holistic well-being — every plan I design fits your
            unique life, sustainably.
          </p>
        </div>
      </motion.div>

      <div className="h-24 sm:h-36 md:h-40" />
    </section>
  );
}

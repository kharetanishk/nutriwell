"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import PlanCard from "@/components/PlanCard";
import { plans } from "@/app/services/plan";

export default function ServicesPage() {
  const [typedText, setTypedText] = useState("");
  const fullText =
    "Explore our core consultation service designed to guide your journey towards balanced nutrition and wellness.";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) clearInterval(interval);
    }, 25);
    return () => clearInterval(interval);
  }, []);

  return (
    <main
      className="
        relative 
        min-h-screen 
        py-24 
        px-5 sm:px-8 lg:px-16 
        overflow-x-hidden 
        overflow-y-visible 
        bg-gradient-to-b from-[#f9fcfa] via-[#f8fdfb] to-[#f6fbf9]
      "
    >
      {/* --- Background Glow --- */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <div className="absolute -top-20 right-0 h-64 w-64 rounded-full bg-[#dff3e6]/60 blur-3xl" />
        <div className="absolute top-[45%] left-0 h-72 w-72 rounded-full bg-[#e2efff]/60 blur-3xl" />
        <div className="absolute bottom-10 right-1/4 h-56 w-56 rounded-full bg-[#fef3e6]/60 blur-3xl" />
      </motion.div>

      {/* --- Content --- */}
      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* --- Page Heading --- */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4 text-center md:text-left"
        >
          Services
        </motion.h1>

        {/* --- Typing Animation Subtitle --- */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-slate-600 mb-14 text-base sm:text-lg max-w-3xl mx-auto md:mx-0 text-center md:text-left font-medium"
        >
          {typedText}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block w-[6px] h-[20px] bg-[#7fb77e] ml-1 align-middle"
          ></motion.span>
        </motion.p>

        {/* --- General Consultation --- */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="
            bg-white/95 
            border border-[#dfe7dd] 
            rounded-3xl 
            p-6 sm:p-8 
            mb-20 
            shadow-[0_3px_25px_rgba(30,80,60,0.08)] 
            backdrop-blur-sm 
            w-full 
            max-w-3xl 
            mx-auto 
            flex flex-col 
            md:flex-row 
            md:items-center 
            md:justify-between 
            md:gap-8 
            hover:shadow-[0_4px_30px_rgba(30,80,60,0.12)] 
            transition-all duration-500
          "
        >
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-slate-900">
              General Consultation
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base leading-relaxed">
              A complete one-on-one session to assess your goals, habits, and
              lifestyle. Get personalized nutrition advice and a roadmap to
              start your wellness journey.
            </p>
            <p className="text-[#318a63] text-lg sm:text-xl font-bold mt-4">
              ₹1,000
            </p>
          </div>

          <div className="mt-5 md:mt-0 flex justify-center md:justify-end">
            <Link
              href="/services/general-consultation"
              className="
                inline-block 
                rounded-full 
                bg-gradient-to-r 
                from-[#7fb77e] via-[#6fbb9c] to-[#64a0c8] 
                text-white 
                px-8 py-3 
                text-sm sm:text-base 
                font-semibold 
                shadow-md 
                hover:shadow-lg 
                hover:scale-[1.03] 
                active:scale-95 
                transition-all duration-300
              "
            >
              Book Appointment
            </Link>
          </div>
        </motion.div>

        {/* --- Plans Section --- */}
        <section className="mt-10 sm:mt-16 relative z-[1000]">
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-semibold text-center text-slate-900 mb-14"
          >
            Our Nutrition & Wellness Plans
          </motion.h2>

          {/* --- Responsive 2-column Grid --- */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="
              grid 
              grid-cols-1 
              md:grid-cols-2 
              gap-10 
              justify-items-center
            "
          >
            {plans.map((plan, i) => (
              <motion.div
                key={plan.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="w-full max-w-lg"
              >
                <PlanCard {...plan} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      </div>
    </main>
  );
}

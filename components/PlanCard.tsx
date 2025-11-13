"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRef, useState, useLayoutEffect } from "react";
import { Plan } from "@/app/services/plan";

export default function PlanCard({
  title,
  slug,
  description,
  howItWorks,
  packages,
  terms,
  note,
}: Plan) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [howOpen, setHowOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  // --- Refs and dynamic heights ---
  const contentRef = useRef<HTMLParagraphElement>(null);
  const [descHeight, setDescHeight] = useState<number>(100);

  const howRef = useRef<HTMLDivElement>(null);
  const [howHeight, setHowHeight] = useState<number>(0);

  const termsRef = useRef<HTMLUListElement>(null);
  const [termsHeight, setTermsHeight] = useState<number>(0);

  useLayoutEffect(() => {
    setDescHeight(isExpanded ? contentRef.current?.scrollHeight || 100 : 100);
  }, [isExpanded, description]);

  useLayoutEffect(() => {
    setHowHeight(howOpen ? howRef.current?.scrollHeight || 0 : 0);
  }, [howOpen, howItWorks]);

  useLayoutEffect(() => {
    setTermsHeight(termsOpen ? termsRef.current?.scrollHeight || 0 : 0);
  }, [termsOpen, terms]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }} // ✅ ensures visible on mobile
      transition={{ duration: 0.6 }}
      className="flex flex-col justify-between bg-white border border-[#dfe7dd] rounded-3xl p-6 sm:p-8 shadow-[0_3px_20px_rgba(30,80,60,0.08)] hover:shadow-[0_4px_25px_rgba(30,80,60,0.12)] transition-all duration-500 hover:-translate-y-1 min-h-[560px] w-full"
    >
      <div className="flex flex-col flex-grow">
        {/* --- Title --- */}
        <h3 className="text-2xl font-semibold text-slate-900 mb-3">{title}</h3>

        {/* --- Description with Read More --- */}
        <div className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
          <motion.div
            layout
            style={{
              overflow: "hidden",
              height: isExpanded ? descHeight + 14 : 100,
              transition: "height 0.5s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            <p ref={contentRef} className="whitespace-pre-line pb-2">
              {description}
            </p>
          </motion.div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[#318a63] font-medium text-sm mt-2 hover:underline focus:outline-none transition-colors"
          >
            {isExpanded ? "Read less ▲" : "Read more ▼"}
          </button>
        </div>
        {/* --- Note Box --- */}
        {note && (
          <div className="bg-[#f1fbf4] border border-[#d5f0df] text-[#1b5131] text-xs sm:text-sm px-4 py-2 rounded-lg mb-4 leading-snug">
            {note}
          </div>
        )}

        {/* --- Packages Section --- */}
        {packages?.length > 0 && (
          <div className="space-y-4">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className="border border-[#e0ece5] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-[#fafdfa] hover:bg-[#f5fbf8] transition-all duration-300"
              >
                <div className="flex-1 text-left">
                  <h4 className="text-[#1b5131] font-semibold text-base sm:text-lg">
                    {pkg.name}
                  </h4>
                  <p className="text-slate-600 text-sm mt-1">{pkg.details}</p>
                  {pkg.duration && (
                    <p className="text-slate-500 text-xs mt-0.5">
                      Duration: {pkg.duration}
                    </p>
                  )}
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-4 text-center sm:text-right">
                  <p className="text-[#318a63] font-bold text-base sm:text-lg">
                    {pkg.price}
                  </p>
                  <Link
                    href={`/services/${slug}`}
                    className="inline-block rounded-full bg-gradient-to-r from-[#7fb77e] via-[#6fbb9c] to-[#64a0c8] text-white px-6 py-2 mt-2 text-sm sm:text-base font-semibold shadow-md hover:shadow-lg hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 w-full sm:w-auto"
                  >
                    Buy Plan
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- How It Works --- */}
        {howItWorks && (
          <div className="mt-6 border-t border-[#e0ece5] pt-4">
            <button
              onClick={() => setHowOpen(!howOpen)}
              className="flex items-center justify-between text-sm sm:text-base text-[#1b5131] font-semibold w-full focus:outline-none"
            >
              How it works
              <span
                className={`transform transition-transform duration-300 ${
                  howOpen ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            <motion.div
              style={{
                overflow: "hidden",
                height: howOpen ? howHeight + 14 : 0,
                transition: "height 0.4s cubic-bezier(0.4,0,0.2,1)",
              }}
            >
              <div
                ref={howRef}
                className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed whitespace-pre-line pb-2"
              >
                {howItWorks}
              </div>
            </motion.div>
          </div>
        )}

        {/* --- Terms & Conditions --- */}
        {terms && terms.length > 0 && (
          <div className="mt-6 border-t border-[#e0ece5] pt-4">
            <button
              onClick={() => setTermsOpen(!termsOpen)}
              className="flex items-center justify-between text-sm sm:text-base text-[#1b5131] font-semibold w-full focus:outline-none"
            >
              Terms & Conditions
              <span
                className={`transform transition-transform duration-300 ${
                  termsOpen ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            <motion.div
              style={{
                overflow: "hidden",
                height: termsOpen ? termsHeight + 14 : 0,
                transition: "height 0.4s cubic-bezier(0.4,0,0.2,1)",
              }}
            >
              <ul
                ref={termsRef}
                className="list-disc ml-5 mt-2 text-slate-600 text-sm sm:text-base space-y-1 pb-2"
              >
                {terms.map((term, i) => (
                  <li key={i}>{term}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

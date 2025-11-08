"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const services = [
  {
    title: "Nutrition Consultation",
    slug: "NUTRITION",
    description:
      "Personalized nutrition plans tailored to your goals, lifestyle, and health needs.Heal yourself with the right nutrition",
    image: "/images/nutrition.png",
  },
  {
    title: "Fitness Coaching",
    slug: "FITNESS",
    description:
      "Customized workout and fitness guidance to help you build strength and stay consistent.",
    image: "/images/fitness.png",
  },
  {
    title: "Diet Planning",
    slug: "DIET_PLAN",
    description:
      "Balanced diet plans curated to improve your overall wellness and achieve sustainable results.",
    image: "/images/dietplan.png",
  },
];

// Framer Motion card animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.7,
      type: "spring",
      stiffness: 120,
    },
  }),
};

export default function ServicesPage() {
  const pathname = usePathname(); // 👈 forces remount on navigation to fix animation bug

  return (
    <div
      key={pathname} // 👈 ensures Framer Motion re-triggers on client-side navigation
      className="min-h-screen bg-white dark:bg-neutral-950 py-20 px-6 md:px-10 flex flex-col"
    >
      {/* Page Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.7 }}
        className="text-4xl md:text-5xl font-bold text-center mb-8 text-gray-900 dark:text-white tracking-tight"
      >
        Our Services
      </motion.h1>

      {/* Subheading */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.6 }}
        className="text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed mb-16"
      >
        Choose a service to get started with your appointment. Each consultation
        is personalized to your health, fitness, and nutrition goals.
      </motion.p>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {services.map((service, i) => (
          <motion.div
            key={service.slug}
            variants={cardVariants}
            initial="hidden"
            animate="visible" // 👈 changed from whileInView to animate
            custom={i}
            className="flex flex-col items-center bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            {/* Image */}
            <div className="w-full h-48 flex items-center justify-center border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-neutral-800">
              <motion.img
                src={service.image}
                alt={service.title}
                className="h-32 object-contain"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }} // 👈 ensures animation on load
                transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                draggable={false}
              />
            </div>

            {/* Content */}
            <div className="flex flex-col items-center text-center px-6 py-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                {service.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-base mb-8 leading-relaxed">
                {service.description}
              </p>

              <Link
                href={`/book-appointment?service=${service.slug}`}
                prefetch={true} // 👈 prefetch for faster load
                className="inline-block rounded-md bg-black text-white dark:bg-white dark:text-black font-medium px-5 py-2.5 text-sm md:text-base hover:opacity-90 active:scale-95 transition-all duration-200"
              >
                Book Appointment
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

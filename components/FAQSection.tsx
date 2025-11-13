"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What do you expect in Anubha’s Nutrition Clinic?",
    a: "Anubha’s Nutrition Clinic is a healthcare facility where dietitians provide personalized nutrition counseling and guidance to individuals, groups, or communities.",
  },
  {
    q: "What services does Anubha’s Nutrition Clinic offer?",
    a: "Anubha’s Nutrition Clinic offers a range of services including nutrition assessment, personalized meal planning, weight loss programs, medical management, food allergy and intolerance management, wedding glow plans, baby & toddler first solid food, and child & old age nutrition plans.",
  },
  {
    q: "Who can benefit from visiting a dietitian clinic?",
    a: "Anyone can benefit from visiting a dietitian clinic, including individuals with chronic health conditions, those looking to manage their weight, and those seeking general health and wellness guidance",
  },
  {
    q: "What can I expect during my first visit?",
    a: "During your first visit, you can expect a comprehensive assessment of your dietary habits, health status, and lifestyle. The dietitian will work with you to develop a personalized nutrition plan.",
  },
  {
    q: "How long does a typical dietitian appointment last?",
    a: "Appointments usually last around 30–40 minutes, depending on the nature of the consultation.",
  },
  {
    q: "How often should I visit a dietitian clinic?",
    a: "The frequency of visits depends on your health goals. Some clients prefer monthly check-ins, while others come once every few months for follow-ups.",
  },
  {
    q: "Can I get a personalized meal plan?",
    a: "Yes, dietitians can create personalized meal plans tailored to your specific needs and health goals.",
  },
  {
    q: "How will the consultation process work if I don’t live in Pune?",
    a: "Our consultation is designed to benefit all clients, no matter where they live. Besides in-person meetings, clients can interact with us via the phone/ Skype calls/ FaceTime, and email. In fact, many of our Pune -based clients also opt for video/ Audio chats for their appointments",
  },
  {
    q: "What happens once I make the payment?",
    a: "We will generate your appointment schedule and send you a ‘Getting to Know You’ sheet. This contains all the info we will require from you to start the program. No other tests / reports are necessary; however, you are free to share the reports you already have.",
  },
  {
    q: "I travel a lot. How would that be accommodated?",
    a: "Most of our clients have travel as an essential part of their jobs. The diet plan will be designed keeping in tune with the lifestyle and job requirements you might have. You will be educated on how to plan meals while traveling and assisted with choosing best options when you are in a new country/ city.",
  },
  {
    q: "I work in different shifts. Will the plan account for that?",
    a: "We will design an eating pattern that fits into your work schedule & lifestyle. If you do work in shifts (day & night), your meal plan will be tweaked depending on your nutritional requirements as per the work shifts and the availability and practicality of food choices.",
  },
  {
    q: "Will exercise advice also be included in the package?",
    a: "Yes. Your current fitness levels and exercise pattern will be analysed for any additional changes that need to be made. Specific plans, for example exercise prescriptions to be followed at your gym, will be given to you.",
  },
  {
    q: "What kind of exercise is recommended?",
    a: "Any form of exercise that challenges you and is an enjoyable experience. It could be strength training, running or Yoga and also recreational exercise like dancing, swimming, cycling, etc. You will also be educated on the basics of exercise physiology and bio-mechanics so that you have good fundamentals and can make intelligent choices in the future also.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="w-full py-20 px-6 md:px-10">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-slate-900 mb-10">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className="border border-[#dfe7dd] rounded-3xl overflow-hidden bg-white/90 shadow-(--shadow-soft)"
            >
              <button
                className="w-full flex justify-between items-center text-left px-6 py-4 font-medium text-slate-800"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span>{faq.q}</span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <ChevronDown className="w-5 h-5 text-[#7fb77e]" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-5 text-slate-600 text-sm leading-relaxed"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

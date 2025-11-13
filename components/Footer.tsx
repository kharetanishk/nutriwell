"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-[#dfe7dd] bg-white/80 text-slate-600 py-12 backdrop-blur-sm relative z-[100]">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-12 text-center md:text-left">
        {/* Brand / Intro */}
        <div>
          <h3 className="font-semibold text-lg mb-2 text-slate-900">
            Anubha's Nutrition Clinic
          </h3>
          <h4 className="font-semibold text-md mb-3 text-slate-900">
            Dt. Anubha Issac
          </h4>
          <p className="text-slate-600 leading-relaxed text-sm">
            Certified Nutritionist dedicated to helping you heal through
            personalized nutrition, mindful balance, and sustainable wellness.
          </p>

          {/* Social Icons */}
          <div className="mt-4 flex justify-center md:justify-start gap-4">
            <Link
              href="https://www.facebook.com/anu.foodclinic"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-[#f4f9f6] hover:bg-[#1877F2]/10 transition-all duration-300 text-[#1877F2] hover:scale-110"
              title="Facebook"
            >
              <FaFacebookF size={20} />
            </Link>

            <Link
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-[#f4f9f6] hover:bg-[#E1306C]/10 transition-all duration-300 text-[#E1306C] hover:scale-110"
              title="Instagram"
            >
              <FaInstagram size={20} />
            </Link>

            <Link
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-[#f4f9f6] hover:bg-[#0077B5]/10 transition-all duration-300 text-[#0077B5] hover:scale-110"
              title="LinkedIn"
            >
              <FaLinkedinIn size={20} />
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-3 text-slate-900">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/"
                className="hover:text-emerald-700 transition-colors duration-200"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/#about"
                className="hover:text-emerald-700 transition-colors duration-200"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/services"
                className="hover:text-emerald-700 transition-colors duration-200"
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                href="/#faq"
                className="hover:text-emerald-700 transition-colors duration-200"
              >
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-3 text-slate-900">Contact</h4>
          <ul className="space-y-2 text-sm leading-relaxed">
            <li>
              📍 Office no. 1, Upper Ground Floor, Kanaksai CHS Ltd., S.No.56,
              Jagdamba Bhavan Marg, Undri, Pune (411060), India
            </li>
            <li>📞 +91 9713885582</li>
            <li>
              <a
                href="mailto:contact@nutriwell.com"
                className="hover:text-emerald-700 transition-colors duration-200"
              >
                📧 contact@nutriwell.com
              </a>
            </li>
          </ul>
        </div>

        {/* Google Map */}
        <div>
          <h4 className="font-semibold mb-3 text-slate-900">Find Us</h4>

          <div className="overflow-hidden rounded-xl shadow-md border border-[#dfe7dd]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3784.8451797292682!2d73.90861127518981!3d18.445337282633623!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTjCsDI2JzQzLjIiTiA3M8KwNTQnNDAuMyJF!5e0!3m2!1sen!2sin!4v1763012760730!5m2!1sen!2sin"
              width="100%"
              height="220"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <Link
            href="https://maps.app.goo.gl/rH8taHya1obyZsCu9?g_st=aw"
            target="_blank"
            className="block mt-2 text-emerald-700 text-sm hover:underline"
          >
            Open in Google Maps
          </Link>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-6xl mx-auto mt-10 border-t border-[#dfe7dd] pt-6">
        <p className="text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Anubha's Nutrition Clinic — All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}

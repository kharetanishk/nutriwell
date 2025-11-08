"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-neutral-50 dark:bg-neutral-950 text-gray-700 dark:text-gray-300 py-12">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center md:text-left">
        {/* Brand / Intro */}
        <div>
          <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">
            Dr. Priya Sharma
          </h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
            Certified Nutritionist dedicated to helping you heal through
            personalized nutrition, mindful balance, and sustainable wellness.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/"
                className="hover:text-black dark:hover:text-white transition-colors duration-200"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/#about"
                className="hover:text-black dark:hover:text-white transition-colors duration-200"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/services"
                className="hover:text-black dark:hover:text-white transition-colors duration-200"
              >
                Services
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">
            Contact
          </h4>
          <ul className="space-y-2 text-sm">
            <li>📍 Mumbai, India</li>
            <li>📞 +91 9876543210</li>
            <li>
              <a
                href="mailto:contact@nutriwell.com"
                className="hover:text-black dark:hover:text-white transition-colors duration-200"
              >
                📧 contact@nutriwell.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-6xl mx-auto mt-10 border-t border-gray-200 dark:border-gray-800 pt-6">
        <p className="text-center text-sm text-gray-500 dark:text-gray-500">
          © {new Date().getFullYear()} NutriWell — All rights reserved.
        </p>
      </div>
    </footer>
  );
}

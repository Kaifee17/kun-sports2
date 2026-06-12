import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-4 z-50"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white/80 backdrop-blur-xl border border-white shadow-lg rounded-full px-6 py-4 flex items-center justify-between">

          <div className="flex items-center gap-4">
            <img
              src="/logo.png"
              alt="KUN Sports"
              className="h-12 object-contain"
            />

            <div>
              <h2 className="font-semibold text-[#0B2239]">
                KUN Sports
              </h2>

              <p className="text-xs text-slate-500">
                Secure AI Assistant
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <a
              href="#about"
              className="hover:text-[#F26A3D] transition"
            >
              About
            </a>

            <a
              href="#vision"
              className="hover:text-[#F26A3D] transition"
            >
              Vision
            </a>

            <a
              href="#mission"
              className="hover:text-[#F26A3D] transition"
            >
              Mission
            </a>
          </div>

          <button className="bg-[#F26A3D] text-white px-5 py-2 rounded-full font-medium hover:scale-105 transition-all duration-300">
            Contact Us
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
import { motion } from "framer-motion";
import {
  ShieldCheck,
  MapPin,
  Sparkles,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-24">

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-orange-200 rounded-full blur-[140px] opacity-30"></div>

      <div className="relative max-w-7xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl"
        >

          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 text-[#F26A3D] px-4 py-2 rounded-full font-medium">

            <Sparkles size={16} />

            AI Powered Sports Platform

          </div>

          <h1 className="mt-8 text-6xl md:text-7xl font-semibold leading-[1.05] text-[#0B2239]">

            The Secure AI Assistant

            <span className="block text-[#F26A3D]">
              for KUN Sports
            </span>

          </h1>

          <p className="mt-8 text-xl text-slate-600 leading-relaxed max-w-3xl">

            Built exclusively for KUN Sports in
            Jeddah, Saudi Arabia.

            Get instant answers about memberships,
            fitness programs, training facilities,
            sports events, operations and more
            through a secure AI-powered experience.

          </p>

          <div className="flex flex-wrap gap-4 mt-10">

            <div className="bg-white border border-slate-200 px-5 py-3 rounded-full flex items-center gap-2 shadow-sm">

              <ShieldCheck size={18} />

              Secure Environment

            </div>

            <div className="bg-white border border-slate-200 px-5 py-3 rounded-full flex items-center gap-2 shadow-sm">

              <MapPin size={18} />

              Jeddah, Saudi Arabia

            </div>

          </div>

        </motion.div>

      </div>

    </section>
  );
}
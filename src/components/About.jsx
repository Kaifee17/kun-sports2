import { motion } from "framer-motion";
import {
  Target,
  Eye,
  Trophy,
} from "lucide-react";

export default function About() {
  return (
    <section
      id="about"
      className="py-24"
    >
      <div className="max-w-7xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >

          <p className="text-[#F26A3D] font-semibold mb-4">
            ABOUT KUN SPORTS
          </p>

          <h2 className="text-5xl md:text-6xl font-semibold text-[#0B2239]">
            Building the Future of
            <br />
            Sports & Wellness
          </h2>

        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 mt-16">

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >

            <div className="bg-white border border-slate-200 rounded-[32px] p-10 shadow-sm">

              <div className="flex items-center gap-3 mb-6">

                <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center">

                  <Trophy className="text-[#F26A3D]" />

                </div>

                <h3 className="text-2xl font-semibold">
                  History & Timeline
                </h3>

              </div>

              <div className="space-y-6 text-slate-600 leading-relaxed">

                <p>
                  KUN Sports emerged in 2019, marking a strategic
                  expansion of KUN Investment Holding's diverse
                  portfolio into the sports and wellness market.
                </p>

                <p>
                  Driven by a purposeful vision, KUN Sports was
                  established to redefine fitness, wellness and
                  sporting excellence across Saudi Arabia.
                </p>

                <p>
                  In September 2021, the first IN2 Fitness
                  location was launched in Jeddah, setting the
                  stage for a new era of fitness and wellness
                  experiences within the Kingdom.
                </p>

              </div>

            </div>

          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >

            <div className="bg-gradient-to-br from-[#F26A3D] to-[#ff8b5d] rounded-[32px] p-10 text-white h-full">

              <h3 className="text-3xl font-semibold mb-6">
                Why KUN Sports?
              </h3>

              <div className="space-y-5">

                <div className="bg-white/10 backdrop-blur rounded-2xl p-5">
                  Premium sports and wellness facilities
                </div>

                <div className="bg-white/10 backdrop-blur rounded-2xl p-5">
                  Industry-leading fitness experiences
                </div>

                <div className="bg-white/10 backdrop-blur rounded-2xl p-5">
                  Community-driven programs and events
                </div>

                <div className="bg-white/10 backdrop-blur rounded-2xl p-5">
                  Technology-enabled member experiences
                </div>

              </div>

            </div>

          </motion.div>

        </div>

        <div
          id="vision"
          className="grid md:grid-cols-2 gap-8 mt-16"
        >

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white border border-slate-200 rounded-[32px] p-10 shadow-sm"
          >

            <div className="flex items-center gap-4 mb-6">

              <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center">

                <Eye className="text-[#F26A3D]" />

              </div>

              <h3 className="text-3xl font-semibold">
                Our Vision
              </h3>

            </div>

            <p className="text-slate-600 text-lg leading-relaxed">
              To set the benchmark for excellence in sports and
              wellness, inspiring a culture of health, fitness
              and vitality across Saudi Arabia through innovation,
              accessibility and world-class experiences.
            </p>

          </motion.div>

          <motion.div
            id="mission"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-white border border-slate-200 rounded-[32px] p-10 shadow-sm"
          >

            <div className="flex items-center gap-4 mb-6">

              <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center">

                <Target className="text-[#F26A3D]" />

              </div>

              <h3 className="text-3xl font-semibold">
                Our Mission
              </h3>

            </div>

            <p className="text-slate-600 text-lg leading-relaxed">
              Our mission is to create a vibrant and dynamic
              sports culture in Saudi Arabia by providing
              premium fitness, wellness and sporting services
              that inspire individuals and communities to
              achieve healthier and more active lifestyles.
            </p>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
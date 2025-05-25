"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
/* import { useEffect } from "react";
 */
export default function HomePage() {
  const { scrollYProgress } = useScroll();
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -150]);

  const features = [
    {
      icon: "⚡",
      title: "Blitz-Tracker",
      desc: "Echtzeit-Updates für maximale Dynamik.",
    },
    {
      icon: "🔍",
      title: "Deep Dive Insights",
      desc: "Visualisierungen, die sofort Klarheit schaffen.",
    },
    {
      icon: "🏆",
      title: "Erfolg feiern",
      desc: "Erhalte virtuelle Trophäen für Meilensteine.",
    },
  ];

  return (
    <div className="relative overflow-hidden bg-black text-white font-sans">
      <Header />

      {/* Hero Section */}
      <motion.section
        className="relative flex flex-col items-center justify-center text-center h-screen overflow-hidden"
        style={{ y: bgY }}
      >
        {/* Scrolling Grid Background */}
        <motion.div
          className="absolute inset-0 bg-grid-pattern"
          animate={{ backgroundPosition: ["0px 0px", "200px 200px"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        {/* Animated underline */}
        <motion.h1
          className="relative z-10 text-6xl md:text-7xl font-extrabold mb-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-400">
            Deine Ziele. In Bewegung.
          </span>
          <motion.div
            className="absolute left-1/2 bottom-0 h-1 bg-indigo-400 origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </motion.h1>
        <motion.p
          className="relative z-10 max-w-xl text-lg text-gray-300 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          Setze neue Maßstäbe: Dokumentiere, teile und erreiche Deine Erfolge
          mit Leichtigkeit.
        </motion.p>
        <motion.div
          className="relative z-10 mt-8 flex space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <Link href="/create">
            <motion.button
              id="cta-button"
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-cyan-400 text-black font-bold rounded-full shadow-lg hover:shadow-2xl"
              whileHover={{ scale: 1.1, rotate: [0, 3] }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Starte Jetzt
            </motion.button>
          </Link>
          <Link href="/challenges">
            <motion.button
              className="px-8 py-4 border-2 border-cyan-400 text-cyan-400 font-semibold rounded-full hover:bg-cyan-400 hover:text-black transition"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              Community Flow
            </motion.button>
          </Link>
        </motion.div>
      </motion.section>

      {/* Feature Highlights with 3D tilt */}
      <section className="py-24 bg-black">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 px-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="p-8 bg-black/70 border border-gray-700 rounded-3xl backdrop-blur-md text-center cursor-pointer"
              whileHover={{ rotateY: 10, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="text-6xl mb-4 text-cyan-300 animate-pulse">
                {f.icon}
              </div>
              <h3 className="text-2xl font-bold mb-2">{f.title}</h3>
              <p className="text-gray-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative py-32 overflow-hidden bg-gradient-to-r from-purple-900 to-indigo-900 text-white text-center">
        {/* Swirling Rings Background */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 2 }}
        >
          <svg className="w-64 h-64 animate-spin-slow" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="white"
              strokeWidth="2"
              fill="none"
              opacity="0.3"
            />
            <circle
              cx="50"
              cy="50"
              r="30"
              stroke="white"
              strokeWidth="1"
              fill="none"
              opacity="0.2"
            />
          </svg>
        </motion.div>
        <motion.div
          className="relative z-10 max-w-3xl mx-auto px-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Steig ein und dominiere dein Spiel
          </h2>
          <p className="mb-8 text-lg text-white/90">
            Schließe dich jetzt an, dokumentiere deinen Fortschritt live und
            spüre den Nervenkitzel jeder neuen Errungenschaft.
          </p>
          <motion.button
            id="cta-button"
            className="inline-flex items-center px-12 py-5 bg-cyan-500 text-black font-bold rounded-full shadow-[0_0_50px_rgba(0,255,255,0.9)] hover:shadow-[0_0_80px_rgba(0,255,255,1)]"
            whileHover={{ scale: 1.2, rotate: [0, -5, 5, 0] }}
            whileTap={{ scale: 0.9 }}
            transition={{
              // scale bleibt spring
              scale: { type: "spring", stiffness: 400 },
              // rotate mit tween/keyframes statt spring
              rotate: {
                type: "keyframes", // oder "tween"
                values: [0, -5, 5, 0],
                times: [0, 0.3, 0.6, 1], // optional, verteilt die Keyframes
                duration: 0.6,
                ease: "easeInOut",
              },
            }}
          >
            Jetzt Durchstarten 🚀
          </motion.button>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}

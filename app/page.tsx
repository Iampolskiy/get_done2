"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center h-screen bg-gradient-to-b from-black via-transparent to-black">
        <motion.h1
          className="text-6xl sm:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-100"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Erreiche Deine Ziele mit Get Done
        </motion.h1>
        <motion.p
          className="mt-6 max-w-2xl text-lg text-white/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Organisiere, finde und teile Deine Challenges an einem Ort. Starte
          noch heute und entdecke neue Ziele, die Dich weiterbringen.
        </motion.p>
        <motion.div
          className="mt-8 flex space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <Link href="/create">
            <motion.button
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-2xl shadow-lg hover:bg-blue-700 transition"
              whileHover={{ scale: 1.05 }}
            >
              Neue Challenge erstellen
            </motion.button>
          </Link>
          <Link href="/challenges">
            <motion.button
              className="px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-2xl shadow-lg hover:bg-white/20 transition"
              whileHover={{ scale: 1.05 }}
            >
              Challenges entdecken
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Suchen & Filtern",
              text: "Finde genau die Challenges, die zu Dir passen, mit leistungsstarken Such- und Filteroptionen.",
            },
            {
              title: "Sortieren & Organisieren",
              text: "Ordne Deine Ziele nach Fortschritt, Datum oder Kategorien und behalte stets den Überblick.",
            },
            {
              title: "Community & Teilen",
              text: "Teile Deine Erfolge, entdecke Updates anderer und sei Teil einer motivierenden Community.",
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              className="p-6 bg-white/5 backdrop-blur-md rounded-2xl text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.3 }}
            >
              <h3 className="text-xl font-bold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-white/70">{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 bg-gradient-to-r from-teal-400 to-indigo-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h2
            className="text-3xl font-bold text-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Bereit für Deine nächste Challenge?
          </motion.h2>
          <Link href="/create">
            <motion.button
              className="mt-6 px-8 py-3 bg-black text-teal-400 font-semibold rounded-2xl shadow-lg hover:bg-gray-900 transition"
              whileHover={{ scale: 1.1 }}
            >
              Ziel erstellen
            </motion.button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
}

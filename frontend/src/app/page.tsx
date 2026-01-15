"use client";

import { Navbar } from "@/components/Navbar";
import { MoveRight, BookOpen, Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const categories = [
  { id: 1, name: "Fiction", icon: BookOpen, color: "bg-blue-500/10 text-blue-500" },
  { id: 2, name: "Non-Fiction", icon: TrendingUp, color: "bg-green-500/10 text-green-500" },
  { id: 3, name: "Bestsellers", icon: Star, color: "bg-yellow-500/10 text-yellow-500" },
  { id: 4, name: "Children's", icon: BookOpen, color: "bg-pink-500/10 text-pink-500" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6">
              Discover Your Next <br />
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                Great Read
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 text-balance max-w-lg">
              Explore thousands of books from World of Books.
              Real-time data, instant availability, and curated collections just for you.
            </p>
            <div className="flex gap-4">
              <Link
                href="/categories"
                className="group flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-all hover:pr-8"
              >
                Start Exploring
                <MoveRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {/* Abstract 3D-like visual using CSS shapes/gradients */}
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur-3xl opacity-30 animate-pulse" />
              <div className="absolute inset-10 bg-secondary/50 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-2xl p-8 flex flex-col gap-4 transform rotate-6 hover:rotate-0 transition-transform duration-500">
                <div className="h-4 w-1/3 bg-white/10 rounded-full" />
                <div className="h-4 w-2/3 bg-white/10 rounded-full" />
                <div className="flex-1 bg-white/5 rounded-xl border border-white/5 mt-4 grid place-items-center text-muted-foreground/50">
                  Book Cover Preview
                </div>
              </div>
              <div className="absolute inset-10 bg-secondary/80 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-2xl p-8 flex flex-col gap-4 transform -rotate-6 translate-x-4 translate-y-4 hover:rotate-0 hover:translate-x-0 hover:translate-y-0 transition-all duration-500 z-10">
                <div className="flex justify-between items-center">
                  <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <BookOpen className="text-indigo-400 w-5 h-5" />
                  </div>
                  <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded-full">In Stock</span>
                </div>
                <div className="mt-2">
                  <h3 className="text-xl font-bold">The Great Gatsby</h3>
                  <p className="text-sm text-muted-foreground">F. Scott Fitzgerald</p>
                </div>
                <div className="mt-auto flex justify-between items-end">
                  <span className="text-2xl font-bold">$12.99</span>
                  <button className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg">View</button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-between items-end mb-12"
          >
            <div>
              <h2 className="text-3xl font-bold mb-2">Browse Categories</h2>
              <p className="text-muted-foreground">Find the perfect book from our curated lists.</p>
            </div>
            <Link href="/categories" className="text-primary hover:underline hidden md:block">
              View all
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/categories/${cat.id}`} className="group relative block p-8 rounded-2xl bg-secondary hover:bg-secondary/80 transition-all border border-transparent hover:border-primary/20">
                  <div className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <cat.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground">Explore thousands of titles in {cat.name.toLowerCase()}.</p>

                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoveRight className="w-5 h-5 text-primary" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

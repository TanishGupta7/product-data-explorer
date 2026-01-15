"use client";

import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Book, Music, Film, Gamepad } from "lucide-react";

const headings = [
    { id: "books", name: "Books", icon: Book, count: "1.2M+", color: "bg-blue-500/10 text-blue-500" },
    { id: "music", name: "Music", icon: Music, count: "800k+", color: "bg-purple-500/10 text-purple-500" },
    { id: "films", name: "Films", icon: Film, count: "450k+", color: "bg-red-500/10 text-red-500" },
    { id: "games", name: "Games", icon: Gamepad, count: "200k+", color: "bg-green-500/10 text-green-500" },
];

export default function CategoriesPage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />

            <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <div className="mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold mb-4"
                    >
                        Explore Collections
                    </motion.h1>
                    <p className="text-muted-foreground max-w-2xl">
                        Browse through our extensive catalog of rare finds, bestsellers, and hidden gems.
                        Select a category to start your journey.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {headings.map((heading, index) => (
                        <motion.div
                            key={heading.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={`/categories/${heading.id}`} className="group block relative overflow-hidden rounded-3xl border border-border bg-card hover:border-primary/50 transition-colors p-8 h-64">
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="relative z-10 h-full flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div className={`p-4 rounded-2xl ${heading.color}`}>
                                            <heading.icon className="w-8 h-8" />
                                        </div>
                                        <div className="p-3 rounded-full bg-secondary text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                            <ChevronRight className="w-5 h-5" />
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className="text-3xl font-bold mb-2 group-hover:translate-x-1 transition-transform">{heading.name}</h2>
                                        <p className="text-muted-foreground">{heading.count} items available</p>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </main>
    );
}

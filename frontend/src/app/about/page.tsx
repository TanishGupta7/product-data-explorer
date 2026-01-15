"use client";

import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />

            <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl mx-auto"
                >
                    <h1 className="text-4xl font-bold mb-6">About Product Data Explorer</h1>
                    <div className="prose dark:prose-invert">
                        <p className="text-lg text-muted-foreground mb-6">
                            This project is a full-stack product exploration platform built as a technical assignment.
                            It demonstrates modern web development practices including on-demand scraping, efficient data storage, and a premium user interface.
                        </p>

                        <h2 className="text-2xl font-bold mb-4">Tech Stack</h2>
                        <ul className="list-disc pl-6 space-y-2 mb-8 text-muted-foreground">
                            <li><strong>Frontend:</strong> Next.js 15, Tailwind CSS v4, Framer Motion, TypeScript</li>
                            <li><strong>Backend:</strong> NestJS</li>
                            <li><strong>Database:</strong> MongoDB (via Mongoose)</li>
                            <li><strong>Scraping:</strong> Crawlee + Playwright</li>
                        </ul>

                        <h2 className="text-2xl font-bold mb-4">Features</h2>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>Dynamic Drill-down Categories</li>
                            <li>Live Scraping from World of Books</li>
                            <li>Real-time database updates</li>
                            <li>Responsive, Dark-mode first design</li>
                        </ul>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}

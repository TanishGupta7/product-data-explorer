"use client";

import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, BookOpen, Layers } from "lucide-react";

export default function SubCategoriesPage() {
    const params = useParams();
    const headingId = params.headingId as string;

    // Mock Data Generator
    const getSubcategories = (id: string) => {
        const base = [
            { id: "fiction", name: "Fiction", count: 12050 },
            { id: "non-fiction", name: "Non-Fiction", count: 8500 },
            { id: "fantasy", name: "Fantasy", count: 3200 },
            { id: "sci-fi", name: "Science Fiction", count: 2800 },
            { id: "history", name: "History", count: 1500 },
            { id: "biography", name: "Biography", count: 1200 },
            { id: "children", name: "Children's Books", count: 4500 },
            { id: "art", name: "Art & Photography", count: 900 },
        ];
        return base; // Return same for all for demo
    };

    const subCategories = getSubcategories(headingId);
    const formattedTitle = headingId.charAt(0).toUpperCase() + headingId.slice(1);

    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />

            <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <Link href="/categories" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Collections
                </Link>

                <div className="mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold mb-4"
                    >
                        {formattedTitle} Categories
                    </motion.h1>
                    <p className="text-muted-foreground max-w-2xl">
                        Drill down into specific genres and topics within {formattedTitle}.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {subCategories.map((sub, index) => (
                        <motion.div
                            key={sub.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link
                                href={`/categories/${headingId}/${sub.id}`}
                                className="group flex flex-col p-6 rounded-2xl bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300 h-full border border-transparent hover:shadow-lg hover:shadow-primary/20"
                            >
                                <div className="mb-auto">
                                    <Layers className="w-8 h-8 mb-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                                    <h3 className="text-xl font-bold mb-1">{sub.name}</h3>
                                </div>
                                <div className="mt-4 pt-4 border-t border-foreground/10 group-hover:border-primary-foreground/20 text-sm opacity-70">
                                    {sub.count.toLocaleString()} items
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </main>
    );
}

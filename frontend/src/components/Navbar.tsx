"use client";

import Link from "next/link";
import { Search, ShoppingBag, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/lib/cart-context";

export function Navbar() {
    const { items, toggleCart } = useCart();

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 right-0 z-50 px-6 py-4 glass"
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    DataExplorer
                </Link>

                <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-muted-foreground">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <Link href="/categories" className="hover:text-primary transition-colors">Categories</Link>
                    <Link href="/about" className="hover:text-primary transition-colors">About</Link>
                </div>

                <div className="flex items-center space-x-4">
                    <button className="p-2 hover:bg-secondary rounded-full transition-colors">
                        <Search className="w-5 h-5" />
                    </button>
                    <button
                        onClick={toggleCart}
                        className="p-2 hover:bg-secondary rounded-full transition-colors relative"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        {items?.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                {items.length}
                            </span>
                        )}
                    </button>
                    <button className="md:hidden p-2 hover:bg-secondary rounded-full transition-colors">
                        <Menu className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </motion.nav>
    );
}

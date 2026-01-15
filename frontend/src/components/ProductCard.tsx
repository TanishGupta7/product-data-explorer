"use client";

import { motion } from "framer-motion";
import { Star, ShoppingCart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";

interface ProductCardProps {
    id: string;
    title: string;
    author: string;
    price: string;
    image?: string;
    rating?: number;
}

export function ProductCard({ id, title, author, price, image, rating = 4.5 }: ProductCardProps) {
    const { addItem } = useCart();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="group relative bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
        >
            <div className="relative aspect-[2/3] overflow-hidden bg-secondary">
                {image ? (
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-gradient-to-br from-secondary to-muted">
                        <span className="text-sm">No Image</span>
                    </div>
                )}

                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
                    <button
                        onClick={() => addItem({ id, title, price, image: image || "" })}
                        className="p-2 bg-background/80 backdrop-blur rounded-full hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm"
                    >
                        <ShoppingCart className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                    <div className="text-xs text-muted-foreground mb-1">{author}</div>
                    <div className="flex items-center text-amber-400 text-xs">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="ml-1 text-foreground">{rating}</span>
                    </div>
                </div>

                <Link href={`/product/${id}`} className="block">
                    <h3 className="font-semibold text-lg leading-tight mb-2 line-clamp-2 hover:text-primary transition-colors">
                        {title}
                    </h3>
                </Link>

                <div className="flex justify-between items-center mt-4">
                    <span className="font-bold text-lg">{price}</span>
                    <Link
                        href={`/product/${id}`}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                    >
                        Details
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}

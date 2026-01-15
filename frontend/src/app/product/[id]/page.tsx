"use client";

import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Star, ShoppingCart, Truck, RefreshCcw, ShieldCheck, Heart, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getProductById, Product } from "@/lib/api";

import { useCart } from "@/lib/cart-context";

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [isLiked, setIsLiked] = useState(false);
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const { addItem } = useCart();

    useEffect(() => {
        getProductById(id)
            .then(setProduct)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </main>
        );
    }

    if (!product) {
        return (
            <main className="min-h-screen bg-background text-foreground flex items-center justify-center flex-col gap-4">
                <div className="text-xl">Product not found</div>
                <button onClick={() => router.back()} className="text-primary hover:underline">Go back</button>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />

            <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to results
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Image Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative aspect-[3/4] bg-secondary rounded-2xl overflow-hidden border border-border"
                    >
                        {product.imageUrl ? (
                            <Image
                                src={product.imageUrl}
                                alt={product.title}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-gradient-to-br from-secondary to-muted">
                                <span className="text-xl">No Image</span>
                            </div>
                        )}

                        <div className="absolute top-4 left-4">
                            <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                                {product.condition || 'Very Good Condition'}
                            </span>
                        </div>
                    </motion.div>

                    {/* Details Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
                                <p className="text-xl text-muted-foreground">by <span className="text-primary cursor-pointer hover:underline">{product.author || 'Unknown Author'}</span></p>
                            </div>
                            <button
                                onClick={() => setIsLiked(!isLiked)}
                                className={`p-3 rounded-full border ${isLiked ? 'bg-red-500/10 border-red-500 text-red-500' : 'border-border text-muted-foreground hover:border-primary hover:text-primary'} transition-all`}
                            >
                                <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                            </button>
                        </div>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex items-center text-amber-400">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} className="w-5 h-5 fill-current" />
                                ))}
                            </div>
                            <span className="text-muted-foreground text-sm">(Scraped Data)</span>
                        </div>

                        <div className="text-4xl font-bold text-primary mb-8">
                            {product.price}
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Truck className="w-5 h-5 text-primary" />
                                Free standard shipping on orders over $15
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <RefreshCcw className="w-5 h-5 text-primary" />
                                30-day return policy
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <ShieldCheck className="w-5 h-5 text-primary" />
                                Quality guaranteed - Checked by experts
                            </div>
                        </div>

                        <div className="flex gap-4 mb-12">
                            <button
                                onClick={() => product && addItem({ id: product._id, title: product.title, price: product.price, image: product.imageUrl || "" })}
                                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Add to Cart
                            </button>
                        </div>

                        <div className="border-t border-border pt-8">
                            <h3 className="font-bold text-lg mb-4">Product Details</h3>

                            {(product.details?.description || product.description) && (
                                <p className="text-muted-foreground text-sm mb-6 leading-relaxed whitespace-pre-wrap">
                                    {product.details?.description || product.description}
                                </p>
                            )}

                            {product.details?.specs ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-6">
                                    {Object.entries(product.details.specs).map(([key, value]) => (
                                        <div key={key} className="flex justify-between border-b border-border/50 py-2">
                                            <span className="text-sm font-medium text-muted-foreground capitalize">{key}</span>
                                            <span className="text-sm font-semibold">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : null}

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="block text-muted-foreground text-xs mb-1">Source URL</span>
                                    <a href={product.productUrl} target="_blank" className="font-medium text-primary hover:underline truncate block">
                                        World of Books
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}

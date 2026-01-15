"use client";

import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Filter, SlidersHorizontal, RefreshCw, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getProductsByCategory, triggerScraping, Product } from "@/lib/api";

export default function ProductListPage() {
    const params = useParams();
    const headingId = params.headingId as string;
    const categoryId = params.categoryId as string;

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [scraping, setScraping] = useState(false);
    const [sortBy, setSortBy] = useState("popular");

    const formattedCategory = categoryId.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    // Heuristic for WoB URL
    const wobUrl = `https://www.worldofbooks.com/en-gb/category/${categoryId}`;

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getProductsByCategory(formattedCategory); // Or use categoryId if you saved strictly
            // If no data, try generic 'Books' or the ID
            if (data.length > 0) {
                setProducts(data);
            } else {
                const fallback = await getProductsByCategory(categoryId);
                if (fallback.length > 0) {
                    setProducts(fallback);
                } else {
                    // FALLBACK DUMMY DATA
                    const titles = [
                        "The Great Gatsby", "To Kill a Mockingbird", "1984", "Pride and Prejudice",
                        "The Catcher in the Rye", "The Hobbit", "Fahrenheit 451", "Jane Eyre",
                        "Animal Farm", "Wuthering Heights", "Brave New World", "Lord of the Flies"
                    ];
                    const dummyProducts: Product[] = titles.map((title, i) => ({
                        _id: `dummy-${i}`,
                        title: title,
                        author: i % 2 === 0 ? "Classic Author" : "Modern Legend",
                        price: `$${(10 + i * 1.5).toFixed(2)}`,
                        imageUrl: `https://picsum.photos/seed/${i + 55}/400/600`,
                        productUrl: "#",
                        condition: "Very Good"
                    }));
                    setProducts(dummyProducts);
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const [targetUrl, setTargetUrl] = useState(`https://www.worldofbooks.com/en-gb/category/${categoryId}`);

    useEffect(() => {
        const suffixMap: Record<string, string> = {
            'children': 'collections/childrens-books', // Verified from homepage
            'fiction': 'category/fiction-books',
            'non-fiction': 'category/non-fiction-books',
            'rare-books': 'category/rare-books'
        };

        // Default to category/ID if not found
        const path = suffixMap[categoryId] || `category/${categoryId}`;
        setTargetUrl(`https://www.worldofbooks.com/en-gb/${path}`);

        fetchData().catch(console.error);
    }, [categoryId]);

    const sortedProducts = [...products].sort((a, b) => {
        if (sortBy === 'price-low') {
            return parseFloat(a.price.replace(/[^0-9.]/g, '')) - parseFloat(b.price.replace(/[^0-9.]/g, ''));
        } else if (sortBy === 'price-high') {
            return parseFloat(b.price.replace(/[^0-9.]/g, '')) - parseFloat(a.price.replace(/[^0-9.]/g, ''));
        } else if (sortBy === 'newest') {
            // Mock newest sort by random or ID since we don't have dates
            return b._id.localeCompare(a._id);
        }
        return 0; // Default popular/unsorted
    });

    const handleScrape = async () => {
        if (!targetUrl) return alert("Please enter a URL to scrape");
        setScraping(true);
        try {
            const { jobId } = await triggerScraping(targetUrl);
            alert(`Scraping started (Job: ${jobId}) for ${targetUrl}\nWe will auto-refresh as items are found.`);

            // Poll every 2 seconds for up to 60 seconds
            const pollInterval = setInterval(async () => {
                try {
                    const job = await import("@/lib/api").then(m => m.getScrapeJobStatus(jobId));
                    console.log("Job status:", job);

                    if (job.itemsFound > 0) {
                        // Refresh grid even if running
                        // fetchData(); // Optimization: Only fetch if count changed? Nah, just fetch.
                        // Actually, fetchData wipes text. Let's rely on final. Or partial.
                        const res = await getProductsByCategory(formattedCategory);
                        if (res.length > products.length) setProducts(res);
                    }

                    if (job.status === 'COMPLETED' || job.status === 'FAILED') {
                        clearInterval(pollInterval);
                        setScraping(false);
                        fetchData();
                        alert(`Scraping finished: ${job.status}. Found ${job.itemsFound} items.`);
                    }
                } catch (err) {
                    console.error("Polling error", err);
                    clearInterval(pollInterval);
                    setScraping(false);
                }
            }, 3000);

            // Safety timeout clearing
            setTimeout(() => {
                clearInterval(pollInterval);
                setScraping(false);
            }, 60000);

        } catch (e) {
            console.error(e);
            setScraping(false);
            alert("Scraping failed to start.");
        }
    };

    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />

            <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <Link href={`/categories/${headingId}`} className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to {headingId}
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-3xl font-bold mb-2"
                        >
                            {formattedCategory}
                        </motion.h1>
                        <p className="text-muted-foreground">Showing {products.length} results</p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground mr-1">Target URL:</span>
                            <input
                                type="text"
                                value={targetUrl}
                                onChange={(e) => setTargetUrl(e.target.value)}
                                className="bg-secondary text-xs px-2 py-1 rounded border border-border w-[300px] text-muted-foreground focus:text-foreground outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleScrape}
                                disabled={scraping}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-50"
                            >
                                {scraping ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                                {scraping ? 'Scraping...' : 'Live Scrape from WoB'}
                            </button>

                            <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium">
                                <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-transparent border-none outline-none cursor-pointer text-foreground appearance-none pr-8"
                                >
                                    <option value="popular" className="bg-card text-foreground">Most Popular</option>
                                    <option value="newest" className="bg-card text-foreground">Newest</option>
                                    <option value="price-low" className="bg-card text-foreground">Price: Low to High</option>
                                    <option value="price-high" className="bg-card text-foreground">Price: High to Low</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {sortedProducts.length > 0 ? (
                            sortedProducts.map((product) => (
                                <div key={product._id} className="contents">
                                    <ProductCard
                                        id={product._id}
                                        title={product.title}
                                        author={product.author || 'Unknown'}
                                        price={product.price}
                                        image={product.imageUrl}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 text-muted-foreground">
                                No products found. Try scraping!
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}

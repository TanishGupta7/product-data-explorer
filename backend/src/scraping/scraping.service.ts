import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlaywrightCrawler, Dataset } from 'crawlee';
import { ProductsService } from '../products/products.service';
import { ScrapeJob, ScrapeJobDocument, ScrapeStatus } from './schemas/scrape-job.schema';

@Injectable()
export class ScrapingService {
    private readonly logger = new Logger(ScrapingService.name);

    constructor(
        private readonly productsService: ProductsService,
        @InjectModel(ScrapeJob.name) private scrapeJobModel: Model<ScrapeJobDocument>
    ) { }

    async getJob(id: string) {
        return this.scrapeJobModel.findById(id).exec();
    }

    async scrapeCategory(url: string) {
        // 1. Create Job Entry
        const job = await this.scrapeJobModel.create({
            targetUrl: url,
            status: ScrapeStatus.RUNNING,
            startedAt: new Date(),
        });
        this.logger.log(`Starting Scrape Job ${job._id} for ${url}`);

        // Launch in background (do not await here, so controller returns immediately)
        this.runCrawler(job, url).catch(err => this.logger.error(err));

        return job;
    }

    private async runCrawler(job: ScrapeJobDocument, url: string) {
        let itemsFound = 0;
        const crawler = new PlaywrightCrawler({
            headless: true,
            maxRequestsPerCrawl: 30, // Limit for demo speed
            requestHandlerTimeoutSecs: 60,

            requestHandler: async ({ page, request, log, enqueueLinks }) => {
                try {
                    const title = await page.title().catch(() => 'No Title');
                    log.info(`Processing ${request.url} [${request.label || 'CATEGORY'}] - Title: ${title}`);

                    // Set User-Agent
                    await page.setExtraHTTPHeaders({
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Accept-Language': 'en-US,en;q=0.9',
                    });

                    if (request.label === 'DETAIL') {
                        // --- PHASE 2: SCRAPE DETAILS ---
                        try {
                            const description = await page.locator('#description, .description-container, .product-description, [itemprop="description"]').first().innerText({ timeout: 5000 }).catch(() => '');

                            const specs: any = {};
                            const rows = await page.locator('.product-details-table tr, .spec-row, tr').all();
                            for (const row of rows) {
                                const key = await row.locator('th, .label, td:first-child').first().innerText().catch(() => '');
                                const value = await row.locator('td, .value, td:last-child').last().innerText().catch(() => '');
                                if (key && value && key !== value) specs[key.replace(':', '').trim()] = value.trim();
                            }

                            // Save details
                            const product = await this.productsService.upsert({
                                title: title,
                                productUrl: request.url,
                                price: '0',
                                category: 'Books'
                            } as any);

                            if (product) {
                                await this.productsService.upsertDetail(product._id.toString(), {
                                    productId: product._id,
                                    description: description.slice(0, 2000),
                                    specs,
                                    ratingsAvg: 4.5,
                                    reviewsCount: 10
                                });
                                log.info(`Saved details for ${product.title}`);
                            }
                        } catch (e) {
                            log.error(`Failed to scrape details for ${request.url}: ${e}`);
                        }

                    } else {
                        // --- PHASE 1: LISTING PAGE ---
                        try {
                            await page.waitForLoadState('domcontentloaded');
                            await page.waitForTimeout(5000); // Increased wait time for dynamic content
                        } catch (e) { log.info('Timeout waiting for load (non-fatal)'); }

                        // 1. Enqueue Product Details (STRICTER)
                        const queued = await enqueueLinks({
                            selector: 'a[href*="/products/"]', // Focus on /products/ links
                            label: 'DETAIL',
                            userData: { source: 'listing' },
                            strategy: 'same-domain',
                            // Explicitly exclude collections and categories to prevent runaway crawling
                            exclude: [/\/collections\//, /\/category\//, /\/pages\//, /\/basket/, /\/checkout/]
                        });
                        log.info(`Enqueued ${queued.processedRequests.length} detail pages.`);

                        // 2. Scrape Basic Info (Broader Strategy)
                        const productData = await page.$$eval('div, li, article', (items) => {
                            const seen = new Set();
                            const results: any[] = [];
                            let debugTotal = 0;
                            let debugPriceSkipped = 0;

                            items.forEach((item, index) => {
                                debugTotal++;
                                const img = item.querySelector('img');
                                const link = item.querySelector('a');
                                const innerText = (item as HTMLElement).innerText || '';

                                if (img && link && innerText.length > 5) {
                                    const hasPrice = innerText.includes('£') || innerText.includes('$');
                                    if (!hasPrice) {
                                        debugPriceSkipped++;
                                        return;
                                    }

                                    const title = link.textContent?.trim() || img.alt || 'Unknown Title';
                                    const url = link.href;

                                    // filters
                                    if (url.includes('login') || url.includes('account') || url.includes('cart') || url.includes('search')) return;

                                    // CRITICAL: Do not treat category/collection links as products in Phase 1
                                    if (url.includes('/collections/') && !url.includes('/products/')) return;
                                    if (url.includes('/category/') && !url.includes('/products/')) return;

                                    if (title && url && !seen.has(title)) {
                                        seen.add(title);
                                        const priceMatch = innerText.match(/[$£]\d+\.\d{2}/);

                                        results.push({
                                            title,
                                            price: priceMatch ? priceMatch[0] : 'Check Price',
                                            productUrl: url,
                                            imageUrl: img.getAttribute('src') || img.getAttribute('data-src') || ''
                                        });
                                    }
                                }
                            });

                            const unique = results.filter((v, i, a) => a.findIndex(v2 => (v2.productUrl === v.productUrl)) === i);
                            if (unique.length === 0) {
                                return { stats: { debugTotal, debugPriceSkipped }, results: [] };
                            }
                            return { stats: null, results: unique };
                        });

                        // Handle the return type
                        const finalResults = Array.isArray(productData) ? productData : productData.results;
                        const stats = !Array.isArray(productData) ? productData.stats : null;

                        if (stats && finalResults.length === 0) {
                            log.warning(`Scraped 0 items. Debug: Checked ${stats.debugTotal} containers. Skipped ${stats.debugPriceSkipped} for no price.`);
                        } else {
                            log.info(`Scraped ${finalResults.length} items from listing page.`);
                            if (finalResults.length > 0) {
                                log.debug(`First item found: ${JSON.stringify(finalResults[0])}`);
                            }
                        }

                        itemsFound += finalResults.length;

                        for (const data of finalResults) {
                            await this.productsService.upsert({ ...data, category: 'Books' } as any);
                        }
                    }
                } catch (err: any) {
                    log.error(`CRITICAL HANDLER ERROR in ${request.url}: ${err.message}`);
                }
            },
            failedRequestHandler: async ({ request, log }) => {
                log.error(`Request failed: ${request.url}`);
            }
        });

        try {
            await crawler.run([url]);

            await this.scrapeJobModel.findByIdAndUpdate(job._id, {
                status: ScrapeStatus.COMPLETED,
                finishedAt: new Date(),
                itemsFound
            });
            this.logger.log(`Job ${job._id} completed. Found ${itemsFound} items.`);

        } catch (e: any) {
            this.logger.error(`Scrape failed: ${e.message}`);
            await this.scrapeJobModel.findByIdAndUpdate(job._id, {
                status: ScrapeStatus.FAILED,
                errorLog: e.message,
                finishedAt: new Date()
            });
        }
    }
}

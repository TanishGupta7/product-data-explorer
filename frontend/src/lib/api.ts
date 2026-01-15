import axios from 'axios';

// Use 127.0.0.1 to avoid Windows localhost resolution issues
const API_URL = 'http://127.0.0.1:3001';

export const api = axios.create({
    baseURL: API_URL,
});

export interface ProductDetail {
    description?: string;
    specs?: Record<string, string>;
    ratingsAvg?: number;
    reviewsCount?: number;
}

export interface Product {
    _id: string;
    title: string;
    author?: string;
    price: string;
    imageUrl?: string;
    productUrl: string;
    category?: string;
    condition?: string;
    description?: string;
    details?: ProductDetail;
    reviews?: any[];
}

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
    const response = await api.get(`/products/category/${category}`);
    return response.data;
};

export const getProductById = async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
};

export const triggerScraping = async (url: string) => {
    const response = await api.post('/scraping/category', { url });
    return response.data; // { message, jobId, url }
};

export const getScrapeJobStatus = async (jobId: string) => {
    const response = await api.get(`/scraping/job/${jobId}`);
    return response.data; // { status, itemsFound, ... }
};

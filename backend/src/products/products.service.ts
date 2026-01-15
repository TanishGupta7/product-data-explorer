import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './schemas/product.schema';
import { ProductDetail, ProductDetailDocument } from './schemas/product-detail.schema';
import { Review, ReviewDocument } from './schemas/review.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(ProductDetail.name) private productDetailModel: Model<ProductDetailDocument>,
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) { }

  async create(createProductDto: CreateProductDto) {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  async findAll() {
    return this.productModel.find().exec();
  }

  async findOne(id: string) {
    // Return product with details
    const product = await this.productModel.findById(id).lean().exec();
    if (!product) return null;

    const details = await this.productDetailModel.findOne({ productId: id }).lean().exec();
    const reviews = await this.reviewModel.find({ productId: id }).lean().exec();

    return { ...product, details, reviews };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    return this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true }).exec();
  }

  async remove(id: string) {
    return this.productModel.findByIdAndDelete(id).exec();
  }

  async upsert(createProductDto: CreateProductDto) {
    return this.productModel.findOneAndUpdate(
      { productUrl: createProductDto.productUrl },
      { ...createProductDto, scrapedAt: new Date() },
      { upsert: true, new: true }
    ).exec();
  }

  async upsertDetail(productId: string, detailData: any) {
    return this.productDetailModel.findOneAndUpdate(
      { productId },
      { ...detailData },
      { upsert: true, new: true }
    ).exec();
  }

  async findByCategory(category: string) {
    // Basic limit for demo
    return this.productModel.find({ category: { $regex: category, $options: 'i' } }).limit(50).exec();
  }
}

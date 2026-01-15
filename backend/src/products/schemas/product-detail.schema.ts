import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ProductDetailDocument = HydratedDocument<ProductDetail>;

@Schema({ timestamps: true })
export class ProductDetail {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true, unique: true })
    productId: string;

    @Prop()
    description: string;

    @Prop({ type: Object })
    specs: Record<string, any>; // JSON metadata (ISBN, Publisher, Year)

    @Prop()
    ratingsAvg: number;

    @Prop()
    reviewsCount: number;
}

export const ProductDetailSchema = SchemaFactory.createForClass(ProductDetail);

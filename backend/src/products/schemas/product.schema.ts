import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
    @Prop({ required: true })
    title: string;

    @Prop()
    author: string;

    @Prop({ required: true })
    price: string;

    @Prop()
    imageUrl: string;

    @Prop({ unique: true })
    productUrl: string;

    @Prop()
    category: string;

    @Prop()
    condition: string;

    @Prop()
    description: string;

    @Prop()
    scrapedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

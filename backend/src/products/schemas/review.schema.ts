import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({ timestamps: true })
export class Review {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
    productId: string;

    @Prop({ required: true })
    author: string;

    @Prop({ required: true })
    rating: number;

    @Prop()
    text: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

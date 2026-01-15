import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ScrapeJobDocument = HydratedDocument<ScrapeJob>;

export enum ScrapeStatus {
    PENDING = 'PENDING',
    RUNNING = 'RUNNING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
}

@Schema({ timestamps: true })
export class ScrapeJob {
    @Prop({ required: true })
    targetUrl: string;

    @Prop({ required: true, enum: ScrapeStatus, default: ScrapeStatus.PENDING })
    status: ScrapeStatus;

    @Prop()
    startedAt: Date;

    @Prop()
    finishedAt: Date;

    @Prop()
    errorLog: string;

    @Prop({ default: 0 })
    itemsFound: number;
}

export const ScrapeJobSchema = SchemaFactory.createForClass(ScrapeJob);

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScrapingService } from './scraping.service';
import { ScrapingController } from './scraping.controller';
import { ProductsModule } from '../products/products.module';
import { ScrapeJob, ScrapeJobSchema } from './schemas/scrape-job.schema';

@Module({
  imports: [
    ProductsModule,
    MongooseModule.forFeature([{ name: ScrapeJob.name, schema: ScrapeJobSchema }])
  ],
  controllers: [ScrapingController],
  providers: [ScrapingService],
})
export class ScrapingModule { }

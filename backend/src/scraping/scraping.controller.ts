import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ScrapingService } from './scraping.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('scraping')
@Controller('scraping')
export class ScrapingController {
    constructor(private readonly scrapingService: ScrapingService) { }

    @Post('category')
    @ApiOperation({ summary: 'Trigger scraping of a category URL' })
    async scrapeCategory(@Body('url') url: string) {
        // Return the JOB ID so frontend can poll
        const job = await this.scrapingService.scrapeCategory(url);
        return { message: 'Scraping started', jobId: job._id, url };
    }

    @Get('job/:id')
    @ApiOperation({ summary: 'Get scraping job status' })
    async getJobStatus(@Param('id') id: string) {
        return this.scrapingService.getJob(id);
    }
}

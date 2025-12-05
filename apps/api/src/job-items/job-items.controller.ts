import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { JobItemsService } from './job-items.service';
import { CreateJobItemDto } from './dto/create-job-item.dto';

@Controller('job-items')
export class JobItemsController {
  constructor(private readonly jobItemsService: JobItemsService) {}

  @Post()
  create(@Body() createJobItemDto: CreateJobItemDto) {
    return this.jobItemsService.create(createJobItemDto);
  }

  @Get()
  findAll() {
    return this.jobItemsService.findAll();
  }

  @Get('job/:jobId')
  findByJobId(@Param('jobId') jobId: string) {
    return this.jobItemsService.findByJobId(jobId);
  }
}

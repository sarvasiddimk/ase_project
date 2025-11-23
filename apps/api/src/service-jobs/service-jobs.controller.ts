import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { ServiceJobsService } from './service-jobs.service';
import { CreateServiceJobDto, UpdateServiceJobDto } from './dto/create-service-job.dto';

@Controller('service-jobs')
export class ServiceJobsController {
    constructor(private readonly serviceJobsService: ServiceJobsService) { }

    @Post()
    create(@Body() createServiceJobDto: CreateServiceJobDto) {
        return this.serviceJobsService.create(createServiceJobDto);
    }

    @Get()
    findAll() {
        return this.serviceJobsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.serviceJobsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateServiceJobDto: UpdateServiceJobDto) {
        return this.serviceJobsService.update(id, updateServiceJobDto);
    }
}

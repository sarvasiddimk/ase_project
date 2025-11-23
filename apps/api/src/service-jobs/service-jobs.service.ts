import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceJob, JobStatus } from './entities/service-job.entity';
import { CreateServiceJobDto, UpdateServiceJobDto } from './dto/create-service-job.dto';

@Injectable()
export class ServiceJobsService {
    constructor(
        @InjectRepository(ServiceJob)
        private serviceJobsRepository: Repository<ServiceJob>,
    ) { }

    create(createServiceJobDto: CreateServiceJobDto) {
        const job = this.serviceJobsRepository.create(createServiceJobDto);
        return this.serviceJobsRepository.save(job);
    }

    findAll() {
        return this.serviceJobsRepository.find({ relations: ['vehicle', 'customer'] });
    }

    findOne(id: string) {
        return this.serviceJobsRepository.findOne({ where: { id }, relations: ['vehicle', 'customer'] });
    }

    async update(id: string, updateServiceJobDto: UpdateServiceJobDto) {
        await this.serviceJobsRepository.update(id, updateServiceJobDto);
        return this.findOne(id);
    }

    async updateStatus(id: string, status: JobStatus) {
        await this.serviceJobsRepository.update(id, { status });
        return this.findOne(id);
    }
}

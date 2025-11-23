import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobItem } from './entities/job-item.entity';
import { CreateJobItemDto } from './dto/create-job-item.dto';

@Injectable()
export class JobItemsService {
    constructor(
        @InjectRepository(JobItem)
        private jobItemsRepository: Repository<JobItem>,
    ) { }

    create(createJobItemDto: CreateJobItemDto) {
        const total = createJobItemDto.quantity * createJobItemDto.unitPrice;
        const jobItem = this.jobItemsRepository.create({
            ...createJobItemDto,
            totalPrice: total,
        });
        return this.jobItemsRepository.save(jobItem);
    }

    findAll() {
        return this.jobItemsRepository.find({ relations: ['serviceJob'] });
    }

    findByJobId(serviceJobId: string) {
        return this.jobItemsRepository.find({ where: { serviceJobId } });
    }
}

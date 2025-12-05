import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceJob, JobStatus } from './entities/service-job.entity';
import {
  CreateServiceJobDto,
  UpdateServiceJobDto,
} from './dto/create-service-job.dto';

import { Appointment } from '../scheduling/entities/appointment.entity';

@Injectable()
export class ServiceJobsService {
  constructor(
    @InjectRepository(ServiceJob)
    private serviceJobsRepository: Repository<ServiceJob>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) { }

  async create(createServiceJobDto: CreateServiceJobDto) {
    const job = this.serviceJobsRepository.create(createServiceJobDto);
    const savedJob = await this.serviceJobsRepository.save(job);

    if (createServiceJobDto.appointmentId) {
      await this.appointmentRepository.update(
        createServiceJobDto.appointmentId,
        { serviceJob: savedJob }
      );
    }

    return savedJob;
  }

  findAll() {
    return this.serviceJobsRepository.find({
      relations: ['vehicle', 'customer'],
    });
  }

  async findOne(id: string) {
    const job = await this.serviceJobsRepository.findOne({
      where: { id },
      relations: ['vehicle', 'customer', 'invoice', 'items'],
    });
    if (!job) {
      throw new NotFoundException(`Service job with ID ${id} not found`);
    }
    return job;
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

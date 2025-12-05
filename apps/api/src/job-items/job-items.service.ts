import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobItem } from './entities/job-item.entity';
import { CreateJobItemDto } from './dto/create-job-item.dto';
import { InventoryService } from '../inventory/inventory.service';
import { JobItemType } from './entities/job-item.entity';

@Injectable()
export class JobItemsService {
  constructor(
    @InjectRepository(JobItem)
    private jobItemsRepository: Repository<JobItem>,
    private inventoryService: InventoryService,
  ) { }

  async create(createJobItemDto: CreateJobItemDto) {
    try {
      if (!createJobItemDto.serviceJobId) {
        throw new Error('serviceJobId is required');
      }

      // If it's a part, deduct from inventory
      if (createJobItemDto.type === JobItemType.PART && createJobItemDto.inventoryItemId) {
        await this.inventoryService.adjustStock(
          createJobItemDto.inventoryItemId,
          -createJobItemDto.quantity,
          `Used in Service Job`
        );
      }

      const total = createJobItemDto.quantity * createJobItemDto.unitPrice;
      const jobItem = this.jobItemsRepository.create({
        ...createJobItemDto,
        totalPrice: total,
      });
      return await this.jobItemsRepository.save(jobItem);
    } catch (error) {
      console.error('Error creating job item:', error);
      throw error;
    }
  }

  findAll() {
    return this.jobItemsRepository.find({ relations: ['serviceJob'] });
  }

  findByJobId(serviceJobId: string) {
    return this.jobItemsRepository.find({ where: { serviceJobId } });
  }
}

import { JobItemType } from '../entities/job-item.entity';

export class CreateJobItemDto {
  serviceJobId: string;
  type: JobItemType;
  description: string;
  quantity: number;
  unitPrice: number;
  inventoryItemId?: string;
}

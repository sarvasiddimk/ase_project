import { JobStatus } from '../entities/service-job.entity';

export class CreateServiceJobDto {
  vehicleId: string;
  customerId: string;
  description?: string;
  appointmentId?: string;
}

export class UpdateServiceJobDto {
  status?: JobStatus;
  description?: string;
}

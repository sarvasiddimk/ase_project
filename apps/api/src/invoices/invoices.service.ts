import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice, InvoiceStatus } from './entities/invoice.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { ServiceJob } from '../service-jobs/entities/service-job.entity';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoicesRepository: Repository<Invoice>,
    @InjectRepository(ServiceJob)
    private serviceJobsRepository: Repository<ServiceJob>,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const job = await this.serviceJobsRepository.findOne({
      where: { id: createInvoiceDto.jobId },
      relations: ['items', 'customer', 'vehicle'],
    });

    if (!job) {
      throw new NotFoundException(
        `Job with ID ${createInvoiceDto.jobId} not found`,
      );
    }

    if (job.invoiceId) {
      throw new BadRequestException(
        `Job ${createInvoiceDto.jobId} already has an invoice`,
      );
    }

    // Calculate totals
    const subtotal = job.items.reduce(
      (sum, item) => sum + Number(item.totalPrice),
      0,
    );
    const taxRate = 0.1; // 10% tax for example
    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + taxAmount;

    // Create invoice
    const invoice = this.invoicesRepository.create({
      invoiceNumber: `INV-${Date.now()}`, // Simple generation for now
      status: InvoiceStatus.DRAFT,
      issuedAt: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due in 7 days
      totalAmount,
      taxAmount,
      lineItems: job.items,
      job,
      jobId: job.id,
    });

    const savedInvoice = await this.invoicesRepository.save(invoice);

    // Update job with invoice reference
    job.invoice = savedInvoice;
    job.invoiceId = savedInvoice.id;
    await this.serviceJobsRepository.save(job);

    return savedInvoice;
  }

  findAll(): Promise<Invoice[]> {
    return this.invoicesRepository.find({ relations: ['job', 'job.customer'] });
  }

  async findOne(id: string): Promise<Invoice> {
    const invoice = await this.invoicesRepository.findOne({
      where: { id },
      relations: ['job', 'job.customer', 'job.vehicle'],
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    return invoice;
  }

  async findByJob(jobId: string): Promise<Invoice> {
    const invoice = await this.invoicesRepository.findOne({
      where: { jobId },
      relations: ['job'],
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice for Job ID ${jobId} not found`);
    }

    return invoice;
  }
}

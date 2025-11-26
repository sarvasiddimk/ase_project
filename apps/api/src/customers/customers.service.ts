import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomersService {
    constructor(
        @InjectRepository(Customer)
        private customersRepository: Repository<Customer>,
    ) { }

    create(createCustomerDto: CreateCustomerDto) {
        const customer = this.customersRepository.create(createCustomerDto);
        return this.customersRepository.save(customer);
    }

    findAll(search?: string) {
        if (search) {
            return this.customersRepository.find({
                where: [
                    { name: ILike(`%${search}%`) },
                    { email: ILike(`%${search}%`) },
                    { phone: ILike(`%${search}%`) },
                ],
                relations: ['vehicles'],
            });
        }
        return this.customersRepository.find({ relations: ['vehicles'] });
    }

    findOne(id: string) {
        return this.customersRepository.findOne({ where: { id }, relations: ['vehicles'] });
    }
}

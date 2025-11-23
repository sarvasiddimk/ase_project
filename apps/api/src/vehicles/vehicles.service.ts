import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';

@Injectable()
export class VehiclesService {
    constructor(
        @InjectRepository(Vehicle)
        private vehiclesRepository: Repository<Vehicle>,
    ) { }

    create(createVehicleDto: CreateVehicleDto) {
        const vehicle = this.vehiclesRepository.create(createVehicleDto);
        return this.vehiclesRepository.save(vehicle);
    }

    findAll() {
        return this.vehiclesRepository.find({ relations: ['customer'] });
    }

    findOne(id: string) {
        return this.vehiclesRepository.findOne({ where: { id }, relations: ['customer'] });
    }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessProfile } from './entities/business-profile.entity';
import { UpdateBusinessProfileDto } from './dto/update-business-profile.dto';

@Injectable()
export class BusinessProfileService {
    constructor(
        @InjectRepository(BusinessProfile)
        private repository: Repository<BusinessProfile>,
    ) { }

    async getProfile() {
        const profiles = await this.repository.find();
        if (profiles.length === 0) {
            // Create default if not exists
            const defaultProfile = this.repository.create({
                name: 'Red Panther Auto',
                email: 'contact@redpanther.com',
                phone: '+1 (555) 000-0000',
                address: '123 Mechanic Lane\nAutomotive District, CA 90210',
                website: 'https://redpanther.com',
            });
            return await this.repository.save(defaultProfile);
        }
        return profiles[0];
    }

    async updateProfile(updateDto: UpdateBusinessProfileDto) {
        const profile = await this.getProfile();
        Object.assign(profile, updateDto);
        return await this.repository.save(profile);
    }
}

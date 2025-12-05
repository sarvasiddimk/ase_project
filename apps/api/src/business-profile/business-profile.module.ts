import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessProfileService } from './business-profile.service';
import { BusinessProfileController } from './business-profile.controller';
import { BusinessProfile } from './entities/business-profile.entity';

@Module({
    imports: [TypeOrmModule.forFeature([BusinessProfile])],
    controllers: [BusinessProfileController],
    providers: [BusinessProfileService],
    exports: [BusinessProfileService],
})
export class BusinessProfileModule { }

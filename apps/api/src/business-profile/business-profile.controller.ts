import { Controller, Get, Patch, Body } from '@nestjs/common';
import { BusinessProfileService } from './business-profile.service';
import { UpdateBusinessProfileDto } from './dto/update-business-profile.dto';

@Controller('business-profile')
export class BusinessProfileController {
    constructor(private readonly businessProfileService: BusinessProfileService) { }

    @Get()
    getProfile() {
        return this.businessProfileService.getProfile();
    }

    @Patch()
    updateProfile(@Body() updateDto: UpdateBusinessProfileDto) {
        return this.businessProfileService.updateProfile(updateDto);
    }
}

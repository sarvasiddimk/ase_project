import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { SchedulingService } from './scheduling.service';
import {
  CreateAppointmentDto,
  UpdateAppointmentDto,
} from './dto/appointment.dto';

@Controller('scheduling')
export class SchedulingController {
  constructor(private readonly schedulingService: SchedulingService) {}

  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.schedulingService.create(createAppointmentDto);
  }

  @Get()
  findAll(@Query('start') start?: string, @Query('end') end?: string) {
    return this.schedulingService.findAll(start, end);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schedulingService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.schedulingService.update(id, updateAppointmentDto);
  }
}

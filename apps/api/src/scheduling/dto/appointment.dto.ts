export class CreateAppointmentDto {
    customerId: string;
    vehicleId: string;
    serviceJobId?: string;
    startTime: string; // ISO Date string
    endTime: string;   // ISO Date string
    notes?: string;
}

export class UpdateAppointmentDto {
    startTime?: string;
    endTime?: string;
    status?: 'SCHEDULED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    notes?: string;
}

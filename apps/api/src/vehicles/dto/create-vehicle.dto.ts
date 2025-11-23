export class CreateVehicleDto {
    vin: string;
    make: string;
    model: string;
    year: number;
    customerId: string;
    telematicsId?: string;
}

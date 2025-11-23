export class CreateCustomerDto {
    name: string;
    email: string;
    phone: string;
    preferences?: Record<string, any>;
}

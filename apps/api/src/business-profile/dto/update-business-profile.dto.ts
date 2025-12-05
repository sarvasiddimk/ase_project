import { IsString, IsOptional, IsEmail } from 'class-validator';

export class UpdateBusinessProfileDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsString()
    @IsOptional()
    website?: string;

    @IsString()
    @IsOptional()
    logo?: string;
}

import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from "class-validator";


export class CreateEventDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsDateString()
    @IsNotEmpty()
    date: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    location: string;

    @IsInt()
    @Min(1)
    capacity: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    price: number;

}
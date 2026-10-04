import { IsInt, IsNotEmpty, IsUUID, Max, Min } from "class-validator";


export class PurchaseTicketDto {
    @IsUUID('4')
    @IsNotEmpty()
    eventId: string;

    @IsInt()
    @Min(1)
    @Max(10)
    quantity: number;
}
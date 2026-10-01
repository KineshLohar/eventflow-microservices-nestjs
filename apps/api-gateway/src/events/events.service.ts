import { HttpException, Injectable } from '@nestjs/common';
import { SERVICES_PORT } from '@app/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EventsService {
    private readonly eventServiceUrl = `http://localhost:${SERVICES_PORT.EVENTS_SERVICE}`;

    constructor(private readonly httpService: HttpService){}

    async create(data: object, userId: string, userRole: string){
        try {
            const response = await firstValueFrom(
                this.httpService.post(this.eventServiceUrl, data, {
                    headers: { 'x-user-id': userId, 'x-user-role': userRole}
                })
            )

            return response.data;
        } catch (error) {
            this.handleError(error)
        }
    }

    private handleError(error: unknown): never {
        const err = error as {
            response?: { data: string | object; status: number }
        }
        if (err.response) {
            throw new HttpException(err.response.data, err.response.status)
        }
        throw new HttpException('Something went wrong', 503);

    }


}

import { Injectable } from '@nestjs/common';
import { SERVICES_PORT } from '../../../libs/common/src';

@Injectable()
export class AppService {
  getHello(): string {
    return `API GATEWAY is running on port ${SERVICES_PORT.API_GATEWAY}`;
  }
}

import { Injectable } from '@nestjs/common';
import { DiscreaseStock } from './types';

@Injectable()
export class StockService {
  constructor() {}

  discreaseStock(data: DiscreaseStock[]) {
    console.log({ data });
    return data;
  }
}

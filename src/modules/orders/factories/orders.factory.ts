import { Injectable } from '@nestjs/common';
import { Order, OrdersCreator, OrderType } from '../interfaces';
import { BranchOrdersService, ClientOrdersService } from '../services';

@Injectable()
export class OrdersFactory implements OrdersCreator {
  constructor(
    private readonly clientOrdersService: ClientOrdersService,
    private readonly branchOrdersService: BranchOrdersService,
  ) {}

  // * Main handler
  handleOrderCreation(orderType: OrderType): Order {
    const orders: Record<string, Order> = {
      client: this.clientOrdersService,
      // branch: this.branchOrdersService,
    };

    const orderInstance = orders[orderType];
    if (!orderInstance) {
      throw new Error(`Factory method not found for: ${orderType}`);
    }
    return orderInstance;
  }
}

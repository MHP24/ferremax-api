export type DiscreaseStock = {
  productId: string;
  branchId: string;
  quantity: number;
};

export type DiscreaseStockOutput = {
  totalStockDifference: number;
  branchStockDifference: number;
};

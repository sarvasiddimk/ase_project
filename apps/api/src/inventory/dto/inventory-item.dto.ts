export class CreateInventoryItemDto {
  sku: string;
  name: string;
  description?: string;
  quantityOnHand: number;
  reorderLevel: number;
  costPrice: number;
  sellPrice: number;
  location?: string;
}

export class UpdateInventoryItemDto {
  sku?: string;
  name?: string;
  description?: string;
  quantityOnHand?: number;
  reorderLevel?: number;
  costPrice?: number;
  sellPrice?: number;
  location?: string;
}

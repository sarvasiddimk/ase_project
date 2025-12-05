export class CreateOrderDto {
    supplierId: string;
    items: {
        inventoryItemId: string;
        quantity: number;
        costPrice: number;
    }[];
}

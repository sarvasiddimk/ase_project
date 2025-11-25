import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryItemDto, UpdateInventoryItemDto } from './dto/inventory-item.dto';

@Controller('inventory')
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) { }

    @Post()
    create(@Body() createInventoryItemDto: CreateInventoryItemDto) {
        return this.inventoryService.create(createInventoryItemDto);
    }

    @Get()
    findAll() {
        return this.inventoryService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.inventoryService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateInventoryItemDto: UpdateInventoryItemDto) {
        return this.inventoryService.update(id, updateInventoryItemDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.inventoryService.remove(id);
    }

    @Post(':id/adjust')
    adjustStock(
        @Param('id') id: string,
        @Body() body: { quantity: number; reason: string }
    ) {
        return this.inventoryService.adjustStock(id, body.quantity, body.reason);
    }
}

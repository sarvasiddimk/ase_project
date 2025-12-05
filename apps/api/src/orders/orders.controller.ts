import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    create(@Body() createOrderDto: CreateOrderDto) {
        return this.ordersService.create(createOrderDto);
    }

    @Get()
    findAll() {
        return this.ordersService.findAll();
    }

    @Get('suppliers')
    findAllSuppliers() {
        return this.ordersService.findAllSuppliers();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.ordersService.findOne(id);
    }

    @Post(':id/receive')
    receiveOrder(@Param('id') id: string) {
        return this.ordersService.receiveOrder(id);
    }
}

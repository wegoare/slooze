import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderInput } from './dto/create-order.input';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createOrderInput: CreateOrderInput) {
    let total = 0;
    const itemsData: any[] = [];

    for (const item of createOrderInput.items) {
      const menuItem = await this.prisma.menuItem.findUnique({
        where: { id: item.menuItemId },
      });
      if (!menuItem) throw new BadRequestException(`MenuItem ${item.menuItemId} not found`);
      total += menuItem.price * item.quantity;
      itemsData.push({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
      });
    }

    return this.prisma.order.create({
      data: {
        userId,
        status: 'PENDING',
        total,
        items: {
          create: itemsData,
        },
      },
    });
  }

  async checkout(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new BadRequestException('Order not found');
    
    const paymentMethods = await this.prisma.paymentMethod.findMany({ where: { userId } });
    if (paymentMethods.length === 0) throw new BadRequestException('No payment method found');

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'PAID' },
    });
  }

  async cancel(orderId: string) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.order.findMany({ where: { userId } });
  }
}

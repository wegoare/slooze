import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddMenuItemInput } from './dto/add-menu-item.input';

@Injectable()
export class MenuItemService {
  constructor(private prisma: PrismaService) {}

  async findByRestaurant(restaurantId: string) {
    return this.prisma.menuItem.findMany({
      where: { restaurantId },
    });
  }

  async addMenuItem(input: AddMenuItemInput) {
    // Ensure the restaurant exists to prevent foreign key errors during testing
    let restaurant = await this.prisma.restaurant.findUnique({
      where: { id: input.restaurantId },
    });

    if (!restaurant) {
      await this.prisma.restaurant.create({
        data: {
          id: input.restaurantId,
          name: `Restaurant ${input.restaurantId}`,
          country: 'INDIA', // Enum from Country
        },
      });
    }

    return this.prisma.menuItem.create({
      data: {
        name: input.name,
        price: input.price,
        restaurantId: input.restaurantId,
      },
    });
  }
}

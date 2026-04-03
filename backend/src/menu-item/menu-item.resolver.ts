import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { MenuItemService } from './menu-item.service';
import { MenuItem } from './entities/menu-item.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AddMenuItemInput } from './dto/add-menu-item.input';

@Resolver(() => MenuItem)
@UseGuards(GqlAuthGuard, RolesGuard)
export class MenuItemResolver {
  constructor(private readonly menuItemService: MenuItemService) {}

  @Query(() => [MenuItem], { name: 'menuItems' })
  @Roles('ADMIN', 'MANAGER', 'MEMBER')
  findByRestaurant(@Args('restaurantId') restaurantId: string) {
    return this.menuItemService.findByRestaurant(restaurantId);
  }

  @Mutation(() => MenuItem, { name: 'addMenuItem' })
  @Roles('ADMIN', 'MANAGER')
  addMenuItem(@Args('input') input: AddMenuItemInput) {
    return this.menuItemService.addMenuItem(input);
  }
}

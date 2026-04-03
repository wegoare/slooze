import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => Order)
@UseGuards(GqlAuthGuard, RolesGuard)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Mutation(() => Order)
  @Roles('ADMIN', 'MANAGER', 'MEMBER')
  createOrder(
    @Args('input') createOrderInput: CreateOrderInput,
    @CurrentUser() user: any,
  ) {
    return this.orderService.create(user.userId, createOrderInput);
  }

  @Mutation(() => Order)
  @Roles('ADMIN', 'MANAGER')
  checkoutOrder(@Args('orderId') orderId: string, @CurrentUser() user: any) {
    return this.orderService.checkout(orderId, user.userId);
  }

  @Mutation(() => Order)
  @Roles('ADMIN', 'MANAGER')
  cancelOrder(@Args('orderId') orderId: string) {
    return this.orderService.cancel(orderId);
  }

  @Query(() => [Order], { name: 'myOrders' })
  @Roles('ADMIN', 'MANAGER', 'MEMBER')
  myOrders(@CurrentUser() user: any) {
    return this.orderService.findByUser(user.userId);
  }
}

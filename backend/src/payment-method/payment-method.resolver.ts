import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { PaymentMethodService } from './payment-method.service';
import { PaymentMethod } from './entities/payment-method.entity';
import { AddPaymentMethodInput } from './dto/payment-method.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => PaymentMethod)
@UseGuards(GqlAuthGuard, RolesGuard)
export class PaymentMethodResolver {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Mutation(() => PaymentMethod)
  @Roles('ADMIN')
  addPaymentMethod(
    @Args('input') input: AddPaymentMethodInput,
    @CurrentUser() user: any,
  ) {
    return this.paymentMethodService.addMethod(user.userId, input);
  }

  @Mutation(() => PaymentMethod)
  @Roles('ADMIN')
  deletePaymentMethod(@Args('id') id: string) {
    return this.paymentMethodService.deleteMethod(id);
  }

  @Query(() => [PaymentMethod], { name: 'myPaymentMethods' })
  @Roles('ADMIN', 'MANAGER', 'MEMBER')
  myPaymentMethods(@CurrentUser() user: any) {
    return this.paymentMethodService.findByUser(user.userId);
  }
}

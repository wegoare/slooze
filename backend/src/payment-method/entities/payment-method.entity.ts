import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class PaymentMethod {
  @Field()
  id: string;

  @Field()
  provider: string;

  @Field()
  last4: string;
}

import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AddPaymentMethodInput {
  @Field()
  provider: string;

  @Field()
  last4: string;
}

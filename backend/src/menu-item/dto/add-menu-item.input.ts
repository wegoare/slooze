import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class AddMenuItemInput {
  @Field()
  name: string;

  @Field(() => Float)
  price: number;

  @Field()
  restaurantId: string;
}

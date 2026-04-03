import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class Order {
  @Field()
  id: string;

  @Field()
  status: string;

  @Field(() => Float)
  total: number;
}

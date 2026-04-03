import { InputType, Field } from '@nestjs/graphql';
import { Role, Country } from '@prisma/client';

@InputType()
export class SignupInput {
  @Field()
  email: string;

  @Field()
  password: string;

  // Use Prisma enum values
  @Field(() => String) // GraphQL can't use Prisma enum directly
  role: Role;          

  @Field(() => String)
  country: Country;    
}
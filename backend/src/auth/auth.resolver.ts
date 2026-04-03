import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupInput } from './dto/signup.input';
import { LoginInput } from './dto/login.input';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query(() => String)
  hello(): string {
    return 'Hello World!';
  }

  @Mutation(() => String)
  signup(
    @Args('input') input: SignupInput,
  ): Promise<string> {
    return this.authService.signup(input);
  }

  @Mutation(() => String)
  login(
    @Args('input') input: LoginInput,
  ): Promise<string> {
    return this.authService.login(input);
  }
}
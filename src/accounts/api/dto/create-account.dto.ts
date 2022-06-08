import { InputType, Field } from "@nestjs/graphql";
import { Matches, MinLength } from "class-validator";
import { Constants } from "src/constants";

@InputType()
export class CreateAccountDto {
  @Field()
  @Matches(Constants.EMAIL_PATTERN)
  email: string;

  @Field()
  @MinLength(Constants.MIN_USERNAME_CHARACTERS)
  @Matches(Constants.USERNAME_PATTERN)
  username: string;

  @Field()
  @MinLength(Constants.MIN_PASSWORD_CHARACTERS)
  password: string;
}

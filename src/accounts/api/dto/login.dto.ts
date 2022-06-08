import { InputType, Field } from "@nestjs/graphql";
import { IsString, MinLength } from "class-validator";
import { Constants } from "src/constants";

@InputType()
export class LoginDto {
  @Field()
  @IsString()
  user: string;

  @Field()
  @MinLength(Constants.MIN_PASSWORD_CHARACTERS)
  password: string;
}

import { InputType, Field } from "@nestjs/graphql";
import { IsAlphanumeric, IsString, MinLength } from "class-validator";
import { Constants } from "src/constants";

@InputType()
export class ResetPasswordDto {
  @Field()
  @IsAlphanumeric()
  id: string;

  @Field()
  @IsString()
  token: string;

  @Field()
  @MinLength(Constants.MIN_PASSWORD_CHARACTERS)
  password: string;
}

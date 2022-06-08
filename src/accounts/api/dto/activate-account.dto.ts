import { InputType, Field } from "@nestjs/graphql";
import { IsAlphanumeric, IsString } from "class-validator";

@InputType()
export class ActivateAccountDto {
  @Field()
  @IsAlphanumeric()
  id: string;

  @Field()
  @IsString()
  token: string;
}

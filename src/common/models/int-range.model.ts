import { InputType, Field, Int } from "@nestjs/graphql";
import { IsInt } from "class-validator";

@InputType()
export class IntRange {
  @Field(() => Int)
  @IsInt()
  min: number;

  @Field(() => Int)
  @IsInt()
  max: number;
}

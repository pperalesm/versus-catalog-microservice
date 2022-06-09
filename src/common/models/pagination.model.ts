import { InputType, Field, Int } from "@nestjs/graphql";
import { IsInt } from "class-validator";

@InputType()
export class Pagination {
  @Field(() => Int)
  @IsInt()
  limit: number;

  @Field(() => Int)
  @IsInt()
  skip: number;
}

import { InputType, Field } from "@nestjs/graphql";
import { IsEnum, IsOptional } from "class-validator";
import { Sorting } from "backend-common";

@InputType()
export class GameSort {
  @Field(() => Sorting, { nullable: true })
  @IsEnum(Sorting)
  @IsOptional()
  title?: Sorting;

  @Field(() => Sorting, { nullable: true })
  @IsEnum(Sorting)
  @IsOptional()
  averageRating?: Sorting;

  @Field(() => Sorting, { nullable: true })
  @IsEnum(Sorting)
  @IsOptional()
  popularity?: Sorting;
}

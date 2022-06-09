import { Field, InputType, Int } from "@nestjs/graphql";
import { IsArray, IsInt, IsOptional, IsString } from "class-validator";

@InputType()
export class GameFilter {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  title?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  company?: string;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  yearReleased?: number;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  tags?: string[];
}

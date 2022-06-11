import { Field, InputType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsArray, IsOptional, IsString, ValidateNested } from "class-validator";
import { IntRange } from "backend-common";

@InputType()
export class GameFilter {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  title?: string;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  companies?: string[];

  @Field(() => IntRange, { nullable: true })
  @ValidateNested()
  @Type(() => IntRange)
  yearReleased?: IntRange;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  tags?: string[];

  playedBy?: string[];

  pendingBy?: string[];
}

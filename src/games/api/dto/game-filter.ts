import { Field, InputType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsArray, IsOptional, IsString, ValidateNested } from "class-validator";
import { IntRange } from "src/common/models/int-range.model";

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

  @Field(() => IntRange, { nullable: true })
  @ValidateNested()
  @Type(() => IntRange)
  yearReleased?: IntRange;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  tags?: string[];

  playedUsernames?: string[];

  pendingUsernames?: string[];
}

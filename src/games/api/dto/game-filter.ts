import { Field, InputType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsArray, IsOptional, IsString, ValidateNested } from "class-validator";
import { DateRange, IntRange } from "backend-common";

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

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  status?: string[];

  @Field(() => DateRange, { nullable: true })
  @ValidateNested()
  @Type(() => DateRange)
  releaseDate?: DateRange;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  gameModes?: string[];

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  genres?: string[];

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  platforms?: string[];

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  playerPerspectives?: string[];

  @Field(() => IntRange, { nullable: true })
  @ValidateNested()
  @Type(() => IntRange)
  averagePayToWin?: IntRange;

  playedBy?: string[];

  pendingBy?: string[];
}

import { InputType, Field, Int } from "@nestjs/graphql";
import { IsArray, IsDate, IsInt, IsOptional, IsString } from "class-validator";

@InputType()
export class CreateGameDto {
  @Field(() => Int)
  @IsInt()
  igdbId: number;

  @Field()
  @IsString()
  title: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  developer?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  publisher?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  status?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  officialWebsite?: string;

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  releaseDate?: Date;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  image?: string;

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
}

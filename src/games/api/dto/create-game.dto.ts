import { InputType, Field, Int } from "@nestjs/graphql";
import { IsArray, IsInt, IsString } from "class-validator";

@InputType()
export class CreateGameDto {
  @Field()
  @IsString()
  title: string;

  @Field()
  @IsString()
  description: string;

  @Field()
  @IsString()
  company: string;

  @Field(() => Int)
  @IsInt()
  yearReleased: number;

  @Field()
  @IsString()
  image: string;

  @Field(() => [String])
  @IsArray()
  tags: string[];
}

import { InputType, Field } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { Pagination } from "backend-common";
import { GameFilter } from "./game-filter";
import { GameSort } from "./game-sort";

@InputType()
export class GameOptions {
  @Field(() => Pagination)
  @ValidateNested()
  @Type(() => Pagination)
  page: Pagination;

  @Field(() => GameFilter, { nullable: true })
  @ValidateNested()
  @Type(() => GameFilter)
  filter?: GameFilter;

  @Field(() => GameSort, { nullable: true })
  @ValidateNested()
  @Type(() => GameSort)
  sort?: GameSort;
}

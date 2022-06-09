import { InputType, Field } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { Pagination } from "src/common/models/pagination.model";
import { GameFilter } from "./game-filter";
import { GameSort } from "./game-sort";

@InputType()
export class FindGamesDto {
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

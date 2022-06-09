import { registerEnumType } from "@nestjs/graphql";

export enum Sorting {
  Asc = 1,
  Desc = -1,
}

registerEnumType(Sorting, { name: "Sorting" });

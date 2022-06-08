import { Query, Resolver } from "@nestjs/graphql";
import { Game } from "../domain/entities/game.entity";
import { GamesService } from "../domain/games.service";

@Resolver(() => Game)
export class GamesResolver {
  constructor(private readonly gamesService: GamesService) {}

  @Query(() => Game)
  async test() {
    return "";
  }
}

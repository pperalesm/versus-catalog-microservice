import { Args, Query, Resolver } from "@nestjs/graphql";
import { Game } from "../domain/entities/game.entity";
import { GamesService } from "../domain/games.service";
import { FindGamesDto } from "./dto/find-games.dto";

@Resolver(() => Game)
export class GamesResolver {
  constructor(private readonly gamesService: GamesService) {}

  @Query(() => [Game])
  async findGames(
    @Args("findGamesDto", { type: () => FindGamesDto })
    findGamesDto: FindGamesDto,
  ) {
    console.log(findGamesDto);
    return await this.gamesService.findGames(findGamesDto);
  }
}

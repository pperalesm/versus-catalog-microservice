import { UseGuards } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { AuthenticatedUser } from "src/common/decorators/current-user.decorator";
import { JwtGqlGuard } from "src/common/guards/jwt-gql.guard";
import { AuthUser } from "src/common/models/auth-user.model";
import { Game } from "../domain/entities/game.entity";
import { GamesService } from "../domain/games.service";
import { ArrayOptions } from "./dto/array-options.dto";

@Resolver(() => Game)
export class GamesResolver {
  constructor(private readonly gamesService: GamesService) {}

  @Query(() => [Game])
  async findGames(@Args("arrayOptions") arrayOptions: ArrayOptions) {
    return await this.gamesService.find(arrayOptions);
  }

  @Query(() => [Game])
  @UseGuards(JwtGqlGuard)
  async findPlayedGames(
    @AuthenticatedUser() authUser: AuthUser,
    @Args("arrayOptions") arrayOptions: ArrayOptions,
  ) {
    return await this.gamesService.findPlayed(authUser, arrayOptions);
  }

  @Query(() => [Game])
  @UseGuards(JwtGqlGuard)
  async findPendingGames(
    @AuthenticatedUser() authUser: AuthUser,
    @Args("arrayOptions") arrayOptions: ArrayOptions,
  ) {
    return await this.gamesService.findPending(authUser, arrayOptions);
  }

  @Query(() => [String])
  async findTags() {
    return await this.gamesService.findTags();
  }

  @Query(() => [String])
  async findCompanies() {
    return await this.gamesService.findCompanies();
  }

  @Query(() => Game)
  async findGame(@Args("title") title: string) {
    return await this.gamesService.findOne(title);
  }
}

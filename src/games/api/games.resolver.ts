import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthenticatedUser } from "backend-common";
import { JwtGqlGuard } from "backend-common";
import { AuthUser } from "backend-common";
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

  @Mutation(() => Game)
  @UseGuards(JwtGqlGuard)
  async addGameToPlayed(
    @AuthenticatedUser() authUser: AuthUser,
    @Args("title") title: string,
  ) {
    return await this.gamesService.updateToPlayed(authUser, title);
  }

  @Mutation(() => Game)
  @UseGuards(JwtGqlGuard)
  async addGameToPending(
    @AuthenticatedUser() authUser: AuthUser,
    @Args("title") title: string,
  ) {
    return await this.gamesService.updateToPending(authUser, title);
  }

  @Mutation(() => Game)
  @UseGuards(JwtGqlGuard)
  async removeGameFromPlayed(
    @AuthenticatedUser() authUser: AuthUser,
    @Args("title") title: string,
  ) {
    return await this.gamesService.removeFromPlayed(authUser, title);
  }

  @Mutation(() => Game)
  @UseGuards(JwtGqlGuard)
  async removeGameFromPending(
    @AuthenticatedUser() authUser: AuthUser,
    @Args("title") title: string,
  ) {
    return await this.gamesService.removeFromPending(authUser, title);
  }

  @Mutation(() => Game)
  @UseGuards(JwtGqlGuard)
  async moveGameToPlayed(
    @AuthenticatedUser() authUser: AuthUser,
    @Args("title") title: string,
  ) {
    return await this.gamesService.moveToPlayed(authUser, title);
  }
}

import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import {
  AuthenticatedUser,
  CommonConstants,
  Roles,
  RolesGqlGuard,
} from "backend-common";
import { JwtGqlGuard } from "backend-common";
import { AuthUser } from "backend-common";
import { Game } from "../domain/entities/game.entity";
import { GamesService } from "../domain/games.service";
import { CreateGameDto } from "./dto/create-game.dto";
import { GameOptions } from "./dto/game-options";

@Resolver(() => Game)
export class GamesResolver {
  constructor(private readonly gamesService: GamesService) {}

  @Mutation(() => Game)
  @Roles(CommonConstants.ADMIN_ROLE)
  @UseGuards(JwtGqlGuard, RolesGqlGuard)
  async createGame(@Args("createGameDto") createGameDto: CreateGameDto) {
    return await this.gamesService.create(createGameDto);
  }

  @Mutation(() => Game)
  @Roles(CommonConstants.ADMIN_ROLE)
  @UseGuards(JwtGqlGuard, RolesGqlGuard)
  async deleteGame(@Args("title") title: string) {
    return await this.gamesService.deleteOne(title);
  }

  @Query(() => [Game])
  async findGames(@Args("gameOptions") gameOptions: GameOptions) {
    return await this.gamesService.find(gameOptions);
  }

  @Query(() => [Game])
  @UseGuards(JwtGqlGuard)
  async findPlayedGames(
    @AuthenticatedUser() authUser: AuthUser,
    @Args("gameOptions") gameOptions: GameOptions,
  ) {
    return await this.gamesService.findPlayed(authUser, gameOptions);
  }

  @Query(() => [Game])
  @UseGuards(JwtGqlGuard)
  async findPendingGames(
    @AuthenticatedUser() authUser: AuthUser,
    @Args("gameOptions") gameOptions: GameOptions,
  ) {
    return await this.gamesService.findPending(authUser, gameOptions);
  }

  @Query(() => [String])
  async findGameModes() {
    return await this.gamesService.findGameModes();
  }

  @Query(() => [String])
  async findGenres() {
    return await this.gamesService.findGenres();
  }

  @Query(() => [String])
  async findPlatforms() {
    return await this.gamesService.findPlatforms();
  }

  @Query(() => [String])
  async findPlayerPerspectives() {
    return await this.gamesService.findPlayerPerspectives();
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

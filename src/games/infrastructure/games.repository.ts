import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, SortOrder } from "mongoose";
import { CommonConstants, Pagination } from "backend-common";
import { Game, GameDocument } from "../domain/entities/game.entity";
import { ClientKafka } from "@nestjs/microservices";

@Injectable()
export class GamesRepository {
  constructor(
    @Inject("KAFKA") private readonly kafka: ClientKafka,
    @InjectModel(Game.name)
    private gameModel: Model<GameDocument>,
  ) {}

  async create(game: Game): Promise<Game> {
    try {
      const createdGame = await this.gameModel.create(game);

      this.kafka.emit(CommonConstants.GAME_CREATED_EVENT, createdGame.toJSON());

      return createdGame;
    } catch (e) {
      throw new ConflictException();
    }
  }

  async find(
    page: Pagination,
    filter?: Record<string, unknown>,
    sort?: { [key: string]: SortOrder },
  ): Promise<Game[]> {
    return await this.gameModel
      .find(filter)
      .skip(page.skip)
      .limit(page.limit)
      .sort(sort);
  }

  async findTags(): Promise<string[]> {
    return await this.gameModel.distinct("tags");
  }

  async findCompanies(): Promise<string[]> {
    return await this.gameModel.distinct("company");
  }

  async findOne(filter: Record<string, unknown>): Promise<Game> {
    const game = await this.gameModel.findOne(filter);

    if (!game) {
      throw new NotFoundException();
    }

    return game;
  }

  async updateOne(
    filter: Record<string, unknown>,
    updateInfo: Record<string, unknown>,
  ): Promise<Game> {
    const game = await this.gameModel.findOneAndUpdate(filter, updateInfo, {
      new: true,
    });

    if (!game) {
      throw new NotFoundException();
    }

    return game;
  }
}

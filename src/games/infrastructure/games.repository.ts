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

  async deleteOne(filter: Record<string, unknown>): Promise<Game> {
    const game = await this.gameModel.findOneAndDelete(filter);

    if (!game) {
      throw new NotFoundException();
    }

    this.kafka.emit(CommonConstants.GAME_DELETED_EVENT, game.toJSON());

    return game;
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

  async findGameModes(): Promise<string[]> {
    return await this.gameModel.distinct("gameModes");
  }

  async findGenres(): Promise<string[]> {
    return await this.gameModel.distinct("genres");
  }

  async findPlatforms(): Promise<string[]> {
    return await this.gameModel.distinct("platforms");
  }

  async findPlayerPerspectives(): Promise<string[]> {
    return await this.gameModel.distinct("playerPerspectives");
  }

  async findDevelopers(): Promise<string[]> {
    return await this.gameModel.distinct("developer");
  }

  async findPublishers(): Promise<string[]> {
    return await this.gameModel.distinct("publisher");
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
    const session = await this.gameModel.startSession();

    session.startTransaction();

    const oldGame = await this.gameModel
      .findOneAndUpdate(filter, updateInfo)
      .session(session);
    const newGame = await this.gameModel.findOne(filter).session(session);

    await session.commitTransaction();

    if (!oldGame || !newGame) {
      throw new NotFoundException();
    }

    this.kafka.emit(CommonConstants.GAME_UPDATED_EVENT, {
      oldReview: oldGame.toJSON(),
      newReview: newGame.toJSON(),
    });

    return newGame;
  }

  async createOrUpdate(
    filter: Record<string, unknown>,
    updateInfo: Record<string, unknown>,
  ): Promise<Game> {
    const session = await this.gameModel.startSession();

    session.startTransaction();

    const oldGame = await this.gameModel
      .findOneAndUpdate(filter, updateInfo, { upsert: true })
      .session(session);
    const newGame = await this.gameModel.findOne(filter).session(session);

    await session.commitTransaction();

    if (!oldGame) {
      this.kafka.emit(CommonConstants.GAME_CREATED_EVENT, newGame.toJSON());
    } else {
      this.kafka.emit(CommonConstants.GAME_UPDATED_EVENT, {
        oldReview: oldGame.toJSON(),
        newReview: newGame.toJSON(),
      });
    }

    return newGame;
  }
}

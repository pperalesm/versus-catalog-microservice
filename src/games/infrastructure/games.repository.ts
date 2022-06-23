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
      oldGame: oldGame.toJSON(),
      newGame: newGame.toJSON(),
    });

    return newGame;
  }

  async createOrUpdate(
    filter: Record<string, unknown>,
    updateInfo: Record<string, unknown>,
  ): Promise<Game> {
    let oldGame: GameDocument;
    let newGame: GameDocument;

    let titleCounter = 0;
    let trying = true;
    while (trying) {
      const session = await this.gameModel.startSession();
      try {
        session.startTransaction();
        oldGame = await this.gameModel
          .findOneAndUpdate(filter, updateInfo, { upsert: true })
          .session(session);
        newGame = await this.gameModel.findOne(filter).session(session);

        await session.commitTransaction();
        trying = false;
      } catch (e) {
        if (e.codeName != "WriteConflict" && e.codeName != "DuplicateKey") {
          console.error(e);
          trying = false;
        }
        if (e.codeName == "DuplicateKey") {
          let newTitle = updateInfo.title as string;
          const date = updateInfo.releaseDate
            ? (updateInfo.releaseDate as Date)
            : new Date(0, 0, 0);
          date.setDate(date.getDate() + titleCounter);
          if (titleCounter) {
            newTitle =
              newTitle.slice(0, newTitle.length - 13) +
              ` (${date.toISOString().slice(0, 10)})`;
          } else {
            newTitle = newTitle + ` (${date.toISOString().slice(0, 10)})`;
          }
          titleCounter += 1;
          updateInfo = {
            ...updateInfo,
            title: newTitle,
          };
        }
      } finally {
        session.endSession();
      }
    }

    if (!oldGame) {
      this.kafka.emit(CommonConstants.GAME_CREATED_EVENT, newGame.toJSON());
    } else {
      this.kafka.emit(CommonConstants.GAME_UPDATED_EVENT, {
        oldGame: oldGame.toJSON(),
        newGame: newGame.toJSON(),
      });
    }

    return newGame;
  }
}

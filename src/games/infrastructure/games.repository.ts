import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model, SortOrder } from "mongoose";
import {
  CommonConstants,
  CreatedEvent,
  DeletedEvent,
  Pagination,
  UpdatedEvent,
} from "backend-common";
import { Game, GameDocument } from "../domain/entities/game.entity";
import { ClientKafka } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

@Injectable()
export class GamesRepository {
  constructor(
    @Inject("KAFKA") private readonly kafka: ClientKafka,
    @InjectConnection() private connection: Connection,
    @InjectModel(Game.name)
    private gameModel: Model<GameDocument>,
  ) {}

  async create(game: Game): Promise<Game> {
    let createdGame: GameDocument;

    await this.connection.transaction(async (session) => {
      try {
        [createdGame] = await this.gameModel.create([game], {
          session: session,
        });
      } catch (e) {
        throw new ConflictException();
      }

      await firstValueFrom(
        this.kafka.emit(CommonConstants.GAMES_TOPIC, {
          key: createdGame.id,
          value: new CreatedEvent(createdGame),
        }),
      );
    });

    return createdGame;
  }

  async deleteOne(filter: Record<string, unknown>): Promise<Game> {
    let game: GameDocument;

    await this.connection.transaction(async (session) => {
      game = await this.gameModel.findOneAndDelete(filter).session(session);

      if (!game) {
        throw new NotFoundException();
      }

      await firstValueFrom(
        this.kafka.emit(CommonConstants.GAMES_TOPIC, {
          key: game.id,
          value: new DeletedEvent(game),
        }),
      );
    });

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
    let oldGame: GameDocument;
    let newGame: GameDocument;

    await this.connection.transaction(async (session) => {
      oldGame = await this.gameModel
        .findOneAndUpdate(filter, updateInfo)
        .session(session);
      newGame = await this.gameModel.findOne(filter).session(session);

      if (!oldGame || !newGame) {
        throw new NotFoundException();
      }

      await firstValueFrom(
        this.kafka.emit(CommonConstants.GAMES_TOPIC, {
          key: newGame.id,
          value: new UpdatedEvent(oldGame, newGame),
        }),
      );
    });

    return newGame;
  }

  async createOrUpdate(
    filter: Record<string, unknown>,
    updateInfo: Record<string, unknown>,
  ): Promise<Game> {
    let oldGame: GameDocument;
    let newGame: GameDocument;

    await this.connection.transaction(async (session) => {
      oldGame = await this.gameModel
        .findOneAndUpdate(filter, updateInfo, { upsert: true })
        .session(session);
      newGame = await this.gameModel.findOne(filter).session(session);

      if (!oldGame) {
        await firstValueFrom(
          this.kafka.emit(CommonConstants.GAMES_TOPIC, {
            key: newGame.id,
            value: new CreatedEvent(newGame),
          }),
        );
      } else {
        await firstValueFrom(
          this.kafka.emit(CommonConstants.GAMES_TOPIC, {
            key: newGame.id,
            value: new UpdatedEvent(oldGame, newGame),
          }),
        );
      }
    });

    return newGame;
  }
}

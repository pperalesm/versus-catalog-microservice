import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { BrokerEvent, BrokerEventDocument } from "backend-common";
import { Connection, Model } from "mongoose";
import { Game, GameDocument } from "src/games/domain/entities/game.entity";

@Injectable()
export class ReviewsRepository {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(BrokerEvent.name)
    private eventModel: Model<BrokerEventDocument>,
    @InjectModel(Game.name)
    private gameModel: Model<GameDocument>,
  ) {}

  async updateOne(
    gamesFilter: Record<string, unknown>,
    gamesUpdateInfo: Record<string, unknown>,
    uuid: string,
  ) {
    await this.connection.transaction(async (session) => {
      await Promise.all([
        this.eventModel.create([{ uuid: uuid }], {
          session: session,
        }),
        this.gameModel.updateOne(gamesFilter, gamesUpdateInfo).session(session),
      ]);
    });
  }
}

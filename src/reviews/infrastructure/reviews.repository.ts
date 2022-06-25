import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";
import { Game, GameDocument } from "src/games/domain/entities/game.entity";
import {
  ReviewEvent,
  ReviewEventDocument,
} from "../domain/entities/review-event.entity";

@Injectable()
export class ReviewsRepository {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(ReviewEvent.name)
    private eventModel: Model<ReviewEventDocument>,
    @InjectModel(Game.name)
    private gameModel: Model<GameDocument>,
  ) {}

  async updateOne(
    gamesFilter: Record<string, unknown>,
    gamesUpdateInfo: Record<string, unknown>,
    timestamp: string,
  ) {
    await this.connection.transaction(async (session) => {
      await this.eventModel.create([{ timestamp: timestamp }], {
        session: session,
      });
      await this.gameModel
        .updateOne(gamesFilter, gamesUpdateInfo)
        .session(session);
    });
  }
}

import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BrokerEvent, BrokerEventSchema } from "backend-common";
import { Game, GameSchema } from "src/games/domain/entities/game.entity";
import { ReviewsService } from "./domain/reviews.service";
import { ReviewsRepository } from "./infrastructure/reviews.repository";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BrokerEvent.name, schema: BrokerEventSchema },
    ]),
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
  ],
  providers: [ReviewsService, ReviewsRepository],
  exports: [ReviewsService, ReviewsRepository],
})
export class ReviewsModule {}

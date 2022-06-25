import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Game, GameSchema } from "src/games/domain/entities/game.entity";
import {
  ReviewEvent,
  ReviewEventSchema,
} from "./domain/entities/review-event.entity";
import { ReviewsService } from "./domain/reviews.service";
import { ReviewsRepository } from "./infrastructure/reviews.repository";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReviewEvent.name, schema: ReviewEventSchema },
    ]),
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
  ],
  providers: [ReviewsService, ReviewsRepository],
  exports: [ReviewsService, ReviewsRepository],
})
export class ReviewsModule {}

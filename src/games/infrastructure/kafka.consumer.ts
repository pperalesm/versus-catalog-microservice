import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { CommonConstants, KafkaEvent } from "backend-common";
import { GamesService } from "src/games/domain/games.service";
import { Review } from "../domain/vo/review.vo";

@Controller()
export class KafkaConsumer {
  constructor(private readonly gamesService: GamesService) {}

  @EventPattern(CommonConstants.REVIEWS_TOPIC)
  async handleReviewEvent(
    @Payload("value") data: KafkaEvent,
    @Payload("timestamp") eventId: string,
  ) {
    try {
      if (data.type == CommonConstants.CREATED_EVENT) {
        await this.gamesService.reviewCreated(
          new Review({ ...data.payload.item }),
        );
      } else if (data.type == CommonConstants.DELETED_EVENT) {
        await this.gamesService.reviewDeleted(
          new Review({ ...data.payload.item }),
        );
      } else if (data.type == CommonConstants.UPDATED_EVENT) {
        await this.gamesService.reviewUpdated(
          new Review({ ...data.payload.oldItem }),
          new Review({ ...data.payload.newItem }),
        );
      }
    } catch (e) {
      console.error(e);
    }
  }
}

import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { CommonConstants } from "backend-common";
import { GamesService } from "src/games/domain/games.service";
import { Review } from "../domain/vo/review.vo";

@Controller()
export class KafkaConsumer {
  constructor(private readonly gamesService: GamesService) {}

  @EventPattern(CommonConstants.REVIEW_CREATED_EVENT)
  async handleReviewCreated(data: Record<string, any>) {
    try {
      await this.gamesService.reviewCreated(new Review({ ...data.value }));
    } catch (e) {
      console.error(e);
    }
  }

  @EventPattern(CommonConstants.REVIEW_DELETED_EVENT)
  async handleReviewDeleted(data: Record<string, any>) {
    try {
      await this.gamesService.reviewDeleted(new Review({ ...data.value }));
    } catch (e) {
      console.error(e);
    }
  }

  @EventPattern(CommonConstants.REVIEW_UPDATED_EVENT)
  async handleReviewUpdated(data: Record<string, any>) {
    try {
      await this.gamesService.reviewUpdated(
        new Review({ ...data.value.oldReview }),
        new Review({ ...data.value.newReview }),
      );
    } catch (e) {
      console.error(e);
    }
  }
}

import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { CommonConstants, KafkaEvent } from "backend-common";
import { ReviewsService } from "src/reviews/domain/reviews.service";
import { Review } from "src/reviews/domain/vo/review.vo";

@Controller()
export class KafkaConsumer {
  constructor(private readonly reviewsService: ReviewsService) {}

  @EventPattern(CommonConstants.REVIEWS_TOPIC)
  async handleReviewEvent(@Payload("value") data: KafkaEvent) {
    try {
      if (data.type == CommonConstants.CREATED_EVENT) {
        await this.reviewsService.handleCreated(
          new Review({ ...data.payload.item }),
          data.uuid,
        );
      } else if (data.type == CommonConstants.DELETED_EVENT) {
        await this.reviewsService.handleDeleted(
          new Review({ ...data.payload.item }),
          data.uuid,
        );
      } else if (data.type == CommonConstants.UPDATED_EVENT) {
        await this.reviewsService.handleUpdated(
          new Review({ ...data.payload.oldItem }),
          new Review({ ...data.payload.newItem }),
          data.uuid,
        );
      }
    } catch (e) {
      console.error(e);
    }
  }
}

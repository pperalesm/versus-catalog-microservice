import { Injectable } from "@nestjs/common";
import { ReviewsRepository } from "../infrastructure/reviews.repository";
import { Review } from "./vo/review.vo";

@Injectable()
export class ReviewsService {
  constructor(private readonly reviewsRepository: ReviewsRepository) {}

  async handleCreated(review: Review, uuid: string) {
    const ratingInc = {};
    const payToWinInc = {};

    if (review.rating) {
      ratingInc["ratingDistribution." + (review.rating - 1)] = 1;
    }

    if (review.payToWin) {
      payToWinInc["payToWinDistribution." + (review.payToWin - 1)] = 1;
    }

    await this.reviewsRepository.updateOne(
      { title: review.game },
      { $inc: { popularity: 1, ...ratingInc, ...payToWinInc } },
      uuid,
    );
  }

  async handleDeleted(review: Review, uuid: string) {
    const ratingDec = {};
    const payToWinDec = {};

    if (review.rating) {
      ratingDec["ratingDistribution." + (review.rating - 1)] = -1;
    }

    if (review.payToWin) {
      payToWinDec["payToWinDistribution." + (review.payToWin - 1)] = -1;
    }

    await this.reviewsRepository.updateOne(
      { title: review.game },
      { $inc: { popularity: -1, ...ratingDec, ...payToWinDec } },
      uuid,
    );
  }

  async handleUpdated(oldReview: Review, newReview: Review, uuid: string) {
    const ratingDec = {};
    const ratingInc = {};
    const payToWinDec = {};
    const payToWinInc = {};

    if (oldReview.rating) {
      ratingDec["ratingDistribution." + (oldReview.rating - 1)] = -1;
    }
    if (newReview.rating) {
      ratingInc["ratingDistribution." + (newReview.rating - 1)] = 1;
    }
    if (oldReview.payToWin) {
      payToWinDec["payToWinDistribution." + (oldReview.payToWin - 1)] = -1;
    }
    if (newReview.payToWin) {
      payToWinInc["payToWinDistribution." + (newReview.payToWin - 1)] = 1;
    }

    if (
      oldReview.rating != newReview.rating ||
      oldReview.payToWin != newReview.payToWin
    ) {
      await this.reviewsRepository.updateOne(
        { title: oldReview.game },
        {
          $inc: { ...ratingDec, ...payToWinDec, ...ratingInc, ...payToWinInc },
        },
        uuid,
      );
    }
  }
}

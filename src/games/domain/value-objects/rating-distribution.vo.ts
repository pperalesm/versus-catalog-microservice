import { Prop } from "@nestjs/mongoose";

export class RatingDistribution {
  @Prop()
  ones: number = 0;

  @Prop()
  twos: number = 0;

  @Prop()
  threes: number = 0;

  @Prop()
  fours: number = 0;

  @Prop()
  fives: number = 0;
}

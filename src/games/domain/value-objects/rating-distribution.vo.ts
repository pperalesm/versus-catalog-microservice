import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Prop } from "@nestjs/mongoose";

@ObjectType()
export class RatingDistribution {
  @Field(() => Int)
  @Prop()
  ones: number = 0;

  @Field(() => Int)
  @Prop()
  twos: number = 0;

  @Field(() => Int)
  @Prop()
  threes: number = 0;

  @Field(() => Int)
  @Prop()
  fours: number = 0;

  @Field(() => Int)
  @Prop()
  fives: number = 0;

  constructor(
    ones: number,
    twos: number,
    threes: number,
    fours: number,
    fives: number,
  ) {
    this.ones = ones;
    this.twos = twos;
    this.threes = threes;
    this.fours = fours;
    this.fives = fives;
  }
}

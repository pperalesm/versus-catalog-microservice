import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { RatingDistribution } from "../value-objects/rating-distribution.vo";

@ObjectType()
@Schema()
export class Game {
  id?: string;

  @Field()
  @Prop({ unique: true })
  title?: string;

  @Field()
  @Prop()
  description?: string;

  @Field()
  @Prop()
  company?: string;

  @Field(() => Int)
  @Prop()
  yearReleased?: number;

  @Field()
  @Prop()
  image?: string;

  @Field(() => [String])
  @Prop([String])
  tags?: string[];

  @Prop([String])
  playedBy?: string[];

  @Prop([String])
  pendingBy?: string[];

  @Field(() => RatingDistribution)
  @Prop(RatingDistribution)
  ratingDistribution?: RatingDistribution;

  @Field(() => Float, { nullable: true })
  @Prop()
  averageRating?: number;

  @Field(() => Float, { nullable: true })
  @Prop()
  averagePayToWin?: number;

  @Field(() => Int)
  @Prop()
  popularity?: number;

  constructor({
    id,
    title,
    description,
    company,
    yearReleased,
    image,
    tags,
    playedBy,
    pendingBy,
    ratingDistribution,
    averageRating,
    averagePayToWin,
    popularity,
  }: {
    id?: string;
    title?: string;
    description?: string;
    company?: string;
    yearReleased?: number;
    image?: string;
    tags?: string[];
    playedBy?: string[];
    pendingBy?: string[];
    ratingDistribution?: RatingDistribution;
    averageRating?: number;
    averagePayToWin?: number;
    popularity?: number;
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.company = company;
    this.yearReleased = yearReleased;
    this.image = image;
    this.tags = tags;
    this.playedBy = playedBy;
    this.pendingBy = pendingBy;
    this.ratingDistribution = ratingDistribution;
    this.averageRating = averageRating;
    this.averagePayToWin = averagePayToWin;
    this.popularity = popularity;
  }
}

export type GameDocument = Game & Document;

export const GameSchema = SchemaFactory.createForClass(Game);

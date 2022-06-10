import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { RatingDistribution } from "../value-objects/rating-distribution.vo";

@ObjectType()
@Schema({ timestamps: true })
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
  playedUsernames?: string[];

  @Prop([String])
  pendingUsernames?: string[];

  @Field(() => RatingDistribution)
  @Prop(RatingDistribution)
  ratingDistribution?: RatingDistribution;

  @Field(() => Float)
  @Prop()
  averageRating?: number;

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
    playedUsernames,
    pendingUsernames,
    ratingDistribution,
    averageRating,
    popularity,
  }: {
    id?: string;
    title?: string;
    description?: string;
    company?: string;
    yearReleased?: number;
    image?: string;
    tags?: string[];
    playedUsernames?: string[];
    pendingUsernames?: string[];
    ratingDistribution?: RatingDistribution;
    averageRating?: number;
    popularity?: number;
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.company = company;
    this.yearReleased = yearReleased;
    this.image = image;
    this.tags = tags;
    this.playedUsernames = playedUsernames;
    this.pendingUsernames = pendingUsernames;
    this.ratingDistribution = ratingDistribution;
    this.averageRating = averageRating;
    this.popularity = popularity;
  }
}

export type GameDocument = Game & Document;

export const GameSchema = SchemaFactory.createForClass(Game);

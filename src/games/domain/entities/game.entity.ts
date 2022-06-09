import { Field, Int, ObjectType } from "@nestjs/graphql";
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

  @Prop(RatingDistribution)
  ratingDistribution?: RatingDistribution;

  @Prop()
  averageRating?: number;

  @Prop()
  popularity?: number;

  @Field()
  createdAt?: Date;

  @Field()
  updatedAt?: Date;

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
    createdAt,
    updatedAt,
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
    createdAt?: Date;
    updatedAt?: Date;
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
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export type GameDocument = Game & Document;

export const GameSchema = SchemaFactory.createForClass(Game);

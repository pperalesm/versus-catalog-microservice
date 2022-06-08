import { Field, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@ObjectType()
@Schema({ timestamps: true })
export class Game {
  id?: string;

  @Field()
  @Prop({ unique: true })
  email?: string;

  @Field()
  @Prop({ unique: true })
  username?: string;

  @Prop()
  password?: string;

  @Field()
  @Prop()
  role?: string;

  @Field()
  @Prop()
  active?: boolean;

  @Field()
  @Prop()
  avatarPath?: string;

  @Field()
  createdAt?: Date;

  @Field()
  updatedAt?: Date;

  @Prop()
  token?: string;

  constructor({
    id,
    email,
    username,
    password,
    role,
    active,
    avatarPath,
    createdAt,
    updatedAt,
    token,
  }: {
    id?: string;
    email?: string;
    username?: string;
    password?: string;
    role?: string;
    active?: boolean;
    avatarPath?: string;
    createdAt?: Date;
    updatedAt?: Date;
    token?: string;
  }) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.password = password;
    this.role = role;
    this.active = active;
    this.avatarPath = avatarPath;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.token = token;
  }
}

export type GameDocument = Game & Document;

export const GameSchema = SchemaFactory.createForClass(Game);

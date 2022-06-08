import { Field, ObjectType } from "@nestjs/graphql";
import { Account } from "src/accounts/domain/entities/account.entity";

@ObjectType()
export class LoginResponseDto {
  @Field()
  token?: string;

  @Field()
  account?: Account;

  constructor({ token, account }: { token?: string; account?: Account }) {
    this.token = token;
    this.account = account;
  }
}

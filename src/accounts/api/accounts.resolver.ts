import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { AccountsService } from "../domain/accounts.service";
import { Account } from "../domain/entities/account.entity";
import { CreateAccountDto } from "./dto/create-account.dto";
import { ActivateAccountDto } from "./dto/activate-account.dto";
import { LoginDto } from "./dto/login.dto";
import { LoginResponseDto } from "./dto/login-response.dto";
import { UseGuards } from "@nestjs/common";
import { JwtGqlGuard } from "src/common/guards/jwt-gql.guard";
import { ThrottlerGqlGuard } from "src/common/guards/throttler-gql.guard";
import { AuthenticatedUser } from "src/common/decorators/current-user.decorator";
import { AuthUser } from "src/common/models/auth-user.model";
import { ResetPasswordDto } from "./dto/reset-password.dto";

@Resolver(() => Account)
export class AccountsResolver {
  constructor(private readonly accountsService: AccountsService) {}

  @Mutation(() => Account)
  @UseGuards(ThrottlerGqlGuard)
  async createAccount(
    @Args("createAccountDto") createAccountInput: CreateAccountDto,
  ) {
    return await this.accountsService.create(createAccountInput);
  }

  @Mutation(() => Account)
  @UseGuards(ThrottlerGqlGuard)
  async activateAccount(
    @Args("activateAccountDto") activateAccountDto: ActivateAccountDto,
  ) {
    return await this.accountsService.activate(activateAccountDto);
  }

  @Query(() => LoginResponseDto)
  @UseGuards(ThrottlerGqlGuard)
  async login(@Args("loginDto") loginDto: LoginDto) {
    return await this.accountsService.login(loginDto);
  }

  @Query(() => Account)
  @UseGuards(JwtGqlGuard)
  async findAccount(
    @AuthenticatedUser() authUser: AuthUser,
    @Args("username") username: string,
  ) {
    return await this.accountsService.findOne(username);
  }

  @Mutation(() => Account)
  @UseGuards(JwtGqlGuard)
  async removeAccount(@AuthenticatedUser() authUser: AuthUser) {
    return await this.accountsService.remove(authUser.id);
  }

  @Query(() => Boolean)
  @UseGuards(ThrottlerGqlGuard)
  async forgotPassword(@Args("email") email: string) {
    return await this.accountsService.forgotPassword(email);
  }

  @Mutation(() => Account)
  @UseGuards(ThrottlerGqlGuard)
  async resetPassword(
    @Args("resetPasswordDto") resetPasswordDto: ResetPasswordDto,
  ) {
    return await this.accountsService.resetPassword(resetPasswordDto);
  }

  @Query(() => Boolean)
  async checkUsername(@Args("username") username: string) {
    return await this.accountsService.checkUsername(username);
  }
}

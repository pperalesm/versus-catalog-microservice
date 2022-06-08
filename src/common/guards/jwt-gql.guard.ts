import { ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtGqlGuard extends AuthGuard("jwt") {
  getRequest(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context);

    return gqlContext.getContext().req;
  }
}

import { ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { ThrottlerGuard } from "@nestjs/throttler";

@Injectable()
export class ThrottlerGqlGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context);

    return {
      req: gqlContext.getContext().req,
      res: gqlContext.getContext().res,
    };
  }
}

import { FieldMiddleware, MiddlewareContext, NextFn } from "@nestjs/graphql";

export const accountOwnership: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => {
  const value = await next();

  return ctx.context.req.user && ctx.source.id !== ctx.context.req.user.id
    ? null
    : value;
};

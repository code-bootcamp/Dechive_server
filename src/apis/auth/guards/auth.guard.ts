import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

export const DechiveAuthGuard = (name) => {
  return class dechiveAuthGuard extends AuthGuard(name) {
    getRequest(context: ExecutionContext) {
      const dechiveContext = GqlExecutionContext.create(context);
      return dechiveContext.getContext().req;
    }
  };
};

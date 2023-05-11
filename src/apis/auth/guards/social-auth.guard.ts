import { CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

const DYNAMIC_AUTH_GUARD = ['google', 'kakao', 'naver'].reduce((prev, cur) => {
  return { ...prev, [cur]: new (class extends AuthGuard(cur) {})() };
}, {});

export class SocialAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const { social } = context.switchToHttp().getRequest().params;
    return DYNAMIC_AUTH_GUARD[social].canActivate(context);
  }
}

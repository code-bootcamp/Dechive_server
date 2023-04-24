import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { IAuthUser } from 'src/commons/interfaces/context';
import { AuthService } from './auth.service';
import { SocialAuthGuard } from './guards/social-auth.guard';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService, //
  ) {}

  @Get('/graphql/login/:social')
  @UseGuards(SocialAuthGuard)
  loginOAuth(
    @Req() req: Request & IAuthUser, //
    @Res() res: Response,
  ) {
    return this.authService.socialLogin({ req, res });
  }
}

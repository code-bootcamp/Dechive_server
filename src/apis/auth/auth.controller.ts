import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { IAuthUser } from 'src/commons/interfaces/context';
import { IProvider } from 'src/commons/interfaces/provider';
import { AuthService } from './auth.service';
import { SocialAuthGuard } from './guards/social-auth.guard';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService, //
  ) {}

  @Get('login/:social')
  @UseGuards(SocialAuthGuard)
  loginOAuth(
    @Req() req: Request & IAuthUser & IProvider, //
    @Res() res: Response,
  ): Promise<void> {
    return this.authService.socialLogin({
      req,
      res,
      provider: req.params.social,
    });
  }
}

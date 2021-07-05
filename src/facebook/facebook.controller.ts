import { Controller, Get, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { FacebookService } from './facebook.service';

@Controller('facebook')
export class FacebookController {

    constructor(private facebookService: FacebookService) {}

    @Get('/login')
    @UseGuards(AuthGuard("facebook"))
    async facebookLogin(): Promise<any> {
        return HttpStatus.OK
    }

    @Get('/redirect')
    @UseGuards(AuthGuard("facebook"))
    facebookLoginRedirect(@Req() req): Promise<any> {
        return this.facebookService.facebookLogin(req);
    }
}

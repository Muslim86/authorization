import { Controller, Get, HttpStatus, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { FacebookService } from './facebook.service';

@ApiTags('Фейсбук аутентификация')
@Controller('facebook')
export class FacebookController {

    constructor(private facebookService: FacebookService) {}

    @ApiOperation({summary:'Аутентификация пользователя'})
    @Get()
    @UseGuards(AuthGuard("facebook"))
    async facebookLogin(): Promise<any> {
        return HttpStatus.OK
    }

    @ApiOperation({summary:'Переадресация пользователя'})
    @Get('/redirect')
    @UseGuards(AuthGuard("facebook"))
    async facebookLoginRedirect(@Req() req: any, @Res({passthrough: true}) res: Response): Promise<any> {
        const user = await this.facebookService.facebookLogin(req);
        res.cookie('refreshToken', user['refreshToken'], {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
        return user
    }
}

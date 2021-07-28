import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response} from 'express';

import { GoogleService } from './google.service';

@ApiTags('Гугл аутентификация')
@Controller('google')
export class GoogleController {
    constructor(private readonly googleService: GoogleService) {}

    @ApiOperation({summary:'Аутентификация гугл пользователя'})
    @Get()
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) {}

    @ApiOperation({summary:'Переадресация пользователя'})
    @Get('redirect')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req: any, @Res({passthrough: true}) res: Response): Promise<any> {
        const user = await this.googleService.googleLogin(req);
        res.cookie('accessToken', user['accessToken'], {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
        return user
    }
}
import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

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
    googleAuthRedirect(@Req() req) {
        return this.googleService.googleLogin(req)
    }
}

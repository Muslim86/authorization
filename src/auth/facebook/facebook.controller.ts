import { Controller, Get, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

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
    facebookLoginRedirect(@Req() req): Promise<any> {
        return this.facebookService.facebookLogin(req);
    }
}

import { Controller, Get, HttpStatus, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { VkontakteService } from './vkontakte.service';

@ApiTags('Вконтакте аутентификация')
@Controller('vk')
export class VkontakteController {

    constructor(private vkontakteService: VkontakteService) {}

    @ApiOperation({summary:'Аутентификация пользователя'})
    @Get()
    @UseGuards(AuthGuard("vkontakte"))
    async vkLogin(): Promise<any> {
        return HttpStatus.OK
    }

    @ApiOperation({summary:'Переадресация пользователя'})
    @Get('/redirect')
    @UseGuards(AuthGuard("vkontakte"))
    async vkLoginRedirect(@Req() req: any, @Res({passthrough: true}) res: Response): Promise<any> {
        const user = await this.vkontakteService.vkLogin(req);
        res.cookie('accessToken', user['accessToken'], {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
        return user
    }
}

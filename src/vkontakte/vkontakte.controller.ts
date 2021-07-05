import { Controller, Get, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

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
    vkLoginRedirect(@Req() req: any): Promise<any> {
        return this.vkontakteService.vkLogin(req);
    }
}

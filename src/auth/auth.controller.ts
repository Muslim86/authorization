import { Body, Controller, Post, Res, HttpStatus, Req, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';

import { ValidationPipe } from 'src/pipes/validation.pipe';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('Авторизация')
@Controller('/auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @ApiOperation({summary:'Авторизация пользователя'})
    @Post('/login')
    async login(@Body() userDto: CreateUserDto, @Res({passthrough: true}) res: Response) {
        const data = this.authService.login(userDto);
        res.cookie('refreshToken', (await data).ref, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
        return data;
    }

    @ApiOperation({summary:'Логаут пользователя'})
    @Post('/logout')
    async logout(@Req() request: Request, @Res({passthrough: true}) res: Response) {
        const {refreshToken} = request.cookies;
        const token = await this.authService.logout(refreshToken);
        res.clearCookie('refreshToken');
        return HttpStatus.OK
    }

    @ApiOperation({summary:'Регистрация пользователя'})
    @UsePipes(ValidationPipe)
    @Post('/registration')
    async registration(@Body() userDto: CreateUserDto, @Res({passthrough: true}) res: Response) {
        const data = this.authService.registration(userDto);
        res.cookie('refreshToken', (await data).ref, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
        return data
    }

    @ApiOperation({summary:'Обновление токенов'})
    @Post('/refresh')
    async refresh(@Req() request: Request, @Res({passthrough: true}) res: Response) {
        const {refreshToken} = request.cookies;
        const data = this.authService.refresh(refreshToken);
        res.cookie('refreshToken', (await data).ref, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
        return data;
    }

}

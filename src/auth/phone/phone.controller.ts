import {Body, Controller, Post, Res, HttpStatus, Req, UsePipes, Put, Get} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';

import { ValidationPipe } from 'src/pipes/validation.pipe';
import { AuthService } from '../auth.service';
import { CreateNumberUserDto } from '../dto/create-number-user.dto';
import { NumberUserDto } from '../dto/number-user.dto';
import {LoginNumberUserDto} from "../dto/login-number-user.dto";

@ApiTags('Регистрация по номеру')
@Controller('phone')
export class PhoneController {

    constructor(private authService: AuthService) {}

    @ApiOperation({summary:'Регистрация пользователя'})
    @UsePipes(ValidationPipe)
    @Post('/registration')
    async registration(@Body() userDto: CreateNumberUserDto, @Res({passthrough: true}) res: Response) {
        await this.authService.registrationPhone(userDto);
        return HttpStatus.OK;
    }

    @ApiOperation({summary:'Предавторизация пользователя'})
    @Post('/check')
    async checkLogin(@Body() userDto: NumberUserDto) {
        await this.authService.loginPhoneStepOne(userDto);
        return HttpStatus.OK;
    }

    @ApiOperation({summary:'Авторизация пользователя'})
    @Post('/login')
    async login(@Body() userDto: LoginNumberUserDto, @Res({passthrough: true}) res: Response) {
        const data = this.authService.loginPhoneStepTwo(userDto);
        res.cookie('accessToken', (await data).acc, {maxAge: 30 * 60 * 1000, httpOnly: true});
        return data;
    }

    @ApiOperation({summary:'Логаут пользователя'})
    @Get('/logout')
    async logout(@Req() request: Request, @Res({passthrough: true}) res: Response) {
        const {accessToken, refreshToken} = request.cookies;
        const token = await this.authService.logout(accessToken);
        res.clearCookie('accessToken', 'refreshToken');
        return HttpStatus.OK;
    }
}

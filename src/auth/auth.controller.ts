import {
    Body,
    Controller,
    Post,
    Res,
    HttpStatus,
    Req,
    UsePipes,
    Get,
    Put,
    HttpException, UseGuards
} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import { Response, Request } from 'express';

import { ValidationPipe } from 'src/pipes/validation.pipe';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import {User} from "../users/users.model";
import {JwtAuthGuard} from "./jwt-auth.guard";

@ApiTags('Регистрация Email')
@Controller('/auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @ApiOperation({summary:'Регистрация пользователя'})
    @UsePipes(ValidationPipe)
    @Post('/registration')
    async registration(@Body() userDto: CreateUserDto, @Res({passthrough: true}) res: Response) {
        const data = this.authService.registration(userDto);
        res.cookie('accessToken', (await data).acc, {maxAge: 30 * 60 * 1000, httpOnly: true});
        return data
    }

    @ApiOperation({summary:'Авторизация пользователя'})
    @Post('/login')
    async login(@Body() userDto: CreateUserDto, @Res({passthrough: true}) res: Response) {
        const data = this.authService.login(userDto);
        res.cookie('accessToken', (await data).acc, {maxAge: 30 * 60 * 1000, httpOnly: true});
        return data;
    }

    @ApiOperation({summary:'Логаут пользователя'})
    @Get('/logout')
    async logout(@Req() request: Request, @Res({passthrough: true}) res: Response) {
        const {accessToken} = request.cookies;
        if (!accessToken) {
            throw new HttpException('cookie not found', 404)
        }
        res.clearCookie('accessToken');
        return HttpStatus.OK
    }

    @ApiOperation({summary:'Обновление токенов'})
    @Put('/refresh')
    async refresh(@Req() request: Request, @Res({passthrough: true}) res: Response) {
        const refreshToken = request.header("refreshToken");
        const data = this.authService.refresh(refreshToken);
        res.cookie('accessToken', (await data).acc, {maxAge: 30 * 60 * 1000, httpOnly: true});
        return data;
    }

    @ApiOperation({summary:'Получение пользователя'})
    @ApiResponse({status: 200, type: [User]})
    @UseGuards(JwtAuthGuard)
    @Get('/me')
    async getUser(@Req() request: Request) {
        const {accessToken} = request.cookies;
        if (!accessToken) {
            throw new HttpException('cookie not found', 404)
        }
        return await this.authService.getUserByAccessToken(accessToken);
    }
}

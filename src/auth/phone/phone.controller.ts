import { Body, Controller, Post, Res, HttpStatus, Req, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';

import { ValidationPipe } from 'src/pipes/validation.pipe';
import { AuthService } from '../auth.service';
import { CreateNumberUserDto } from '../dto/create-number-user.dto';
import { NumberUserDto } from '../dto/number-user.dto';

@ApiTags('Регистрация по номеру')
@Controller('phone')
export class PhoneController {

    constructor(private authService: AuthService) {}

    @Post('/check')
    async checkLogin(@Body() userDto: NumberUserDto) {
        const data = this.authService.loginPhoneStepOne(userDto);
        return data;
    }

    @ApiOperation({summary:'Авторизация пользователя'})
    @Post('/login')
    async login(@Body() userDto: CreateNumberUserDto, @Res({passthrough: true}) res: Response) {
        const data = this.authService.loginPhoneStepTwo(userDto);
        res.cookie('accesToken', (await data).acc, {maxAge: 30 * 60 * 1000, httpOnly: true});
        return data;
    }

    @ApiOperation({summary:'Логаут пользователя'})
    @Post('/logout')
    async logout(@Req() request: Request, @Res({passthrough: true}) res: Response) {
        const {accesToken, refreshToken} = request.cookies;
        const token = await this.authService.logout(accesToken);
        res.clearCookie('accesToken', 'refreshToken');
        return HttpStatus.OK
    }

    @ApiOperation({summary:'Регистрация пользователя'})
    @UsePipes(ValidationPipe)
    @Post('/registration')
    async registration(@Body() userDto: CreateNumberUserDto, @Res({passthrough: true}) res: Response) {
        const data = this.authService.registrationPhone(userDto);
        return data
    }

    @ApiOperation({summary:'Обновление токенов'})
    @Post('/refresh')
    async refresh(@Req() request: Request, @Res({passthrough: true}) res: Response) {
        const refreshToken = request.header("refreshToken");
        const data = this.authService.refresh(refreshToken);
        res.cookie('accesToken', (await data).acc, {maxAge: 30 * 60 * 1000, httpOnly: true});
        return data;
    }
    
}

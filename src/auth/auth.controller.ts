import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';

@ApiTags('Авторизация')
@Controller('/auth')
export class AuthController {

    constructor(private authSetvice: AuthService) {}

    @ApiOperation({summary:'Авторизация пользователя'})
    @Post('/login')
    login(@Body() userDto: CreateUserDto) {
        return this.authSetvice.login(userDto);
    }

    @ApiOperation({summary:'Регистрация пользователя'})
    @Post('/registration')
    registration(@Body() userDto: CreateUserDto) {
        return this.authSetvice.registration(userDto);
    }
}

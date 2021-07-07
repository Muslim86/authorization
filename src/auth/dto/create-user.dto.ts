import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";


export class CreateUserDto {
    @ApiProperty({example:'user@mail.ru', description:'Логин/почта пользователя'})
    @IsString({message: 'Должно быть строкой'})
    @IsEmail({})
    @Length(1, 255, {message: 'Не менее 1 и не более 255 символов'})
    readonly login: string;

    @ApiProperty({example:'qwerty123', description:'Пароль пользователя'})
    @IsString({message: 'Должно быть строкой'})
    @Length(6, 255, {message: 'Не менее 6 и не более 255 символов'})
    readonly password: string;

    @ApiProperty({example:'Email', description:'Тип аккаунта'})
    @IsString({message: 'Должно быть строкой'})
    @Length(1, 255, {message: 'Не менее 1 и не более 255 символов'})
    readonly typeAccount?: string;

    @ApiProperty({example:'Вася Пупкин', description:'Имя пользователя'})
    @IsString({message: 'Должно быть строкой'})
    @Length(1, 255, {message: 'Не менее 1 и не более 255 символов'})
    readonly name?: string;
}
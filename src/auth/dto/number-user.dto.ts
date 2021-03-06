import { ApiProperty } from "@nestjs/swagger";
import { IsPhoneNumber, IsString, Length } from "class-validator";


export class NumberUserDto {
    @ApiProperty({example:'+79998887766', description:'Логин/почта пользователя'})
    @IsString({message: 'Должно быть строкой'})
    @IsPhoneNumber()
    @Length(1, 255, {message: 'Не менее 1 и не более 255 символов'})
    readonly login: string;

    @ApiProperty({example:'Вася Пупкин', description:'Имя пользователя'})
    @IsString({message: 'Должно быть строкой'})
    @Length(1, 255, {message: 'Не менее 1 и не более 255 символов'})
    readonly name: string;
}
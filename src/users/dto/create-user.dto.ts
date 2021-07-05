import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({example:'ВасяПупкин', description:'Почта'})
    readonly login: string;

    @ApiProperty({example:'qwerty123', description:'Пароль'})
    readonly password: string;
}
import { ApiProperty } from "@nestjs/swagger";


export class UserDto {

    @ApiProperty({example:'user@mail.ru', description:'Логин пользователя'})
    readonly login: string;

    @ApiProperty({example:'1', description:'Id пользователя'})
    readonly id: number;

    constructor(model) {
        this.login = model.login;
        this.id = model.id;
    }
}
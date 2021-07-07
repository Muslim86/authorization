import { ApiProperty } from "@nestjs/swagger";

export class SaveTokenDto {

    @ApiProperty({example:'1', description:'ID пользователя'})
    readonly user: number;

    @ApiProperty({example:'AsksfsiAis2-siaiWnsq', description:'Рефреш токен пользователя'})
    readonly refreshToken: string;

}
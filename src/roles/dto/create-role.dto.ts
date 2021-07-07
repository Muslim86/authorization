import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class CreateRoleDto {

    @ApiProperty({example:'Admin', description:'Значение роли'})
    @IsString({message: 'Должно быть строкой'})
    @Length(1, 255, {message: 'Не менее 1 и не более 255 символов'})
    readonly value: string;

    @IsString({message: 'Должно быть строкой'})
    @Length(1, 255, {message: 'Не менее 1 и не более 255 символов'})
    @ApiProperty({example:'Неограниченные полномочия', description:'Описание роли'})
    readonly description: string;
}
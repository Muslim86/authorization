import { ApiProperty } from "@nestjs/swagger";

export class CreateRoleDto {
    @ApiProperty({example:'Admin', description:'Значение роли'})
    readonly value: string;
    @ApiProperty({example:'Неограниченные полномочия', description:'Описание роли'})
    readonly description: string;
}
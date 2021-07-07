import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, Table, Model } from "sequelize-typescript";

@Table({tableName: 'auth'})
export class Auth extends Model<Auth> {
    
    @ApiProperty({example:'1', description:'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example:'1', description:'id пользователя'})
    @Column({type: DataType.INTEGER})
    user: number;

    @ApiProperty({example:'osjmqwUsfkfkauxwns-s821-sakMa', description:'Refresh token'})
    @Column({type: DataType.STRING})
    refreshToken: string;

}
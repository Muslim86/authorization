import { ApiProperty } from "@nestjs/swagger";
import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { Role } from "src/roles/roles.model";
import { UserRoles } from "src/roles/user-roles.model";

interface UserCreationAttr {
    login: string;
    password: string;
}

@Table({tableName: 'users'})
export class User extends Model<User, UserCreationAttr> {
    
    @ApiProperty({example:'1', description:'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example:'Вконтакте', description:'Тип зарегистрированного аккаунта'})
    @Column({type: DataType.STRING})
    typeAccount: string;

    @ApiProperty({example:'Вася Пупкин', description:'Имя пользователя'})
    @Column({type: DataType.STRING})
    name: string;

    @ApiProperty({example:'89998887766 / user@mail.ru', description:'Логин пользователя'})
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    login: string;

    @ApiProperty({example:'qwerty123', description:'Пароль'})
    @Column({type: DataType.STRING, allowNull: false})
    password: string;

    @BelongsToMany(() => Role, () => UserRoles)
    roles: Role[];
}
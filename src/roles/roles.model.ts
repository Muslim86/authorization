import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, Model, Table, BelongsToMany } from "sequelize-typescript";
import { User } from "src/users/users.model";
import { UserRoles } from "./user-roles.model";

interface RoleCreationAttr {
    value: string;
    description: string;
}

@Table({tableName: 'roles'})
export class Role extends Model<Role, RoleCreationAttr> {
    
    @ApiProperty({example:'1', description:'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example:'Admin', description:'Название роли'})
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    value: string;

    @ApiProperty({example:'Неограниченные полномочия', description:'Описание роли'})
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    description: string;

    @BelongsToMany(() => User, () => UserRoles)
    users: User[];
}
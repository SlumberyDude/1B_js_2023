import { ApiProperty } from '@nestjs/swagger';
import { Model, Table, Column, DataType, BelongsToMany, HasMany, ForeignKey } from 'sequelize-typescript';
import { User } from 'src/users/users.model';

// Так как эндпоинт регистрации находится в профиле и профиль и пользователь
// связаны, как 1 к 1, то при создании сущности Profile также необходимо создавать данные User.
// Соответственно, обязательным и неизменным будет являться поле привязки к User
interface ProfileCreationAttrs {
    user_id: number;
}

@Table({ tableName: 'profiles' })
export class Profile extends Model<Profile, ProfileCreationAttrs> {

    @ApiProperty({ example: '11', description: 'Уникальный идентификатор профиля' })
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @Column({ type: DataType.STRING, allowNull: true})
    username: string;

    @Column({ type: DataType.STRING, allowNull: true})
    social: string;

    @ApiProperty({ example: '3', description: 'Уникальный идентификатор пользователя' })
    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, unique: true, allowNull: false })
    user_id: number;

    // @BelongsToMany( () => Role, () => UserRoles)
    // roles: Role[];

    // @HasMany(() => Post)
    // posts: Post[];
}
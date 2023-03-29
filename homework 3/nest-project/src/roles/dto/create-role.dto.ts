import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

export class CreateRoleDto {
    
    @ApiProperty({ example: 'USER', description: 'Имя новой роли' })
    @IsString({message: 'Должно быть строкой'})
    readonly name: string;

    @ApiProperty({ example: '1', description: 'Уровень доступа роли' })
    @IsInt({message: 'Должно быть целым числом'})
    readonly value: number;

    @ApiProperty({ example: 'Роль для рядовых пользователей', description: 'Описание новой роли' })
    @IsString({message: 'Должно быть строкой'})
    readonly description: string;
}
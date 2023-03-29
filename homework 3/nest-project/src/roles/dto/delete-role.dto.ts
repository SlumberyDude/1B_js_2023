import { ApiProperty } from "@nestjs/swagger";
import { IsNotIn, IsString } from "class-validator";

export class DeleteRoleDto {
    @ApiProperty({ example: 'SMALLADMIN', description: 'Имя роли для удаления' })
    @IsString({message: 'Должно быть строкой'})
    @IsNotIn(['OWNER', 'ADMIN', 'USER'], {message: 'Базовые роли не могут быть удалены'})
    readonly name: string;
}
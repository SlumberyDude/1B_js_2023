import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, IsInt, IsNotEmpty, IsOptional, IsEnum } from "class-validator";
import { FileStorageType } from "../files.model";

export class CreateFileDto {

    @ApiProperty({ example: 'profile', required: false, description: 'Название типа сущности, где используется файл' })
    @IsString({ message: 'Должно быть строкой' })
    @IsOptional()
    readonly essenceTable: string;

    @ApiProperty({ example: '13', required: false, description: 'ID сущности, где используется файл' })
    @Type(() => Number)
    @IsInt({ message: 'Должно быть целым числом' })
    @IsOptional()
    readonly essenceId: number;

    @ApiProperty({ example: 'DBSTORE', required: false, description: 'Тип хранения файла', default: 'DBSTORE' })
    @IsEnum(FileStorageType, {message: 'Доступно 2 типа: DBSTORE FSSTORE'})
    readonly storageType: FileStorageType;

    @ApiProperty({ type: 'string', format: 'binary', required: true, description: 'Файл' })
    readonly file: Buffer;
}
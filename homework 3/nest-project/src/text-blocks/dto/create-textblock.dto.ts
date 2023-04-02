import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateTextBlockDto {

    @ApiProperty({ example: 'main-hero-text', description: 'Уникальное название блока' })
    @IsString({ message: 'Должно быть строкой' })
    readonly searchName: string;

    @ApiProperty({ example: 'Добро пожаловать на портал!', description: 'Название блока' })
    @IsString({ message: 'Должно быть строкой' })
    readonly name: string;

    @ApiProperty({ example: 'Мы рады Вас видеть в нашем уютном подполье.', description: 'Основной текст блока' })
    @IsString({ message: 'Должно быть строкой' })
    @IsOptional()
    readonly text: string;

    @ApiProperty({ example: 'main-page', description: 'Группа к которой относится блок' })
    @IsString({ message: 'Должно быть строкой' })
    @IsOptional()
    readonly group: string;

    @ApiProperty({ type: 'string', format: 'binary', required: false, description: 'Файл' })
    @IsOptional()
    readonly file: Buffer;
}
import { ApiProperty } from '@nestjs/swagger';
import { Model, Table, Column, DataType } from 'sequelize-typescript';

interface TextBlocksCreationAttrs {
    name: string;
    value: number;
    description: string;
}

@Table({ tableName: 'text-blocks' })
export class TextBlocks extends Model<TextBlocks, TextBlocksCreationAttrs> {

    @ApiProperty({ example: '1', description: 'Уникальный идентификатор текстового блока' })
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @ApiProperty({ example: 'main-hero-text', description: 'Уникальное название блока' })
    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    searchName: string;

    @ApiProperty({ example: 'Добро пожаловать на портал!', description: 'Название блока' })
    @Column({ type: DataType.STRING, allowNull: false })
    name: string;

    @ApiProperty({ example: 'Мы рады Вас видеть в нашем уютном подполье.', description: 'Основной текст блока' })
    @Column({ type: DataType.STRING, allowNull: true })
    text: string;

    @ApiProperty({ example: 'main-page', description: 'Группа к которой относится блок' })
    @Column({ type: DataType.STRING, allowNull: true })
    group: string;
}
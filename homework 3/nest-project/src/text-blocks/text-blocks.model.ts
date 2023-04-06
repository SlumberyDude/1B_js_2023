import { ApiProperty } from '@nestjs/swagger';
import { Model, Table, Column, DataType, ForeignKey, HasOne, BelongsTo } from 'sequelize-typescript';
import { File } from '../files/files.model';

interface TextBlocksCreationAttrs {
    searchName: string;
    name: string;
    text: string;
    group: string;
    image_id: number;
}

@Table({ tableName: 'text-blocks' })
export class TextBlock extends Model<TextBlock, TextBlocksCreationAttrs> {

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

    @ApiProperty({ example: '7', description: 'Уникальный идентификатор файла изображения' })
    @ForeignKey(() => File)
    @Column({ type: DataType.INTEGER })
    image_id: number;

    @BelongsTo(() => File, 'image_id')
    image: File;
}
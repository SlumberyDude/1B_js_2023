import { ApiProperty } from '@nestjs/swagger';
import { Model, Table, Column, DataType } from 'sequelize-typescript';

export enum FileStorageType {
    DBSTORE = "DBSTORE", // Сохранять файл в базе данных в поле data
    FSSTORE = "FSSTORE", // Сохранять файл в файловой системе
}

interface FilesCreationAttrs {
    storageType: FileStorageType;
    essenceTable: string;
    essenceId: number;
    data: Uint8Array;
    originalName: string;
    filename: string;
}

@Table({ tableName: 'files' })
export class Files extends Model<File, FilesCreationAttrs> {

    @ApiProperty({ example: '1', description: 'Уникальный идентификатор файла' })
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @ApiProperty({ example: 'TextBlock', description: 'Название сущности, где используется файл' })
    @Column({ type: DataType.STRING, allowNull: true })
    essenceTable: string;

    @ApiProperty({ example: '13', description: 'ID сущности, где используется файл' })
    @Column({ type: DataType.INTEGER, allowNull: true })
    essenceId: number;

    @ApiProperty({ example: 'DBSTORE', description: 'Тип хранения файла' })
    @Column({
        defaultValue: FileStorageType.DBSTORE,
        type: DataType.ENUM(...Object.values(FileStorageType)),
    })
    storageType: FileStorageType;

    @ApiProperty({ description: 'Файл сохраненный в базе в бинарном виде, если type = DBSTORE' })   
    @Column({ type: DataType.BLOB, allowNull: true })
    data: Uint8Array;

    @ApiProperty({ example: 'smiling_cat.jpg', description: 'Имя файла, сохраненного в файловой системе, если type = FSSTORE' })   
    @Column({ type: DataType.STRING, allowNull: true })
    filename: string;

    @ApiProperty({ example: 'grumpy_cat.jpg', description: 'Имя оригинального файла' })   
    @Column({ type: DataType.STRING, allowNull: false })
    originalName: string;
}
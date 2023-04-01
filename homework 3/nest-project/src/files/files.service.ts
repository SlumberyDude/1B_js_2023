import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import { InjectModel } from '@nestjs/sequelize';
import { Files, FileStorageType } from './files.model';
import { CreateFileDto } from './dto/create-file.dto';
import { FileInfoDto } from './dto/file-info.dto';

@Injectable()
export class FilesService {

    constructor(@InjectModel(Files) private filesRepository: typeof Files) {}

    // Создает файл и сохраняет его в зависимости от выбранного способа хранения
    async createFile(dto: CreateFileDto, file: Express.Multer.File) {
        console.log(`got dto: ${JSON.stringify(dto)}`);
        if (dto.storageType == FileStorageType.DBSTORE) {
            return await this.storeFileDB(dto, file);
        }
        return await this.storeFileFS(dto, file);
    }

    // сохраняет его в базе данных, как bytea (BLOB)
    private async storeFileDB(dto: CreateFileDto, file: Express.Multer.File) {
        try {
            const newFile = await this.filesRepository.create({
                ...dto,
                originalName: file.originalname,
                data: file.buffer,
            });

            return {
                id: newFile.id,
                storageType: newFile.storageType,
                essenceTable: newFile.essenceTable,
                essenceId: newFile.essenceId,
                originalName: newFile.originalName,
                dataLengthBytes: newFile.data.length,
                createdAt: newFile.createdAt,
            }

        } catch (error) {
            throw new HttpException('Ошибка при записи файла в базу', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    // сохраняет в файловой системе
    private async storeFileFS(dto: CreateFileDto, file: Express.Multer.File) {
        const fileName = uuid.v4() + '.' + file.originalname.split('.').pop();
        try {

            const filePath = path.resolve(__dirname, '..', 'static');
            // TODO: в идеале заменить синхронные вызовы на асинхронные
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, {recursive: true});
            }
            fs.writeFileSync(path.join(filePath, fileName), file.buffer);
        } catch (error) {
            throw new HttpException('Произошла ошибка при записи файла на диск', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        try {
            const newFile = await this.filesRepository.create({
                ...dto,
                originalName: file.originalname,
                filename: fileName
            });

            return {
                id: newFile.id,
                storageType: newFile.storageType,
                essenceTable: newFile.essenceTable,
                essenceId: newFile.essenceId,
                originalName: newFile.originalName, 
                filename: newFile.filename,
                createdAt: newFile.createdAt,
            }
        } catch {
            throw new HttpException('Произошла ошибка при записи объекта в БД', HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }


}

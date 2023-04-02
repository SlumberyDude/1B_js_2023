import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import { InjectModel } from '@nestjs/sequelize';
import { File, FileStorageType } from './files.model';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { Op } from 'sequelize';

@Injectable()
export class FilesService {

    constructor(@InjectModel(File) private filesRepository: typeof File) {}

    // Создает файл и сохраняет его в зависимости от выбранного способа хранения
    async createFile(dto: CreateFileDto, file: Express.Multer.File) {

        // Параметры, которых не хватает в dto, но нужны для создания объекта.
        const dataParams = {
            data: null,
            filename: null,
            originalName: file.originalname,
        }; 

        if (dto.storageType == FileStorageType.DBSTORE) {
            dataParams.data = file.buffer;
        } else {
            dataParams.filename =  this.generateFilename(file.originalname);
            this.writeBufferToFile(dataParams.filename, file.buffer);
        }

        try {
            const newFile = await this.filesRepository.create({
                ...dto,
                ...dataParams,
            });

            // return this.fileOutputView(newFile);
            return newFile.id;
            
        } catch {
            throw new HttpException('Ошибка при создании файла', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getFileById(id: number) : Promise<File> {
        const file = await this.filesRepository.findByPk(id);
        if (file === undefined) {
            throw new HttpException('Файла с таким id не существует', HttpStatus.NOT_FOUND);
        }
        return file;
    }

    async updateFileById(id: number, dto: UpdateFileDto, file?: Express.Multer.File) {
        // Получаем существующий объект из базы, который будем обновлять
        const oldFile = await this.getFileById(id);
        // На протяжении всей функции будет использован метод .set а затем осуществлено обновление в базе посредством .save
        // При изменении способа хранения файла или самого файла данные могут быть утеряны в случае ошибок во время работы функции, необходима система бекапов при работе с файловой системой (TODO)
        // essenceTable и essenceId можно обновить сразу без проблем, а вот storageType и file требуют более сложной обработки.
        if (dto.essenceTable !== undefined) oldFile.set('essenceTable', dto.essenceTable);
        if (dto.essenceId !== undefined) oldFile.set('essenceId', dto.essenceId);

        if (file) { // Замена файла
            oldFile.set('originalName', file.originalname); // новый файл - новое оригинальное имя
            
            // Удаляем данные старого файла
            if (oldFile.storageType === FileStorageType.FSSTORE) {
                this.deleteFileFS(oldFile.filename); // Физическое удаление файла
                oldFile.set('filename', null);
            } else {
                oldFile.set('data', null);
            }
            
            const newStorageType = dto.storageType ?? oldFile.storageType; // Выводим способ хранения для текущего файла
            
            // Сохраняем данные нового файла
            if (newStorageType === FileStorageType.FSSTORE) {
                const newFilename = this.generateFilename(file.originalname);
                this.writeBufferToFile(newFilename, file.buffer);
                oldFile.set('filename', newFilename);
            } else {
                oldFile.set('data', file.buffer);
            }

            oldFile.set('storageType', newStorageType);

            // Заменили файл, все поля обновлены, можно выходить
            return this.fileOutputView(await oldFile.save());
        }
        // Замена файла не требуется

        if (dto.storageType === undefined || dto.storageType === oldFile.storageType) {
            await oldFile.save(); // Не требуется изменить способ хранения - выходим
            return this.fileOutputView(oldFile);
        }

        // Требуется изменить способ хранения
        oldFile.set('storageType', dto.storageType);

        if (dto.storageType === FileStorageType.FSSTORE) {
            // Выгружаем буфер из БД и записываем в файл на диске
            const newFileName = this.generateFilename(oldFile.originalName);

            this.writeBufferToFile(newFileName, oldFile.data);
            
            oldFile.set('data', null);
            oldFile.set('filename', newFileName);
        } else {
            // Выгружаем файл на диске в буфер и записываем в БД.
            const buffer = this.readFileToBuffer(oldFile.filename);

            oldFile.set('data', buffer);
            // Удаляем файл с диска
            this.deleteFileFS(oldFile.filename);
            
            oldFile.set('filename', null);
        }

        return this.fileOutputView(await oldFile.save());
    }

    // Устанавливает в essenceTable и essenceId значения null (отвязывает файл от сущности)
    async unbindFileById(id: number) {
        const file = await this.getFileById(id);

        file.set('essenceTable', null);
        file.set('essenceId', null);

        await file.save();
        return this.fileOutputView(file);
    }

    async deleteFileById(id: number) {
        const file = await this.getFileById(id);

        if (file.storageType === FileStorageType.FSSTORE) {
            this.deleteFileFS(file.filename);
        }
        file.destroy();
    }

    async clearFiles() {
        const files = await this.filesRepository.findAll({
            where: {
                createdAt: {
                    [Op.lt]: new Date(Date.now() - (60 * 60 * 1000)) // Все файлы, чье время создания раньше, чем 1 час назад
                },
                essenceTable: null,
                essenceId: null,
            },
            attributes: ['id'],
        })

        for (let {id} of files) {
            this.deleteFileById(id);
        }

        return {'message': `Удалено файлов: ${files.length}`};
    }

    // HELPERS 
    // TODO: перевести операции с FS на асинхронные рельсыs
    
    // Преобразует файл из БД в более удобную для вывода пользователю форму (чтобы не выводил весь буфер данных)
    private fileOutputView(file: File) {
        const res = { 
            id: file.id,
            storageType: file.storageType,
            essenceTable: file.essenceTable,
            essenceId: file.essenceId,
            originalName: file.originalName,
            data: null,
            filename: file.filename,
            createdAt: file.createdAt,
        };

        if (file.storageType === FileStorageType.DBSTORE) {
            res.data = `Byte Array Data [${file.data.length}] byte`;
        }
        return res;
    }

    private generateFilename(originalname: string) {
        return uuid.v4() + '.' + originalname.split('.').pop();
    }

    private writeBufferToFile(fileName: string, buffer: Buffer) {
        try {
            const pathName = path.resolve(__dirname, '..', 'static');

            if (!fs.existsSync(pathName)) {
                fs.mkdirSync(pathName, {recursive: true});
            }
            fs.writeFileSync(path.join(pathName, fileName), buffer);
        } catch (error) {
            throw new HttpException('Произошла ошибка при записи файла на диск', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private readFileToBuffer(fileName: string) : Buffer {
        try {
            const filePath = path.resolve(__dirname, '..', 'static', fileName);
            
            if (!fs.existsSync(filePath)) {
                throw new Error;
            }

            return fs.readFileSync(filePath);

        } catch (error) {
            throw new HttpException('Произошла ошибка при чтении файла с диска', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Удаляет физически файл с диска
    private deleteFileFS(filename: string) {
        try {
            const filePath = path.resolve(__dirname, '..', 'static', filename);

            if (!fs.existsSync(filePath)) {
                console.log(`Старый файл ${filePath} не существует (уже удален?), ничего делать не надо`)
                return;
            }

            fs.rmSync(filePath);

        } catch (error) {
            throw new HttpException('Произошла ошибка при удалении старого файла', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}

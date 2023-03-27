import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';

@Injectable()
export class FilesService {

    async createFile(file: any): Promise<string> {
        try {
            console.log(`file: ${file}`)
            const fileName = uuid.v4() + '.jpg'; // Если расширение неизвестно, то необходимо получить его из названия загружаемого исходного файла
            const filePath = path.resolve(__dirname, '..', 'static');
            // TODO: в идеале заменить синхронные вызовы на асинхронные
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, {recursive: true});
            }
            fs.writeFileSync(path.join(filePath, fileName), file.buffer);
            return fileName;
        } catch (error) {
            throw new HttpException('Произошла ошибка при записи файла', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

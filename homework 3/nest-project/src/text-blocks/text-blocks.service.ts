import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { File, FileStorageType } from '../files/files.model';
import { FilesService } from '../files/files.service';
import { CreateTextBlockDto } from './dto/create-textblock.dto';
import { UpdateTextBlockDto } from './dto/update-textblock.dto';
import { TextBlock } from './text-blocks.model';

@Injectable()
export class TextBlocksService {

    constructor(@InjectModel(TextBlock) private textBlockRepository: typeof TextBlock,
                                   private filesService: FilesService) {}

    async createTextBlock(createBlockDto: CreateTextBlockDto, file: Express.Multer.File) {

        let fileId = undefined;
        if (file) {
            fileId = await this.filesService.createFile({
                storageType: FileStorageType.FSSTORE,
                essenceTable: 'text-block',
            }, file);
        }

        let textBlock = undefined;
        try {
            textBlock = await this.textBlockRepository.create({
                ...createBlockDto,
                image_id: fileId,
            })
        } catch {
            this.filesService.deleteFileById(fileId);
            throw new HttpException('Ошибка при создании текстового блока', HttpStatus.INTERNAL_SERVER_ERROR);
        }


        if (fileId) {
            await this.filesService.updateFileById(fileId, { essenceId: textBlock.id })    
        }

        return textBlock;
    }

    async getTextBlockById(id: number) {
        const tblock = await this.textBlockRepository.findByPk(id, {
            include: {all: true}
        });
        if (!tblock) {
            throw new HttpException('Нет текстового блока с данным id', HttpStatus.NOT_FOUND);
        }

        return tblock;
    }

    async getTextBlockByName(searchName: string) {
        const tblock = await this.textBlockRepository.findOne({
            where: {
                searchName: searchName,
            },
            include: {
                all: true,
            }
        });

        if (!tblock) {
            throw new HttpException('Нет текстового блока с данным именем', HttpStatus.NOT_FOUND);
        }

        return tblock;
    }

    async getTextBlocksByGroup(group: string) {
        const tblocks = await this.textBlockRepository.findAll({
            where: {
                group: group,
            },
            include: {
                all: true,
            }
        });

        return tblocks;
    }

    async updateTextBlockById(id: number, dto: UpdateTextBlockDto, file: Express.Multer.File) {
        const tblock = await this.textBlockRepository.findByPk(id);
        if (!tblock) throw new HttpException('Нет текстового блока с данным id', HttpStatus.NOT_FOUND);

        if (file) {
            await this.filesService.updateFileById(tblock.image_id, {}, file);
        }
        return await tblock.update(dto);
    }

    async deleteTextBlockById(id: number) {
        const tblock = await this.textBlockRepository.findByPk(id);
        if (!tblock) return; // delete идемпотентный
        
        await tblock.destroy();
        await this.filesService.unbindFileById(tblock.image_id);
    }
}

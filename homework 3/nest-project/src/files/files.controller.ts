import { Body, Controller, Post, UploadedFile, UseInterceptors, UsePipes } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ParseFile } from 'src/pipes/parse-file.pipe';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { ApiFile } from './api-file.decorator';
import { CreateFileDto } from './dto/create-file.dto';
import { FilesService } from './files.service';

@ApiTags('Файлы')
@Controller('files')
export class FilesController {

    constructor(private filesService: FilesService ) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    uploadFile(
        @Body(new ValidationPipe()) createFileDto: CreateFileDto,
        @UploadedFile(ParseFile) file: Express.Multer.File
    ) {
        return this.filesService.createFile(createFileDto, file);
    }

}

import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors, UsePipes } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ParseFile } from 'src/pipes/parse-file.pipe';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { ApiFile } from './api-file.decorator';
import { CreateFileDto } from './dto/create-file.dto';
import { FileIdParamDto } from './dto/file-id.param.dto';
import { UpdateFileDto } from './dto/update-file.dto';
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

    @Put('/:id')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    updateFile(
        @Body(new ValidationPipe()) updateFileDto: UpdateFileDto,
        @UploadedFile() file: Express.Multer.File,
        @Param(new ValidationPipe()) {id}: FileIdParamDto,
    ) {
        return this.filesService.updateFileById(id, updateFileDto, file);
    }

    @Put('/unbind/:id')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    unbindFile(
        @Param(new ValidationPipe()) {id}: FileIdParamDto,
    ) {
        return this.filesService.unbindFileById(id);
    }

    @Delete('/:id')
    @ApiResponse({ status: 204 })
    deleteFile(
        @Param(new ValidationPipe()) {id}: FileIdParamDto,
    ) {
        return this.filesService.deleteFileById(id);
    }

    @Get('clear')
    clearFiles() {
        return this.filesService.clearFiles();
    }

}

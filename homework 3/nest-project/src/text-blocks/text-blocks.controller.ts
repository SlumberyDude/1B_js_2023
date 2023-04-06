import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleAccess } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { initRoles } from '../init/init.roles';
import { ValidationPipe } from '../pipes/validation.pipe';
import { BlockGroupParamDto, BlockIdParamDto, BlockNameParamDto } from './dto/block-param.dto';
import { CreateTextBlockDto } from './dto/create-textblock.dto';
import { UpdateTextBlockDto } from './dto/update-textblock.dto';
import { TextBlock } from './text-blocks.model';
import { TextBlocksService } from './text-blocks.service';

@ApiTags('Текстовый блок')
@Controller('text-blocks')
export class TextBlocksController {

    constructor(private textBlockService: TextBlocksService) {}

    @ApiOperation({ summary: 'Создание нового блока' })
    @ApiResponse({ status: 200, type: TextBlock })
    @RoleAccess(initRoles.ADMIN.value)
    @UseGuards(RolesGuard)
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    createTextBlock(
        @Body(new ValidationPipe()) createBlockDto: CreateTextBlockDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.textBlockService.createTextBlock(createBlockDto, file);
    }

    @ApiOperation({ summary: 'Обновление блока' })
    @ApiResponse({ status: 200, type: TextBlock })
    @RoleAccess(initRoles.ADMIN.value)
    @UseGuards(RolesGuard)
    @Put('/:id')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    updateTextBlock(
        @Body(new ValidationPipe()) updateBlockDto: UpdateTextBlockDto,
        @UploadedFile() file: Express.Multer.File,
        @Param(new ValidationPipe()) {id}: BlockIdParamDto,
    ) {
        return this.textBlockService.updateTextBlockById(id, updateBlockDto, file);
    }

    @ApiOperation({ summary: 'Получение блока по id' })
    @ApiResponse({ status: 200, type: TextBlock })
    @Get('/:id')
    getTextBlockById(@Param(new ValidationPipe()) {id}: BlockIdParamDto) {
        return this.textBlockService.getTextBlockById(id);
    }

    @ApiOperation({ summary: 'Получение блока по имени для поиска' })
    @ApiResponse({ status: 200, type: TextBlock })
    @Get('name/:name')
    getTextBlockByName(@Param(new ValidationPipe()) {name}: BlockNameParamDto) {
        return this.textBlockService.getTextBlockByName(name);
    }

    @ApiOperation({ summary: 'Получение блоков в заданной группе' })
    @ApiResponse({ status: 200, type: [TextBlock] })
    @Get('group/:group')
    getTextBlocksByGroup(@Param(new ValidationPipe()) {group}: BlockGroupParamDto) {
        return this.textBlockService.getTextBlocksByGroup(group);
    }

    @ApiOperation({ summary: 'Удаление блока' })
    @ApiResponse({ status: 204 })
    @RoleAccess(initRoles.ADMIN.value)
    @UseGuards(RolesGuard)
    @Delete('/:id')
    deleteTextBlockById(@Param(new ValidationPipe()) {id}: BlockIdParamDto) {
        return this.textBlockService.deleteTextBlockById(id);
    }


}

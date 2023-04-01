import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Files } from './files.model';

@Module({
    providers: [FilesService],
    exports: [FilesService],
    controllers: [FilesController],
    imports: [
        SequelizeModule.forFeature([Files])
    ]
})
export class FilesModule {}

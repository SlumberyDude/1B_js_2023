import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { File } from './files.model';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    providers: [FilesService],
    exports: [FilesService],
    controllers: [FilesController],
    imports: [
        SequelizeModule.forFeature([File]),
        AuthModule
    ]
})
export class FilesModule {}

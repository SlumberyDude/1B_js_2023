import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { File } from 'src/files/files.model';
import { FilesModule } from 'src/files/files.module';
import { TextBlocksController } from './text-blocks.controller';
import { TextBlock } from './text-blocks.model';
import { TextBlocksService } from './text-blocks.service';

@Module({
    controllers: [TextBlocksController],
    providers: [TextBlocksService],
    imports: [
        SequelizeModule.forFeature([TextBlock]),
        FilesModule,
        AuthModule
    ],
})
export class TextBlocksModule {}

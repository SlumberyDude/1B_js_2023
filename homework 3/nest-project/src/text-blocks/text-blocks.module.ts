import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '../auth/auth.module';
import { FilesModule } from '../files/files.module';
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

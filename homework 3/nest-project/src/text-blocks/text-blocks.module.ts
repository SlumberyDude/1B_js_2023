import { Module } from '@nestjs/common';
import { TextBlocksController } from './text-blocks.controller';
import { TextBlocksService } from './text-blocks.service';

@Module({
  controllers: [TextBlocksController],
  providers: [TextBlocksService]
})
export class TextBlocksModule {}

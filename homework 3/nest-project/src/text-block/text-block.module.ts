import { Module } from '@nestjs/common';
import { TextBlockController } from './text-block.controller';
import { TextBlockService } from './text-block.service';

@Module({
  controllers: [TextBlockController],
  providers: [TextBlockService]
})
export class TextBlockModule {}

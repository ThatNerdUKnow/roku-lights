import { Module } from '@nestjs/common';
import { RokuController } from './roku.controller';
import { RokuService } from './roku.service';

@Module({
  controllers: [RokuController],
  providers: [RokuService]
})
export class RokuModule {}

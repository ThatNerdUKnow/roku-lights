import { Module } from '@nestjs/common';
import { HueService } from './hue.service';
import { HueController } from './hue.controller';

@Module({
  providers: [HueService],
  controllers: [HueController]
})
export class HueModule {}

import { Module, HttpModule } from '@nestjs/common';
import { HueService } from './hue.service';
import { HueController } from './hue.controller';


@Module({
  imports: [HttpModule],
  providers: [HueService],
  controllers: [HueController]
})
export class HueModule {}

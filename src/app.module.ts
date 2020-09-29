import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RokuModule } from './roku/roku.module';
import { HueModule } from './hue/hue.module';

@Module({
  imports: [RokuModule, HueModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

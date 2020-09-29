import { Test, TestingModule } from '@nestjs/testing';
import { HueController } from './hue.controller';

describe('HueController', () => {
  let controller: HueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HueController],
    }).compile();

    controller = module.get<HueController>(HueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

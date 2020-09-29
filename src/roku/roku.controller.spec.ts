import { Test, TestingModule } from '@nestjs/testing';
import { RokuController } from './roku.controller';

describe('RokuController', () => {
  let controller: RokuController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RokuController],
    }).compile();

    controller = module.get<RokuController>(RokuController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

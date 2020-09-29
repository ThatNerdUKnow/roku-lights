import { Test, TestingModule } from '@nestjs/testing';
import { RokuService } from './roku.service';

describe('RokuService', () => {
  let service: RokuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RokuService],
    }).compile();

    service = module.get<RokuService>(RokuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

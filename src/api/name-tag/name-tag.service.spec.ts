import { Test, TestingModule } from '@nestjs/testing';
import { NameTagService } from './name-tag.service';

describe('NameTagService', () => {
  let service: NameTagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NameTagService],
    }).compile();

    service = module.get<NameTagService>(NameTagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { NameTagController } from './name-tag.controller';

describe('NameTagController', () => {
  let controller: NameTagController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NameTagController],
    }).compile();

    controller = module.get<NameTagController>(NameTagController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

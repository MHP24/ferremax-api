import { Controller, Post } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiTags } from '@nestjs/swagger';
import { Swagger } from '../../common/swagger/decorators';
import { runSeedDocumentation } from './docs';

@ApiTags('seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @Swagger(runSeedDocumentation)
  runSeed() {
    return this.seedService.runSeed();
  }
}

import { Controller, Get, Param, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { exec } from 'child_process';
import { ModelsService } from './models.service';

@ApiTags()
@Controller()
export class ModelsController {
  constructor(
    private readonly configService: ConfigService,
    private readonly modelsService: ModelsService
  ) { }
  @Get('/models/list')
  modelsList() {
    return this.modelsService.getModels();
  }

  @Get('/models/list-failed')
  failedModelsList() {
    return this.modelsService.getFailedModels();
  }

  @Get('/models/storage')
  storage() {
    return this.modelsService.getStorageModels();
  }

  @Get('/models/total')
  total() {
    return this.modelsService.getTotal();
  }

  @Get('/system_stats')
  stats() {
    return this.modelsService.getStats();
  }

  @Get('/disk')
  disk() {
    return new Promise((res, rej) => {
      exec(`df -h | grep /dev/root`,
        (error, stdout, stderr) => {
          res({ status: stdout, models: this.modelsService.getTotal() });

          if (error !== null) {
            console.log(`exec error: ${error}`);
          }
        });
    })
  }
}
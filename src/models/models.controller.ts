import { Controller, Get, Param, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { exec } from 'child_process';
import { ModelsService } from './models.service';

@ApiTags('models')
@Controller('models')
export class ModelsController {
  constructor(
    private readonly configService: ConfigService,
    private readonly modelsService: ModelsService
  ) { }
  @Get('/version')
  getVersion() {
    return this.configService.get('version');
  }

  @Get('/config')
  getConfig() {
    return {};
  }

  @Get('/list')
  modelsList() {
    return this.modelsService.getModels();
  }

  @Get('/storage')
  storage() {
    return this.modelsService.getStorageModels();
  }

  @Get('/gpu')
  gpu() {
    return new Promise((res, rej) => {
      exec(`nvidia-smi --query-gpu=utilization.gpu --format=csv`,
        (error, stdout, stderr) => {
          res({ status: stdout });

          if (error !== null) {
            console.log(`exec error: ${error}`);
          }
        });
    })
  }
}
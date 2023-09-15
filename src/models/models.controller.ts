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

  @Get('/list-failed')
  failedModelsList() {
    return this.modelsService.getFailedModels();
  }

  @Get('/storage')
  storage() {
    return this.modelsService.getStorageModels();
  }

  @Get('/total')
  total() {
    return this.modelsService.getTotal();
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
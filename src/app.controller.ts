import { Controller, Get, Param, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { exec } from 'child_process';
import { AppService } from './app.service';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(
    private readonly configService: ConfigService,
    private readonly appService: AppService
  ) { }
  @Get('/version')
  getVersion() {
    return this.configService.get('version');
  }

  @Get('/config')
  getConfig() {
    return {};
  }

  @Get('/status/:lora')
  status(@Param('lora') loraName) {
    return this.appService.getTrainInfo(loraName);
  }

  @Get('/stop/:lora')
  stop(@Param('lora') loraName) {
    return this.appService.stopTrain(loraName);
  }

  @Get('/add/:lora')
  train(@Param('lora') loraName) {
    return this.appService.addTrain(loraName);
  }

  @Get('/list')
  list() {
    return this.appService.getAllTrains();
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
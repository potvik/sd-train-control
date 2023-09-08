import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { exec } from 'child_process';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly configService: ConfigService) { }
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
    return new Promise((res, rej) => {
      exec(`cat /home/ubuntu/train_controller/${loraName}.lock`,
        (error, stdout, stderr) => {
          // console.log(stdout);
          // console.log(stderr);

          res({ status: stdout });

          if (error !== null) {
            // console.log(`exec error: ${error}`);
          }
        });
    })
  }

  @Get('/stop/:lora')
  stop(@Param('lora') loraName) {
    return new Promise((res, rej) => {
      exec(`sh /home/ubuntu/train_controller/stop.sh ${loraName}`,
        (error, stdout, stderr) => {
          console.log(stdout);
          console.log(stderr);

          res({ status: stdout });

          if (error !== null) {
            console.log(`exec error: ${error}`);
          }
        });
    })
  }

  @Get('/train/:lora')
  train(@Param('lora') loraName) {
    exec(`sh /home/ubuntu/train_controller/start.sh ${loraName}`,
      (error, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        if (error !== null) {
          console.log(`exec error: ${error}`);
        }
      });

    return loraName;
  }

  @Get('/gpu')
  gpu() {
    return new Promise((res, rej) => {
      exec(`nvidia-smi --query-gpu=utilization.gpu --format=csv --loop=1`,
        (error, stdout, stderr) => {
          // console.log(stdout);
          // console.log(stderr);

          res({ status: stdout });

          if (error !== null) {
            // console.log(`exec error: ${error}`);
          }
        });
    })
  }
}
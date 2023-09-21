import * as process from 'process';

export default () => ({
  version: process.env.npm_package_version || '0.0.1',
  name: process.env.npm_package_name || '',
  port: parseInt(process.env.PORT, 10) || 7860,
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  STABILITY_API_KEY: process.env.STABILITY_API_KEY,
  SD_API_URL: process.env.SD_API_URL,
  SERVICE_PATH: '/home/ubuntu/sd-train-control',

  MODELS_PATH: process.env.MODELS_PATH,
  LORAS_PATH: process.env.LORAS_PATH,
  CONTROLNETS_PATH: process.env.CONTROLNETS_PATH,
  COMFY_API_URL: process.env.COMFY_API_URL,
  TRAIN_API_URL: process.env.TRAIN_API_URL,
});
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { HttpService } from '@nestjs/axios';
import { civitaiReqListModelsParams, downloadFile, renameFile } from './helpers';

export interface IStorageModel {
    id: string;
    hash: string;
}

@Injectable()
export class ModelsService {
    private readonly logger = new Logger(ModelsService.name);

    storagePath = "/home/ubuntu";
    civitAIApiUrl = ''

    storageModels: string[] = [];
    syncStorageModelsInterval = 10000;

    civitAIModels = [];

    constructor(
        private configService: ConfigService,
        private readonly httpService: HttpService
    ) {
        this.storagePath = configService.get('STORAGE_PATH') || "/home/ubuntu";

        Promise.all([
            this.loadCivitAIModelsList(),
            this.loadStorageModels()
        ]).then(
            () => this.syncModels()
        );
    }

    loadStorageModels = () => {
        return new Promise((res, rej) => {
            try {
                fs.readdir(this.storagePath, (err, files) => {
                    //handling error
                    if (err) {
                        this.logger.error('Unable to scan directory: ' + err);
                        rej(err);
                    }

                    this.storageModels = files.map(f => f.split('.')[0]);

                    res(files);
                });
            } catch (err) {
                this.logger.error('loadStorageModels', err);
                rej(err);
            }
        });
    }

    loadCivitAIModelsList = async () => {
        try {
            const query = encodeURIComponent(JSON.stringify(civitaiReqListModelsParams));

            const res = await this.httpService.axiosRef.get(`https://civitai.com/api/trpc/model.getAll?input=${query}`);

            this.civitAIModels = res.data.result.data.json.items;
        } catch (e) {
            this.logger.error('loadCivitAIModelsList', e);
        }
    }

    syncModels = async () => {
        try {
            this.logger.log("syncModels", this.civitAIModels.length);

            for (let i = 0; i < this.civitAIModels.length; i++) {
                const model = this.civitAIModels[i];

                const modelId = model.version.id;

                if (!this.storageModels.find(id => id === model.version.id)) {
                    const url = `https://civitai.com/api/download/models/${modelId}`;
                    const tmpFilePath = `${this.storagePath}/last`;
                    const filePath = `${this.storagePath}/${modelId}.safetensors`;

                    this.logger.log('Download: ', url, filePath);

                    try {
                        await downloadFile(url, tmpFilePath);

                        await renameFile(tmpFilePath, filePath);

                        this.storageModels.push(modelId);
                    } catch (e) { }
                }
            }
        } catch (e) {
            this.logger.error('syncModels', e);
        }

        setTimeout(this.syncModels, 1000);
    }

    getModels = () => {
        return this.civitAIModels.map(m => ({
            ...m,
            supported: this.storageModels.includes(m.version.id)
        }));
    }

    getStorageModels = () => {
        return this.storageModels;
    }
}

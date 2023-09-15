import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
const psTree = require('ps-tree');
import { exec } from 'child_process';
import { getModelByParam } from './models/models-config';

var kill = function (pid, signal = 'SIGKILL', callback) {
    callback = callback || function () { };
    var killTree = true;
    if (killTree) {
        psTree(pid, function (err, children) {
            [pid].concat(
                children.map(function (p) {
                    return p.PID;
                })
            ).forEach(function (tpid) {
                try { process.kill(tpid, signal) }
                catch (ex) { }
            });
            callback();
        });
    } else {
        try { process.kill(pid, signal) }
        catch (ex) { }
        callback();
    }
};

export enum TRAIN_STATUS {
    WAITING = 'WAITING',
    IN_PROGRESS = 'IN_PROGRESS',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
    CANCELED = 'CANCELED',
}

export enum TRAIN_MODEL {
    BASE = 'base',
    REAL = 'real',
}

const TRAIN_MODEL_MAP: Record<TRAIN_MODEL, string> = {
    base: 'runwayml/stable-diffusion-v1-5',
    real: 'SG161222/Realistic_Vision_V2.0',
}

export interface ITrainQueue {
    loraName: string;
    status: TRAIN_STATUS;
    process?: ChildProcessWithoutNullStreams;
    error?: string;
    trainModel: TRAIN_MODEL;
}

@Injectable()
export class AppService {
    queue: ITrainQueue[] = [];
    private readonly logger = new Logger(AppService.name);

    constructor(
        private configService: ConfigService,
    ) {
        this.trainLoop();
    }

    addTrain = (loraName: string, trainModel: TRAIN_MODEL) => {
        const train = this.getTrainInfo(loraName);

        if (train) {
            throw new Error('This train already in progress');
        }

        this.queue.push({ loraName, status: TRAIN_STATUS.WAITING, trainModel });

        return this.getTrainInfo(loraName);
    }

    getTrainNumberInQueue = (loraName: string) => {
        return this.queue.filter(
            t => t.status === TRAIN_STATUS.WAITING || t.status === TRAIN_STATUS.IN_PROGRESS
        ).findIndex(t => t.loraName === loraName);
    }

    getTrainInfo = (loraName: string) => {
        const train = this.queue.find(t => t.loraName === loraName);

        const numberInQueue = this.getTrainNumberInQueue(loraName);

        return train ?
            {
                loraName: train.loraName,
                status: train.status,
                error: train.error,
                trainModel: train.trainModel,
                numberInQueue
            } : undefined;
    }

    getAllTrains = () => {
        return this.queue.map(train => ({
            loraName: train.loraName,
            status: train.status,
            error: train.error,
            train: train.trainModel,
            numberInQueue: this.getTrainNumberInQueue(train.loraName)
        }))
    }

    trainLoop = async () => {
        try {
            const trains = this.queue.filter(t => t.status === TRAIN_STATUS.WAITING);

            for (let i = 0; i < trains.length; i++) {
                await this.startTrain(trains[i]);
            }
        } catch (e) {
            this.logger.error('trainLoop', e?.message);
        }

        setTimeout(() => this.trainLoop(), 1000);
    }

    startTrain = (train: ITrainQueue) => {
        return new Promise((res, rej) => {
            // const childProcess = spawn(
            //     `sh`, [`${this.configService.get('SERVICE_PATH')}/start.sh`, train.loraName],
            //     { detached: true }
            // );

            // train.process = childProcess;

            // childProcess.on('close', code => {
            //     if (code === 0) {
            //         train.status = TRAIN_STATUS.SUCCESS;
            //         res(true);
            //     } else {
            //         train.status = TRAIN_STATUS.CANCELED;
            //         rej('code not 0');
            //     }
            // }).on('error', (error) => {
            //     train.status = TRAIN_STATUS.ERROR;
            //     train.error = error?.message;

            //     this.logger.error('startTrain', `exec error: ${error}`)
            //     rej(error);
            // });
            train.status = TRAIN_STATUS.IN_PROGRESS;

            let trainModelPath = TRAIN_MODEL_MAP[train.trainModel];

            if (!trainModelPath) {
                const model = getModelByParam(train.trainModel);

                trainModelPath = model ?
                    `/home/ubuntu/ComfyUI/models/checkpoints/${model.path}`
                    : TRAIN_MODEL_MAP.base;
            }

            const proc = exec(
                `sh ${this.configService.get('SERVICE_PATH')}/start.sh ${train.loraName} ${trainModelPath}`,
                (err, stdout, stderr) => {
                    if (err) {
                        this.logger.error('startTrain', err);
                        train.status = TRAIN_STATUS.CANCELED;
                        rej(err);
                        return;
                    }

                    this.logger.log(`stdout: ${stdout}`);
                    this.logger.log(`stderr: ${stderr}`);

                    train.status = TRAIN_STATUS.SUCCESS;
                    res(true);
                });

            train.process = proc;
        })
    }

    stopTrain = (loraName: string) => {
        const train = this.queue.find(t => t.loraName === loraName);

        if (!train) {
            throw new Error('Train not found');
        }

        if (!train.process || train.status !== TRAIN_STATUS.IN_PROGRESS) {
            throw new Error('Train not started');
        }

        kill(train.process.pid, 'SIGKILL', () => { });

        return true;
    }
}

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import kill from 'tree-kill';

export enum TRAIN_STATUS {
    WAITING = 'WAITING',
    IN_PROGRESS = 'IN_PROGRESS',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
    CANCELED = 'CANCELED',
}

export interface ITrainQueue {
    loraName: string;
    status: TRAIN_STATUS;
    process?: ChildProcessWithoutNullStreams;
    error?: string;
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

    addTrain = (loraName: string) => {
        const train = this.getTrainInfo(loraName);

        if (train) {
            throw new Error('This train already in progress');
        }

        this.queue.push({ loraName, status: TRAIN_STATUS.WAITING });

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
                numberInQueue
            } : undefined;
    }

    getAllTrains = () => {
        return this.queue.map(train => ({
            loraName: train.loraName,
            status: train.status,
            error: train.error,
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
            train.status = TRAIN_STATUS.IN_PROGRESS;

            const childProcess = spawn(
                `sh`, [`${this.configService.get('SERVICE_PATH')}/start.sh`, train.loraName],
                { detached: true }
            );

            train.process = childProcess;

            childProcess.on('close', code => {
                if (code === 0) {
                    train.status = TRAIN_STATUS.SUCCESS;
                    res(true);
                } else {
                    train.status = TRAIN_STATUS.CANCELED;
                    rej('code not 0');
                }
            }).on('error', (error) => {
                train.status = TRAIN_STATUS.ERROR;
                train.error = error?.message;

                this.logger.error('startTrain', `exec error: ${error}`)
                rej(error);
            });
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

        train.process.kill();
        kill(train.process.pid);

        return true;
    }
}

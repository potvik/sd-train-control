import * as fs from 'fs';
import * as request from 'request';
import * as progress from 'request-progress';

export const civitaiReqListModelsParams = {
    json: {
        period: "AllTime",
        periodMode: "published",
        sort: "Highest Rated",
        types: ["Checkpoint"],
        view: "feed",
        cursor: null
    },
    meta: {
        values: {
            cursor: ["undefined"]
        }
    }
};

export const downloadFile = async (url: string, filename: string) => {
    return new Promise((res, rej) => {
        try {
            progress(request(url), {
                // throttle: 2000,                    // Throttle the progress event to 2000ms, defaults to 1000ms 
                // delay: 1000,                       // Only start to emit after 1000ms delay, defaults to 0ms 
                // lengthHeader: 'x-transfer-length'  // Length header to use, defaults to content-length 
            })
                .on('progress', (state) => {
                    console.log('progress', state);
                })
                .on('error', function (err) {
                    console.error('downloadFile', err);
                    rej(err);
                })
                .on('end', function () {
                    console.log('downloadFile', 'END');
                    res(true);
                })
                .pipe(fs.createWriteStream(filename));
        } catch (e) {
            console.error('downloadFile', url, filename, e);
            rej(e);
        }
    })
}

export const renameFile = (oldPath, newPath) => {
    return new Promise((res, rej) => {
        fs.rename(oldPath, newPath, (err) => {
            if (err) {
                rej(err);
            }

            res(true);
        });
    });
}
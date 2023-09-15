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
                    // console.log('progress', state);
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

export const modelExample = {
    "id": 4384,
    "name": "DreamShaper",
    "type": "Checkpoint",
    "nsfw": false,
    "status": "Published",
    "createdAt": "2023-01-12T01:31:27.233Z",
    "lastVersionAt": "2023-08-01T13:41:14.861Z",
    "publishedAt": "2023-01-12T02:31:27.233Z",
    "locked": false,
    "earlyAccessDeadline": null,
    "mode": null,
    "user": {
        "id": 53515,
        "username": "Lykon",
        "deletedAt": null,
        "image": "https://cdn.discordapp.com/avatars/180327464155742208/59254be18ccd627daf138d053327485d.png"
    },
    "tags": [
        4,
        12,
        18,
        46,
        172,
        310,
        342,
        1083,
        1237,
        2283,
        3922,
        5098,
        5133,
        5145,
        5158,
        5200,
        5207,
        5212,
        5245,
        5248,
        5269
    ],
    "hashes": [
        "c5372b26da3bd08e9aa4861d3273931d8c2990f2f0a41ed80d6ac88f4da873a4",
        "9e63083ae01901ff0e1668b43c1fbcaa3876d0d958fa4a8b7ff5d30fd68d923b",
        "73903a3bad50477e0641b4ebe529ef895a6de4f8ef6e16825e15153b7d299f7c",
        "ac84e05d5039d7a8aea3ced335ac7c56da6d3c6816465651f928b137c3a7b24a",
        "c01207ce7e33df523d3acb75bdc962e1d55496f565547ea41fd70c5e3b6980ec",
        "498c18f2a52a34bb41dd2072101787d037c6507d26ba28c2a589b90884dc6e0e",
        "f8869b4aeee2ee3b1603c041b513e5961c7f81cb605b9f2d52e1b43e09b7fb7e",
        "ed989d673dbf0153d1cd16994c1bfa27a0f13de1e60665aabcb99334ca5b78e9",
        "a1e232c37d2f59c2dce7bd49145d115ed134e8f30eff8fddea3fd0ac2a2356ea",
        "17364b458d5f2ece75827fda53febf2f92b5e2db96a5543304c82cf1e9aee63e",
        "6d492d946ca8e128bc61da13b7e931778c0ca45574000a59dc92127f8debdf01",
        "519e6fe53029c7896467d3e4e806891b4c115790a7f418d484a1daf890ecc3c2",
        "ffad8f3da766de2a56343e388df43941ee27143a03c596e0b8f06976d4fa52e9",
        "a60cfaa90decb28a1447f955e29220eb867e8e157f0ca8a4d3b839cd9cd4832a",
        "2336dbf342b059f88cae7e4f40d5619f3b7ad8ca6f8583fc913e7ddde18fb197",
        "853e7e85c46be9ad4815666cd335545df32dab5e0d22afe5ccc6ad9bda834b52",
        "8c87aba96b45656f7d47a5f10a09f59c2785ec6c0c437f0c3b10405d21cde667",
        "17364b458d5f2ece75827fda53febf2f92b5e2db96a5543304c82cf1e9aee63e",
        "b24e42e3bc52c83aa4a354aad311ee49eff2ed148235d97a9523fa0e292775d1",
        "8c87aba96b45656f7d47a5f10a09f59c2785ec6c0c437f0c3b10405d21cde667",
        "a1e232c37d2f59c2dce7bd49145d115ed134e8f30eff8fddea3fd0ac2a2356ea",
        "4e367dddcbf844034114bb078b022f929b8e685670a27698e400e8fa5e8a4b1c",
        "08acb74861f281b4649cf3c553505ca679273755ba0ac13d1971f4fbdd80d28f",
        "0e8df96ba4bd1b6fd95642ea0adc809be8372172809dcff4366308efcfe5ac61",
        "482fae2f3deca6f4a726e83924c1195131fb851296f5ef1e9b315e7354fb22c4",
        "6c8715d22517e6d2c61c847ed5f7abdd3ed2eb76bb5dff7d4ed3282754c2f25f",
        "1dceefec0715b23865d23c8145f2c1558bb4402570e6f2857b664d8cada46ae1",
        "9e9fa0d8225a1aaa4aa661f8da31b38a7b1d7e9379150ec12b9a6cca651db91a",
        "a845ff26936f79a98b6f4c142e936398c59c0d0a040caec49a1de68987de29e5",
        "c464e275684c36b987481638b420f3833077118f5d4cf89344e4010642ce76ea",
        "637d5dcb91d2b08195ba2baa07767d8004d3c950d61bc5f2a4eab367baa811c1",
        "13dfc9921f8d0cc3fbf769edc3c3723c9db1aee3f85d0603fc45c7cba86d3397",
        "bd19602ce0191c5720dae3b9ea272b855a906d3f168a788b666e5f9adb736e3b",
        "6b776c57d90f894e49549ac4d9bc5a356163fba1645d9561b267740db6b394af",
        "ba82f6bc65646128b5a294fcb5008ff67614cbed187d667ef3b9658726b06406",
        "3c7e791602fc0da48870d0d45698d0f4c3159aa293bc8f8f8acf10f8dba5c580",
        "0aa2c8f932fe5dd91319e1f51c2f96fdf7f651b5fcb6f88df30a579be848e9c1",
        "7f16bbcd80427ca1c7eb0f10778943964f3da6d443117f76dd49675ac2ac923e",
        "afb5fabc4f6a887305c47665aa4969acee69c0c7155881fac5cea063dc023172",
        "5415fd85c7e6c9e1d3050af0e27fd9f283c0f145d8244c375449158dd225dc0c",
        "770bbe8225939d5141aa8f4c6c3b636e9d358ef2755f9b175be3ace665fed8c6",
        "8e788e4a3589b112d42314c2134fff5b5aeb65779f7a0affe5028dfb2a67f362",
        "b76cc78ad9e2f001603f200d4e26153ce565a6ac3c179ada73d2e4a4071d4eac",
        "c249d7853b061e77fbe96ddb20687714591b518d30de3222ed38714a4e48e866",
        "879db523c30d3b9017143d56705015e15a2cb5628762c11d086fed9538abd7fd",
        "540fa535578b5842038c3eef4926f1ca41eb7c6bff5dcc02c1d316ee0f9b9efb",
        "db2c51c33339792df6baf443710c525440ce2e67617641368dd1688d57925926",
        "1f8bfb009cc2d8914834ddbe24b80be80217a0d47cc52e53eb584c638b58ef22",
        "30bd30436b78a7e44a89bf06ddf2472408352a815ebd6ac9d3a5e47a4465b79a"
    ],
    "rank": {
        "downloadCount": 545222,
        "favoriteCount": 32967,
        "commentCount": 749,
        "ratingCount": 2519,
        "collectedCount": 672,
        "rating": 4.954743946010321
    },
    "version": {
        "id": 128713,
        "earlyAccessTimeFrame": 0,
        "baseModel": "SD 1.5",
        "baseModelType": "Standard",
        "createdAt": "2023-07-29T15:56:46.392Z",
        "generationCoverage": {
            "covered": true
        }
    },
    "images": [
        {
            "id": 1777041,
            "userId": 53515,
            "name": "26072158-132340247-8k portrait of beautiful cyborg with brown hair, intricate, elegant, highly detailed, majestic, digital photography, art by artg_ed.png",
            "url": "dd9b038c-bd15-43ab-86ab-66e145ad7ff2",
            "nsfw": "None",
            "width": 1096,
            "height": 1648,
            "hash": "UFBMV#_29]IV~W-;X8NGTK%M-ps.%Mx[ogs.",
            "type": "image",
            "metadata": {
                "hash": "UFBMV#_29]IV~W-;X8NGTK%M-ps.%Mx[ogs.",
                "width": 1096,
                "height": 1648
            },
            "modelVersionId": 128713,
            "tags": [
                5193,
                1930,
                111761,
                112035,
                833,
                192,
                66,
                5133,
                2435,
                111759,
                5787,
                5942,
                111939
            ]
        },
        {
            "id": 1777043,
            "userId": 53515,
            "name": "26072224-5775713-(masterpiece), (extremely intricate_1.3), (realistic), portrait of a girl, the most beautiful in the world, (medieval armor), me.png",
            "url": "c1033497-007c-4a73-b812-915c8e32e8fe",
            "nsfw": "None",
            "width": 1120,
            "height": 1824,
            "hash": "UeIXaFNG%2-o~Wt6t7s:g4xuIoR*X9ozIUa}",
            "type": "image",
            "metadata": {
                "hash": "UeIXaFNG%2-o~Wt6t7s:g4xuIoR*X9ozIUa}",
                "width": 1120,
                "height": 1824
            },
            "modelVersionId": 128713,
            "tags": [
                5163,
                192,
                66,
                5133,
                5193,
                1930,
                5241,
                111761,
                5169,
                5484,
                111754,
                1441,
                112055,
                112056,
                111782
            ]
        },
        {
            "id": 1777944,
            "userId": 53515,
            "name": "26072285-951655291-cgmech, (realistic)_solo, white mecha robot, cape, science fiction, torn clothes, glowing, standing, robot joints, mecha, armor,.png",
            "url": "e6a56e46-ccbf-4de3-ad62-09afd2ad9b91",
            "nsfw": "None",
            "width": 1176,
            "height": 1912,
            "hash": "UuIY5@IVxuaz~qRjofj[tQWBRPWAbHM|M{Rk",
            "type": "image",
            "metadata": {
                "hash": "UuIY5@IVxuaz~qRjofj[tQWBRPWAbHM|M{Rk",
                "width": 1176,
                "height": 1912
            },
            "modelVersionId": 128713,
            "tags": [
                111756,
                111757,
                111758,
                8
            ]
        },
        {
            "id": 1777046,
            "userId": 53515,
            "name": "26072218-2067885436-(anime coloring, anime screencap, ghibli, mappa, anime style), 1girl, hatsune miku, white gown, angel, angel wings, golden halo,.png",
            "url": "1c1d4f13-21b0-4068-acd0-51a3ec1c18bc",
            "nsfw": "None",
            "width": 1024,
            "height": 1408,
            "hash": "UAH_}d9G00xV00?b~CIAO@IprWV?4:-;ITRP",
            "type": "image",
            "metadata": {
                "hash": "UAH_}d9G00xV00?b~CIAO@IprWV?4:-;ITRP",
                "width": 1024,
                "height": 1408
            },
            "modelVersionId": 128713,
            "tags": [
                7620,
                2397,
                111753,
                5163,
                192,
                66,
                5133,
                5484,
                111754,
                4,
                7168
            ]
        },
        {
            "id": 1781165,
            "userId": 53515,
            "name": "26072419-1584580292-masterpiece, (photorealistic_1.4), best quality, beautiful lighting, (ulzzang-6500_0.5), lucy _(cyberpunk_), 1girl, white hair,.png",
            "url": "e5f49ec5-62f7-4511-8be6-517042729091",
            "nsfw": "None",
            "width": 1352,
            "height": 1696,
            "hash": "UPC?lyt6V?.TI[o#X9xtDikCbIRO%2jYn~NH",
            "type": "image",
            "metadata": {
                "hash": "UPC?lyt6V?.TI[o#X9xtDikCbIRO%2jYn~NH",
                "width": 1352,
                "height": 1696
            },
            "modelVersionId": 128713,
            "tags": [
                5193,
                2435,
                66,
                334,
                111759,
                111765,
                111766,
                5484,
                111754
            ]
        },
        {
            "id": 1778542,
            "userId": 53515,
            "name": "26072341-3091544718-(masterpiece), (extremely intricate), fantasy, (((realistic portrait of an evil hermit, male, villain, anti hero, evil face, mas.png",
            "url": "399f1835-2eb3-42f9-80fc-5e7ffb98f5e9",
            "nsfw": "None",
            "width": 688,
            "height": 1024,
            "hash": "U68|eR.7E0IpMe9a9tIoEeNG$*s:5R?G~V-o",
            "type": "image",
            "metadata": {
                "hash": "U68|eR.7E0IpMe9a9tIoEeNG$*s:5R?G~V-o",
                "width": 688,
                "height": 1024
            },
            "modelVersionId": 128713,
            "tags": [
                5484,
                111754,
                66,
                5241,
                1441,
                5193,
                111783,
                7954,
                5163,
                192,
                5133,
                111759,
                111752,
                6628,
                2435,
                5617,
                111772,
                5787,
                5942
            ]
        },
        {
            "id": 1777053,
            "userId": 53515,
            "name": "26072042-5775694-Fashion magazine cover photo of a young asian female model with jet black hair, bold red lipstick, detailed skin, leather jacket.png",
            "url": "82887503-fb67-4b77-8f56-eecb6d230da2",
            "nsfw": "Mature",
            "width": 1176,
            "height": 1912,
            "hash": "UiK^+~WB_Nxu~qxubbbHx]M{jEt7t7oLRjWB",
            "type": "image",
            "metadata": {
                "hash": "UiK^+~WB_Nxu~qxubbbHx]M{jEt7t7oLRjWB",
                "width": 1176,
                "height": 1912
            },
            "modelVersionId": 128713,
            "tags": [
                5193,
                111783,
                7954,
                5163,
                192,
                66,
                5133,
                112157,
                5484,
                111754,
                111942,
                6924
            ]
        },
        {
            "id": 1777509,
            "userId": 53515,
            "name": "26072267-1221160284-film grain and (medium full shot_1.2) and 8K HD RAW photo of one of the most beautiful swedish woman from instagram and (Selfie.png",
            "url": "9a5690e9-fafc-4e9c-9bc0-b9aaad215562",
            "nsfw": "Mature",
            "width": 1024,
            "height": 1536,
            "hash": "UAI}3G=y0Nem0z~q?bE156t7-p%g009]D%-p",
            "type": "image",
            "metadata": {
                "hash": "UAI}3G=y0Nem0z~q?bE156t7-p%g009]D%-p",
                "width": 1024,
                "height": 1536
            },
            "modelVersionId": 128713,
            "tags": [
                2013,
                5163,
                66,
                5133,
                111844,
                111954,
                111955,
                508,
                7802,
                5241,
                1895,
                112072
            ]
        },
        {
            "id": 1777051,
            "userId": 53515,
            "name": "26072078-5775692-Portrait photo of muscular bearded guy in a worn mech suit, ((light bokeh)), intricate, (steel metal [rust]), elegant, sharp foc.png",
            "url": "9b64fd01-a4c5-4ecb-8c8f-cc8167a5c0bb",
            "nsfw": "None",
            "width": 1176,
            "height": 1912,
            "hash": "U59?:%={00T1={IT00xv0gf+}q-;Tyw]^PX8",
            "type": "image",
            "metadata": {
                "hash": "U59?:%={00T1={IT00xv0gf+}q-;Tyw]^PX8",
                "width": 1176,
                "height": 1912
            },
            "modelVersionId": 128713,
            "tags": [
                7659,
                5484,
                111754,
                66,
                5163,
                5231,
                5232,
                5241,
                1441
            ]
        },
        {
            "id": 1778026,
            "userId": 53515,
            "name": "26072311-1650465323-black humanoid made of rock, upper body, barechested, male,  ((masterpiece, best quality)),  , cracked skin, white electricity c.png",
            "url": "29d21927-d45d-4062-a7c4-45bba8226302",
            "nsfw": "None",
            "width": 1024,
            "height": 1536,
            "hash": "U6AK2L9G00t7?wIA00jY_3s.RORk01-:ITRj",
            "type": "image",
            "metadata": {
                "hash": "U6AK2L9G00t7?wIA00jY_3s.RORk01-:ITRj",
                "width": 1024,
                "height": 1536
            },
            "modelVersionId": 128713,
            "tags": [
                5484,
                111754,
                66,
                5241,
                1441,
                5163,
                5231,
                5232,
                321,
                111763,
                346,
                7757
            ]
        }
    ],
    "canGenerate": true,
    "supported": false
};
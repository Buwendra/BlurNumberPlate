const { fetch } = require('undici');
const gm = require('gm');
const fs = require('fs');
const sizeOf = require('image-size');
var convert = require('xml-js');
const { calcDis } = require('./calDistance');
const vision = require('@google-cloud/vision');

// read images and get licens plate location
async function readImage(fileName) {
    return new Promise(async (resolve, reject) => {
        try {
            pathToFile = './resources/' + fileName;
            //get image size
            const dimensions = await sizeOf(pathToFile)
            if (dimensions.type === 'png' || dimensions.type === 'jpeg') {
                console.log(dimensions)
                // vision client
                const client = new vision.ImageAnnotatorClient();
                const request = {
                    image: { content: fs.readFileSync(pathToFile) },
                };

                const [result] = await client.objectLocalization(request);

                const objects = result.localizedObjectAnnotations;
                var newVertises = [];
                for (object of objects) {
                    if (object.name === 'License plate') {
                        console.log(`Name: ${object.name}`);
                        const vertices = object.boundingPoly.normalizedVertices;
                        for (v of vertices) {
                            newVertises.push({ x: v.x * dimensions.width, y: v.y * dimensions.height })
                            console.log(newVertises);
                        }
                    } else {
                        console.log(`No License Plate ${fileName}`)
                        resolve('NoLicensePlate');
                    }
                }
                resolve({ path: pathToFile, vert: newVertises })
            } else {
                console.log(`This type is not supported ${dimensions.type}`)
                reject('WrongType')
            }
        } catch (e) {
            console.log(e);
            reject(e);
            // [Error: Uh oh!]
        }
    });
}

// draw a blured squear covering the License plate
async function drawBlur(pathToFile, newVertises, fileName) {
    return new Promise(async (resolve, reject) => {
        try {
            var tempX = 0;
            var tempY = 0;
            var width = 0;
            var height = 0;

            for (var v of newVertises) {
                if (tempX === 0 && tempY === 0) {
                    tempX = v.x;
                    tempY = v.y;
                } else {
                    var d = await calcDis(tempX, tempY, v.x, v.y)
                    tempX = v.x;
                    tempY = v.y;
                    width = d;
                }
            }
            var d = await calcDis(tempX, tempY, newVertises[0].x, newVertises[0].y)
            height = d;

            const img = gm(pathToFile)
            img.size((err, value) => {
                img.region(width, height, newVertises[0].x, newVertises[0].y)
                img.blur(20, 35)
                img.write("./output/" + fileName, function (err) {
                    if (!err) {
                        console.log('Blur Compleated');
                        resolve();
                    } else {
                        console.log(err)
                        reject();
                    }
                });
            })
        } catch (e) {
            console.log(e);
            reject(e);
            // [Error: Uh oh!]
        }
    });
}

// read xml file and get image info
async function getImageData(url) {
    try {
        const res = await fetch(url);
        const text = await res.text()
        var result = convert.xml2json(text, { compact: true, spaces: 4 });
        console.log(result);
        var jsonFull = JSON.parse(result)
        var output = [];

        await jsonFull.ListBucketResult.Contents.forEach(data => {
            if (data.Size._text > 0) {
                var temp = { url: url + "/" + data.Key._text }
                output.push(temp)
            }
        })
        console.log(output);
        return output;
    } catch (e) {
        console.log(e);
        // [Error: Uh oh!]
    }
}

module.exports = { readImage, drawBlur, getImageData };
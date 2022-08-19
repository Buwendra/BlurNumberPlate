const { removeFiles } = require('./services/removeFiles');
const { downloadFiles } = require('./services/getImages');
const { copyFileToGCS } = require('./services/uploadFile');
const { readImage, drawBlur, getImageData } = require('./services/imageFunctions')

// Main function
async function main() {
    try {
        const url = "http://sl-coding-test.s3.ap-southeast-2.amazonaws.com";
        await removeFiles();
        const urls = await getImageData(url);
        var fileNames = [];
        for (data of urls) {
            console.log(data.url)
            var arr = data.url.split("/")
            var filename = arr[arr.length - 1];
            fileNames.push({ name: filename })
            await downloadFiles(data.url, filename);
        }
        var output = [];
        for (data of fileNames) {
            console.log(data.name)
            const fileData = await readImage(data.name);
            if (fileData !== 'WrongType' && fileData !== 'NoLicensePlate') {
                await drawBlur(fileData.path, fileData.vert, data.name)
                const fileUrl = await copyFileToGCS(data.name, 'blurred_images_test', {})
                output.push({ fileUrl: fileUrl })
            }
        }
        console.log(output)
    } catch (e) {
        console.log(e);
        // [Error: Uh oh!]
    }

}

main()

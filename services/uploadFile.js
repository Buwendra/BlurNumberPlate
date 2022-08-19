const { Storage } = require('@google-cloud/storage');
const path = require('path')

const storage = new Storage();


/**
   * Get public URL of a file. The file must have public access
   */



/**
  * Copy file from local to a GCS bucket.
  * Uploaded file will be made publicly accessible.
  */
function copyFileToGCS(localFilePath, bucketName, options) {
    localFilePath = './output/' + localFilePath
    return new Promise(async (resolve, reject) => {
        try {
            options = options || {};

            const bucket = storage.bucket(bucketName);
            const fileName = path.basename(localFilePath);
            const file = bucket.file(fileName);

            await bucket.upload(localFilePath, options)
            await file.makePublic()
            resolve(`https://storage.googleapis.com/${bucketName}/${fileName}`)

        } catch (e) {
            console.log(e);
            reject(e)
            // [Error: Uh oh!]
        }
    })
};


module.exports = { copyFileToGCS };
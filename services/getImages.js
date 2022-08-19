const http = require('http'); // or 'https' for https:// URLs
const fs = require('fs');

//Downloading files 
async function downloadFiles(url, filename) {
    const file = await fs.createWriteStream("./resources/" + filename);
    console.log("Download Started");
    return new Promise((resolve, reject) => {
        try {
            http.get(url, (response) => {
                response.pipe(file);
                response.on("error", reject);
                file.on("finish", () => {
                    file.close();
                    console.log("Download Completed");
                    resolve();
                }).on("error", reject);
            }).on("error", reject);
        } catch (e) {
            console.log(e);
            reject(e)
            // [Error: Uh oh!]
        }
    });

}


module.exports = { downloadFiles };
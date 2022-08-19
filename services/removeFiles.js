const fs = require('fs');
const path = require('path');

// remove files from both resources and output folders
function removeFiles() {
    try {
        fs.readdir('./resources', (err, files) => {
            if (err) throw err;

            for (const file of files) {
                fs.unlink(path.join('./resources', file), err => {
                    if (err) throw err;
                });
            }
        });
        fs.readdir('./output', (err, files) => {
            if (err) throw err;

            for (const file of files) {
                fs.unlink(path.join('./output', file), err => {
                    if (err) throw err;
                });
            }
        });
    } catch (e) {
        console.log(e);
        // [Error: Uh oh!]
    }
}


module.exports = { removeFiles };
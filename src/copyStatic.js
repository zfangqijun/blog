const fs = require('fs');
const path = require('path');
const readdir = require("recursive-readdir");
const { recursionMkdir } = require("./recursionMkdir");

const cssReadPath = path.resolve(__dirname, '../template/css');
const cssWritePath = path.resolve(__dirname, '../dist/css');


const copyCss = async () => {
    const paths = await readdir(cssReadPath);
    await recursionMkdir(cssWritePath);

    for (let _path of paths) {
        const readStream = fs.createReadStream(_path);
        const writePath = path.resolve(cssWritePath, path.parse(_path).base);
        const writeStream = fs.createWriteStream(writePath);
        readStream.pipe(writeStream);
    }

}

module.exports = {
    copyCss
}

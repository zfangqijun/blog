const fs = require('fs').promises;
const path = require('path');
const readdir = require("recursive-readdir");
const { sortByDate } = require('./utils');

const articlesPath = path.resolve(__dirname, '../articles');

const ignoreFunc = (file, stats) => {
    const regexp = new RegExp(/\.md$/);
    return stats.isDirectory() || !regexp.test(file);
}

const getMdFilePathList = () => {
    return readdir(articlesPath, [ignoreFunc])
}

const readMdFiles = async (paths) => {
    const files = [];
    for (let path of paths) {
        const buffer = await fs.readFile(path);
        const fileTexts = buffer.toString().split('+++');
        const opt = JSON.parse(fileTexts[1]);

        files.push({
            opt: {
                ...opt,
                path: `/${opt.date}/${opt.tag}`
            },
            text: fileTexts[2]
        });
    }
    return sortByDate(files);
}


const getMdFiles = async () => {
    const paths = await getMdFilePathList();
    const files = await readMdFiles(paths);
    return files;
}

module.exports = {
    getMdFiles
}






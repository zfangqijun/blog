const path = require('path');
const fs = require('fs').promises;

const isDirExist = (_path) => {
    return fs.stat(_path).then(() => {
        return true;
    }).catch(() => {
        return false;
    });
}

const recursionMkdir = async (_path) => {
    if (await isDirExist(_path)) return;
    await recursionMkdir(path.parse(_path).dir);
    await fs.mkdir(_path);
}


module.exports = {
    recursionMkdir
};



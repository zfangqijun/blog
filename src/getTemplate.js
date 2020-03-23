const fs = require('fs').promises;
const path = require('path');

const homeTemplatePath = path.resolve(__dirname, '../template/index.ejs');
const articleTemplatePath = path.resolve(__dirname, '../template/article.ejs');

const getHomeTemplate = async () => {
    const buffer = await fs.readFile(homeTemplatePath);
    return buffer.toString();
}

const getArticleTemplate = async () => {
    const buffer = await fs.readFile(articleTemplatePath);
    return buffer.toString();
}

module.exports = {
    getHomeTemplate,
    getArticleTemplate
}
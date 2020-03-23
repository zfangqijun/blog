const ejs = require('ejs');
const fs = require('fs').promises;
const path = require('path');

const { md } = require('./md');
const { getMdFiles } = require('./getMdFiles');
const { getHomeTemplate, getArticleTemplate } = require('./getTemplate');
const { recursionMkdir } = require('./recursionMkdir');

const distPath = path.resolve(__dirname, '../dist');

const createHomePage = async () => {
    const files = await getMdFiles();
    const template = await getHomeTemplate();
    const articleLinks = files.map((item) => {
        return `
        <li id="article-item">
            <div id="date">${item.opt.date}</div>
            <a href="${item.opt.path}">
            ${item.opt.title}
            </a>
        </li>`;
    })

    const html = ejs.render(template, { articleLinks }, {
        rmWhitespace: true,
    });

    fs.writeFile(path.resolve(distPath, 'index.html'), Buffer.from(html))
}

const createArticlePage = async () => {
    const files = await getMdFiles();
    const template = await getArticleTemplate();

    for (let file of files) {
        const article = md.render(file.text);
        const html = ejs.render(template,
            {
                article,
                title: file.opt.title
            },
            {
                rmWhitespace: true,
            }
        );

        const dirPath = path.resolve(distPath, `.${file.opt.path}`);
        await recursionMkdir(dirPath);

        fs.writeFile(
            path.resolve(dirPath, './index.html'),
            Buffer.from(html)
        )
    }
}

const createPage = async () => {
    createHomePage();
    createArticlePage();
}

module.exports = {
    createPage
}

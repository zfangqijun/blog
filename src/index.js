
const { copyCss, copyImages } = require('./copyStatic');
const { createPage } = require('./createPage');

createPage();
copyCss();
copyImages();

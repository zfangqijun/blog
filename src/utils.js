const sortByDate = (files) => {
    files.sort((a, b) => {
        const date1 = new Date(a.opt.date);
        const date2 = new Date(b.opt.date);
        return date2.getTime() - date1.getTime();
    })
    return files;
}

module.exports = {
    sortByDate,
}
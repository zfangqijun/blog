const sortByDate = (files) => {
    files.sort((a, b) => {
        const date1 = new Date(a.opt.date);
        const date2 = new Date(b.opt.date);
        return date1.getTime() - date2.getTime();
    })
    return files;
}

module.exports = {
    sortByDate,
}
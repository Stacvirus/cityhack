const { PORT, HOST } = process.env;

function imageLinkRefactoring(link) {
  return `${HOST}${PORT}/${link}`;
}

module.exports = imageLinkRefactoring;

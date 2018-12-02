const fs = require('fs')

module.exports = class Storage {

  constructor(pathFile) {

    this.pathFileScope = './scope' + pathFile;
    this.pathFileReport = './reports' + pathFile;
    this.encoding = 'ascii';
    this.deliver = /\r\n/;

  }

  getScope (FileScope) {

    return fs.readFileSync(this.pathFileScope, this.encoding).split(this.deliver);

  }

  setReport (data) {

    return fs.writeFileSync(`${this.pathFileReport}`, data, 'binary');

  }

};

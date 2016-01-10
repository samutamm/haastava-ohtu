
const fs = require('fs');

module.exports = function(config) {
  var vcFolderPath = process.cwd() + '/' + config.vcFolderName;
  fs.access(vcFolderPath, fs.F_OK, function(err) {
    if(err) {
      createVcFolder(vcFolderPath);
    } else {
      console.log('Folder ' + config.vcFolderName + ' allready exists.');
    }
  });
}

function createVcFolder(vcFolderPath) {
  fs.mkdir(vcFolderPath, function(err) {
    if(err) {
      console.log('Cannot create ' + vcFolderPath);
    } else {
      console.log('Initialized empty repository in ' + vcFolderPath);
    }
  });
}

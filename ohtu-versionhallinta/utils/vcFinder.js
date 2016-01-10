const fs = require('fs');

var finder = {
  findVcFolder: function(vcFolderName, rootPath, callback) {
    if (rootPath === "") {
      callback(null);
      return;
    }
    var currentFolderPath = rootPath + '/' + vcFolderName;
    fs.access(currentFolderPath, fs.F_OK, function(err) {
      if (err) {
        finder.findVcFolder(vcFolderName, finder.parentFile(rootPath), callback);
      } else {
        callback(currentFolderPath);
      }
    });
  },
  parentFile: function(path) {
    for(var i = path.length - 1; i >= 0; i--) {
      if(path.charAt(i) === '/') {
        return path.substring(0, i);
      }
    }
    return "";
  }
};

module.exports = finder;

const fs = require('fs');
const async = require('async');
const vcFinder = require('../utils/vcFinder.js');
const copier = require('../utils/copier.js');

module.exports = function(config) {
  const fileToSave = process.argv[3];
  vcFinder.findVcFolder(config.vcFolderName, process.cwd(), function(vcPath) {
    if(!vcPath) {
      console.log('No ' + config.vcFolderName + '-folder found in path.');
      return;
    } else {
      saveFile(vcPath, fileToSave, process.cwd());
    }
  });
}

function saveFile(vcPath, filename, root) {
  const date = new Date();
  const dayStr = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
  async.series({
    fileExists: function(callback) {
      fs.access(root + '/' + filename, fs.F_OK, function(err) {
        if (err) {
          callback('File ' + filename + ' does not exist.', null);
        } else {
          callback(null, null);
        }
      });
    },
    dateFolderExists: function(callback) {
      const dayPath = vcPath + '/' + dayStr;
      fs.access(dayPath, fs.F_OK, function(err) {
        if(err) {
          fs.mkdir(dayPath, function(err) {
            callback(err, null);
          });
        } else {
          callback(null,null);
        }
      });
    },
    copyfile: function(callback) {
      const timeStr = date.getHours() + '.' + date.getMinutes();
      const newFileName = dayStr + '/' + timeStr + '.' + filename;
      copier.copyFile(root + '/' + filename, vcPath + '/' + newFileName, function(err) {
        if(err) {
          callback('Could not copy file: ' + err, null);
        } else {
          callback(null, null);
        }
      });
    }
  },
  function(err, results) {
    if(err) console.log(err);
  });
}

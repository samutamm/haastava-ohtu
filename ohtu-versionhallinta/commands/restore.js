const fs = require('fs');
const vcFinder = require('../utils/vcFinder.js');
const copier = require('../utils/copier.js');
const async = require('async');
const readline = require('readline');

const date = process.argv[3];
const filename = process.argv[4];

module.exports = function(config) {
  async.waterfall([
    async.apply(searchVcFolder, config),
    checkThereIsFiles,
    listAndChooseFile,
    copyFile
  ],
    function(err, results) {
      if(err) {
        console.log(err);
      } else {
        console.log(results);
      }
    });
}

function filterByFileName(files, fileName) {
  return files.filter(function(file) {
    return file.indexOf(fileName) !== -1;
  });
}

function searchVcFolder(config, callback) {
  vcFinder.findVcFolder(config.vcFolderName, process.cwd(), function(vcPath) {
    if(vcPath) {
      callback(null, vcPath);
    } else {
      callback('Cannot find vcFolder in path ' + process.cwd(), null);
    }
  });
}

function checkThereIsFiles(vcPath, callback) {
  const folderPath = vcPath + '/' + date;
  fs.access(folderPath, fs.F_OK, function(err) {
    if(err) {
      callback('No files saved in ' + date, null);
    } else {
      callback(null, folderPath);
    }
  });
}

function listAndChooseFile(path, callback) {
  fs.readdir(path, function(err, files) {
    if(err) callback(err,null);
    files = filterByFileName(files, filename);
    if(files.length === 0) {
      callback('No files found with ' + date + ' and ' + filename, null);
    }else if(files.length === 1) {
      callback(null, files[0], path);
    } else {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      console.log('Files to choose: ');
      for(var i in files) {
        console.log(files[i] + ' [' + i + ']');
      }
      rl.question('Which file you would like to restore? (give number)', function(index){
        if(files[index] !== undefined) {
          callback(null, files[index], path);
        } else {
          callback('No such index!', null);
        }
        rl.close();
      });
    }
  });
}

function copyFile(vcFilename, path, callback) {
  copier.copyFile(path + '/' + vcFilename, filename, function(err) {
    if(err) {
      callback('Could not restore file: ' + err, null);
    } else {
      callback(null, 'Restored version: ' + vcFilename);
    }
  });
}

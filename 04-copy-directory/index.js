const fs = require('fs');
const path = require('path');

const folderSource = path.join(__dirname, 'files');
const folderDestination = path.join(__dirname, 'files-copy');

fs.rm(folderDestination, { recursive: true, force: false }, (error) => {
  if (error) {
    createFolder(folderDestination);
    copyFiles(folderSource, folderDestination);
  } else {
    createFolder(folderDestination);
    copyFiles(folderSource, folderDestination);
  }
});

function createFolder(destination) {
  fs.mkdir(destination, { recursive: true }, (error) => {
    if (error) {
      console.log('Error: ', error.message);
    }
  });
}

function copyFiles(source, destination) {
  fs.readdir(source, { withFileTypes: true }, (error, files) => {
    if (error) {
      console.log('Error: ', error.message);
    }
    if (files) {
      files.forEach(file => {
        if (file.isFile()) {
          fs.copyFile(path.join(source, file.name), path.join(destination, file.name), (error) => {
            if (error) {
              console.log('Error: ', error.message);
            }
          });
        }
        if (file.isDirectory()) {
          const subFolderDestination = path.join(destination, file.name);
          const subFolderSource = path.join(source, file.name);
          createFolder(subFolderDestination);
          copyFiles(subFolderSource, subFolderDestination, (error) => {
            if (error) {
              console.log('Error: ', error.message);
            }
          });
        }
      });
    }
  });
}

/* function deleteFiles(folder) {
  fs.readdir(folder, { withFileTypes: true }, (error, files) => {
    if (error) {
      console.log('Error: ', error.message);
    }
    files.forEach(file => {
      fs.rm(`${folder}/${file.name}`, { recursive: true, force: true }, (error) => {
        if (error) {
          console.log('Error: ', error.message);
        }
      });
    });
  });
} */

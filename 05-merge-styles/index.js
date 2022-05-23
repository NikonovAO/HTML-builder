const fs = require('fs');
const path = require('path');

const folderStyles = path.join(__dirname, 'styles');
const folderDist = path.join(__dirname, 'project-dist');
const bundleCss = path.join(folderDist, 'bundle.css');

function mergeStyles(source, destination) {
  fs.readdir(source, { withFileTypes: true }, (error, files) => {
    if (error) {
      console.log('Error: ', error.message);
    }
    if (files) {
      let bundleStyles = '';
      files.forEach(file => {
        const fileExtension = path.extname(file.name);
        if(fileExtension === '.css') {
          fs.readFile(path.join(source, file.name), 'utf8', (error, data) => {
            if (error) {
              console.log('Error: ', error.message);
            }
            bundleStyles += data;
            fs.writeFile(destination, bundleStyles, (error) => {
              if (error) {
                console.log('Error: ', error.message);
              }
            });
          });
        }
      });
    }
  });
}

mergeStyles(folderStyles, bundleCss);

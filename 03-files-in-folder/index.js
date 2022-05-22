const fs = require('fs');
const path = require('path');

const fileLocation = path.join(__dirname, 'secret-folder');

async function readDirectory(pathFolder) {
  const files = await fs.promises.readdir(pathFolder, { withFileTypes: true });
  files.forEach(file => {
    if (file.isFile()) {
      calcSizeFiles(fileLocation, file.name, file);
    }
  });

  function calcSizeFiles(locationFile, nameFile, file) {
    fs.stat(`${locationFile}/${nameFile}`, (err, stats) => {
      if(err) {
        console.log('Error: ', err);
      }
      const fileName = path.basename(nameFile, path.extname(nameFile));
      const fileExtension = path.extname(file.name).substring(1);
      const sizeFile = `${(stats.size / 1024).toFixed(3)} kb`;
      console.log(`${fileName} - ${fileExtension} - ${sizeFile}`);
    });
  }
}
readDirectory(fileLocation);
const fs = require('fs');
const path = require('path');

const folderStyles = path.join(__dirname, 'styles');
const folderAssets = path.join(__dirname, 'assets');
const folderComponents = path.join(__dirname, 'components');
const templateHtml = path.join(__dirname, 'template.html');

const bundleFolder = path.join(__dirname, 'project-dist');
const bundleCss = path.join(bundleFolder, 'style.css');
const bundleHtml = path.join(bundleFolder, 'index.html');
const bundleAssets = path.join(bundleFolder, 'assets');

fs.rm(bundleFolder, { recursive: true, force: false }, async (error) => {
  if (error) {
    await createFolder(bundleFolder);
    await mergeStyles(folderStyles, bundleCss);
    copyFiles(folderAssets, bundleAssets);
    await mergeHtml(templateHtml, folderComponents, bundleHtml);
  } else {
    await createFolder(bundleFolder);
    await mergeStyles(folderStyles, bundleCss);
    copyFiles(folderAssets, bundleAssets);
    await mergeHtml(templateHtml, folderComponents, bundleHtml);
  }
});

async function createFolder(destination) {
  fs.mkdir(destination, { recursive: true }, (error) => {
    if (error) {
      console.log('Error: ', error.message);
    }
  });
}

async function mergeStyles(source, destination) {
  fs.readdir(source, { withFileTypes: true }, (error, files) => {
    if (error) {
      console.log('Error: ', error.message);
    }
    if (files) {
      let bundleStyles = '';
      files.forEach(file => {
        const fileExtension = path.extname(file.name);
        if (fileExtension === '.css') {
          fs.readFile(path.join(source, file.name), 'utf8', (error, data) => {
            if (error) {
              console.log('Error: ', error.message);
            }
            bundleStyles += `${data}\n`;
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

function copyFiles(source, destination) {
  fs.readdir(source, { withFileTypes: true }, (error, files) => {
    if (error) {
      console.log('Error: ', error.message);
    }
    createFolder(destination);
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

async function mergeHtml(template, source, destination) {
  let templateSrc = await fs.promises.readFile(template, 'utf8');
  fs.readdir(source, { withFileTypes: true }, (error, files) => {
    if (error) {
      console.log('Error: ', error.message);
    }
    if (files) {
      files.forEach(file => {
        const fileExtension = path.extname(file.name);
        if (fileExtension === '.html') {
          fs.readFile(path.join(source, file.name), 'utf8', async (error, data) => {
            if (error) {
              console.log(error.message);
            }
            templateSrc = templateSrc.replace(`{{${path.basename(file.name, fileExtension)}}}`, data);
            await fs.promises.writeFile(destination, templateSrc, (error) => {
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

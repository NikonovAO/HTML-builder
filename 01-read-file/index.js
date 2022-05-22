const fs = require('fs');
const path = require('path');

const fileLocation = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(fileLocation, 'utf8');

readStream.on('data', (chunk) => {
  console.log(chunk);
});
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputDirectory = './src/img';
const outputDirectory = './dist/img';

fs.readdir(inputDirectory, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(files);

  files.forEach((file) => {
    // Check if the file is an image (you may need to adjust this check depending on your file types)
    if (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')) {
      const inputFilePath = path.join(inputDirectory, file);
      const outputFilePath = path.join(outputDirectory, `${file.slice(0, -4)}.jpg`);
      sharp(inputFilePath)
        .jpeg({ quality: 60 })
        .toFile(outputFilePath, (err, info) => {
          if (err) {
            console.error(err);
          } else {
            console.log(info);
          }
        });
    }
  });
});
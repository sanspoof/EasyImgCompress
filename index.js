// import fs from 'fs';
// import path from 'path';
// import sharp from 'sharp';

// CommonJS modules, not ES6 modules (import/export) as can encounter more problems from this with Node.js
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Change these based on directory structure..
// Although keeping src and dist is a good idea

const inputDirectory = 'src';
const outputDirectory = 'dist';
const minWidthForResize = 1000; // Minimum width for resizing
const outputQuality = 60; // Output quality (0 - 100)

async function convertImagesStandard(directory) {

  try {

    const files = await fs.promises.readdir(directory);

    console.log(files);

    for (const file of files) {

      const filePath = path.join(directory, file);

      const fileStat = await fs.promises.stat(filePath);

      if (fileStat.isDirectory()) {

        const outputSubdirectory = path.join(directory.replace(inputDirectory, outputDirectory), file);

        if (!fs.existsSync(outputSubdirectory)) {

          fs.mkdirSync(outputSubdirectory, { recursive: true }); // Create directory recursively if it doesn't exist

        }
        await convertImagesStandard(filePath); // Recursively process subdirectories

      } else if (fileStat.isFile()) {

        // Check if the file is an image (JPEG or PNG) .... can add more formats here if you want??
        if (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')) {

          const outputSubdirectory = directory.replace(inputDirectory, outputDirectory);

          const inputFilePath = filePath;

          const fileExtension = path.extname(file);

          const fileNameWithoutExtension = path.basename(file, fileExtension);

          const outputFileName = `${fileNameWithoutExtension}${fileExtension}`;

          const outputFilePath = path.join(outputSubdirectory, outputFileName);

          const metadata = await sharp(inputFilePath).metadata();

          const { width } = metadata;

          if (width <= minWidthForResize) {

            // Skip resizing if the image is not wider than the minimum width for resizing
            await fs.promises.copyFile(inputFilePath, outputFilePath);

            console.log(`Copied ${file} without resizing.`);
          } else {

            await sharp(inputFilePath)

              .resize({ width: minWidthForResize }) // Resize if over set limit

              .toFile(outputFilePath, { quality: outputQuality });

            console.log(`Resized ${file} to minimum width: ${minWidthForResize} with output quality: ${outputQuality}`);

          }

        }

      }

    }

  } catch (err) {

    console.error(err);

  }

}

// convertImagesStandard(inputDirectory);



// below is converted to webp instead of converting using the extension already there...

const webPOutputQuality = 60; // 0 - 100

function convertImagestoWebP(directory) {

  fs.readdir(directory, (err, files) => {

    if (err) {

      console.error(err);

      return;

    }

    console.log(files);

    files.forEach((file) => {

      const filePath = path.join(directory, file);

      const fileStat = fs.statSync(filePath);

      if (fileStat.isDirectory()) {

        const outputSubdirectory = path.join(directory.replace(inputDirectory, outputDirectory), file);

        if (!fs.existsSync(outputSubdirectory)) {

          fs.mkdirSync(outputSubdirectory, { recursive: true }); // Create directory recursively if it doesn't exist

        }

        convertImagestoWebP(filePath); // Recursively process subdirectories

      } else if (fileStat.isFile()) {

        // Check if the file is an image (JPEG or PNG) .... can add more formats here if you want??

        if (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')) {

          const outputSubdirectory = directory.replace(inputDirectory, outputDirectory);

          const inputFilePath = filePath;

          const fileExtension = path.extname(file);

          const fileNameWithoutExtension = path.basename(file, fileExtension);

          const outputFileName = `${fileNameWithoutExtension}.webp`;

          const outputFilePath = path.join(outputSubdirectory, outputFileName);

          sharp(inputFilePath)

            .webp({ quality: webPOutputQuality }) // Convert to WebP format

            .toFile(outputFilePath, (err, info) => {

              if (err) {

                console.error(err);

              } else {

                console.log(info);

              }

            });

        }

      }

    });

  });

}

//convertImagestoWebP(inputDirectory);

module.exports = {
  convertImagesStandard,
  convertImagestoWebP
};



const args = process.argv.slice(2);

const functionToRun = args[0];

switch (functionToRun) {

  case 'convertImagesStandard':

    convertImagesStandard(inputDirectory);

    break;

  case 'convertImagestoWebP':

    convertImagestoWebP(inputDirectory);

    break;

  default:
    console.log('please specify a function to run');

}

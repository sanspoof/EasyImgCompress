const fs = require('fs');

const path = require('path');

const sharp = require('sharp');

// Change these based on directory structure..
// Althought keeping src and dist is a good idea

const inputDirectory = 'src';
const outputDirectory = 'dist';

const webpOutputQuality = 60; // 0 - 100

function convertImages(directory) {

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

        convertImages(filePath); // Recursively process subdirectories

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

            .webp({ quality: webpOutputQuality }) // Convert to WebP format

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

convertImages(inputDirectory);

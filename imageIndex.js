const fs = require('fs');
const path = require('path');

const checkArrayHasDuplicateValue = (list, value) => {
  let count = 0;
  list = list.map((item) => item.split('.')[0]);

  list.forEach((item) => {
    if (item === value) count += 1;
  });

  return count > 1;
};

const createIndex = (dir, files) => {
  let str = '';

  files.forEach((file) => {
    const filePath = path.join(dir, file); // Get the full path of the file
    // Check if the file is a directory
    if (
      supportedExtensions.includes(file.split('.').at(-1)) &&
      !fs.statSync(filePath).isDirectory()
    ) {
      if (
        checkArrayHasDuplicateValue(
          files.map((file) => file.split('.')[0]),
          file.split('.')[0],
        )
      ) {
        let fileName = `${file.split('.')[0].replaceAll('-', '_')}_${
          file.split('.')[1]
        }`;
        if (/^\d/.test(fileName)) {
          fileName = 'img' + fileName;
        }
        str += `import ${fileName} from "./${file}";\n`;
      } else {
        let fileName = file.split('.')[0].replaceAll('-', '_');
        if (/^\d/.test(fileName)) {
          fileName = 'img' + fileName;
        }
        str += `import ${fileName} from "./${file}";\n`;
      }
    }
  });

  let dirName = dir.split('/').at(-1);
  if (/^\d/gi.test(dirName)) {
    dirName = 'dir' + dirName;
  }
  str += `\nexport const ${dirName.replaceAll('.', '_')} = {\n`;

  files.forEach((file) => {
    const filePath = path.join(dir, file); // Get the full path of the file
    if (
      supportedExtensions.includes(file.split('.').at(-1)) &&
      !fs.statSync(filePath).isDirectory()
    ) {
      if (
        checkArrayHasDuplicateValue(
          files.map((file) => file.split('.')[0]),
          file.split('.')[0],
        )
      ) {
        let fileName = `${file.split('.')[0].replaceAll('-', '_')}_${
          file.split('.')[1]
        }`;
        if (/^\d/.test(fileName)) {
          fileName = 'img' + fileName;
        }
        str += `"${fileName.replaceAll('_', '-')}":${fileName.replaceAll(
          '-',
          '_',
        )},\n`;
      } else {
        let fileName = file.split('.')[0];
        if (/^\d/.test(fileName)) {
          fileName = 'img' + fileName;
        }
        str += `  ${
          fileName.includes('-') ? `"${fileName}"` : fileName
        }: ${fileName.replaceAll('-', '_')},\n`;
      }
    }
  });

  str += `};\n`;

  fs.writeFileSync(`${dir}/index.ts`, str);
};

function walkDir(dir) {
  const files = fs.readdirSync(dir); // Read the contents of the directory

  if (
    files.find((item) => {
      return supportedExtensions.includes(item.split('.').at(-1));
    })
  ) {
    createIndex(dir, files);
  }

  files.forEach((file) => {
    const filePath = path.join(dir, file); // Get the full path of the file

    // Check if the file is a directory
    if (fs.statSync(filePath).isDirectory()) {
      // If it's a directory, recursively call walkDir
      walkDir(filePath);
    } else {
      // If it's a file, you can do something with it here
    }
  });
}

const supportedExtensions = ['svg', 'jpg', 'png', 'jpeg'];

let directoryPath = '../src/assets';
walkDir(directoryPath);

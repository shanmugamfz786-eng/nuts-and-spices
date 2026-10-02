const fs = require('fs');

function replaceInFile(filePath) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.replace(/919876543210/g, '919655298540');
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Updated ' + filePath);
  }
}

replaceInFile('./src/data/products.js');
replaceInFile('./server/config/db.js');
replaceInFile('./server/scripts/initDb.js');

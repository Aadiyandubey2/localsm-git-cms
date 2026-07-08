const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src', 'utils', 'mongoose-mock');
const destDir = path.join(__dirname, '..', 'node_modules', 'mongoose');

console.log(`Copying mock mongoose from ${srcDir} to ${destDir}...`);

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(path.join(srcDir, 'index.js'), path.join(destDir, 'index.js'));
fs.writeFileSync(
  path.join(destDir, 'package.json'),
  JSON.stringify({
    name: "mongoose",
    version: "1.0.0",
    main: "index.js"
  }, null, 2)
);

console.log('Mock mongoose installed successfully.');

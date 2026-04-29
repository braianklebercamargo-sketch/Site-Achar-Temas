import fs from 'fs';

const postsPath = 'src/data/posts.json';
const postsData = JSON.parse(fs.readFileSync(postsPath, 'utf8'));

const urls = new Set();
// Search in stringified postsData
const strData = fs.readFileSync(postsPath, 'utf8');
const matches = strData.match(/https:\/\/achartemas\.com\/wp-content\/uploads\/[a-zA-Z0-9\/\-\._]+/g) || [];

for (const match of matches) {
  urls.add(match);
}

// Write urls to a file to inspect
fs.writeFileSync('urls.json', JSON.stringify([...urls], null, 2));
console.log('Found', urls.size, 'URLs');

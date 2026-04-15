import https from 'https';

https.get('https://achartemas.com/', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const imgRegex = /<img[^>]+src="([^">]+)"/g;
    let match;
    const images = [];
    while ((match = imgRegex.exec(data)) !== null) {
      images.push(match[1]);
    }
    console.log(JSON.stringify(images, null, 2));
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});

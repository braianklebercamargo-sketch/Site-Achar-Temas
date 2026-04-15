import https from 'https';

https.get('https://achartemas.com/', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const titleRegex = /<h[1-6][^>]*>(.*?)<\/h[1-6]>/g;
    let match;
    const titles = [];
    while ((match = titleRegex.exec(data)) !== null) {
      titles.push(match[1].replace(/<[^>]+>/g, '').trim());
    }
    console.log("TITLES:");
    console.log(JSON.stringify(titles, null, 2));

    const pRegex = /<p[^>]*>(.*?)<\/p>/g;
    const paragraphs = [];
    while ((match = pRegex.exec(data)) !== null) {
      paragraphs.push(match[1].replace(/<[^>]+>/g, '').trim());
    }
    console.log("PARAGRAPHS:");
    console.log(JSON.stringify(paragraphs, null, 2));
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});

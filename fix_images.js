import fs from 'fs';
import https from 'https';

async function downloadBinary(urlStr, dest) {
  return new Promise((resolve, reject) => {
    https.get(urlStr, (res) => {
      if (res.statusCode !== 200) {
        return resolve(false);
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(true));
      });
    }).on('error', err => reject(err));
  });
}

async function run() {
  console.log("Fetching live posts...");
  const fetchJson = urlStr => new Promise((resolve, reject) => {
    https.get(urlStr, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const posts = await fetchJson('https://achartemas.com/wp-json/wp/v2/posts?per_page=100');
  console.log(`Fetched ${posts.length} posts`);

  const files = fs.readdirSync('public/wp-images');
  console.log(`Found ${files.length} corrupted local images`);

  let urls = [];
  
  // Extract URLs
  for (const p of posts) {
    const html = p.content.rendered;
    const matches = html.match(/https:\/\/achartemas\.com\/wp-content\/uploads\/[0-9]{4}\/[0-9]{2}\/[^\s"']+/g) || [];
    urls.push(...matches);
    
    // Also get yoast etc
    if (p.yoast_head_json?.og_image?.[0]?.url) {
      urls.push(p.yoast_head_json.og_image[0].url);
    }
  }

  // Favicon
  urls.push("https://achartemas.com/wp-content/uploads/2025/03/Favicon-AT-1.png");
  // Profile pic maybe?
  urls.push("https://achartemas.com/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-06-at-10.05.17.jpeg");
  urls.push("https://achartemas.com/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-25-at-21.43.21-1024x768.jpeg");
  urls.push("https://achartemas.com/wp-content/uploads/2026/01/WhatsApp-Image-2026-01-30-at-21.00.45-1024x682.jpeg");

  // unique
  urls = [...new Set(urls)];

  console.log(`Found ${urls.length} unique image URLs from live data.`);

  // Map to local filenames
  for (const url of urls) {
    const filename = url.split('/').pop().split('?')[0];
    
    // Which files in local match this filename?
    const matchFiles = files.filter(f => f.endsWith(filename));
    for (const mf of matchFiles) {
       console.log(`Redownloading ${mf} from ${url}`);
       await downloadBinary(url, 'public/wp-images/' + mf);
    }
  }
}
run();


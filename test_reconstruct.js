import fs from 'fs';
import https from 'https';

async function downloadBinary(urlStr, dest) {
  return new Promise((resolve, reject) => {
    https.get(urlStr, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', 'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8' } }, (res) => {
      if (res.statusCode !== 200) {
        console.log("Failed", res.statusCode, urlStr)
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

const postsPath = 'src/data/posts.json';
const postsData = JSON.parse(fs.readFileSync(postsPath, 'utf8'));
const files = fs.readdirSync('public/wp-images');

async function run() {
  for (const post of postsData) {
    const d = new Date(post.date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    
    // Find all files matching content-{post.id}- or featured-{post.id}-
    const postFiles = files.filter(f => f.startsWith(`content-${post.id}-`) || f.startsWith(`featured-${post.id}-`));
    
    for (const file of postFiles) {
      // Reconstruct original URL
      let baseName = file.replace(`content-${post.id}-`, '').replace(`featured-${post.id}-`, '');
      let dest = `public/wp-images/${file}`;
      
      const url = `https://achartemas.com/wp-content/uploads/${year}/${month}/${baseName}`;
      console.log("Downloading", url, "to", dest);
      const success = await downloadBinary(url, dest);
      
      if (!success) {
         // Maybe the image was from a previous month or generic?
         console.log("Failed to download", url);
      }
    }
  }

  // Also download the specific ones
  await downloadBinary("https://achartemas.com/wp-content/uploads/2025/03/Favicon-AT-1.png", "public/wp-images/Favicon-AT-1.png");
  await downloadBinary("https://achartemas.com/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-06-at-10.05.17.jpeg", "public/wp-images/WhatsApp-Image-2025-07-06-at-10.05.17.jpeg");
}
run();

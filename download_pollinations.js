import fs from 'fs';
import https from 'https';

const posts = JSON.parse(fs.readFileSync('src/data/posts.json', 'utf8'));

async function downloadBinary(urlStr, dest) {
  return new Promise((resolve, reject) => {
    let req;
    
    const timeoutId = setTimeout(() => {
      req.destroy();
      resolve(false);
    }, 15000); // 15s timeout
    
    req = https.get(urlStr, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        clearTimeout(timeoutId);
        return resolve(downloadBinary(res.headers.location, dest));
      }
      if (res.statusCode !== 200) {
        clearTimeout(timeoutId);
        return resolve(false);
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          clearTimeout(timeoutId);
          resolve(true);
        });
      });
    }).on('error', err => {
      clearTimeout(timeoutId);
      resolve(false);
    });
  });
}

async function run() {
  console.log("Starting generation...");
  let count = 0;
  
  // Create a generic placeholder for failures
  const fallbackUrl = 'https://dummyimage.com/800x600/333333/ffffff&text=AcharTemas';
  
  for (const post of posts) {
    const dest = `public/wp-images/generated-${post.id}.jpg`;
    
    if (fs.existsSync(dest)) {
       const stats = fs.statSync(dest);
       if (stats.size > 10000) continue; // valid
    }

    try {
      console.log(`Generating for post ${post.id}: ${post.title.rendered.substring(0, 30)}`);
      // Use pollinations:
      const prompt = `Hyper realistic aesthetic photograph representing ${post.title.rendered.substring(0, 50)}`;
      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=600&nologo=true&seed=${post.id}`;
      
      let success = await downloadBinary(url, dest);
      if (!success) {
         console.log(`Fallback for ${post.id}`);
         // fallback placeholder
         await downloadBinary(`https://loremflickr.com/800/600/${encodeURIComponent(post.title.rendered.split(' ')[0])}`, dest);
      } else {
         count++;
      }
    } catch (err) { }
  }
  
  const cats = [
    { name: 'cultura', prompt: 'Michael Jackson e astros do Pop' },
    { name: 'ciencia', prompt: 'Natureza ciencia e biologia' },
    { name: 'arte', prompt: 'Oculos de realidade virtual quadros museu' },
    { name: 'gastro', prompt: 'Prato de comida gourmet e roupas chiques' }
  ];
  
  for (const cat of cats) {
     const dest = `public/wp-images/cat-${cat.name}.jpg`;
     if (fs.existsSync(dest)) {
       const stats = fs.statSync(dest);
       if (stats.size > 10000) continue;
     }
     const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(cat.prompt)}?width=800&height=600&nologo=true`;
     let success = await downloadBinary(url, dest);
     if (!success) await downloadBinary(fallbackUrl, dest);
  }
  
  console.log(`Generated additional images.`);
}

run();

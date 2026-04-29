import fs from 'fs';
import archiver from 'archiver';

const output = fs.createWriteStream('public/wp-images-backup.zip');
const archive = archiver('zip', {
  zlib: { level: 9 }
});

output.on('close', function() {
  console.log(archive.pointer() + ' total bytes');
  console.log('Images backup zip created successfully at public/wp-images-backup.zip');
});

archive.on('error', function(err) {
  throw err;
});

archive.pipe(output);
archive.directory('public/wp-images/', 'wp-images');
archive.finalize();

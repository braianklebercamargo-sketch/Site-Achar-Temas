import fs from 'fs';
import archiver from 'archiver';

const output = fs.createWriteStream('public/site-export.zip');
const archive = archiver('zip', {
  zlib: { level: 9 }
});

output.on('close', function() {
  console.log(archive.pointer() + ' total bytes');
  console.log('Site export zip created successfully at public/site-export.zip');
});

archive.on('error', function(err) {
  throw err;
});

archive.pipe(output);
// We want the contents of dist to be at the root of the zip
archive.directory('dist/', false);
archive.finalize();

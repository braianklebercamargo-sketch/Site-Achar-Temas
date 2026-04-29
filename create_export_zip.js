import fs from 'fs';
import archiver from 'archiver';

const output = fs.createWriteStream('export_wordpress.zip');
const archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level.
});

output.on('close', function() {
  console.log(archive.pointer() + ' total bytes');
  console.log('Archiver has been finalized and the output file descriptor has closed.');
});

archive.on('error', function(err) {
  throw err;
});

archive.pipe(output);

// Append the XML file
archive.file('wp_export.xml', { name: 'wp_export.xml' });

// Append all images
archive.directory('public/wp-images/', 'wp-images');

// Also include the raw JSON data just in case
archive.file('src/data/posts.json', { name: 'raw_data/posts.json' });
archive.file('src/data/categories.json', { name: 'raw_data/categories.json' });
archive.file('src/data/comments.json', { name: 'raw_data/comments.json' });

archive.finalize();

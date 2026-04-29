import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import archiver from 'archiver';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Construindo a aplicação React...');
execSync('npm run build', { stdio: 'inherit' });

console.log('Copiando os arquivos para a pasta do tema wordpress...');
const themeDir = path.join(__dirname, 'achar-temas');
const distDir = path.join(__dirname, 'dist');
const themeDistDir = path.join(themeDir, 'dist');

if (fs.existsSync(themeDistDir)) {
    fs.rmSync(themeDistDir, { recursive: true, force: true });
}
fs.mkdirSync(themeDistDir);

// Copia o build da pasta dist para a pasta do tema
function copyDir(src, dest) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest);
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}
copyDir(distDir, themeDistDir);

// Retira os arquivos da pasta public/wp-images e coloca dentro do arquivo ZIP (mas na raiz de upload, ou na pasta imgs do tema, mas como wp-images)
// Eles não devem mudar os caminhos do react, então deixamos o react usar /wp-images/...

const output = fs.createWriteStream(path.join(__dirname, 'achar-temas.zip'));
const archive = archiver('zip', {
    zlib: { level: 9 }
});

output.on('close', function() {
    console.log(`\nTema empacotado com sucesso! Arquivo: achar-temas.zip (${archive.pointer()} bytes)`);
    console.log('Você já pode fazer o upload desse arquivo pelo painel do WordPress ou cPanel.');
});

archive.on('error', function(err) {
    throw err;
});

archive.pipe(output);
archive.directory(themeDir, 'achar-temas');
archive.finalize();

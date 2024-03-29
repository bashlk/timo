const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, 'packages');
const destination = path.join(__dirname, 'dist');

fs.readdirSync(source, { withFileTypes: true }).forEach(dirent => {
    if (dirent.isDirectory()) {
        const currentPath = path.join(source, dirent.name);
        const distPath = path.join(currentPath, 'dist');
        const outputPath = path.join(destination, dirent.name);

        if (fs.existsSync(distPath)) {
            fs.mkdirSync(outputPath, { recursive: true });
            fs.cpSync(distPath, outputPath, { recursive: true });
        }
    }
});
const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        const p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) walk(p, callback);
        else if (p.endsWith('.jsx') || p.endsWith('.js')) callback(p);
    });
}

walk('frontend/src', (file) => {
    let content = fs.readFileSync(file, 'utf8');
    let lines = content.split('\n');
    let inFunction = 0;
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (line.match(/(?:function |const [A-Za-z0-9_]+\s*=\s*(?:\([^)]*\)|[^=]*?)\s*=>)/)) inFunction++;
        if (line.match(/^}/)) inFunction = Math.max(0, inFunction - 1);
        
        if (inFunction === 0 && line.includes('t(')) {
            // Ignore some false positives
            if (line.includes('transparent') || line.includes('gradient')) continue;
            console.log(`Global t() in ${file}:${i+1} - ${line.trim()}`);
        }
    }
});

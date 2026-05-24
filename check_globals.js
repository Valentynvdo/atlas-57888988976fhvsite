const fs = require('fs');

function check(file) {
    let content = fs.readFileSync(file, 'utf8');
    let lines = content.split('\n');
    let inFunction = 0;
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (line.match(/(?:function |const [A-Za-z0-9_]+\s*=\s*(?:\([^)]*\)|[^=]*?)\s*=>)/)) inFunction++;
        if (line.match(/^}/)) inFunction = Math.max(0, inFunction - 1);
        
        if (inFunction === 0 && line.includes('t(')) {
            console.log(`Global t() in ${file}:${i+1} - ${line.trim()}`);
        }
    }
}

['frontend/src/pages/Terms.jsx', 'frontend/src/pages/Contacts.jsx', 'frontend/src/pages/Admin.jsx', 'frontend/src/components/atlas/LivingIntelligence.jsx'].forEach(check);

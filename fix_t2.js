const fs = require('fs');

function checkFile(file) {
    let content = fs.readFileSync(file, 'utf8');
    let hasGlobalT = false;
    
    // Quick heuristic for top-level t() usage
    let lines = content.split('\n');
    let inFunction = 0;
    for (let i=0; i<lines.length; i++) {
        let line = lines[i];
        if (line.match(/(?:function |const [A-Za-z0-9_]+\s*=\s*(?:\([^)]*\)|[^=]*?)\s*=>)/)) inFunction++;
        if (line.match(/^}/)) inFunction = Math.max(0, inFunction - 1);
        
        if (inFunction === 0 && line.includes('t(')) {
            console.log(`Global t() in ${file}:${i+1} - ${line}`);
            hasGlobalT = true;
        }
    }
}

['frontend/src/pages/Dashboard.jsx', 'frontend/src/pages/Docs.jsx', 'frontend/src/components/atlas/AtlasComparison.jsx', 'frontend/src/components/atlas/AbsoluteAwareness.jsx', 'frontend/src/components/atlas/Navbar.jsx'].forEach(checkFile);


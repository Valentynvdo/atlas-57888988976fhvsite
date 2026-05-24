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
    if (!content.includes('t(')) return;

    // Check if there are global uses of t(...) outside of any curly braces (very rough heuristic)
    // Actually simpler: just find all components that don't have useTranslation
    let matches = [...content.matchAll(/(?:function ([A-Z]\w+)|const ([A-Z]\w+)\s*=\s*(?:\([^)]*\)|[^=]*?)\s*=>)\s*{([^]*?)}/g)];
    for (let m of matches) {
        let name = m[1] || m[2];
        let body = m[3];
        if (body.includes('t(') && !body.includes('const { t } = useTranslation()') && !body.match(/const \{[^}]*t[^}]*\} = useTranslation\(\)/)) {
            console.log(`Component ${name} in ${file} uses t but missing useTranslation`);
        }
    }
    
    // Check for global const ... = [ ... t(...) ... ]
    let globals = [...content.matchAll(/const\s+([A-Z_0-9]+)\s*=\s*\[[^]*?\];/g)];
    for (let m of globals) {
        if (m[0].includes('t(')) {
            console.log(`Global array ${m[1]} in ${file} uses t()!`);
        }
    }
});

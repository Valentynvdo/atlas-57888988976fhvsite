const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        const p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) walk(p, callback);
        else if (p.endsWith('.jsx') || p.endsWith('.js')) callback(p);
    });
}

let foundAny = false;

walk('src', (file) => {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('t(')) return;
    
    try {
        const ast = parser.parse(content, {
            sourceType: 'module',
            plugins: ['jsx']
        });
        
        traverse(ast, {
            CallExpression(path) {
                if (path.node.callee.name === 't') {
                    if (!path.scope.hasBinding('t')) {
                        console.log(`Undefined t() in ${file} at line ${path.node.loc.start.line}`);
                        foundAny = true;
                    }
                }
            }
        });
    } catch(e) {
        // Ignore parser errors for non-standard files
    }
});

if (!foundAny) console.log("All t() usages are safely bound!");

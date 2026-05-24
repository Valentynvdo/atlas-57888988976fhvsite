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

walk('src', (file) => {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('t(')) return;
    
    let ast;
    try {
        ast = parser.parse(content, {
            sourceType: 'module',
            plugins: ['jsx']
        });
    } catch(e) {
        return;
    }
    
    let injections = [];
    
    traverse(ast, {
        CallExpression(path) {
            if (path.node.callee.name === 't' && !path.scope.hasBinding('t')) {
                const fnParent = path.getFunctionParent();
                if (fnParent) {
                    const body = fnParent.node.body;
                    if (body.type === 'BlockStatement') {
                        // We need to inject at the start of this block
                        injections.push(body.loc.start.line);
                    } else {
                        // Arrow function with implicit return: `() => t(...)`
                        // We need to convert it or we just wrap it. But usually it's a component.
                        console.log(`Needs manual fix for implicit return in ${file} line ${path.node.loc.start.line}`);
                    }
                }
            }
        }
    });
    
    if (injections.length > 0) {
        // Unique lines and sort descending so we don't mess up line numbers when inserting
        injections = [...new Set(injections)].sort((a, b) => b - a);
        let lines = content.split('\n');
        let modified = false;
        
        for (let lineNum of injections) {
            // lineNum is 1-indexed, but it's the line where `{` is.
            // We want to insert `const { t } = useTranslation();` right after the `{`
            let idx = lineNum - 1;
            let lineStr = lines[idx];
            let match = lineStr.match(/\{/);
            if (match) {
                let col = match.index;
                let before = lineStr.substring(0, col + 1);
                let after = lineStr.substring(col + 1);
                lines[idx] = before + ' const { t } = useTranslation(); ' + after;
                modified = true;
            }
        }
        
        if (modified) {
            // Check if useTranslation is imported
            if (!lines.some(l => l.includes('useTranslation'))) {
                lines.unshift('import { useTranslation } from "react-i18next";');
            }
            fs.writeFileSync(file, lines.join('\n'));
            console.log(`Fixed ${file}`);
        }
    }
});

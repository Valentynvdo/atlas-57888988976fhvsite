const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        const p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) walk(p, callback);
        else if (p.endsWith('.jsx') || p.endsWith('.js')) callback(p);
    });
}

const babel = require('@babel/core');

walk('frontend/src', (file) => {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('t(') && !content.includes('t:')) return;

    try {
        const out = babel.transformSync(content, {
            plugins: [
                function({ types: t }) {
                    return {
                        visitor: {
                            Identifier(path) {
                                if (path.node.name === 't' && path.isReferencedIdentifier()) {
                                    // Check if t is defined in scope
                                    if (!path.scope.hasBinding('t')) {
                                        // Find the closest function scope
                                        const fnParent = path.getFunctionParent();
                                        if (fnParent) {
                                            // Check if it's a React component
                                            const isReactComponent = fnParent.node.id && /^[A-Z]/.test(fnParent.node.id.name) 
                                                || (fnParent.parent.type === 'VariableDeclarator' && /^[A-Z]/.test(fnParent.parent.id.name));
                                            
                                            if (isReactComponent) {
                                                console.log(`Missing t in component: ${file} at line ${path.node.loc.start.line}`);
                                            } else {
                                                console.log(`Missing t outside component: ${file} at line ${path.node.loc.start.line}`);
                                            }
                                        } else {
                                            console.log(`Missing t globally: ${file} at line ${path.node.loc.start.line}`);
                                        }
                                    }
                                }
                            }
                        }
                    };
                }
            ],
            presets: ['@babel/preset-react'],
            filename: file,
            ast: false,
            code: false
        });
    } catch (e) {
        console.error(`Error in ${file}: ${e.message}`);
    }
});

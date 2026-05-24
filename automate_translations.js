const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');
const path = require('path');

const filesToTranslate = [
  "frontend/src/components/atlas/MacOSControl.jsx",
  "frontend/src/components/atlas/SmartConcierge.jsx",
  "frontend/src/components/atlas/AbsoluteAwareness.jsx",
  "frontend/src/components/atlas/AtlasComparison.jsx",
  "frontend/src/pages/Docs.jsx",
  "frontend/src/pages/Privacy.jsx",
  "frontend/src/pages/Terms.jsx",
  "frontend/src/pages/Contacts.jsx",
  "frontend/src/pages/Admin.jsx",
  "frontend/src/pages/AdminPin.jsx"
];

let allExtracted = {};
let counter = 1000;

function containsCyrillic(str) {
  return /[\u0400-\u04FF]/.test(str);
}

function generateKey(str) {
  counter++;
  return "txt_" + counter;
}

filesToTranslate.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  
  const code = fs.readFileSync(filePath, 'utf-8');
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript']
  });

  let modified = false;

  traverse(ast, {
    StringLiteral(path) {
      if (
        path.parentPath.isImportDeclaration() ||
        path.parentPath.isObjectProperty({ key: path.node }) ||
        (path.parentPath.isJSXAttribute() && ["placeholder", "title", "label", "alt", "eyebrow"].indexOf(path.parentPath.node.name.name) === -1)
      ) {
        return;
      }
      
      if (containsCyrillic(path.node.value)) {
        const val = path.node.value.trim();
        const key = generateKey(val);
        allExtracted[key] = val;
        
        if (path.parentPath.isJSXAttribute()) {
          path.replaceWith(t.jsxExpressionContainer(
            t.callExpression(t.identifier('t'), [t.stringLiteral(key)])
          ));
        } else {
          path.replaceWith(
            t.callExpression(t.identifier('t'), [t.stringLiteral(key)])
          );
        }
        modified = true;
        path.skip();
      }
    },
    JSXText(path) {
      if (containsCyrillic(path.node.value)) {
        const val = path.node.value.trim();
        if (!val) return;
        
        const key = generateKey(val);
        allExtracted[key] = val;
        
        path.replaceWith(t.jsxExpressionContainer(
          t.callExpression(t.identifier('t'), [t.stringLiteral(key)])
        ));
        modified = true;
        path.skip();
      }
    }
  });

  if (modified) {
    let hasImport = false;
    traverse(ast, {
      ImportDeclaration(path) {
        if (path.node.source.value === 'react-i18next') hasImport = true;
      }
    });

    if (!hasImport) {
      ast.program.body.unshift(
        t.importDeclaration(
          [t.importSpecifier(t.identifier('useTranslation'), t.identifier('useTranslation'))],
          t.stringLiteral('react-i18next')
        )
      );
      
      traverse(ast, {
        ExportDefaultDeclaration(path) {
          if (path.node.declaration.type === 'FunctionDeclaration') {
            const body = path.node.declaration.body.body;
            body.unshift(
              t.variableDeclaration('const', [
                t.variableDeclarator(
                  t.objectPattern([t.objectProperty(t.identifier('t'), t.identifier('t'), false, true)]),
                  t.callExpression(t.identifier('useTranslation'), [])
                )
              ])
            );
          }
        }
      });
    }

    const output = generate(ast, {}, code);
    fs.writeFileSync(filePath, output.code);
    console.log("Updated", filePath);
  }
});

fs.writeFileSync("extracted_translations.json", JSON.stringify(allExtracted, null, 2));
console.log(`Extracted ${Object.keys(allExtracted).length} strings`);

const fs = require('fs');
const glob = require('glob');
const path = require('path');

const files = glob.sync('src/pages/**/*.jsx');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  if (!content.includes('useNavigate')) {
    continue;
  }
  
  // Replace import
  if (content.includes('import { useNavigate } from "react-router-dom";')) {
    content = content.replace('import { useNavigate } from "react-router-dom";', 'import { useNavigate } from "react-router-dom";\nimport useLocalizedNavigate from "../hooks/useLocalizedNavigate";');
  } else if (content.match(/import \{[^}]*useNavigate[^}]*\} from "react-router-dom";/)) {
    const match = content.match(/import \{[^}]*useNavigate[^}]*\} from "react-router-dom";/)[0];
    content = content.replace(match, match + '\nimport useLocalizedNavigate from "../hooks/useLocalizedNavigate";');
  }

  // Replace usage
  content = content.replace(/const navigate = useNavigate\(\);/g, 'const navigate = useLocalizedNavigate();');

  fs.writeFileSync(file, content);
}
console.log("Done");

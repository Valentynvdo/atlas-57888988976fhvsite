const fs = require('fs');

const ukPath = './src/locales/uk.json';
const enPath = './src/locales/en.json';

const uk = JSON.parse(fs.readFileSync(ukPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

uk.living_intel.eyebrow = "Живий Інтелект";
en.living_intel.eyebrow = "Living Intelligence";

fs.writeFileSync(ukPath, JSON.stringify(uk, null, 2) + '\n');
fs.writeFileSync(enPath, JSON.stringify(en, null, 2) + '\n');

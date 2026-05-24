const fs = require('fs');

function fixMacOSControl() {
    let path = 'frontend/src/components/atlas/MacOSControl.jsx';
    let code = fs.readFileSync(path, 'utf8');
    if (code.includes('const cards = [{')) {
        code = code.replace(/const cards = \[\{([\s\S]*?)\];/g, '');
        code = code.replace('export default function MacOSControl() {', `export default function MacOSControl() {\n  const cards = [{ $1 ];`);
        fs.writeFileSync(path, code);
        console.log("Fixed MacOSControl.jsx");
    }
}

function fixAbsoluteAwareness() {
    let path = 'frontend/src/components/atlas/AbsoluteAwareness.jsx';
    let code = fs.readFileSync(path, 'utf8');
    if (!code.includes('const { t } = useTranslation()') || code.split('const { t } = useTranslation()').length < 3) {
        code = code.replace('function FaceIDOrb() {', `function FaceIDOrb() {\n  const { t } = useTranslation();`);
        fs.writeFileSync(path, code);
        console.log("Fixed AbsoluteAwareness.jsx");
    }
}

function fixAtlasComparison() {
    let path = 'frontend/src/components/atlas/AtlasComparison.jsx';
    let code = fs.readFileSync(path, 'utf8');
    if (!code.split('useTranslation()').length || code.split('useTranslation()').length < 3) {
        code = code.replace('function ComparisonCategory({', `function ComparisonCategory({\n  title,\n  icon,\n  normalBullets,\n  atlasBullets,\n  delay,\n  visualType\n}) {\n  const { t } = useTranslation();\n  return ( // ... placeholder `);
        // Better:
        let parts = code.split('visualType\n}) {\n');
        if (parts.length > 1) {
            fs.writeFileSync(path, parts[0] + 'visualType\n}) {\n  const { t } = useTranslation();\n' + parts[1]);
            console.log("Fixed AtlasComparison.jsx");
        }
    }
}

function fixDashboard() {
    let path = 'frontend/src/pages/Dashboard.jsx';
    let code = fs.readFileSync(path, 'utf8');
    if (code.includes('const FAQ_ITEMS = [')) {
        code = code.replace(/const FAQ_ITEMS = \[\s*\{[\s\S]*?\];/g, '');
        // Just redefine it inside FAQ function
        let faqItemsStr = `const FAQ_ITEMS = [
  { q: t("dashboard.faq_q1"), a: t("dashboard.faq_a1") },
  { q: t("dashboard.faq_q2"), a: t("dashboard.faq_a2") },
  { q: t("dashboard.faq_q3"), a: t("dashboard.faq_a3") },
  { q: t("dashboard.faq_q4"), a: t("dashboard.faq_a4") },
  { q: t("dashboard.faq_q5"), a: t("dashboard.faq_a5") },
];`;
        code = code.replace('function FAQ({ items, t }) {', `function FAQ({ t }) {\n  ${faqItemsStr}`);
        code = code.replace('<FAQ items={FAQ_ITEMS} t={t} />', '<FAQ t={t} />');
        fs.writeFileSync(path, code);
        console.log("Fixed Dashboard.jsx");
    }
}

function fixDocs() {
    let path = 'frontend/src/pages/Docs.jsx';
    let code = fs.readFileSync(path, 'utf8');
    if (code.includes('const SECTIONS = [')) {
        let match = code.match(/const SECTIONS = \[\s*\{[\s\S]*?\];/g);
        if (match) {
            code = code.replace(match[0], '');
            code = code.replace('export default function Docs() {', `export default function Docs() {\n  ${match[0]}`);
            fs.writeFileSync(path, code);
            console.log("Fixed Docs.jsx");
        }
    }
}

function fixNavbar() {
    let path = 'frontend/src/components/atlas/Navbar.jsx';
    let code = fs.readFileSync(path, 'utf8');
    if (code.includes('const navLinks = [')) {
        let match = code.match(/const navLinks = \[\s*\{[\s\S]*?\];/g);
        if (match) {
            code = code.replace(match[0], '');
            code = code.replace('export default function Navbar({ onCta }) {', `export default function Navbar({ onCta }) {\n  ${match[0]}`);
            fs.writeFileSync(path, code);
            console.log("Fixed Navbar.jsx");
        }
    }
}

function fixLivingIntelligence() {
    let path = 'frontend/src/components/atlas/LivingIntelligence.jsx';
    let code = fs.readFileSync(path, 'utf8');
    if (code.includes('const features = [')) {
        let match = code.match(/const features = \[\s*\{[\s\S]*?\];/g);
        if (match) {
            code = code.replace(match[0], '');
            code = code.replace('export default function LivingIntelligence() {', `export default function LivingIntelligence() {\n  ${match[0]}`);
            fs.writeFileSync(path, code);
            console.log("Fixed LivingIntelligence.jsx");
        }
    }
}

fixMacOSControl();
fixAbsoluteAwareness();
fixAtlasComparison();
fixDashboard();
fixDocs();
fixNavbar();
fixLivingIntelligence();


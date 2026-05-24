const fs = require('fs');

const ukPath = './src/locales/uk.json';
const enPath = './src/locales/en.json';

const uk = JSON.parse(fs.readFileSync(ukPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

uk.final_cta = {
  soon: "Скоро",
  title_1: "Готові зустріти свого Атласа?",
  desc: "Приєднуйтесь до списку очікування першими — і будьте серед тих, хто змінить спосіб взаємодії з macOS.",
  btn: "Зустрічайте Атлас"
};

en.final_cta = {
  soon: "Coming soon",
  title_1: "Ready to meet your Atlas?",
  desc: "Join the waitlist first — and be among those who will change the way they interact with macOS.",
  btn: "Meet Atlas"
};

fs.writeFileSync(ukPath, JSON.stringify(uk, null, 2) + '\n');
fs.writeFileSync(enPath, JSON.stringify(en, null, 2) + '\n');

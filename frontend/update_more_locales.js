const fs = require('fs');

const ukPath = './src/locales/uk.json';
const enPath = './src/locales/en.json';

const uk = JSON.parse(fs.readFileSync(ukPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

uk.auth = uk.auth || {};
uk.auth.logging_in = "Завершуємо вхід…";

en.auth = en.auth || {};
en.auth.logging_in = "Logging in...";

uk.coming_soon = {
  title: "Скоро серед вас.",
  desc: "Атлас зараз навчається. Ми готуємо приватну бета-програму для перших користувачів macOS — і дамо вам знати, щойно вона стане доступною.",
  btn: "Зрозуміло"
};

en.coming_soon = {
  title: "Coming soon to your Mac.",
  desc: "Atlas is currently learning. We are preparing a private beta program for early macOS users — and we will let you know as soon as it is available.",
  btn: "Understood"
};

fs.writeFileSync(ukPath, JSON.stringify(uk, null, 2) + '\n');
fs.writeFileSync(enPath, JSON.stringify(en, null, 2) + '\n');

const fs = require('fs');

async function translate(text) {
  if (!text.trim() || (text.trim().length === 1 && !text.match(/[а-яА-ЯіІїЇєЄґҐ]/))) return text;
  
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=uk&tl=en&dt=t&q=${encodeURIComponent(text)}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data[0].map(x => x[0]).join('');
  } catch (e) {
    console.error("Error:", text, e.message);
    return text;
  }
}

async function main() {
  const data = JSON.parse(fs.readFileSync('extracted_translations.json', 'utf8'));
  const enData = {};
  let count = 0;
  const total = Object.keys(data).length;
  console.log(`Starting ${total} translations...`);
  
  for (const [k, v] of Object.entries(data)) {
    enData[k] = await translate(v);
    count++;
    if (count % 20 === 0) {
      console.log(`Translated ${count}/${total}`);
      fs.writeFileSync('en_extracted.json', JSON.stringify(enData, null, 2));
    }
    // sleep
    await new Promise(r => setTimeout(r, 100));
  }
  
  fs.writeFileSync('en_extracted.json', JSON.stringify(enData, null, 2));
  console.log('Done!');
}
main();

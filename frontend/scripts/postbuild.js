const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const buildDir = path.join(__dirname, '..', 'build');

if (!fs.existsSync(buildDir)) {
  console.log("Build directory not found, skipping postbuild.");
  process.exit(0);
}

// 1. Read build/index.html to extract the injected JS/CSS tags
const builtIndexHtml = fs.readFileSync(path.join(buildDir, 'index.html'), 'utf8');
const scriptTagsMatch = builtIndexHtml.match(/<script defer="defer" src="\/static\/js\/[^>]+><\/script>/g);
const cssTagsMatch = builtIndexHtml.match(/<link href="\/static\/css\/[^>]+" rel="stylesheet">/g);

const scriptTags = scriptTagsMatch ? scriptTagsMatch.join('') : '';
const cssTags = cssTagsMatch ? cssTagsMatch.join('') : '';

// 2. Read base HTML files from public/
const baseHtmlUk = fs.readFileSync(path.join(publicDir, 'index.html'), 'utf8');
const baseHtmlEn = fs.readFileSync(path.join(publicDir, 'en', 'index.html'), 'utf8');

const pages = {
  blog: {
    uk: {
      title: "Блог Atlas AI — Штучний Інтелект, Автоматизація та macOS",
      description: "Останні новини, статті та технічні інсайти від команди Atlas AI. Читайте про розвиток автономних ШІ-агентів, локальні LLM та майбутнє екосистеми Apple."
    },
    en: {
      title: "Atlas AI Blog — Artificial Intelligence, Automation & macOS",
      description: "Latest news, articles, and technical insights from the Atlas AI team. Read about the development of autonomous AI agents, local LLMs, and the future of the Apple ecosystem."
    }
  },
  docs: {
    uk: {
      title: "Документація Atlas AI — Інструкції з налаштування локального ШІ",
      description: "Повний посібник користувача Atlas AI. Інструкції з налаштування локальної бази знань, підключення Telegram-бота, конфігурації голосового керування та автоматизації macOS."
    },
    en: {
      title: "Atlas AI Documentation — Local AI Setup Guides",
      description: "Complete Atlas AI documentation and user manuals. Learn how to configure local AI knowledge bases, set up Telegram bot integration, voice commands, and macOS automation tasks."
    }
  },
  careers: {
    uk: {
      title: "Кар'єра в Atlas AI — Вакансії для AI & Swift Розробників",
      description: "Приєднуйтесь до команди Atlas AI. Вакансії для Swift, SwiftUI та AI інженерів у стартапі штучного інтелекту. Створюйте автономні ШІ-агенти для macOS разом з нами."
    },
    en: {
      title: "Careers at Atlas AI — Join the Next-Gen AI Macbook Team",
      description: "Explore remote AI engineer jobs and Swift/SwiftUI developer vacancies at Atlas AI setup. Help us build the best personal AI assistant for macOS productivity."
    }
  },
  investors: {
    uk: {
      title: "Інвестиції в ШІ-стартап Atlas AI — Майбутнє Автономних Агентів для macOS",
      description: "Інформація для інвесторів та партнерів Atlas AI. Інвестуйте в перспективний штучний інтелект для макбук та автономні ШІ-агенти на ринку корпоративного софту."
    },
    en: {
      title: "Invest in Atlas AI — The Future of Autonomous AI Agents for macOS",
      description: "Information for investors and partners of Atlas AI. Invest in promising artificial intelligence for macbook and autonomous AI agents in the corporate software market."
    }
  }
};

function generateHtml(baseHtml, meta, urlPath) {
  let html = baseHtml;
  
  html = html.replace(/<meta name="description" content="[^"]*" \/>/g, `<meta name="description" content="${meta.description}" />`);
  html = html.replace(/<meta property="og:description" content="[^"]*" \/>/g, `<meta property="og:description" content="${meta.description}" />`);
  html = html.replace(/<meta name="twitter:description" content="[^"]*" \/>/g, `<meta name="twitter:description" content="${meta.description}" />`);
  
  html = html.replace(/<meta property="og:title" content="[^"]*" \/>/g, `<meta property="og:title" content="${meta.title}" />`);
  html = html.replace(/<meta name="twitter:title" content="[^"]*" \/>/g, `<meta name="twitter:title" content="${meta.title}" />`);
  
  html = html.replace(/<link rel="canonical" href="https:\/\/atlas-assistant\.online\/[^"]*" \/>/g, `<link rel="canonical" href="https://atlas-assistant.online${urlPath}" />`);
  html = html.replace(/<meta property="og:url" content="https:\/\/atlas-assistant\.online\/[^"]*" \/>/g, `<meta property="og:url" content="https://atlas-assistant.online${urlPath}" />`);
  html = html.replace(/<meta name="twitter:url" content="https:\/\/atlas-assistant\.online\/[^"]*" \/>/g, `<meta name="twitter:url" content="https://atlas-assistant.online${urlPath}" />`);
  
  if (html.includes('<title>')) {
    html = html.replace(/<title>.*<\/title>/, `<title>${meta.title}</title>`);
  } else {
    html = html.replace('<!-- SEO Meta Tags -->', `<!-- SEO Meta Tags -->\n        <title>${meta.title}</title>`);
  }

  // Ensure scripts and css are injected
  if (cssTags && !html.includes('rel="stylesheet"')) {
    html = html.replace('</head>', `${cssTags}</head>`);
  }
  if (scriptTags && !html.includes('src="/static/js')) {
    html = html.replace('</body>', `${scriptTags}</body>`);
  }

  return html;
}

for (const [page, translations] of Object.entries(pages)) {
  const ukDir = path.join(buildDir, page);
  if (!fs.existsSync(ukDir)) fs.mkdirSync(ukDir, { recursive: true });
  fs.writeFileSync(path.join(ukDir, 'index.html'), generateHtml(baseHtmlUk, translations.uk, `/${page}`));
  console.log(`Created build/${page}/index.html with scripts`);

  const enDir = path.join(buildDir, 'en', page);
  if (!fs.existsSync(enDir)) fs.mkdirSync(enDir, { recursive: true });
  fs.writeFileSync(path.join(enDir, 'index.html'), generateHtml(baseHtmlEn, translations.en, `/en/${page}`));
  console.log(`Created build/en/${page}/index.html with scripts`);
}

// Update build/en/index.html to have scripts too!
const enBaseDir = path.join(buildDir, 'en');
if (!fs.existsSync(enBaseDir)) fs.mkdirSync(enBaseDir, { recursive: true });
fs.writeFileSync(path.join(enBaseDir, 'index.html'), generateHtml(baseHtmlEn, { title: "Atlas AI — Autonomous AI Assistant for macOS", description: "Atlas AI is a smart personal assistant for macOS. Automate your Mac, manage apps, and boost your productivity." }, "/en"));
console.log(`Created build/en/index.html with scripts`);


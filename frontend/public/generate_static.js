const fs = require('fs');
const path = require('path');

const publicDir = '/Users/valentinvdovicenko/Desktop/atlas_ai/website/frontend/public';
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
  
  // Replace description
  html = html.replace(/<meta name="description" content="[^"]*" \/>/g, `<meta name="description" content="${meta.description}" />`);
  html = html.replace(/<meta property="og:description" content="[^"]*" \/>/g, `<meta property="og:description" content="${meta.description}" />`);
  html = html.replace(/<meta name="twitter:description" content="[^"]*" \/>/g, `<meta name="twitter:description" content="${meta.description}" />`);
  
  // Replace title
  html = html.replace(/<meta property="og:title" content="[^"]*" \/>/g, `<meta property="og:title" content="${meta.title}" />`);
  html = html.replace(/<meta name="twitter:title" content="[^"]*" \/>/g, `<meta name="twitter:title" content="${meta.title}" />`);
  
  // Replace canonical and urls
  html = html.replace(/<link rel="canonical" href="https:\/\/atlas-assistant\.online\/[^"]*" \/>/g, `<link rel="canonical" href="https://atlas-assistant.online${urlPath}" />`);
  html = html.replace(/<meta property="og:url" content="https:\/\/atlas-assistant\.online\/[^"]*" \/>/g, `<meta property="og:url" content="https://atlas-assistant.online${urlPath}" />`);
  html = html.replace(/<meta name="twitter:url" content="https:\/\/atlas-assistant\.online\/[^"]*" \/>/g, `<meta name="twitter:url" content="https://atlas-assistant.online${urlPath}" />`);
  
  // Add <title> tag if missing, or replace it if it exists
  if (html.includes('<title>')) {
    html = html.replace(/<title>.*<\/title>/, `<title>${meta.title}</title>`);
  } else {
    html = html.replace('<!-- SEO Meta Tags -->', `<!-- SEO Meta Tags -->\n        <title>${meta.title}</title>`);
  }

  return html;
}

for (const [page, translations] of Object.entries(pages)) {
  // UK
  const ukDir = path.join(publicDir, page);
  if (!fs.existsSync(ukDir)) fs.mkdirSync(ukDir, { recursive: true });
  fs.writeFileSync(path.join(ukDir, 'index.html'), generateHtml(baseHtmlUk, translations.uk, `/${page}`));
  console.log(`Created ${ukDir}/index.html`);

  // EN
  const enDir = path.join(publicDir, 'en', page);
  if (!fs.existsSync(enDir)) fs.mkdirSync(enDir, { recursive: true });
  fs.writeFileSync(path.join(enDir, 'index.html'), generateHtml(baseHtmlEn, translations.en, `/en/${page}`));
  console.log(`Created ${enDir}/index.html`);
}

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

  pricing: {
    uk: {
      title: "Ціни — Atlas AI для macOS",
      description: "Тарифні плани Atlas AI для macOS. Оберіть місячний, квартальний або річний доступ до автономного ШІ-асистента."
    },
    en: {
      title: "Pricing — Atlas AI for macOS",
      description: "Atlas AI pricing plans for macOS. Choose monthly, quarterly or yearly access to your autonomous AI assistant."
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
  
  html = html.replace(/<meta[^>]*?name="description"[^>]*?>/g, `<meta data-rh="true" name="description" content="${meta.description}" />`);
  html = html.replace(/<meta[^>]*?property="og:description"[^>]*?>/g, `<meta data-rh="true" property="og:description" content="${meta.description}" />`);
  html = html.replace(/<meta[^>]*?name="twitter:description"[^>]*?>/g, `<meta data-rh="true" name="twitter:description" content="${meta.description}" />`);
  
  html = html.replace(/<meta[^>]*?property="og:title"[^>]*?>/g, `<meta data-rh="true" property="og:title" content="${meta.title}" />`);
  html = html.replace(/<meta[^>]*?name="twitter:title"[^>]*?>/g, `<meta data-rh="true" name="twitter:title" content="${meta.title}" />`);
  
  html = html.replace(/<link[^>]*?rel="canonical"[^>]*?>/g, `<link data-rh="true" rel="canonical" href="https://atlas-assistant.online${urlPath}" />`);
  html = html.replace(/<meta[^>]*?property="og:url"[^>]*?>/g, `<meta data-rh="true" property="og:url" content="https://atlas-assistant.online${urlPath}" />`);
  html = html.replace(/<meta[^>]*?name="twitter:url"[^>]*?>/g, `<meta data-rh="true" name="twitter:url" content="https://atlas-assistant.online${urlPath}" />`);
  
  if (/<title[^>]*>/.test(html)) {
    html = html.replace(/<title[^>]*>.*?<\/title>/g, `<title data-rh="true">${meta.title}</title>`);
  } else {
    html = html.replace('<!-- SEO Meta Tags -->', `<!-- SEO Meta Tags -->\n        <title data-rh="true">${meta.title}</title>`);
  }

  // Ensure scripts and css are injected
  if (cssTags) {
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

// Build specific pages for each blog post
const blogsPath = path.join(__dirname, '..', 'src', 'data', 'blogs.js');
if (fs.existsSync(blogsPath)) {
  const content = fs.readFileSync(blogsPath, 'utf8');
  const regex = /slug:\s*["']([^"']+)["'].*?en:\s*\{(.*?)\}.*?uk:\s*\{(.*?)\}/gs;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const slug = match[1];
    const enBlock = match[2];
    const ukBlock = match[3];

    const extract = (block, key) => {
      const reg = new RegExp(`${key}:\\s*["'](.*?)["']`);
      const m = block.match(reg);
      return m ? m[1] : null;
    };

    const enTitle = extract(enBlock, 'seoTitle') || extract(enBlock, 'title');
    const enDesc = extract(enBlock, 'seoDescription') || extract(enBlock, 'excerpt');
    const ukTitle = extract(ukBlock, 'seoTitle') || extract(ukBlock, 'title');
    const ukDesc = extract(ukBlock, 'seoDescription') || extract(ukBlock, 'excerpt');

    if (ukTitle && ukDesc) {
      const ukBlogDir = path.join(buildDir, 'blog', slug);
      if (!fs.existsSync(ukBlogDir)) fs.mkdirSync(ukBlogDir, { recursive: true });
      fs.writeFileSync(path.join(ukBlogDir, 'index.html'), generateHtml(baseHtmlUk, { title: ukTitle, description: ukDesc }, `/blog/${slug}`));
      console.log(`Created build/blog/${slug}/index.html`);
    }

    if (enTitle && enDesc) {
      const enBlogDir = path.join(buildDir, 'en', 'blog', slug);
      if (!fs.existsSync(enBlogDir)) fs.mkdirSync(enBlogDir, { recursive: true });
      fs.writeFileSync(path.join(enBlogDir, 'index.html'), generateHtml(baseHtmlEn, { title: enTitle, description: enDesc }, `/en/blog/${slug}`));
      console.log(`Created build/en/blog/${slug}/index.html`);
    }
  }
}

// Update build/en/index.html to have scripts too!
const enBaseDir = path.join(buildDir, 'en');
if (!fs.existsSync(enBaseDir)) fs.mkdirSync(enBaseDir, { recursive: true });
fs.writeFileSync(path.join(enBaseDir, 'index.html'), generateHtml(baseHtmlEn, { title: "Atlas AI — Autonomous AI Assistant for macOS", description: "Atlas AI is a smart personal assistant for macOS. Automate your Mac, manage apps, and boost your productivity." }, "/en"));
console.log(`Created build/en/index.html with scripts`);


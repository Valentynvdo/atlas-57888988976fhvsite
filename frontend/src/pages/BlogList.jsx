import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { blogs } from '../data/blogs';

export default function BlogList() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(circle at 50% 0%, #111 0%, #000 100%)",
      color: "#fff",
      fontFamily: "'Inter', sans-serif",
      padding: "120px 24px 60px 24px"
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ 
          fontSize: "3rem", 
          fontWeight: 700, 
          letterSpacing: "-0.04em", 
          marginBottom: 16,
          background: "linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.6) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          {lang === 'uk' ? 'Блог' : lang === 'ru' ? 'Блог' : 'Blog'}
        </h1>
        <p style={{
          fontSize: "1.1rem",
          color: "rgba(255,255,255,0.6)",
          marginBottom: 60,
          lineHeight: 1.6
        }}>
          {lang === 'uk' ? 'Дізнайтеся більше про Atlas AI, автоматизацію macOS та майбутнє штучного інтелекту.' : 
           lang === 'ru' ? 'Узнайте больше о Atlas AI, автоматизации macOS и будущем искусственного интеллекта.' : 
           'Discover more about Atlas AI, macOS automation, and the future of artificial intelligence.'}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {blogs.map(blog => {
            // Fallback to English if translation is missing for some reason
            const localizedData = blog.content[lang] || blog.content['en'];
            
            return (
              <article key={blog.id} style={{
                paddingBottom: 40,
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                display: "flex",
                flexDirection: "column",
                gap: 12
              }}>
                <div style={{ fontSize: "0.9rem", color: "rgba(0,229,255,0.8)", fontWeight: 500, letterSpacing: "0.05em" }}>
                  {blog.date} • {blog.readTime}
                </div>
                <Link to={`/blog/${blog.slug}`} style={{ textDecoration: "none" }}>
                  <h2 style={{
                    fontSize: "2rem",
                    fontWeight: 600,
                    letterSpacing: "-0.03em",
                    color: "#fff",
                    margin: 0,
                    transition: "color 0.2s ease"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "rgba(0,229,255,1)"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#fff"}
                  >
                    {localizedData.title}
                  </h2>
                </Link>
                <p style={{
                  fontSize: "1.1rem",
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.6,
                  margin: 0
                }}>
                  {localizedData.excerpt}
                </p>
                <Link to={`/blog/${blog.slug}`} style={{
                  fontSize: "1rem",
                  fontWeight: 500,
                  color: "#fff",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 8,
                  width: "fit-content"
                }}>
                  {lang === 'uk' ? 'Читати далі' : lang === 'ru' ? 'Читать далее' : 'Read more'}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

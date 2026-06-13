import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import useLocalizedNavigate from '../hooks/useLocalizedNavigate';
import { blogs } from '../data/blogs';
import { getBlogCover } from '../data/blogCovers';
import { ArrowLeft, ChevronLeft, ArrowRight, Clock } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function BlogList() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const navigate = useLocalizedNavigate();

  const blogPath = (slug) => (lang === 'en' ? `/en/blog/${slug}` : `/blog/${slug}`);
  const [featured, ...rest] = blogs;
  const featuredData = featured.content[lang] || featured.content['en'];

  return (
    <div style={{
      position: "relative",
      minHeight: "100vh",
      color: "#fff",
      fontFamily: "var(--sf-text, 'Inter', sans-serif)",
      padding: "120px 24px 80px 24px",
      overflow: "hidden",
    }}>
      <Helmet>
        <title>{t('blog_page.title')}</title>
        <meta name="description" content={t('blog_page.description')} />
      </Helmet>

      {/* Ambient glow */}
      <div aria-hidden="true" style={{
        position: "absolute", top: -200, left: "50%", transform: "translateX(-50%)",
        width: 900, height: 500,
        background: "radial-gradient(ellipse, rgba(255,255,255,0.080), transparent 70%)",
        filter: "blur(40px)", pointerEvents: "none",
      }} />

      <button
        onClick={() => navigate("/")}
        style={{
          position: "absolute",
          top: 28,
          left: 28,
          color: "#2997ff",
          fontSize: 14,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          zIndex: 10,
          transition: "all 0.2s ease"
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "#2997ff";  }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "#2997ff";  }}
      >
        <ChevronLeft size={16} />
        {lang === 'uk' ? 'На головну' : lang === 'ru' ? 'На главную' : 'Back to Home'}
      </button>

      <div style={{ maxWidth: 1140, margin: "0 auto", position: "relative" }}>
        <div className="section-eyebrow" style={{ marginBottom: 16 }}>Atlas AI · Blog</div>
        <h1 style={{
          fontSize: "clamp(2.4rem, 5vw, 4rem)",
          fontWeight: 700,
          letterSpacing: "-0.04em",
          marginBottom: 16,
          marginTop: 0,
          color: "#f5f5f7", background: "none"
        }}>
          {t('blog_page.h1', { defaultValue: t('blog_page.h1_fallback') })}
        </h1>
        <p style={{
          fontSize: "1.15rem",
          color: "rgba(255,255,255,0.6)",
          marginBottom: 64,
          lineHeight: 1.6,
          maxWidth: 640,
        }}>
          {t('blog_page.subtitle')}
        </p>

        {/* Featured article */}
        <Link to={blogPath(featured.slug)} className="blog-card fade-up" data-testid={`blog-card-featured`} style={{ marginBottom: 28, display: "block" }}>
          <article style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", alignItems: "stretch" }}>
            <div className="blog-cover-wrap" style={{ minHeight: 280 }}>
              <img
                className="blog-cover"
                style={{ height: "100%", aspectRatio: "auto", position: "absolute", inset: 0 }}
                src={getBlogCover(featured.slug, 0)}
                alt={featuredData.title}
                loading="lazy"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
            </div>
            <div style={{ padding: "40px 36px", display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ fontSize: "0.85rem", color: "#2997ff", fontWeight: 600, letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 8 }}>
                <Clock size={13} /> {featured.date} • {featured.readTime}
              </div>
              <h2 style={{
                fontSize: "clamp(1.6rem, 2.6vw, 2.2rem)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "#fff",
                margin: 0,
                lineHeight: 1.15,
              }}>
                {featuredData.title}
              </h2>
              <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.62)", lineHeight: 1.65, margin: 0 }}>
                {featuredData.excerpt}
              </p>
              <span style={{
                fontSize: "0.95rem", fontWeight: 600, color: "#fff",
                display: "inline-flex", alignItems: "center", gap: 8, marginTop: "auto", paddingTop: 10,
              }}>
                {lang === 'uk' ? 'Читати далі' : lang === 'ru' ? 'Читать далее' : 'Read more'}
                <ArrowRight size={16} color="#f5f5f7" />
              </span>
            </div>
          </article>
        </Link>

        {/* Magazine grid */}
        <div className="blog-grid">
          {rest.map((blog, idx) => {
            const localizedData = blog.content[lang] || blog.content['en'];
            return (
              <Link key={blog.id} to={blogPath(blog.slug)} className="blog-card fade-up" data-testid={`blog-card-${idx}`} style={{ animationDelay: `${Math.min(idx * 0.06, 0.5)}s` }}>
                <article style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                  <div className="blog-cover-wrap">
                    <img
                      className="blog-cover"
                      src={getBlogCover(blog.slug, idx + 1)}
                      alt={localizedData.title}
                      loading="lazy"
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                  </div>
                  <div style={{ padding: "24px 24px 28px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                    <div style={{ fontSize: "0.8rem", color: "#2997ff", fontWeight: 600, letterSpacing: "0.08em" }}>
                      {blog.date} • {blog.readTime}
                    </div>
                    <h2 style={{
                      fontSize: "1.25rem",
                      fontWeight: 650,
                      letterSpacing: "-0.02em",
                      color: "#fff",
                      margin: 0,
                      lineHeight: 1.3,
                    }}>
                      {localizedData.title}
                    </h2>
                    <p style={{
                      fontSize: "0.92rem",
                      color: "rgba(255,255,255,0.55)",
                      lineHeight: 1.6,
                      margin: 0,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}>
                      {localizedData.excerpt}
                    </p>
                    <span style={{
                      fontSize: "0.88rem", fontWeight: 600, color: "rgba(255,255,255,0.85)",
                      display: "inline-flex", alignItems: "center", gap: 6, marginTop: "auto", paddingTop: 8,
                    }}>
                      {lang === 'uk' ? 'Читати далі' : lang === 'ru' ? 'Читать далее' : 'Read more'}
                      <ArrowRight size={14} color="#f5f5f7" />
                    </span>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

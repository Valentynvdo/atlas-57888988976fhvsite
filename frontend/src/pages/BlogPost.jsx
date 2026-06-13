import React, { useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useParams, Link, Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { blogs } from '../data/blogs';
import { getBlogCover } from '../data/blogCovers';
import { Helmet } from 'react-helmet-async';

export default function BlogPost() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const location = useLocation();

  const blog = blogs.find(b => b.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const localizedData = blog ? (blog.content[lang] || blog.content['en']) : null;

  // SEO via Helmet is used in the render method

  if (!blog) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div style={{
      minHeight: "100vh",
      color: "#fff",
      fontFamily: "var(--sf-text, var(--sf-text, -apple-system, BlinkMacSystemFont, sans-serif))",
      padding: "110px 24px 80px 24px",
      position: "relative",
      overflow: "hidden",
    }}>
      <Helmet>
        <title>{localizedData.seoTitle || localizedData.title}</title>
        <meta name="description" content={localizedData.seoDescription || localizedData.excerpt} />
        <link rel="canonical" href={`https://atlas-assistant.online${location.pathname}`} />
        <meta property="og:title" content={localizedData.seoTitle || localizedData.title} />
        <meta property="og:description" content={localizedData.seoDescription || localizedData.excerpt} />
      </Helmet>

      {/* Ambient glow */}
      <div aria-hidden="true" style={{
        position: "absolute", top: -180, left: "50%", transform: "translateX(-50%)",
        width: 800, height: 440,
        background: "radial-gradient(ellipse, rgba(255,255,255,0.070), transparent 70%)",
        filter: "blur(40px)", pointerEvents: "none",
      }} />

        <div style={{ position: "absolute", top: 28, left: 28, display: "flex", gap: 24, zIndex: 10 }}>
          {[
            { to: lang === 'en' ? "/en/" : "/", label: lang === 'uk' ? 'На головну' : lang === 'ru' ? 'На главную' : 'Home' },
            { to: lang === 'en' ? "/en/blog" : "/blog", label: lang === 'uk' ? 'Блог' : lang === 'ru' ? 'Блог' : 'Blog' },
          ].map((l) => (
            <Link key={l.to} to={l.to} style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 14,
              fontWeight: 500,
              color: "#2997ff",
              textDecoration: "none",
              background: "transparent",
              border: "none",
              transition: "color 0.2s ease"
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#2997ff"; }}
            >
              <ChevronLeft size={16} /> {l.label}
            </Link>
          ))}
        </div>

      <div style={{ maxWidth: 820, margin: "0 auto", position: "relative" }}>

        {/* AI-generated cover */}
        <div style={{
          borderRadius: 24,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "none",
          marginBottom: 40,
        }}>
          <img
            src={getBlogCover(blog.slug, 0)}
            alt={localizedData.title}
            loading="lazy"
            style={{ width: "100%", aspectRatio: "16 / 7", objectFit: "cover", display: "block" }}
            onError={(e) => { e.currentTarget.parentElement.style.display = "none"; }}
          />
        </div>

        <div style={{ fontSize: "0.9rem", color: "#2997ff", fontWeight: 600, letterSpacing: "0.06em", marginBottom: 16 }}>
          {blog.date} • {blog.readTime}
        </div>

        <h1 style={{
          fontSize: "clamp(2rem, 4.5vw, 3rem)",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          marginBottom: 32,
          marginTop: 0,
          lineHeight: 1.12,
          background: "linear-gradient(180deg, #fff 0%, rgba(216,210,255,0.8) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          {localizedData.title}
        </h1>

        <div
          className="blog-content"
          style={{
            fontSize: "1.13rem",
            color: "rgba(255,255,255,0.75)",
            lineHeight: 1.8
          }}
          dangerouslySetInnerHTML={{ __html: localizedData.body }}
        />

        <style dangerouslySetInnerHTML={{__html: `
          .blog-content p { margin-bottom: 24px; }
          .blog-content h1 { color: #fff; font-size: 2rem; font-weight: 700; letter-spacing: -0.02em; line-height: 1.2; margin-bottom: 24px; }
          .blog-content h2 { color: #fff; margin-top: 48px; margin-bottom: 20px; font-size: 1.85rem; font-weight: 650; letter-spacing: -0.02em; line-height: 1.25; }
          .blog-content h3 { color: #fff; margin-top: 32px; margin-bottom: 16px; font-size: 1.4rem; font-weight: 600; }
          .blog-content a { color: #2997ff; text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.180); transition: border-color 0.2s; }
          .blog-content a:hover { border-bottom-color: rgba(255,255,255,0.200); }
          .blog-content strong { color: #fff; font-weight: 600; }
          .blog-content ul, .blog-content ol { margin-bottom: 24px; padding-left: 24px; }
          .blog-content li { margin-bottom: 10px; }
          .blog-content code { font-family: var(--mono, monospace); font-size: 0.92em; background: rgba(255,255,255,0.060); border: 1px solid rgba(255,255,255,0.100); padding: 2px 8px; border-radius: 8px; color: #cdc7ff; }
          .blog-content pre { background: rgba(13,13,18,0.9); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 20px; overflow-x: auto; margin-bottom: 24px; }
          .blog-content blockquote { border-left: 3px solid #f5f5f7; margin: 0 0 24px; padding: 8px 0 8px 20px; color: rgba(255,255,255,0.65); }
        `}} />
      </div>
    </div>
  );
}

import React, { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { blogs } from '../data/blogs';

export default function BlogPost() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';

  const blog = blogs.find(b => b.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const localizedData = blog ? (blog.content[lang] || blog.content['en']) : null;

  // SEO update
  useEffect(() => {
    if (localizedData) {
      document.title = `${localizedData.title} | Atlas AI`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute("content", localizedData.excerpt);
      }
    }
  }, [localizedData]);

  if (!blog) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(circle at 50% 0%, #111 0%, #000 100%)",
      color: "#fff",
      fontFamily: "'Inter', sans-serif",
      padding: "120px 24px 80px 24px"
    }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        
        <Link to="/blog" style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: "0.95rem",
          fontWeight: 500,
          color: "rgba(255,255,255,0.6)",
          textDecoration: "none",
          marginBottom: 40,
          transition: "color 0.2s ease"
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = "#fff"}
        onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          {lang === 'uk' ? 'На головну блогу' : lang === 'ru' ? 'На главную блога' : 'Back to Blog'}
        </Link>

        <div style={{ fontSize: "0.9rem", color: "rgba(0,229,255,0.8)", fontWeight: 500, letterSpacing: "0.05em", marginBottom: 16 }}>
          {blog.date} • {blog.readTime}
        </div>

        <h1 style={{ 
          fontSize: "3rem", 
          fontWeight: 800, 
          letterSpacing: "-0.03em", 
          marginBottom: 32,
          lineHeight: 1.1,
          background: "linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.7) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          {localizedData.title}
        </h1>

        <div 
          className="blog-content"
          style={{
            fontSize: "1.15rem",
            color: "rgba(255,255,255,0.75)",
            lineHeight: 1.8
          }}
          dangerouslySetInnerHTML={{ __html: localizedData.body }} 
        />
        
        <style dangerouslySetInnerHTML={{__html: `
          .blog-content p { margin-bottom: 24px; }
          .blog-content h2 { color: #fff; margin-top: 48px; margin-bottom: 20px; font-size: 2rem; font-weight: 600; letter-spacing: -0.02em; }
          .blog-content h3 { color: #fff; margin-top: 32px; margin-bottom: 16px; font-size: 1.5rem; font-weight: 600; }
          .blog-content a { color: #00e5ff; text-decoration: none; border-bottom: 1px solid rgba(0,229,255,0.3); transition: border-color 0.2s; }
          .blog-content a:hover { border-bottom-color: rgba(0,229,255,1); }
          .blog-content strong { color: #fff; font-weight: 600; }
        `}} />
      </div>
    </div>
  );
}

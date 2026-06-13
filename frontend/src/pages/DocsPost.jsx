import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import docsData from "../data/docs";

export default function DocsPost() {
  const { slug } = useParams();
  const { i18n } = useTranslation();
  const isEn = i18n.language === "en";

  const doc = docsData.find((d) => d.slug === slug);

  if (!doc) {
    return <Navigate to="/docs" replace />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#09090b",
        color: "#ffffff",
        fontFamily: "Inter, system-ui, sans-serif",
        padding: "40px 5%",
      }}
    >
      <Helmet>
        <title>{isEn ? doc.seoTitle.en : doc.seoTitle.uk}</title>
        <meta
          name="description"
          content={isEn ? doc.seoDescription.en : doc.seoDescription.uk}
        />
        <link
          rel="canonical"
          href={
            isEn
              ? `https://atlas-assistant.online/en/docs/${slug}`
              : `https://atlas-assistant.online/docs/${slug}`
          }
        />
        <link rel="alternate" hreflang="uk" href={`https://atlas-assistant.online/docs/${slug}`} />
        <link rel="alternate" hreflang="en" href={`https://atlas-assistant.online/en/docs/${slug}`} />
      </Helmet>
      
      <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: 20 }}>
          {isEn ? doc.title.en : doc.title.uk}
        </h1>
        <p style={{ color: "rgba(255, 255, 255,0.7)", lineHeight: 1.6 }}>
          {isEn ? doc.content.en : doc.content.uk}
        </p>
      </div>
    </div>
  );
}

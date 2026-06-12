import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { 
  Loader2, ArrowLeft, Send, Sparkles, Code2, BrainCircuit, 
  CheckCircle2, Users, Globe2, ChevronRight, Github 
} from "lucide-react";
import api from "../lib/api";
import { Helmet } from "react-helmet-async";

const STORAGE_KEY = "atlas_careers_draft";

export default function Careers() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    portfolio: "",
    timezone: "",
    availability: "full_time",
    tools: "",
    weakness: "",
    practical: "",
    source: "",
    motivation: ""
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [focusedInput, setFocusedInput] = useState(null);
  
  const [stats, setStats] = useState({ applied: 12, countries: 8 });

  // Load stats
  useEffect(() => {
    api.get("/api/careers/stats")
      .then(res => {
        if (res.data) setStats(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const nextStep = () => {
    setError("");
    if (step === 1 && (!formData.name || !formData.contact || !formData.portfolio)) {
      setError(t("atlas_v2.careers.error_message") || "Будь ласка, заповніть всі обов'язкові поля.");
      return;
    }
    if (step === 2 && (!formData.tools || !formData.weakness)) {
      setError(t("atlas_v2.careers.error_message") || "Будь ласка, заповніть всі обов'язкові поля.");
      return;
    }
    if (step === 3 && !formData.practical) {
      setError(t("atlas_v2.careers.error_message") || "Будь ласка, заповніть всі обов'язкові поля.");
      return;
    }
    if (step < totalSteps) setStep(s => s + 1);
  };

  const prevStep = () => {
    setError("");
    if (step > 1) setStep(s => s - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.motivation.length < 100) {
      setError((t("atlas_v2.careers.form.motivation_ph") || "Мінімум 100 символів"));
      return;
    }
    
    setSubmitting(true);
    setError("");

    try {
      await api.post("/api/careers/apply", formData);
      setSuccess(true);
      localStorage.removeItem(STORAGE_KEY); // clear draft
    } catch (err) {
      setError(t("atlas_v2.careers.error_message") || "Сталася помилка. Спробуйте пізніше.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = (name) => ({
    width: "100%",
    padding: "16px 20px",
    borderRadius: 16,
    background: focusedInput === name ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
    border: `1px solid ${focusedInput === name ? "rgba(255,255,255,0.200)" : "rgba(255,255,255,0.1)"}`,
    color: "#fff",
    outline: "none",
    fontSize: 16,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: focusedInput === name ? "0 0 20px rgba(255,255,255,0.060) inset, 0 0 15px rgba(255,255,255,0.120)" : "none"
  });

  const labelStyle = {
    display: "block",
    marginBottom: 8,
    fontSize: 14,
    fontWeight: 600,
    color: "rgba(255,255,255,0.8)",
    letterSpacing: "0.02em"
  };

  // GitHub validation preview
  const isGithubLink = formData.portfolio.includes("github.com/");
  const githubUsername = isGithubLink ? formData.portfolio.split("github.com/")[1].split("/")[0] : null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#030303",
      color: "#fff",
      fontFamily: "Inter, sans-serif",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      position: "relative",
      padding: "80px 40px",
      overflowX: "hidden"
    }}>
      <Helmet>
        <title>{isEn ? "Careers at Atlas AI — Join the Next-Gen AI Macbook Team" : "Кар'єра в Atlas AI — Вакансії для AI & Swift Розробників"}</title>
        <meta name="description" content={isEn ? "Explore remote AI engineer jobs and Swift/SwiftUI developer vacancies at Atlas AI setup. Help us build the best personal AI assistant for macOS productivity." : "Приєднуйтесь до команди Atlas AI. Вакансії для Swift, SwiftUI та AI інженерів у стартапі штучного інтелекту. Створюйте автономні ШІ-агенти для macOS разом з нами."} />
        <link rel="canonical" href={isEn ? "https://atlas-assistant.online/en/careers" : "https://atlas-assistant.online/careers"} />
      </Helmet>
      {/* Background Effects */}
      <div style={{
        position: "fixed", top: "10%", left: "20%", width: 600, height: 600,
        background: "radial-gradient(circle, rgba(255,255,255,0.030) 0%, transparent 60%)",
        filter: "blur(60px)", pointerEvents: "none", zIndex: 0
      }} />
      <div style={{
        position: "fixed", bottom: "10%", right: "10%", width: 500, height: 500,
        background: "radial-gradient(circle, rgba(255,255,255,0.025) 0%, transparent 60%)",
        filter: "blur(60px)", pointerEvents: "none", zIndex: 0
      }} />
      <div style={{
        position: "fixed", inset: 0,
        backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "40px 40px", pointerEvents: "none", zIndex: 0
      }} />

      {/* Back Button */}
      <Link to={isEn ? "/en" : "/"} style={{ 
        position: "absolute", top: 40, left: 40,
        display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.6)", 
        textDecoration: "none", fontSize: 14, fontWeight: 600,
        padding: "10px 0", background: "transparent",
        border: "none", transition: "all 0.2s", zIndex: 10
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}>
        <ArrowLeft size={16} />
        {t("atlas_v2.careers.back_home") || "Повернутися"}
      </Link>

      <div style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 60,
        width: "100%",
        maxWidth: 1400,
        zIndex: 1,
        marginTop: 40
      }}>
        {/* Left Column: Philosophy & Social Proof */}
        <div style={{ flex: "1 1 500px", display: "flex", flexDirection: "column" }}>
          
          <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
            <div style={{ 
              display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", 
              borderRadius: 100, background: "rgba(255,255,255,0.060)", border: "1px solid rgba(255,255,255,0.120)",
              color: "#2997ff", fontSize: 13, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase"
            }}>
              <Sparkles size={14} /> Join Atlas Core Team
            </div>
          </div>
          
          <h1 style={{ fontSize: "clamp(48px, 6vw, 64px)", fontWeight: 800, margin: "0 0 24px", letterSpacing: "-0.03em", lineHeight: 1.05 }}>
            {isEn ? "Careers at Atlas AI: Build Autonomous AI Agents" : "Кар'єра в Atlas AI: Створюйте майбутнє автономного ШІ"}
          </h1>
          
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, marginBottom: 40, fontWeight: 400 }}>
            {isEn ? "We are looking for brilliant minds to reshape desktop computing. Our team builds a secure offline ai assistant for sensitive data mac that runs fully locally. By joining us, you will develop a voice controlled autonomous ai agent macbook application and create cutting-edge open source alternatives to macos ai features." : "Ми шукаємо талановитих спеціалістів, які прагнуть змінити підхід до взаємодії з комп'ютером. Наш продукт — це автономний штучний інтелект для макбук, який працює повністю локально. Якщо ви хочете створювати додатки для продуктивності мак з голосовим керуванням та розвивати безпечні технології, Atlas AI — це ідеальне місце для вашого росту."}
          </p>

          {/* Social Proof Stats */}
          <div style={{ display: "flex", gap: 32, marginBottom: 40, borderTop: "1px solid rgba(255,255,255,0.1)", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "24px 0" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#2997ff", marginBottom: 8 }}>
                <Users size={20} />
                <span style={{ fontSize: 24, fontWeight: 800 }}>{stats.applied}</span>
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{t("atlas_v2.careers.stats.applied") || "людей подали заявку"}</div>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#f5f5f7", marginBottom: 8 }}>
                <Globe2 size={20} />
                <span style={{ fontSize: 24, fontWeight: 800 }}>{stats.countries}</span>
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{t("atlas_v2.careers.stats.countries") || "країн у команді"}</div>
            </div>
          </div>

          {/* Open Roles */}
          {/* Open Roles */}
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16, color: "#fff" }}>
            {isEn ? "Open Engineering Roles and Technical Challenges" : "Наші відкриті вакансії та технологічний стек"}
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, marginBottom: 32 }}>
            {isEn ? "Our core mission is maximizing macos productivity through private, desktop-level automation. We are actively hiring for remote AI engineer jobs and SwiftUI core developers. If you are passionate about local knowledge base ai tool offline mac systems, local LLM quantization, and native macOS execution pipelines, explore our open roles and apply today." : "Ми будуємо складну екосистему, де персональний ші асистент для керування macos обробляє гігабайти даних без інтернету. Нам потрібні інженери, які розуміють, як працює автоматизація рутини на macos, локальні LLM (Ollama/Llama) та системне програмування в екосистемі Apple. Перегляньте наші вакансії розробників штучного інтелекту та Swift/SwiftUI інженерів і надсилайте своє резюме."}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { name: t("atlas_v2.careers.roles.ai_engineer") || "AI Engineer", tags: t("atlas_v2.careers.roles.ai_engineer_tags") || "Python, RAG, Agents" },
              { name: t("atlas_v2.careers.roles.prompt_architect") || "Prompt Architect", tags: t("atlas_v2.careers.roles.prompt_architect_tags") || "Prompt Eng, Claude" },
              { name: t("atlas_v2.careers.roles.macos_dev") || "macOS Developer", tags: t("atlas_v2.careers.roles.macos_dev_tags") || "Swift, SwiftUI" },
              { name: t("atlas_v2.careers.roles.ui_designer") || "UI/UX Designer", tags: t("atlas_v2.careers.roles.ui_designer_tags") || "Figma, Animations" },
              { name: t("atlas_v2.careers.roles.qa_reviewer") || "QA Reviewer", tags: t("atlas_v2.careers.roles.qa_reviewer_tags") || "Testing, Code Review" }
            ].map((role, i) => (
              <div key={i} style={{ 
                padding: "16px 20px", borderRadius: 16, background: "rgba(255,255,255,0.03)", 
                border: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{role.name}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.05)", padding: "4px 10px", borderRadius: 100 }}>
                  {role.tags}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Multi-step Form */}
        <div style={{ flex: "1 1 500px" }}>
          {success ? (
            <div className="glass fade-in" style={{
              padding: 40, borderRadius: 32, textAlign: "center", 
              border: "1px solid rgba(40,200,64,0.3)", background: "rgba(40,200,64,0.05)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.4), inset 0 0 40px rgba(40,200,64,0.1)"
            }}>
              <div style={{ width: 64, height: 64, borderRadius: 32, background: "rgba(40,200,64,0.1)", color: "#28C840", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                <CheckCircle2 size={32} />
              </div>
              <h2 style={{ color: "#28C840", margin: "0 0 16px", fontSize: 24, fontWeight: 700 }}>
                {t("atlas_v2.careers.success_title") || "Заявку успішно надіслано!"}
              </h2>
              <p style={{ color: "rgba(255,255,255,0.7)", margin: 0, fontSize: 16, lineHeight: 1.5 }}>
                {t("atlas_v2.careers.success_desc") || "Ми розглянемо вашу заявку протягом 3-5 днів і напишемо в Telegram/Email."}
              </p>
            </div>
          ) : (
            <div className="glass fade-in" style={{
              padding: "40px", borderRadius: 32, border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(10,10,12,0.4)", backdropFilter: "blur(24px)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1)",
              display: "flex", flexDirection: "column"
            }}>
              {/* Progress Bar */}
              <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
                {[1, 2, 3, 4].map(s => (
                  <div key={s} style={{
                    flex: 1, height: 4, borderRadius: 2,
                    background: s <= step ? "#2997ff" : "rgba(255,255,255,0.1)",
                    boxShadow: s <= step ? "0 0 10px rgba(255,255,255,0.200)" : "none",
                    transition: "all 0.3s"
                  }} />
                ))}
              </div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 24, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {t(`atlas_v2.careers.steps.step_${step}`)} (Крок {step} з {totalSteps})
              </div>

              {error && (
                <div style={{ padding: 16, borderRadius: 16, background: "rgba(255,95,87,0.1)", color: "#FF5F57", fontSize: 14, fontWeight: 500, border: "1px solid rgba(255,95,87,0.2)", marginBottom: 24 }}>
                  {error}
                </div>
              )}

              <form onSubmit={step === totalSteps ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                
                {/* STEP 1: Personal */}
                {step === 1 && (
                  <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    <div>
                      <label style={labelStyle}>{t("atlas_v2.careers.form.name") || "Ім'я та Прізвище"}</label>
                      <input required name="name" value={formData.name} onChange={handleChange} onFocus={() => setFocusedInput("name")} onBlur={() => setFocusedInput(null)} placeholder={t("atlas_v2.careers.form.name_ph")} style={inputStyle("name")} />
                    </div>
                    <div>
                      <label style={labelStyle}>{t("atlas_v2.careers.form.contact") || "Telegram або Email"}</label>
                      <input required name="contact" value={formData.contact} onChange={handleChange} onFocus={() => setFocusedInput("contact")} onBlur={() => setFocusedInput(null)} placeholder={t("atlas_v2.careers.form.contact_ph")} style={inputStyle("contact")} />
                    </div>
                    <div>
                      <label style={labelStyle}>{t("atlas_v2.careers.form.portfolio") || "Github/Портфоліо"}</label>
                      <div style={{ position: "relative" }}>
                        {isGithubLink && (
                          <div style={{ position: "absolute", right: 16, top: 16, color: "rgba(255,255,255,0.5)" }}>
                            <Github size={20} />
                          </div>
                        )}
                        <input required name="portfolio" value={formData.portfolio} onChange={handleChange} onFocus={() => setFocusedInput("portfolio")} onBlur={() => setFocusedInput(null)} placeholder={t("atlas_v2.careers.form.portfolio_ph")} style={{...inputStyle("portfolio"), paddingRight: isGithubLink ? 48 : 20}} />
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 16 }}>
                      <div style={{ flex: 1 }}>
                        <label style={labelStyle}>{t("atlas_v2.careers.form.timezone") || "Часовий пояс"}</label>
                        <input name="timezone" value={formData.timezone} onChange={handleChange} onFocus={() => setFocusedInput("timezone")} onBlur={() => setFocusedInput(null)} placeholder={t("atlas_v2.careers.form.timezone_ph")} style={inputStyle("timezone")} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={labelStyle}>{t("atlas_v2.careers.form.availability") || "Доступність"}</label>
                        <select name="availability" value={formData.availability} onChange={handleChange} style={{...inputStyle("availability"), appearance: "none", cursor: "pointer"}}>
                          <option value="full_time" style={{background: "#000"}}>{t("atlas_v2.careers.form.avail_full") || "Повна зайнятість"}</option>
                          <option value="part_time" style={{background: "#000"}}>{t("atlas_v2.careers.form.avail_part") || "Часткова зайнятість"}</option>
                          <option value="freelance" style={{background: "#000"}}>{t("atlas_v2.careers.form.avail_free") || "Фріланс"}</option>
                          <option value="internship" style={{background: "#000"}}>{t("atlas_v2.careers.form.avail_intern") || "Стажування"}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: AI Experience */}
                {step === 2 && (
                  <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    <div>
                      <label style={labelStyle}>{t("atlas_v2.careers.form.tools") || "Які інструменти AI використовуєте?"}</label>
                      <textarea required name="tools" value={formData.tools} onChange={handleChange} onFocus={() => setFocusedInput("tools")} onBlur={() => setFocusedInput(null)} placeholder={t("atlas_v2.careers.form.tools_ph")} rows={4} style={{ ...inputStyle("tools"), resize: "vertical" }} />
                    </div>
                    <div>
                      <label style={labelStyle}>{t("atlas_v2.careers.form.weakness") || "Назвіть слабку сторону AI-агентів"}</label>
                      <textarea required name="weakness" value={formData.weakness} onChange={handleChange} onFocus={() => setFocusedInput("weakness")} onBlur={() => setFocusedInput(null)} placeholder={t("atlas_v2.careers.form.weakness_ph")} rows={4} style={{ ...inputStyle("weakness"), resize: "vertical" }} />
                    </div>
                  </div>
                )}

                {/* STEP 3: Practice & Source */}
                {step === 3 && (
                  <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    <div>
                      <label style={labelStyle}>{t("atlas_v2.careers.form.practical") || "Напишіть промпт для AppleScript"}</label>
                      <textarea required name="practical" value={formData.practical} onChange={handleChange} onFocus={() => setFocusedInput("practical")} onBlur={() => setFocusedInput(null)} placeholder={t("atlas_v2.careers.form.practical_ph")} rows={4} style={{ ...inputStyle("practical"), resize: "vertical" }} />
                    </div>
                    <div>
                      <label style={labelStyle}>{t("atlas_v2.careers.form.source") || "Як ви дізналися про Atlas?"}</label>
                      <input name="source" value={formData.source} onChange={handleChange} onFocus={() => setFocusedInput("source")} onBlur={() => setFocusedInput(null)} placeholder={t("atlas_v2.careers.form.source_ph")} style={inputStyle("source")} />
                    </div>
                  </div>
                )}

                {/* STEP 4: Motivation */}
                {step === 4 && (
                  <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
                        <label style={{...labelStyle, marginBottom: 0}}>{t("atlas_v2.careers.form.motivation") || "Чому хочете в команду?"}</label>
                        <div style={{ fontSize: 12, color: formData.motivation.length < 100 ? "#FF5F57" : "#28C840" }}>
                          {formData.motivation.length} / 100 {t("atlas_v2.careers.form.char_count")}
                        </div>
                      </div>
                      <textarea required name="motivation" value={formData.motivation} onChange={handleChange} onFocus={() => setFocusedInput("motivation")} onBlur={() => setFocusedInput(null)} placeholder={t("atlas_v2.careers.form.motivation_ph")} rows={6} style={{ ...inputStyle("motivation"), resize: "vertical" }} />
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
                  {step > 1 && (
                    <button type="button" onClick={prevStep} style={{
                      padding: "16px 24px", borderRadius: 16, background: "rgba(255,255,255,0.05)",
                      color: "#fff", fontWeight: 600, border: "1px solid rgba(255,255,255,0.1)",
                      cursor: "pointer", transition: "all 0.2s"
                    }} onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"} onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>
                      {t("atlas_v2.careers.steps.prev") || "Назад"}
                    </button>
                  )}
                  
                  <button type="submit" disabled={submitting} style={{
                    flex: 1, padding: "16px", borderRadius: 16, display: "flex",
                    justifyContent: "center", alignItems: "center", gap: 10, border: "none",
                    background: submitting ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #2997ff, #f5f5f7)",
                    color: "#fff", fontWeight: 700, fontSize: 16, cursor: submitting ? "not-allowed" : "pointer",
                    transition: "all 0.3s",
                    boxShadow: submitting ? "none" : "0 8px 20px rgba(255,255,255,0.180), inset 0 1px 1px rgba(255,255,255,0.4)"
                  }}>
                    {submitting ? <Loader2 size={20} className="spin" /> : 
                      step === totalSteps ? <><Send size={18} /> {t("atlas_v2.careers.form.submit")}</> : 
                      <>{t("atlas_v2.careers.steps.next")} <ChevronRight size={18} /></>}
                  </button>
                </div>
                
                <style>{`.spin{animation: spin 0.9s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                <style>{`.fade-in{animation: fadeIn 0.4s ease-out}@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

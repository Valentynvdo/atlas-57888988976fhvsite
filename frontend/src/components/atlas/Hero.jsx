import { ArrowRight, Mail, FileText, Calendar, FolderOpen, MessageSquare, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * Hero — Apple Dark style.
 * No sphere, no neon. Animated CSS-only Mac window conversation preview.
 */
export default function Hero({ onCta }) {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";

  const conversation = isEn
    ? [
        { who: "user", text: "Summarise today's emails and reply to Anna about the Q1 brief." },
        { who: "assistant", text: "7 new emails. 3 marked important. Drafting your reply to Anna now." },
        { who: "user", text: "Schedule a 30-min call with the design team tomorrow morning." },
        { who: "assistant", text: "Found a slot at 10:30 AM. Invite sent to 4 attendees." }
      ]
    : [
        { who: "user", text: "Підсумуй сьогоднішні листи й дай відповідь Анні щодо брифу Q1." },
        { who: "assistant", text: "7 нових листів. 3 важливі. Готую відповідь Анні." },
        { who: "user", text: "Заплануй 30-хв дзвінок із дизайн-командою на завтра зранку." },
        { who: "assistant", text: "Знайшов слот о 10:30. Запрошення надіслано 4 учасникам." }
      ];

  const sidebar = isEn
    ? { workspaces: "Workspaces", system: "System", conv: "Conversations", mail: "Mail", cal: "Calendar", notes: "Notes", files: "Files", prefs: "Preferences" }
    : { workspaces: "Робочі простори", system: "Система", conv: "Розмови", mail: "Пошта", cal: "Календар", notes: "Нотатки", files: "Файли", prefs: "Налаштування" };

  return (
    <section
      id="hero"
      data-testid="hero-section"
      className="apple-hero"
    >
      <p className="apple-eyebrow" data-testid="hero-eyebrow">
        Atlas AI · macOS
      </p>

      <h1 className="apple-h1" data-testid="hero-title">
        Atlas AI.
        <span style={{ display: "block", color: "#a1a1a6", fontWeight: 500 }}>
          {t("hero.title_span")}
        </span>
      </h1>

      <p className="apple-sub" data-testid="hero-subtitle">
        {t("hero.subtitle")}
      </p>

      <div className="apple-cta-row">
        <button
          data-testid="hero-cta-btn"
          onClick={onCta}
          className="cta-btn"
        >
          {t("hero.btn_meet")}
          <ArrowRight size={16} />
        </button>
        <a href="#features" className="apple-link" data-testid="hero-learn-more">
          {t("hero.btn_learn")} ›
        </a>
      </div>

      {/* Mac window with live conversation animation */}
      <div className="mac-preview" data-testid="hero-mockup">
        <div className="mac-titlebar">
          <span className="dots">
            <span /><span /><span />
          </span>
          <span className="addr">Atlas AI · Assistant</span>
        </div>

        <div className="mac-body">
          <aside className="mac-sidebar">
            <span className="mac-sidebar-label">{sidebar.workspaces}</span>
            <div className="mac-sidebar-item active">
              <MessageSquare size={14} />
              {sidebar.conv}
            </div>
            <div className="mac-sidebar-item">
              <Mail size={14} />
              {sidebar.mail}
            </div>
            <div className="mac-sidebar-item">
              <Calendar size={14} />
              {sidebar.cal}
            </div>
            <div className="mac-sidebar-item">
              <FileText size={14} />
              {sidebar.notes}
            </div>
            <div className="mac-sidebar-item">
              <FolderOpen size={14} />
              {sidebar.files}
            </div>
            <span className="mac-sidebar-label">{sidebar.system}</span>
            <div className="mac-sidebar-item">
              <Settings size={14} />
              {sidebar.prefs}
            </div>
          </aside>

          <div className="mac-conversation" aria-hidden="true">
            {conversation.map((m, i) => (
              <div key={i} className={`bubble ${m.who}`}>{m.text}</div>
            ))}
            <div className="typing-row"><span /><span /><span /></div>
          </div>
        </div>
      </div>
    </section>
  );
}

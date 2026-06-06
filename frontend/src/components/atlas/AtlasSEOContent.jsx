import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mic, Shield, Cpu, FolderOpen, Send, Zap, TrendingUp, Code, Bot } from 'lucide-react';
import './AtlasSEOContent.css';

export default function AtlasSEOContent() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('voice');

  const tabs = [
    { id: 'voice', icon: Mic, label: t('seo_nav_voice') },
    { id: 'privacy', icon: Shield, label: t('seo_nav_privacy') },
    { id: 'automation', icon: Cpu, label: t('seo_nav_automation') },
    { id: 'files', icon: FolderOpen, label: t('seo_nav_files') },
    { id: 'telegram', icon: Send, label: t('seo_nav_telegram') },
    { id: 'performance', icon: Zap, label: t('seo_nav_performance') },
    { id: 'investors', icon: TrendingUp, label: t('seo_nav_investors') },
    { id: 'skills', icon: Code, label: t('seo_nav_skills') },
    { id: 'agents', icon: Bot, label: t('seo_nav_agents') }
  ];

  return (
    <section className="seo-content-section" id="use-cases">
      <div className="seo-content-container">
        <div className="seo-header">
          <h2 className="seo-title shimmer-text">{t('seo_title')}</h2>
          <p className="seo-desc">{t('seo_desc')}</p>
        </div>

        <div className="seo-layout">
          <aside className="seo-sidebar">
            <nav className="seo-nav">
              <h4 className="seo-nav-title">{t('txt_1106') || "Навігація по розділах"}</h4>
              <ul className="seo-nav-list">
                {tabs.map((tab) => (
                  <li key={tab.id}>
                    <button
                      className={`seo-nav-btn ${activeTab === tab.id ? 'active' : ''}`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <tab.icon size={16} className="seo-nav-icon" />
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <main className="seo-main-content">
            {activeTab === 'voice' && (
              <div className="seo-tab-pane fade-in">
                <h3>{t('seo_voice_h3')}</h3>
                <p dangerouslySetInnerHTML={{ __html: t('seo_voice_p1') }} />
                <p dangerouslySetInnerHTML={{ __html: t('seo_voice_p2') }} />
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="seo-tab-pane fade-in">
                <h3>{t('seo_privacy_h3')}</h3>
                <p dangerouslySetInnerHTML={{ __html: t('seo_privacy_p1') }} />
                <p dangerouslySetInnerHTML={{ __html: t('seo_privacy_p2') }} />
              </div>
            )}

            {activeTab === 'automation' && (
              <div className="seo-tab-pane fade-in">
                <h3>{t('seo_automation_h3')}</h3>
                <p dangerouslySetInnerHTML={{ __html: t('seo_automation_p1') }} />
                <p dangerouslySetInnerHTML={{ __html: t('seo_automation_p2') }} />
              </div>
            )}

            {activeTab === 'files' && (
              <div className="seo-tab-pane fade-in">
                <h3>{t('seo_files_h3')}</h3>
                <p dangerouslySetInnerHTML={{ __html: t('seo_files_p1') }} />
                <p dangerouslySetInnerHTML={{ __html: t('seo_files_p2') }} />
              </div>
            )}

            { activeTab === 'telegram' && (
              <div className="seo-tab-pane fade-in">
                <h3>{t('seo_telegram_h3')}</h3>
                <p dangerouslySetInnerHTML={{ __html: t('seo_telegram_p1') }} />
                <p dangerouslySetInnerHTML={{ __html: t('seo_telegram_p2') }} />
              </div>
            )}

            { activeTab === 'performance' && (
              <div className="seo-tab-pane fade-in">
                <h3>{t('seo_performance_h3')}</h3>
                <p dangerouslySetInnerHTML={{ __html: t('seo_performance_p1') }} />
                <p dangerouslySetInnerHTML={{ __html: t('seo_performance_p2') }} />
              </div>
            )}

            { activeTab === 'investors' && (
              <div className="seo-tab-pane fade-in">
                <h3>{t('seo_investors_h3')}</h3>
                <p dangerouslySetInnerHTML={{ __html: t('seo_investors_p1') }} />
                <p dangerouslySetInnerHTML={{ __html: t('seo_investors_p2') }} />
              </div>
            )}

            { activeTab === 'skills' && (
              <div className="seo-tab-pane fade-in">
                <h3>{t('seo_skills_h3')}</h3>
                <p dangerouslySetInnerHTML={{ __html: t('seo_skills_p1') }} />
                <p dangerouslySetInnerHTML={{ __html: t('seo_skills_p2') }} />
              </div>
            )}

            { activeTab === 'agents' && (
              <div className="seo-tab-pane fade-in">
                <h3>{t('seo_agents_h3')}</h3>
                <p dangerouslySetInnerHTML={{ __html: t('seo_agents_p1') }} />
                <p dangerouslySetInnerHTML={{ __html: t('seo_agents_p2') }} />
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}

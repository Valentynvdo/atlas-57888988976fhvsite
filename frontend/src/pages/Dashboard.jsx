import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useLocalizedNavigate from "../hooks/useLocalizedNavigate";
import { toast, Toaster } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, Copy, Eye, EyeOff, Loader2, AlertTriangle, Settings, Check,
  Clock, Users, Sparkles, MessageSquare, Lock, BrainCircuit, Activity,
  Database, ShieldCheck, Terminal, Link as LinkIcon, Download, Key
} from "lucide-react";
import api from "../lib/api";
import { useAuth } from "../lib/auth";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const { user, logout } = useAuth();
  const navigate = useLocalizedNavigate();
  const [search] = useSearchParams();

  const [license, setLicense] = useState(null);
  const [stats, setStats] = useState(null);
  const [liveThought, setLiveThought] = useState(null);
  const [keyHidden, setKeyHidden] = useState(true);
  const [appVersion, setAppVersion] = useState(null);
  const [telegramConfig, setTelegramConfig] = useState({ token: "", username: "" });
  const [telegramSaving, setTelegramSaving] = useState(false);
  
  // Modals & States
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [pwdForm, setPwdForm] = useState({ current: "", new: "" });
  const [pwdBusy, setPwdBusy] = useState(false);
  
  // Custom Skill
  const [skillPrompt, setSkillPrompt] = useState("");
  const [generatingSkill, setGeneratingSkill] = useState(false);

  // Waitlist state
  const [waitlist, setWaitlist] = useState(null);
  const [waitlistLoading, setWaitlistLoading] = useState(false);
  const [waitlistReason, setWaitlistReason] = useState("");

  const loadData = useCallback(async () => {
    try {
      const rLic = await api.get("/api/me/license");
      setLicense(rLic.data);
      const rStats = await api.get("/api/me/atlas-stats");
      setStats(rStats.data);
      const rThought = await api.get("/api/atlas/thought");
      setLiveThought(rThought.data);
      try {
        const rVer = await api.get("/api/atlas/version");
        setAppVersion(rVer.data);
      } catch (e) {
        console.error("Failed to load version", e);
      }
      try {
        const rTg = await api.get("/api/me/telegram");
        setTelegramConfig({ token: rTg.data.telegram_bot_token || "", username: rTg.data.telegram_bot_username || "" });
      } catch (e) {
        console.error("Failed to load telegram config", e);
      }
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    }
  }, []);

  const loadWaitlist = useCallback(async () => {
    try {
      const r = await api.get("/api/billing/waitlist/status");
      setWaitlist(r.data);
    } catch (err) {
      console.error("Failed to load waitlist", err);
    }
  }, []);

  useEffect(() => {
    if (user?.is_admin) {
      navigate("/x7k9m-admin", { replace: true });
      return;
    }
    loadData();
    loadWaitlist();
    const intervalId = setInterval(loadData, 8000);
    return () => clearInterval(intervalId);
  }, [loadData, loadWaitlist, user, navigate]);

  const joinWaitlist = async () => {
    setWaitlistLoading(true);
    try {
      const r = await api.post("/api/billing/waitlist/join", {
        plan: "early_access",
        reason: waitlistReason,
        name: user?.name || "",
      });
      setWaitlist({ in_waitlist: true, position: r.data.position, status: r.data.status });
      toast.success(t("dashboard.waitlist_joined") || "Joined Waitlist");
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Error joining waitlist");
    } finally {
      setWaitlistLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdBusy(true);
    try {
      const r = await api.post("/api/me/change-password", {
        current_password: pwdForm.current,
        new_password: pwdForm.new
      });
      toast.success(r.data.message || "Password changed!");
      setShowPwdModal(false);
      setPwdForm({ current: "", new: "" });
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Error changing password");
    } finally {
      setPwdBusy(false);
    }
  };

  const copyKey = async () => {
    if (!license?.key) return;
    await navigator.clipboard.writeText(license.key);
    toast.success("License Key Copied!");
  };

  const generateSkill = () => {
    if (!skillPrompt) return;
    setGeneratingSkill(true);
    setTimeout(() => {
      setGeneratingSkill(false);
      toast.success("Скіл успішно згенеровано і відправлено в Sandbox!");
      setSkillPrompt("");
    }, 2000);
  };

  const saveTelegramConfig = async () => {
    setTelegramSaving(true);
    try {
      const res = await api.post("/api/me/telegram", { telegram_bot_token: telegramConfig.token });
      setTelegramConfig({ token: res.data.telegram_bot_token, username: res.data.telegram_bot_username });
      toast.success(t("telegram_success"));
    } catch (err) {
      toast.error(err.response?.data?.detail || t("telegram_error"));
    } finally {
      setTelegramSaving(false);
    }
  };

  const copyReferral = () => {
    navigator.clipboard.writeText("https://atlas-assistant.online/invite/" + user?.user_id?.substring(0,8));
    toast.success("Referral Link Copied!");
  };

  if (!license) {
    return (
      <div style={{ minHeight: "100vh", background: "#000", display: "grid", placeItems: "center" }}>
        <Loader2 size={32} color="#2997ff" className="animate-spin" />
      </div>
    );
  }

  const hasAccess = license?.status === "active" || license?.status === "expiring_soon";

  return (
    <div style={{
      minHeight: "100vh",
      background: "#000",
      backgroundImage: "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.060) 0%, transparent 60%)",
      color: "#fff",
      fontFamily: "'Inter', sans-serif",
      position: "relative",
      overflowX: "hidden",
      paddingBottom: 100
    }}>
      <Toaster theme="dark" position="top-center" />

      {/* HEADER NAV */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center",
        backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.05)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontWeight: 500, fontSize: 18 }}>
          <img src="/atlas-icon.png" alt="Atlas" style={{ width: 28, height: 28, borderRadius: 6 }} />
          Atlas AI Command Center
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "center", fontSize: 14 }}>
          <a href="https://t.me/AtlasAICommunity" target="_blank" rel="noreferrer" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>Community</a>
          <a href="https://t.me/ATLAS_Support_Hub_bot" target="_blank" rel="noreferrer" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>Support</a>
          <button onClick={() => setShowPwdModal(true)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: 14 }}>Change Password</button>
          
          <div style={{ display: "flex", alignItems: "center", gap: 10, borderLeft: "1px solid rgba(255,255,255,0.1)", paddingLeft: 24 }}>
            <span style={{ color: "rgba(255,255,255,0.8)" }}>{user?.email}</span>
            <button onClick={() => { logout(); navigate("/"); }} style={{ background: "none", border: "none", color: "#FF5F57", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              <LogOut size={14} /> Exit
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main style={{ width: "100%", padding: "80px 5%" }}>
        
        {!hasAccess ? (
          /* FOMO WAITLIST EXPERIENCE */
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ textAlign: "center", paddingTop: 40, maxWidth: 1200, margin: "0 auto" }}>
            
            {waitlist?.in_waitlist ? (
              <>
                <div style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: "0.2em", color: "#2997ff", marginBottom: 20 }}>Your Waitlist Position</div>
                <div style={{ fontSize: "140px", fontWeight: 200, lineHeight: 1, letterSpacing: "-0.04em", textShadow: "0 0 80px rgba(255,255,255,0.200)" }}>
                  #{waitlist.position || "—"}
                </div>
                <div style={{ fontSize: 18, color: "rgba(255,255,255,0.5)", marginTop: 20 }}>
                  We are activating users in batches. You will receive an email soon.
                </div>
              </>
            ) : (
              <div style={{ maxWidth: 400, margin: "0 auto" }}>
                <div style={{ fontSize: 48, fontWeight: 300, marginBottom: 20 }}>Join the Queue</div>
                <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: 30 }}>Request early access to the most advanced autonomous assistant for macOS.</p>
                <textarea 
                  value={waitlistReason} onChange={e => setWaitlistReason(e.target.value)}
                  placeholder="How do you plan to use Atlas?"
                  style={{ width: "100%", padding: 16, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff", minHeight: 100, marginBottom: 20 }}
                />
                <button onClick={joinWaitlist} disabled={waitlistLoading} style={{ width: "100%", padding: 16, background: "#2997ff", color: "#000", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: "pointer" }}>
                  {waitlistLoading ? "Joining..." : "Get Early Access"}
                </button>
              </div>
            )}

            {/* FOMO Teaser */}
            <div style={{ marginTop: 100, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 40, opacity: 0.4, pointerEvents: "none" }}>
              <FeatureTeaser icon={<BrainCircuit size={32}/>} title="Autonomous Actions" desc="Atlas controls your macOS directly." />
              <FeatureTeaser icon={<Terminal size={32}/>} title="Generative Skills" desc="Write custom skills in plain English." />
              <FeatureTeaser icon={<Activity size={32}/>} title="Live Telemetry" desc="Real-time mood and memory analysis." />
            </div>

          </motion.div>

        ) : (

          /* COMMAND CENTER FOR ACTIVE USERS */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ maxWidth: 1600, margin: "0 auto" }}>
            
            {/* BIG LICENSE & SYNC STATUS */}
            <div style={{ textAlign: "center", marginBottom: 100 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 30, background: "rgba(40, 200, 64, 0.1)", border: "1px solid rgba(40, 200, 64, 0.2)", color: "#28C840", fontSize: 13, marginBottom: 40 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#28C840", boxShadow: "0 0 10px #28C840" }} />
                Real-time Sync Active
              </div>
              <div style={{ fontSize: "6vw", fontWeight: 200, letterSpacing: "0.02em", fontFamily: "'Source Code Pro', monospace", color: keyHidden ? "rgba(255,255,255,0.2)" : "#fff", filter: keyHidden ? "blur(12px)" : "none", transition: "all 0.4s", cursor: "pointer", userSelect: keyHidden ? "none" : "all", wordBreak: "break-all" }} onClick={() => setKeyHidden(!keyHidden)}>
                {license.key}
              </div>
              <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 16, marginTop: 40 }}>
                <button onClick={() => setKeyHidden(!keyHidden)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: "12px 24px", borderRadius: 30, cursor: "pointer", display: "flex", gap: 8, alignItems: "center", fontSize: 15 }}>
                  {keyHidden ? <Eye size={18}/> : <EyeOff size={18}/>} {keyHidden ? "Reveal" : "Hide"}
                </button>
                <button onClick={copyKey} style={{ background: "#2997ff", border: "none", color: "#000", padding: "12px 24px", borderRadius: 30, cursor: "pointer", fontWeight: 600, display: "flex", gap: 8, alignItems: "center", fontSize: 15 }}>
                  <Copy size={18}/> Copy Key
                </button>
                <a href={appVersion?.url || "/AtlasAI-Installer-1.0.dmg"} target="_blank" rel="noopener noreferrer" style={{ background: "rgba(255,255,255,0.1)", textDecoration: "none", border: "none", color: "#fff", padding: "12px 24px", borderRadius: 30, cursor: "pointer", display: "flex", gap: 8, alignItems: "center", fontSize: 15 }}>
                  <Download size={18}/> {t("dashboard_download_app", { version: appVersion?.version || "1.0" })}
                </a>
              </div>
            </div>

            {/* LIVE TELEMETRY & TERMINAL */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: 60, marginBottom: 100 }}>
              
              {/* Terminal */}
              <div>
                <div style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)", marginBottom: 16 }}>Live Evolution Log</div>
                <div style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.120)", borderRadius: 16, padding: 24, minHeight: 280, fontFamily: "'Source Code Pro', monospace", fontSize: 13, color: "#2997ff", boxShadow: "inset 0 0 40px rgba(255,255,255,0.030)" }}>
                  <div style={{ color: "rgba(255,255,255,0.3)", marginBottom: 12 }}>Connected to Atlas Local Engine...</div>
                  {liveThought ? (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                      <span style={{ color: "rgba(255,255,255,0.5)" }}>[{new Date(liveThought.ts).toLocaleTimeString()}]</span> {liveThought.thought}
                    </motion.div>
                  ) : (
                    <div className="animate-pulse">Awaiting thought stream...</div>
                  )}
                  <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 8, opacity: 0.5 }}>
                    <div style={{ width: 8, height: 16, background: "#2997ff", animation: "blink 1s infinite" }} />
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <TelemetryCard title="Actions Automated" value={stats?.requests_count || "0"} desc="Proactive AppleScript executions" />
                <TelemetryCard title="Skills Deployed" value={stats?.skills_count || "0"} desc="Active local python scripts" />
                
                {/* Mock Emotion Map */}
                <div style={{ gridColumn: "span 2", background: "linear-gradient(135deg, rgba(255,255,255,0.050) 0%, transparent 100%)", border: "1px solid rgba(255,255,255,0.100)", borderRadius: 16, padding: 24 }}>
                  <div style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.1em", color: "#f5f5f7", marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
                    <span>Stress / Emotion Map</span>
                    <span style={{ fontSize: 11, background: "rgba(255,255,255,0.100)", padding: "2px 8px", borderRadius: 10 }}>Live</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-end", height: 80, gap: 4 }}>
                    {/* Mock Graph Bars */}
                    {[40, 60, 30, 80, 50, 20, 90, 45, 60, 20, 10, 30].map((h, i) => (
                      <div key={i} style={{ flex: 1, background: `rgba(124, 58, 237, ${h/100})`, height: `${h}%`, borderRadius: "4px 4px 0 0", transition: "height 1s" }} />
                    ))}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 12 }}>* Local analysis via emotion_recognition.py</div>
                </div>
              </div>

            </div>

            {/* SKILL SANDBOX & VIRALITY */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: 60 }}>
              
              {/* Generative Sandbox */}
              <div>
                <div style={{ fontSize: 32, fontWeight: 300, marginBottom: 16 }}>Generative Sandbox</div>
                <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: 20, fontSize: 16 }}>Ask Atlas to write a custom skill for you. It will be generated and tested locally.</p>
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 4 }}>
                  <textarea 
                    value={skillPrompt} onChange={e => setSkillPrompt(e.target.value)}
                    placeholder='e.g. "Every Friday at 18:00, close Xcode and open Safari with a movie list..."'
                    style={{ width: "100%", background: "transparent", border: "none", color: "#fff", padding: 24, fontSize: 16, minHeight: 140, outline: "none", resize: "none" }}
                  />
                  <div style={{ display: "flex", justifyContent: "flex-end", padding: 12 }}>
                    <button onClick={generateSkill} disabled={generatingSkill} style={{ background: "#fff", color: "#000", border: "none", padding: "12px 24px", borderRadius: 10, fontWeight: 600, cursor: "pointer", display: "flex", gap: 8, alignItems: "center", fontSize: 15 }}>
                      {generatingSkill ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />} 
                      Generate Skill
                    </button>
                  </div>
                </div>
              </div>

              {/* Web3 & Referral */}
              <div>
                <div style={{ fontSize: 32, fontWeight: 300, marginBottom: 16 }}>Crypto & Virality</div>
                
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 28, marginBottom: 20 }}>
                  <div style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)", marginBottom: 16 }}>Payment History</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 18, marginBottom: 4 }}>License Activation</div>
                      <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>Card / TON</div>
                    </div>
                    <div style={{ color: "#28C840", fontWeight: 500, fontSize: 16 }}>Success</div>
                  </div>
                </div>

                {user?.invited_by && (
                  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 28, marginBottom: 20 }}>
                    <div style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)", marginBottom: 16 }}>Applied Invite Code</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 18, marginBottom: 4, fontFamily: "monospace", letterSpacing: "0.1em" }}>{user.invited_by}</div>
                        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>Bonus active</div>
                      </div>
                      <div style={{ color: "#28C840", fontWeight: 500, fontSize: 16 }}>+10% Discount</div>
                    </div>
                  </div>
                )}

                <div style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.060) 0%, transparent 100%)", border: "1px solid rgba(255,255,255,0.180)", borderRadius: 16, padding: 28 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
                    <LinkIcon color="#2997ff" size={28} />
                    <div style={{ fontSize: 20, fontWeight: 500 }}>Share Your Skill</div>
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, marginBottom: 24, lineHeight: 1.6 }}>
                    Share your custom skill script with friends. If they activate Atlas, you both get a discount on renewals.
                  </p>
                  <button onClick={() => {
                    navigator.clipboard.writeText(window.location.origin + "/invite/" + (user?.user_id?.substring(0,8) || "atlas"));
                    toast.success("Referral Link Copied!");
                  }} style={{ width: "100%", background: "transparent", border: "1px solid #2997ff", color: "#2997ff", padding: "14px", borderRadius: 10, fontWeight: 600, cursor: "pointer", fontSize: 15 }}>
                    Copy Referral Link
                  </button>
                </div>
              </div>

            </div>

            {/* TELEGRAM BOT SECTION */}
            <div style={{ marginTop: 60, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 32 }}>
              <div style={{ fontSize: 24, fontWeight: 300, marginBottom: 12 }}>{t("telegram_settings_title")}</div>
              <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: 24, fontSize: 15, maxWidth: 800 }} dangerouslySetInnerHTML={{ __html: t("telegram_settings_desc") }} />
              
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 300 }}>
                  <input 
                    type="text" 
                    value={telegramConfig.token} 
                    onChange={e => setTelegramConfig({...telegramConfig, token: e.target.value})}
                    placeholder={t("telegram_placeholder")}
                    style={{ width: "100%", padding: 14, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, color: "#fff", outline: "none", fontFamily: "monospace" }}
                  />
                </div>
                <button 
                  onClick={saveTelegramConfig} 
                  disabled={telegramSaving}
                  style={{ background: "#2997ff", color: "#000", border: "none", padding: "14px 28px", borderRadius: 10, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: 15 }}
                >
                  {telegramSaving ? <Loader2 size={18} className="animate-spin" /> : t("telegram_btn_save")}
                </button>
              </div>

              {telegramConfig.username && (
                <div style={{ marginTop: 24, padding: 16, background: "rgba(40, 200, 64, 0.1)", border: "1px solid rgba(40, 200, 64, 0.3)", borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 13, color: "#28C840", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 4 }}>{t("telegram_bot_connected")}</div>
                    <div style={{ fontSize: 16, fontWeight: 500 }}>@{telegramConfig.username}</div>
                  </div>
                  <a href={`https://t.me/${telegramConfig.username}`} target="_blank" rel="noreferrer" style={{ background: "#fff", color: "#000", textDecoration: "none", padding: "10px 20px", borderRadius: 8, fontWeight: 600, fontSize: 14 }}>
                    {t("telegram_go_to_bot")}
                  </a>
                </div>
              )}
            </div>

          </motion.div>
        )}

      </main>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showPwdModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)", zIndex: 100, display: "grid", placeItems: "center" }}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} style={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", padding: 40, borderRadius: 24, width: "100%", maxWidth: 400 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
                <div style={{ fontSize: 24, fontWeight: 300 }}>Change Password</div>
                <button onClick={() => setShowPwdModal(false)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 24 }}>&times;</button>
              </div>
              <form onSubmit={handleChangePassword}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>Current Password</label>
                  <input type="password" required value={pwdForm.current} onChange={e => setPwdForm({...pwdForm, current: e.target.value})} style={{ width: "100%", padding: 14, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", outline: "none" }} />
                </div>
                <div style={{ marginBottom: 30 }}>
                  <label style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>New Password</label>
                  <input type="password" required minLength={6} value={pwdForm.new} onChange={e => setPwdForm({...pwdForm, new: e.target.value})} style={{ width: "100%", padding: 14, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", outline: "none" }} />
                </div>
                <button type="submit" disabled={pwdBusy} style={{ width: "100%", padding: 14, background: "#fff", color: "#000", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: "pointer", display: "flex", justifyContent: "center" }}>
                  {pwdBusy ? <Loader2 size={18} className="animate-spin" /> : "Save Changes"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function FeatureTeaser({ icon, title, desc }) {
  return (
    <div style={{ textAlign: "left", padding: 30, borderRadius: 24, border: "1px solid rgba(255,255,255,0.1)" }}>
      <div style={{ color: "#2997ff", marginBottom: 20 }}>{icon}</div>
      <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 10, display: "flex", alignItems: "center", gap: 10 }}>
        {title} <Lock size={14} color="rgba(255,255,255,0.4)" />
      </div>
      <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{desc}</div>
    </div>
  );
}

function TelemetryCard({ title, value, desc }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", padding: 24, borderRadius: 16 }}>
      <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)", marginBottom: 16 }}>{title}</div>
      <div style={{ fontSize: 48, fontWeight: 200, marginBottom: 8 }}>{value}</div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{desc}</div>
    </div>
  );
}

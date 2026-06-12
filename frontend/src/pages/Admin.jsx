import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useLocalizedNavigate from "../hooks/useLocalizedNavigate";
import { toast, Toaster } from "sonner";
import { LogOut, Search, Users, TrendingUp, DollarSign, AlertCircle, Loader2, Upload, KeyRound, Activity, X, ShieldOff, ShieldCheck, RefreshCw, Clock, Compass, Cpu, Database, Radio, FileText, Lock, Globe, MapPin, AlertTriangle, Plus, BookOpen } from "lucide-react";
import api from "../lib/api";
import { useAuth } from "../lib/auth";
import AdminPin from "./AdminPin";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
export default function Admin() {
  const {
    t
  } = useTranslation();
  const {
    user,
    loading,
    logout
  } = useAuth();
  const navigate = useLocalizedNavigate();
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(true);

  // Set noindex on this page
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "robots";
      document.head.appendChild(meta);
    }
    meta.content = "noindex,nofollow";
    return () => meta.remove();
  }, []);
  useEffect(() => {
    if (!loading && (!user || !user.is_admin)) navigate("/", {
      replace: true
    });
  }, [user, loading, navigate]);

  // Check if PIN already unlocked
  useEffect(() => {
    if (!user?.is_admin) return;
    api.get("/api/admin/ping").then(() => setUnlocked(true)).catch(() => setUnlocked(false)).finally(() => setChecking(false));
  }, [user]);
  if (loading || checking) {
    return <div style={{
      minHeight: "100vh",
      background: "#000",
      display: "grid",
      placeItems: "center"
    }}>
        <Loader2 size={28} color="#2997ff" className="spin" />
        <style>{`.spin{animation: spin 0.9s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>;
  }
  if (!unlocked) return <AdminPin onUnlock={() => setUnlocked(true)} />;
  return <AdminPanel onLogout={async () => {
    await logout();
    navigate("/");
  }} />;
}
function AdminPanel({
  onLogout
}) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState({
    key: "created_at",
    dir: "desc"
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [apiLogs, setApiLogs] = useState([]);
  const [version, setVersion] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState("users"); // 'users' | 'active' | 'revenue' | 'churn'
  const fileRef = useRef(null);
  const mapRef = useRef(null);

  // Нові стани для розширених преміум-фіч
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, analytics, map, users, health, broadcast, logs, docs_cms, waitlist
  const [waitlistData, setWaitlistData] = useState(null);
  const [waitlistBusy, setWaitlistBusy] = useState(null);
  const [detailedStats, setDetailedStats] = useState(null);
  const [healthMetrics, setHealthMetrics] = useState(null);
  const [activeMap, setActiveMap] = useState([]);
  const [adminLogs, setAdminLogs] = useState([]);
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastTarget, setBroadcastTarget] = useState("all");
  const [sendingBroadcast, setSendingBroadcast] = useState(false);
  const [customDocs, setCustomDocs] = useState([]);
  const [editingDoc, setEditingDoc] = useState(null);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState("edit");
  const [liveContent, setLiveContent] = useState("");
  const [trackingEvents, setTrackingEvents] = useState([]);
  
  // Нові стани для кандидатів
  const [candidates, setCandidates] = useState([
    {
      _id: "test-1",
      name: "Валентин Тестер",
      contact: "@tester_pro",
      portfolio: "https://github.com/atlas-tester",
      experience: "Маю 5 років досвіду в розробці. Вмію будувати архітектуру, делегувати задачі AI та робити рев'ю.",
      status: "new",
      created_at: new Date().toISOString()
    }
  ]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);

  // New state for subadmins
  const [subadmins, setSubadmins] = useState([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminName, setNewAdminName] = useState("");
  const [generatedCreds, setGeneratedCreds] = useState(null);
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const [s, u, l, v, ds, hm, am, al, cd, te] = await Promise.all([api.get("/api/admin/stats"), api.get("/api/admin/users", {
        params: {
          q,
          filter
        }
      }), api.get("/api/admin/api-logs"), api.get("/api/admin/version"), api.get("/api/admin/detailed-stats"), api.get("/api/admin/health-metrics"), api.get("/api/admin/active-map"), api.get("/api/admin/admin-logs"), api.get("/api/admin/docs/custom"), api.get("/api/admin/analytics/events")]);
      setStats(s.data);
      setUsers(u.data);
      setApiLogs(l.data);
      setVersion(v.data);
      setDetailedStats(ds.data);
      setHealthMetrics(hm.data);
      setActiveMap(am.data);
      setAdminLogs(al.data);
      setCustomDocs(cd.data);
      setTrackingEvents(te.data);
      
      try {
        const cands = await api.get("/api/admin/job-applications");
        if (Array.isArray(cands.data)) {
          setCandidates(cands.data);
        }
      } catch (e) {
        console.warn("Failed to fetch candidates, using mock data", e);
      }
      
      if (user?.is_super_admin) {
        try {
          const sa = await api.get("/api/admin/subadmins");
          setSubadmins(sa.data);
        } catch (e) {
          console.error("Failed to fetch subadmins", e);
        }
      }
      try {
        const wl = await api.get("/api/admin/waitlist");
        setWaitlistData(wl.data);
      } catch (e) {
        console.warn("Failed to fetch waitlist", e);
      }
    } catch (err) {
      console.error("Admin refresh error", err);
    }
  }, [q, filter, user?.is_super_admin]);
  useEffect(() => {
    refresh();
    const intervalId = setInterval(refresh, 30000); // Оновлення кожні 30 секунд
    return () => clearInterval(intervalId);
  }, [refresh]);
  const sortedUsers = useMemo(() => {
    const arr = [...users];
    arr.sort((a, b) => {
      const va = a[sort.key] ?? "";
      const vb = b[sort.key] ?? "";
      if (va < vb) return sort.dir === "asc" ? -1 : 1;
      if (va > vb) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [users, sort]);
  const toggleSort = k => setSort(s => s.key === k ? {
    key: k,
    dir: s.dir === "asc" ? "desc" : "asc"
  } : {
    key: k,
    dir: "asc"
  });
  const chartConfig = useMemo(() => {
    switch (selectedMetric) {
      case "active":
        return {
          title: t("txt_1245"),
          color: "#28C840"
        };
      case "revenue":
        return {
          title: t("txt_1246"),
          color: "#FEBC2E"
        };
      case "churn":
        return {
          title: t("txt_1247"),
          color: "#FF5F57"
        };
      case "users":
      default:
        return {
          title: t("txt_1248"),
          color: "#2997ff"
        };
    }
  }, [selectedMetric]);
  const handleBroadcast = async () => {
    if (!broadcastMessage.trim()) return;
    setSendingBroadcast(true);
    try {
      await api.post("/api/admin/broadcast", {
        message: broadcastMessage,
        target: broadcastTarget
      });
      toast.success(t("txt_1249"), {
        style: {
          background: "rgba(40,200,64,0.15)",
          border: "1px solid rgba(40,200,64,0.4)",
          color: "#fff"
        }
      });
      setBroadcastMessage("");
      refresh();
    } catch {
      toast.error(t("txt_1250"));
    } finally {
      setSendingBroadcast(false);
    }
  };
  return <div data-testid="admin-page" style={{
    minHeight: "100vh",
    background: "#040406",
    color: "#fff",
    fontFamily: "Inter, sans-serif",
    display: "flex",
    flexDirection: "column"
  }}>
      <Toaster theme="dark" position="top-center" />

      {/* Header */}
      <header className="admin-header" style={{
      padding: "14px 24px",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
      background: "rgba(4,4,6,0.8)",
      backdropFilter: "blur(16px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 100
    }}>
        <div style={{
        display: "flex",
        alignItems: "center",
        gap: 12
      }}>
          <div style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "linear-gradient(135deg, #2997ff, #f5f5f7)",
          display: "grid",
          placeItems: "center",
          fontSize: 14,
          fontWeight: 700,
          boxShadow: "0 0 15px rgba(255,255,255,0.180)"
        }}>
            A
          </div>
          <div style={{
          fontWeight: 700,
          letterSpacing: "-0.01em",
          fontSize: 16
        }}>Atlas Mission Control</div>
          <span style={{
          fontSize: 10,
          background: "rgba(255,255,255,0.06)",
          padding: "2px 8px",
          borderRadius: 4,
          color: "rgba(255,255,255,0.4)",
          letterSpacing: "0.1em",
          textTransform: "uppercase"
        }}>
            v2.1
          </span>
        </div>
        <button data-testid="admin-logout-btn" onClick={onLogout} className="ghost-btn" style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        color: "#fff",
        display: "flex",
        gap: 6,
        alignItems: "center"
      }}>
          <LogOut size={13} />{t("txt_1251")}</button>
      </header>

      {/* Layout wrapper */}
      <div style={{
      display: "flex",
      flex: 1,
      minHeight: "calc(100vh - 61px)",
      position: "relative"
    }}>
        
        {/* Main Content Area */}
        <main style={{
        flex: 1,
        padding: "32px 3% 80px",
        maxWidth: "calc(100% - 280px)",
        overflowY: "auto"
      }}>
          
          {/* Tab: Dashboard */}
          {activeTab === "dashboard" && <div className="fade-in">
              {stats && <section data-testid="admin-stats" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
            marginBottom: 24
          }}>
                  <StatCard icon={<ShieldCheck size={18} />} label={t("txt_1252")} value={stats.active_count} accent="#28C840" active={selectedMetric === "active"} onClick={() => {
              setSelectedMetric("active");
            }} />
                  <StatCard icon={<Users size={18} />} label={t("txt_1253")} value={stats.total_users} accent="#2997ff" active={selectedMetric === "users"} onClick={() => {
              setSelectedMetric("users");
            }} />
                  <StatCard icon={<TrendingUp size={18} />} label={t("txt_1254")} value={stats.users_today} accent="#f5f5f7" active={false} onClick={() => {}} />
                  <StatCard icon={<AlertCircle size={18} />} label={t("txt_1255")} value={stats.churn_this_month} accent="#FF5F57" active={selectedMetric === "churn"} onClick={() => {
              setSelectedMetric("churn");
            }} />
                  <StatCard icon={<DollarSign size={18} />} label={t("txt_1256")} value={`$${stats.monthly_revenue}`} accent="#FEBC2E" active={selectedMetric === "revenue"} onClick={() => {
              setSelectedMetric("revenue");
            }} />
                </section>}

              {stats && <section data-testid="admin-growth" className="glass" style={{
            padding: 24,
            borderRadius: 20,
            marginBottom: 24,
            border: "1px solid rgba(255,255,255,0.04)"
          }}>
                  <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20
            }}>
                    <div>
                      <div style={{
                  fontSize: 10,
                  letterSpacing: "0.15em",
                  color: chartConfig.color,
                  textTransform: "uppercase",
                  fontWeight: 700
                }}>{t("txt_1257")}</div>
                      <h3 style={{
                  margin: "4px 0 0",
                  fontSize: 20,
                  fontWeight: 700
                }}>{chartConfig.title}</h3>
                    </div>
                    <div style={{
                display: "flex",
                gap: 8
              }}>
                      {["users", "active", "revenue"].map(m => <button key={m} onClick={() => setSelectedMetric(m)} style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  background: selectedMetric === m ? chartConfig.color : "rgba(255,255,255,0.03)",
                  color: selectedMetric === m ? "#000" : "#fff",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}>
                          {m === "users" ? t("txt_1258") : m === "active" ? t("txt_1259") : t("txt_1260")}
                        </button>)}
                    </div>
                  </div>
                  <GrowthChart data={stats.growth} metric={selectedMetric} color={chartConfig.color} />
                </section>}

              {/* Version & Manual Key generator in one row */}
              <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 24
          }}>
                <section className="glass" style={{
              padding: 24,
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.04)"
            }}>
                  <h3 style={{
                margin: "0 0 16px",
                fontSize: 16,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 8
              }}>
                    <KeyRound size={18} color="#2997ff" />{t("txt_1261")}</h3>
                  <ManualKeyGen onCreated={refresh} />
                </section>

                <section className="glass" style={{
              padding: 24,
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.04)"
            }}>
                  <h3 style={{
                margin: "0 0 16px",
                fontSize: 16,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 8
              }}>
                    <Upload size={18} color="#f5f5f7" />{t("txt_1262")}</h3>
                  <div style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: 12,
                marginBottom: 16,
                background: "rgba(255,255,255,0.02)",
                padding: "10px 14px",
                borderRadius: 10
              }}>{t("txt_1263")}<b style={{
                  color: "#fff"
                }}>{version?.version || "—"}</b> · {version?.size_mb || 0} MB<br />{t("txt_1264")}<span style={{
                  color: "#fff"
                }}>{version?.released_at ? fmtDateTime(version.released_at) : "—"}</span>
                  </div>
                  <input ref={fileRef} type="file" accept=".dmg,.zip,.tar.gz" style={{
                display: "none"
              }} />
                  <VersionUpload fileRef={fileRef} onUploaded={refresh} />
                </section>
              </div>

              {/* Compilation Instructions Block */}
              <div style={{ marginTop: 24 }}>
                <section className="glass" style={{
                  padding: 24,
                  borderRadius: 20,
                  border: "1px solid rgba(255,255,255,0.04)"
                }}>
                  <h3 style={{
                    margin: "0 0 16px",
                    fontSize: 16,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 8
                  }}>
                    <BookOpen size={18} color="#FEBC2E" /> Інструкція зі збірки оновлення (PyInstaller)
                  </h3>
                  <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, lineHeight: "1.6" }}>
                    <p style={{ margin: "0 0 12px" }}><b>Як це виправити за 3 кроки:</b></p>
                    <p style={{ margin: "0 0 4px" }}><b>1. Встанови відсутній модуль у твоє віртуальне середовище:</b><br />
                    Переконайся, що в Терміналі зліва написано <code>(.venv)</code>, і введи:</p>
                    <pre style={{ background: "rgba(0,0,0,0.5)", padding: 10, borderRadius: 8, margin: "0 0 12px" }}><code>pip install psutil</code></pre>
                    
                    <p style={{ margin: "0 0 4px" }}><b>2. Перевір, чи є інші "забуті" модулі:</b><br />
                    Оскільки раніше ми бачили помилку з pyaudio, краще встановити і його зараз:</p>
                    <pre style={{ background: "rgba(0,0,0,0.5)", padding: 10, borderRadius: 8, margin: "0 0 12px" }}><code>pip install pyaudio</code></pre>
                    
                    <p style={{ margin: "0 0 4px" }}><b>3. Запусти перезбірку проекту:</b><br />
                    Використовуй команду з прапорцем <code>--noconfirm</code>, щоб Xcode/PyInstaller не питав про видалення папки dist знову:</p>
                    <pre style={{ background: "rgba(0,0,0,0.5)", padding: 10, borderRadius: 8, margin: "0 0 12px", color: "#2997ff" }}><code>python3 -m PyInstaller --clean --noconfirm atlas.spec</code></pre>
                    
                    <div style={{ background: "rgba(255,255,255,0.03)", padding: 12, borderRadius: 8, marginBottom: 16 }}>
                      <b style={{ color: "#fff" }}>Що робить команда:</b>
                      <ul style={{ margin: "8px 0 0", paddingLeft: 20 }}>
                        <li style={{ marginBottom: 4 }}><code>python3 -m PyInstaller</code> — запускає PyInstaller з оточення Python 3.9 (бере з <code>.venv</code>).</li>
                        <li style={{ marginBottom: 4 }}><code>--clean</code> — повністю очищає кеш попередніх збірок.</li>
                        <li style={{ marginBottom: 4 }}><code>--noconfirm</code> — автоматично погоджується на видалення старої папки <code>dist/Atlas.app</code>.</li>
                        <li><code>atlas.spec</code> — файл-інструкція для збірки Atlas AI.</li>
                      </ul>
                    </div>

                    <p style={{ margin: "0 0 4px" }}><b>Що робити після збірки:</b><br />
                    Коли побачиш напис <i style={{ color: "#28C840" }}>Build complete!</i>, запусти файл для перевірки через Термінал командою:</p>
                    <pre style={{ background: "rgba(0,0,0,0.5)", padding: 10, borderRadius: 8, margin: "0 0 12px", color: "#FEBC2E" }}><code>~/Desktop/atlas_ai/dist/Atlas.app/Contents/MacOS/Atlas</code></pre>
                    
                    <p style={{ margin: 0 }}>Якщо вискочить інша помилка <code>ModuleNotFoundError</code> — доставляй цей модуль через <code>pip</code> і знову запускай збірку. Як тільки з'являться логи роботи Атласа — програма успішно скомпільована!</p>
                  </div>
                </section>
              </div>
            </div>}

          {/* Tab: Financial Analytics */}
          {activeTab === "analytics" && <div className="fade-in">
              {detailedStats && <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
            marginBottom: 24
          }}>
                  <div className="glass" style={{
              padding: 24,
              borderRadius: 20,
              borderLeft: "4px solid #2997ff",
              position: "relative",
              overflow: "hidden"
            }}>
                    <div style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.4)",
                textTransform: "uppercase",
                fontWeight: 700
              }}>{t("txt_1265")}</div>
                    <div style={{
                fontSize: 32,
                fontWeight: 800,
                marginTop: 8,
                color: "#2997ff"
              }}>${detailedStats.stripe.amount}</div>
                    <div style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.5)",
                marginTop: 6
              }}>{t("txt_1266")}{detailedStats.stripe.count}</div>
                    <DollarSign size={80} style={{
                position: "absolute",
                right: -15,
                bottom: -15,
                color: "rgba(255,255,255,0.018)"
              }} />
                  </div>
                  <div className="glass" style={{
              padding: 24,
              borderRadius: 20,
              borderLeft: "4px solid #FEBC2E",
              position: "relative",
              overflow: "hidden"
            }}>
                    <div style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.4)",
                textTransform: "uppercase",
                fontWeight: 700
              }}>{t("txt_1267")}</div>
                    <div style={{
                fontSize: 32,
                fontWeight: 800,
                marginTop: 8,
                color: "#FEBC2E"
              }}>${detailedStats.ton.amount}</div>
                    <div style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.5)",
                marginTop: 6
              }}>{t("txt_1268")}{detailedStats.ton.count}</div>
                    <Globe size={80} style={{
                position: "absolute",
                right: -15,
                bottom: -15,
                color: "rgba(254,188,46,0.03)"
              }} />
                  </div>
                </div>}

              <section className="glass" style={{
            padding: 24,
            borderRadius: 20,
            border: "1px solid rgba(255,255,255,0.04)"
          }}>
                <h3 style={{
              margin: "0 0 16px",
              fontSize: 18,
              fontWeight: 700
            }}>{t("txt_1269")}</h3>
                <div style={{
              overflowX: "auto"
            }}>
                  <table style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13
              }}>
                    <thead>
                      <tr style={{
                    color: "rgba(255,255,255,0.4)",
                    textAlign: "left",
                    borderBottom: "1px solid rgba(255,255,255,0.06)"
                  }}>
                        <th style={{
                      padding: 12
                    }}>{t("txt_1270")}</th>
                        <th style={{
                      padding: 12
                    }}>{t("txt_1271")}</th>
                        <th style={{
                      padding: 12
                    }}>{t("txt_1272")}</th>
                        <th style={{
                      padding: 12
                    }}>{t("txt_1273")}</th>
                        <th style={{
                      padding: 12
                    }}>{t("txt_1274")}</th>
                        <th style={{
                      padding: 12
                    }}>{t("txt_1275")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailedStats?.transactions.map((tx, idx) => <tr key={idx} style={{
                    borderBottom: "1px solid rgba(255,255,255,0.03)"
                  }}>
                          <td style={{
                      padding: 12,
                      fontFamily: "monospace",
                      color: "rgba(255,255,255,0.6)"
                    }}>
                            {tx.ton_tx_hash ? tx.ton_tx_hash.slice(0, 16) + "..." : tx.stripe_session_id ? tx.stripe_session_id.slice(0, 16) + "..." : "—"}
                          </td>
                          <td style={{
                      padding: 12
                    }}>{tx.email || "—"}</td>
                          <td style={{
                      padding: 12
                    }}>
                            <span style={{
                        padding: "2px 8px",
                        borderRadius: 4,
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        background: tx.ton_tx_hash ? "rgba(254,188,46,0.12)" : "rgba(255,255,255,0.072)",
                        color: tx.ton_tx_hash ? "#FEBC2E" : "#2997ff"
                      }}>
                              {tx.ton_tx_hash ? "TON" : "Stripe"}
                            </span>
                          </td>
                          <td style={{
                      padding: 12,
                      fontWeight: 600
                    }}>${tx.amount}</td>
                          <td style={{
                      padding: 12
                    }}>
                            <span style={{
                        padding: "2px 8px",
                        borderRadius: 99,
                        fontSize: 10,
                        fontWeight: 700,
                        background: tx.payment_status === "paid" ? "rgba(40,200,64,0.12)" : "rgba(255,95,87,0.12)",
                        color: tx.payment_status === "paid" ? "#28C840" : "#FF5F57"
                      }}>
                              {tx.payment_status === "paid" ? t("txt_1276") : t("txt_1277")}
                            </span>
                          </td>
                          <td style={{
                      padding: 12,
                      color: "rgba(255,255,255,0.5)"
                    }}>{fmtDateTime(tx.created_at)}</td>
                        </tr>)}
                      {(!detailedStats || detailedStats.transactions.length === 0) && <tr>
                          <td colSpan={6} style={{
                      padding: 32,
                      textAlign: "center",
                      color: "rgba(255,255,255,0.4)"
                    }}>{t("txt_1278")}</td>
                        </tr>}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>}

          {/* Tab: Realistic Leaflet Glow Map & Detailed Telemetry */}
          {activeTab === "map" && (() => {
          // Compute real-time map telemetry metrics
          const totalNodes = activeMap.length;
          const countryCounts = {};
          const regionCounts = {};
          let suspiciousCount = 0;
          activeMap.forEach(spot => {
            if (spot.suspicious) suspiciousCount++;
            const c = spot.country || t("txt_1279");
            countryCounts[c] = (countryCounts[c] || 0) + 1;
            const r = spot.region || t("txt_1280");
            const key = `${r} (${c})`;
            regionCounts[key] = (regionCounts[key] || 0) + 1;
          });
          const sortedCountries = Object.entries(countryCounts).map(([name, count]) => ({
            name,
            count,
            pct: Math.round(count / totalNodes * 100) || 0
          })).sort((a, b) => b.count - a.count);
          const sortedRegions = Object.entries(regionCounts).map(([name, count]) => ({
            name,
            count
          })).sort((a, b) => b.count - a.count);
          const focusOnMarker = (lat, lon) => {
            const map = mapRef.current;
            if (!map) return;
            map.setView([lat, lon], 8, {
              animate: true
            });

            // Find the layer in map layers and open popup
            map.eachLayer(layer => {
              if (layer instanceof L.Marker) {
                const pos = layer.getLatLng();
                if (Math.abs(pos.lat - lat) < 0.0001 && Math.abs(pos.lng - lon) < 0.0001) {
                  layer.openPopup();
                }
              }
            });
          };
          return <div className="fade-in" style={{
            display: "flex",
            flexDirection: "column",
            gap: 24
          }}>
                
                {/* 1. Global Telemetry Cards */}
                <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16
            }}>
                  <div className="glass" style={{
                padding: 18,
                borderRadius: 16,
                borderLeft: "4px solid #2997ff",
                background: "rgba(255,255,255,0.01)"
              }}>
                    <div style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,0.4)",
                  textTransform: "uppercase",
                  fontWeight: 700
                }}>{t("txt_1281")}</div>
                    <div style={{
                  fontSize: 24,
                  fontWeight: 800,
                  marginTop: 4
                }}>{totalNodes}</div>
                    <div style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.4)",
                  marginTop: 4
                }}>{t("txt_1282")}</div>
                  </div>
                  <div className="glass" style={{
                padding: 18,
                borderRadius: 16,
                borderLeft: "4px solid #f5f5f7",
                background: "rgba(255,255,255,0.01)"
              }}>
                    <div style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,0.4)",
                  textTransform: "uppercase",
                  fontWeight: 700
                }}>{t("txt_1283")}</div>
                    <div style={{
                  fontSize: 24,
                  fontWeight: 800,
                  marginTop: 4
                }}>{sortedCountries.length}</div>
                    <div style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.4)",
                  marginTop: 4
                }}>{t("txt_1284")}</div>
                  </div>
                  <div className="glass" style={{
                padding: 18,
                borderRadius: 16,
                borderLeft: "4px solid #FEBC2E",
                background: "rgba(255,255,255,0.01)"
              }}>
                    <div style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,0.4)",
                  textTransform: "uppercase",
                  fontWeight: 700
                }}>{t("txt_1285")}</div>
                    <div style={{
                  fontSize: 24,
                  fontWeight: 800,
                  marginTop: 4
                }}>{sortedRegions.length}</div>
                    <div style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.4)",
                  marginTop: 4
                }}>{t("txt_1286")}</div>
                  </div>
                  <div className="glass" style={{
                padding: 18,
                borderRadius: 16,
                borderLeft: `4px solid ${suspiciousCount > 0 ? '#FF5F57' : '#28C840'}`,
                background: "rgba(255,255,255,0.01)"
              }}>
                    <div style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,0.4)",
                  textTransform: "uppercase",
                  fontWeight: 700
                }}>{t("txt_1287")}</div>
                    <div style={{
                  fontSize: 24,
                  fontWeight: 800,
                  marginTop: 4,
                  color: suspiciousCount > 0 ? "#FF5F57" : "#28C840"
                }}>
                      {suspiciousCount}
                    </div>
                    <div style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.4)",
                  marginTop: 4
                }}>
                      {suspiciousCount > 0 ? t("txt_1288") : t("txt_1289")}
                    </div>
                  </div>
                </div>

                {/* 2. Main Map Dashboard Grid */}
                <div style={{
              display: "grid",
              gridTemplateColumns: "320px 1fr",
              gap: 24,
              alignItems: "start"
            }}>
                  
                  {/* Left Column: Geographic Breakdown & Leaderboards */}
                  <div style={{
                display: "flex",
                flexDirection: "column",
                gap: 20
              }}>
                    
                    {/* Countries Leaderboard */}
                    <div className="glass" style={{
                  padding: 20,
                  borderRadius: 20,
                  border: "1px solid rgba(255,255,255,0.04)"
                }}>
                      <h4 style={{
                    margin: "0 0 14px",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#2997ff",
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                  }}>
                        <Globe size={16} />{t("txt_1290")}</h4>
                      <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    maxHeight: 180,
                    overflowY: "auto",
                    paddingRight: 4
                  }}>
                        {sortedCountries.map((c, i) => <div key={i}>
                            <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 12,
                        marginBottom: 4
                      }}>
                              <span>{c.name}</span>
                              <span style={{
                          fontWeight: 600,
                          color: "rgba(255,255,255,0.8)"
                        }}>{c.count} ({c.pct}%)</span>
                            </div>
                            <div style={{
                        width: "100%",
                        height: 4,
                        background: "rgba(255,255,255,0.06)",
                        borderRadius: 2,
                        overflow: "hidden"
                      }}>
                              <div style={{
                          width: `${c.pct}%`,
                          height: "100%",
                          background: "linear-gradient(90deg, #2997ff, #f5f5f7)",
                          borderRadius: 2
                        }} />
                            </div>
                          </div>)}
                        {sortedCountries.length === 0 && <div style={{
                      color: "rgba(255,255,255,0.4)",
                      fontSize: 12,
                      textAlign: "center",
                      padding: "10px 0"
                    }}>{t("txt_1291")}</div>}
                      </div>
                    </div>

                    {/* Regions & Oblasts Monitor */}
                    <div className="glass" style={{
                  padding: 20,
                  borderRadius: 20,
                  border: "1px solid rgba(255,255,255,0.04)"
                }}>
                      <h4 style={{
                    margin: "0 0 14px",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#f5f5f7",
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                  }}>
                        <MapPin size={16} />{t("txt_1292")}</h4>
                      <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    maxHeight: 220,
                    overflowY: "auto",
                    paddingRight: 4
                  }}>
                        {sortedRegions.map((r, i) => <div key={i} style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: 12,
                      padding: "6px 8px",
                      background: "rgba(255,255,255,0.02)",
                      borderRadius: 8
                    }}>
                            <span style={{
                        color: "rgba(255,255,255,0.85)"
                      }}>{r.name}</span>
                            <span style={{
                        fontWeight: 700,
                        color: "#f5f5f7",
                        background: "rgba(255,255,255,0.060)",
                        padding: "2px 8px",
                        borderRadius: 6,
                        fontSize: 11
                      }}>{r.count}</span>
                          </div>)}
                        {sortedRegions.length === 0 && <div style={{
                      color: "rgba(255,255,255,0.4)",
                      fontSize: 12,
                      textAlign: "center",
                      padding: "10px 0"
                    }}>{t("txt_1293")}</div>}
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Leaflet Interactive Map */}
                  <div className="glass" style={{
                padding: 10,
                borderRadius: 24,
                border: "1px solid rgba(255,255,255,0.04)",
                background: "rgba(4,4,6,0.3)"
              }}>
                    <div style={{
                  width: "100%",
                  height: 500,
                  borderRadius: 16,
                  overflow: "hidden"
                }}>
                      <LeafletGlowMap activeMap={activeMap} mapRef={mapRef} />
                    </div>
                  </div>

                </div>

                {/* 3. Detailed Telemetry Log Table */}
                <div className="glass" style={{
              padding: 24,
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.04)"
            }}>
                  <h4 style={{
                margin: "0 0 16px",
                fontSize: 15,
                fontWeight: 700,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                gap: 8
              }}>
                    <Activity size={18} color="#2997ff" />{t("txt_1294")}</h4>
                  <div style={{
                overflowX: "auto"
              }}>
                    <table style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 13
                }}>
                      <thead>
                        <tr style={{
                      color: "rgba(255,255,255,0.4)",
                      textAlign: "left",
                      borderBottom: "1px solid rgba(255,255,255,0.06)"
                    }}>
                          <th style={{
                        padding: 12
                      }}>{t("txt_1295")}</th>
                          <th style={{
                        padding: 12
                      }}>{t("txt_1296")}</th>
                          <th style={{
                        padding: 12
                      }}>{t("txt_1297")}</th>
                          <th style={{
                        padding: 12
                      }}>{t("txt_1298")}</th>
                          <th style={{
                        padding: 12
                      }}>{t("txt_1299")}</th>
                          <th style={{
                        padding: 12
                      }}>{t("txt_1300")}</th>
                          <th style={{
                        padding: 12
                      }}>{t("txt_1301")}</th>
                          <th style={{
                        padding: 12
                      }}>{t("txt_1302")}</th>
                          <th style={{
                        padding: 12,
                        textAlign: "center"
                      }}>{t("txt_1303")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeMap.map((spot, idx) => <tr key={idx} style={{
                      borderBottom: "1px solid rgba(255,255,255,0.03)",
                      background: spot.suspicious ? "rgba(255,95,87,0.02)" : "transparent"
                    }}>
                            <td style={{
                        padding: 12,
                        fontFamily: "monospace",
                        fontWeight: 600
                      }}>{spot.ip}</td>
                            <td style={{
                        padding: 12
                      }}>{spot.country}</td>
                            <td style={{
                        padding: 12,
                        color: "rgba(255,255,255,0.85)"
                      }}>{spot.region || "—"}</td>
                            <td style={{
                        padding: 12
                      }}>{spot.city}</td>
                            <td style={{
                        padding: 12,
                        color: "rgba(255,255,255,0.5)",
                        fontFamily: "monospace"
                      }}>{spot.lat.toFixed(4)}, {spot.lon.toFixed(4)}</td>
                            <td style={{
                        padding: 12,
                        fontFamily: "monospace",
                        color: "rgba(255,255,255,0.200)"
                      }}>{spot.key_prefix.slice(0, 14)}...</td>
                            <td style={{
                        padding: 12
                      }}>
                              {spot.suspicious ? <span style={{
                          padding: "2px 8px",
                          borderRadius: 6,
                          fontSize: 10,
                          fontWeight: 700,
                          background: "rgba(255,95,87,0.12)",
                          color: "#FF5F57",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4
                        }}>
                                  <AlertTriangle size={10} />{t("txt_1304")}</span> : <span style={{
                          padding: "2px 8px",
                          borderRadius: 6,
                          fontSize: 10,
                          fontWeight: 700,
                          background: "rgba(40,200,64,0.12)",
                          color: "#28C840"
                        }}>{t("txt_1305")}</span>}
                            </td>
                            <td style={{
                        padding: 12,
                        color: "rgba(255,255,255,0.4)"
                      }}>{fmtDateTime(spot.ts)}</td>
                            <td style={{
                        padding: 12,
                        textAlign: "center"
                      }}>
                              <button onClick={() => focusOnMarker(spot.lat, spot.lon)} className="ghost-btn" style={{
                          padding: "4px 10px",
                          fontSize: 11,
                          background: "rgba(255,255,255,0.036)",
                          border: "1px solid rgba(255,255,255,0.090)",
                          color: "#2997ff"
                        }}>{t("txt_1306")}</button>
                            </td>
                          </tr>)}
                        {activeMap.length === 0 && <tr>
                            <td colSpan={9} style={{
                        padding: 32,
                        textAlign: "center",
                        color: "rgba(255,255,255,0.4)"
                      }}>{t("txt_1307")}</td>
                          </tr>}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>;
        })()}

          {/* Tab: Tracking Analytics */}
          {activeTab === "tracking" && (
            <div className="fade-in">
              <section className="glass" style={{ padding: 24, borderRadius: 20, border: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                    <Activity size={20} color="#2997ff" />
                    Відстеження дій (Кліки по кнопках)
                  </h3>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.05)", padding: "4px 10px", borderRadius: 12 }}>
                    Оновлюється автоматично
                  </div>
                </div>
                
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ color: "rgba(255,255,255,0.4)", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <th style={{ padding: 12 }}>Час події (Local)</th>
                        <th style={{ padding: 12 }}>Цільова дія (Event)</th>
                        <th style={{ padding: 12 }}>IP Адреса</th>
                        <th style={{ padding: 12 }}>User Agent (Пристрій/ОС)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trackingEvents.map((evt, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                          <td style={{ padding: 12, color: "rgba(255,255,255,0.6)" }}>
                            {fmtDateTime(evt.created_at)}
                          </td>
                          <td style={{ padding: 12, fontWeight: 600 }}>
                            <span style={{
                              padding: "4px 10px",
                              borderRadius: 8,
                              background: evt.event_name.includes("download") ? "rgba(255,255,255,0.060)" : "rgba(255,255,255,0.050)",
                              color: evt.event_name.includes("download") ? "#2997ff" : "#f5f5f7",
                              fontSize: 12
                            }}>
                              {evt.event_name}
                            </span>
                          </td>
                          <td style={{ padding: 12, fontFamily: "monospace", color: "#FEBC2E" }}>
                            {evt.ip_address}
                          </td>
                          <td style={{ padding: 12, color: "rgba(255,255,255,0.5)", maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={evt.user_agent}>
                            {evt.user_agent}
                          </td>
                        </tr>
                      ))}
                      {trackingEvents.length === 0 && (
                        <tr>
                          <td colSpan={4} style={{ padding: 32, textAlign: "center", color: "rgba(255,255,255,0.4)" }}>
                            Поки що немає зафіксованих дій.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {/* Tab: Users Table (Live heartbeats) */}
          {activeTab === "users" && <section data-testid="admin-users-block" className="glass fade-in" style={{
          padding: 24,
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.04)"
        }}>
              <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 20
          }}>
                <div>
                  <h3 style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 700
              }}>{t("txt_1308")}</h3>
                  <div style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.4)",
                marginTop: 4
              }}>{t("txt_1309")}</div>
                </div>
                <div style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              flexWrap: "wrap"
            }}>
                  <div style={{
                position: "relative"
              }}>
                    <Search size={14} style={{
                  position: "absolute",
                  left: 12,
                  top: 11,
                  color: "rgba(255,255,255,0.4)"
                }} />
                    <input data-testid="users-search-input" placeholder={t("txt_1310")} value={q} onChange={e => setQ(e.target.value)} style={{
                  padding: "9px 12px 9px 32px",
                  background: "rgba(0,0,0,0.4)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#fff",
                  borderRadius: 10,
                  fontSize: 13,
                  width: 240,
                  outline: "none"
                }} />
                  </div>
                  <select data-testid="users-filter-select" value={filter} onChange={e => setFilter(e.target.value)} style={{
                padding: "9px 12px",
                background: "rgba(0,0,0,0.4)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#fff",
                borderRadius: 10,
                fontSize: 13,
                outline: "none"
              }}>
                    <option value="all">{t("txt_1311")}</option>
                    <option value="active">{t("txt_1312")}</option>
                    <option value="inactive">{t("txt_1313")}</option>
                    <option value="blocked">{t("txt_1314")}</option>
                  </select>
                  <button data-testid="users-refresh-btn" onClick={refresh} className="ghost-btn" style={{
                background: "rgba(255,255,255,0.04)"
              }}>
                    <RefreshCw size={13} />
                  </button>
                </div>
              </div>

              <div style={{
            overflowX: "auto"
          }}>
                <table style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 13
            }}>
                  <thead>
                    <tr style={{
                  color: "rgba(255,255,255,0.5)",
                  textAlign: "left"
                }}>
                      {[["email", "Email"], ["key", t("txt_1315")], ["active", t("txt_1316")], ["heartbeat", t("txt_1317")], ["mac_id", t("txt_1318")], ["version", t("txt_1319")], ["created_at", t("txt_1320")], ["expires_at", t("txt_1321")]].map(([k, l]) => <th key={k} onClick={() => toggleSort(k)} style={{
                    padding: "12px 14px",
                    cursor: "pointer",
                    fontWeight: 600,
                    userSelect: "none",
                    whiteSpace: "nowrap"
                  }}>
                          {l} {sort.key === k ? sort.dir === "asc" ? "▲" : "▼" : ""}
                        </th>)}
                      <th style={{
                    padding: "12px 14px"
                  }}>{t("txt_1322")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedUsers.map(u => {
                  // Check if online: last ping was < 30 seconds ago
                  const isOnline = u.last_ping && new Date() - new Date(u.last_ping) < 45000;
                  return <tr key={u.user_id} data-testid={`user-row-${u.user_id}`} style={{
                    borderTop: "1px solid rgba(255,255,255,0.05)"
                  }}>
                          <td style={td}>
                            <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8
                      }}>
                              {u.avatar_url ? <img src={u.avatar_url} alt="" style={{
                          width: 22,
                          height: 22,
                          borderRadius: "50%"
                        }} /> : null}
                              <span>{u.email}</span>
                              {u.is_blocked && <ShieldOff size={12} color="#FF5F57" />}
                            </div>
                          </td>
                          <td style={{
                      ...td,
                      fontFamily: "monospace",
                      color: "rgba(255,255,255,0.6)"
                    }}>
                            {u.key ? u.key.slice(0, 14) + "…" : "—"}
                          </td>
                          <td style={td}>
                            <span style={{
                        padding: "3px 10px",
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 700,
                        background: u.active ? "rgba(40,200,64,0.12)" : "rgba(255,95,87,0.12)",
                        color: u.active ? "#28C840" : "#FF5F57"
                      }}>
                              {u.active ? t("txt_1323") : t("txt_1324")}
                            </span>
                          </td>
                          <td style={td}>
                            <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6
                      }}>
                              <span style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: isOnline ? "#28C840" : "rgba(255,255,255,0.15)",
                          boxShadow: isOnline ? "0 0 8px #28C840" : "none",
                          display: "inline-block"
                        }} />
                              <span style={{
                          fontSize: 11,
                          color: isOnline ? "#28C840" : "rgba(255,255,255,0.4)"
                        }}>
                                {isOnline ? "Online" : "Offline"}
                              </span>
                            </div>
                          </td>
                          <td style={{
                      ...td,
                      fontFamily: "monospace",
                      color: "rgba(255,255,255,0.6)"
                    }}>
                            {u.mac_id ? `${u.mac_name || "Mac"} (${u.mac_id.slice(0, 6)})` : "—"}
                          </td>
                          <td style={td}>{u.version}</td>
                          <td style={td}>{fmtDate(u.created_at)}</td>
                          <td style={td}>{fmtDate(u.expires_at)}</td>
                          <td style={td}>
                            <button data-testid={`user-open-${u.user_id}`} onClick={() => setSelectedUser(u)} className="ghost-btn" style={{
                        padding: "5px 12px",
                        fontSize: 12,
                        background: "rgba(255,255,255,0.03)"
                      }}>{t("txt_1325")}</button>
                          </td>
                        </tr>;
                })}
                    {sortedUsers.length === 0 && <tr>
                        <td colSpan={9} style={{
                    padding: 40,
                    textAlign: "center",
                    color: "rgba(255,255,255,0.4)"
                  }}>{t("txt_1326")}</td>
                      </tr>}
                  </tbody>
                </table>
              </div>
            </section>}

          {/* Tab: Server and Database Health */}
          {activeTab === "health" && <div className="fade-in">
              <section className="glass" style={{
            padding: 24,
            borderRadius: 20,
            border: "1px solid rgba(255,255,255,0.04)"
          }}>
                <div style={{
              marginBottom: 20
            }}>
                  <div style={{
                fontSize: 10,
                color: "#f5f5f7",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                fontWeight: 700
              }}>{t("txt_1327")}</div>
                  <h3 style={{
                margin: "4px 0 0",
                fontSize: 20,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 8
              }}>
                    <Cpu size={20} color="#f5f5f7" />{t("txt_1328")}</h3>
                </div>

                {healthMetrics && <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 20
            }}>
                    <div style={{
                background: "rgba(255,255,255,0.02)",
                padding: 20,
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.04)"
              }}>
                      <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12
                }}>
                        <span style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.4)"
                  }}>{t("txt_1329")}</span>
                        <Cpu size={16} color="#2997ff" />
                      </div>
                      <div style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "#2997ff"
                }}>{healthMetrics.cpu_percent}%</div>
                      <div style={{
                  width: "100%",
                  height: 6,
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: 3,
                  marginTop: 12,
                  overflow: "hidden"
                }}>
                        <div style={{
                    width: `${healthMetrics.cpu_percent}%`,
                    height: "100%",
                    background: "#2997ff",
                    borderRadius: 3
                  }} />
                      </div>
                    </div>

                    <div style={{
                background: "rgba(255,255,255,0.02)",
                padding: 20,
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.04)"
              }}>
                      <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12
                }}>
                        <span style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.4)"
                  }}>{t("txt_1330")}</span>
                        <Database size={16} color="#f5f5f7" />
                      </div>
                      <div style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "#f5f5f7"
                }}>{healthMetrics.memory.used_mb} MB</div>
                      <div style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.4)",
                  marginTop: 6
                }}>{t("txt_1331")}{healthMetrics.memory.total_mb} MB</div>
                    </div>

                    <div style={{
                background: "rgba(255,255,255,0.02)",
                padding: 20,
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.04)"
              }}>
                      <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12
                }}>
                        <span style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.4)"
                  }}>{t("txt_1332")}</span>
                        <Radio size={16} color="#28C840" />
                      </div>
                      <div style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "#28C840"
                }}>{healthMetrics.db_latency_ms} ms</div>
                      <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  marginTop: 6
                }}>
                        <span style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#28C840"
                  }} />
                        <span style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.5)"
                  }}>{t("txt_1333")}</span>
                      </div>
                    </div>

                    <div style={{
                background: "rgba(255,255,255,0.02)",
                padding: 20,
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.04)"
              }}>
                      <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12
                }}>
                        <span style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.4)"
                  }}>{t("txt_1334")}</span>
                        <Clock size={16} color="#FEBC2E" />
                      </div>
                      <div style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#FEBC2E",
                  marginTop: 4
                }}>
                        {Math.floor(healthMetrics.uptime_seconds / 3600)}{t("txt_1335")}{Math.floor(healthMetrics.uptime_seconds % 3600 / 60)}{t("txt_1336")}</div>
                      <div style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.4)",
                  marginTop: 12
                }}>Python {healthMetrics.python_version}</div>
                    </div>
                  </div>}
              </section>
            </div>}

          {/* Tab: Broadcast Alert Center */}
          {activeTab === "broadcast" && <div className="fade-in">
              <section className="glass" style={{
            padding: 24,
            borderRadius: 20,
            border: "1px solid rgba(255,255,255,0.04)"
          }}>
                <div style={{
              marginBottom: 20
            }}>
                  <div style={{
                fontSize: 10,
                color: "#FEBC2E",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                fontWeight: 700
              }}>{t("txt_1337")}</div>
                  <h3 style={{
                margin: "4px 0 0",
                fontSize: 20,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 8
              }}>
                    <Radio size={20} color="#FEBC2E" />{t("txt_1338")}</h3>
                </div>

                <div style={{
              display: "grid",
              gap: 16
            }}>
                  <div>
                    <label style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.5)",
                  display: "block",
                  marginBottom: 8
                }}>{t("txt_1339")}</label>
                    <select value={broadcastTarget} onChange={e => setBroadcastTarget(e.target.value)} style={{
                  padding: "12px 16px",
                  background: "rgba(0,0,0,0.5)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#fff",
                  borderRadius: 12,
                  fontSize: 14,
                  outline: "none",
                  width: "100%",
                  maxWidth: 320
                }}>
                      <option value="all">{t("txt_1340")}</option>
                      <option value="telegram">{t("txt_1341")}</option>
                      <option value="clients">{t("txt_1342")}</option>
                    </select>
                  </div>

                  <div>
                    <label style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.5)",
                  display: "block",
                  marginBottom: 8
                }}>{t("txt_1343")}</label>
                    <textarea placeholder={t("txt_1344")} value={broadcastMessage} onChange={e => setBroadcastMessage(e.target.value)} rows={5} style={{
                  width: "100%",
                  padding: 16,
                  background: "rgba(0,0,0,0.4)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 14,
                  color: "#fff",
                  fontSize: 14,
                  fontFamily: "inherit",
                  resize: "vertical",
                  outline: "none"
                }} />
                  </div>

                  <button onClick={handleBroadcast} disabled={sendingBroadcast || !broadcastMessage.trim()} className="cta-btn" style={{
                padding: "14px 28px",
                borderRadius: 12,
                alignSelf: "flex-start",
                display: "flex",
                gap: 8,
                alignItems: "center"
              }}>
                    {sendingBroadcast ? <Loader2 size={16} className="spin" /> : <Radio size={16} />}{t("txt_1345")}</button>
                </div>
              </section>
            </div>}

          {/* Tab: Admin Audit Log */}
          {activeTab === "logs" && <div className="fade-in">
              <section className="glass" style={{
            padding: 24,
            borderRadius: 20,
            border: "1px solid rgba(255,255,255,0.04)"
          }}>
                <div style={{
              marginBottom: 20
            }}>
                  <div style={{
                fontSize: 10,
                color: "#FF5F57",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                fontWeight: 700
              }}>{t("txt_1346")}</div>
                  <h3 style={{
                margin: "4px 0 0",
                fontSize: 20,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 8
              }}>
                    <FileText size={20} color="#FF5F57" />{t("txt_1347")}</h3>
                </div>

                <div style={{
              overflowX: "auto"
            }}>
                  <table style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13
              }}>
                    <thead>
                      <tr style={{
                    color: "rgba(255,255,255,0.4)",
                    textAlign: "left",
                    borderBottom: "1px solid rgba(255,255,255,0.06)"
                  }}>
                        <th style={{
                      padding: 12
                    }}>{t("txt_1348")}</th>
                        <th style={{
                      padding: 12
                    }}>{t("txt_1349")}</th>
                        <th style={{
                      padding: 12
                    }}>{t("txt_1350")}</th>
                        <th style={{
                      padding: 12
                    }}>{t("txt_1351")}</th>
                        <th style={{
                      padding: 12
                    }}>{t("txt_1352")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminLogs.map((log, idx) => <tr key={idx} style={{
                    borderBottom: "1px solid rgba(255,255,255,0.03)"
                  }}>
                          <td style={{
                      padding: 12
                    }}>
                            <span style={{
                        padding: "2px 8px",
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 700,
                        background: "rgba(255,95,87,0.12)",
                        color: "#FF5F57"
                      }}>
                              {log.action}
                            </span>
                          </td>
                          <td style={{
                      padding: 12,
                      fontWeight: 600
                    }}>{log.performed_by}</td>
                          <td style={{
                      padding: 12
                    }}>{log.target_email || "—"}</td>
                          <td style={{
                      padding: 12,
                      color: "rgba(255,255,255,0.5)"
                    }}>{fmtDateTime(log.performed_at)}</td>
                          <td style={{
                      padding: 12,
                      fontFamily: "monospace",
                      fontSize: 12,
                      color: "rgba(255,255,255,0.200)"
                    }}>
                            {JSON.stringify(log.details || {})}
                          </td>
                        </tr>)}
                      {adminLogs.length === 0 && <tr>
                          <td colSpan={5} style={{
                      padding: 32,
                      textAlign: "center",
                      color: "rgba(255,255,255,0.4)"
                    }}>{t("txt_1353")}</td>
                        </tr>}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>}
          {/* Tab: Documentation CMS (Markdown Editor & Preview) */}
          {activeTab === "docs_cms" && (() => {
          const handleSaveDoc = async e => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = {
              id: formData.get("id"),
              title: formData.get("title"),
              eyebrow: formData.get("eyebrow"),
              desc: formData.get("desc"),
              icon: formData.get("icon"),
              order: parseInt(formData.get("order")) || 99,
              content: formData.get("content")
            };
            try {
              await api.post("/api/admin/docs", data);
              toast.success(t("txt_1354"));
              setIsDocModalOpen(false);
              setEditingDoc(null);
              refresh();
            } catch (err) {
              console.error("Save doc error:", err);
              toast.error(t("txt_1355") + (err.response?.data?.detail || err.message));
            }
          };
          const handleDeleteDoc = async id => {
            if (!window.confirm(`Ви дійсно бажаєте видалити розділ "${id}"?`)) return;
            try {
              await api.delete(`/api/admin/docs/${id}`);
              toast.success(t("txt_1356"));
              refresh();
            } catch (err) {
              console.error("Delete doc error:", err);
              toast.error(t("txt_1357") + (err.response?.data?.detail || err.message));
            }
          };
          return <div className="fade-in" style={{
            display: "flex",
            flexDirection: "column",
            gap: 24
          }}>
                
                <section className="glass" style={{
              padding: 24,
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.04)"
            }}>
                  <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
                flexWrap: "wrap",
                gap: 12
              }}>
                    <div>
                      <div style={{
                    fontSize: 10,
                    color: "#f5f5f7",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    fontWeight: 700
                  }}>{t("txt_1358")}</div>
                      <h3 style={{
                    margin: "4px 0 0",
                    fontSize: 20,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 8
                  }}>
                        <BookOpen size={20} color="#f5f5f7" />{t("txt_1359")}</h3>
                    </div>
                    <button onClick={() => {
                  setEditingDoc({
                    id: "",
                    title: "",
                    eyebrow: t("txt_1360"),
                    desc: "",
                    icon: "BookOpen",
                    order: 99,
                    content: ""
                  });
                  setLiveContent("");
                  setActiveEditorTab("edit");
                  setIsDocModalOpen(true);
                }} className="cta-btn" style={{
                  padding: "8px 16px",
                  fontSize: 12
                }}>
                      <Plus size={14} style={{
                    marginRight: 6
                  }} />{t("txt_1361")}</button>
                  </div>

                  <div style={{
                overflowX: "auto"
              }}>
                    <table style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 13
                }}>
                      <thead>
                        <tr style={{
                      color: "rgba(255,255,255,0.4)",
                      textAlign: "left",
                      borderBottom: "1px solid rgba(255,255,255,0.06)"
                    }}>
                          <th style={{
                        padding: 12
                      }}>{t("txt_1362")}</th>
                          <th style={{
                        padding: 12
                      }}>Slug / ID</th>
                          <th style={{
                        padding: 12
                      }}>{t("txt_1363")}</th>
                          <th style={{
                        padding: 12
                      }}>{t("txt_1364")}</th>
                          <th style={{
                        padding: 12
                      }}>{t("txt_1365")}</th>
                          <th style={{
                        padding: 12
                      }}>{t("txt_1366")}</th>
                          <th style={{
                        padding: 12,
                        textAlign: "center"
                      }}>{t("txt_1367")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customDocs.map((doc, idx) => <tr key={idx} style={{
                      borderBottom: "1px solid rgba(255,255,255,0.03)"
                    }}>
                            <td style={{
                        padding: 12,
                        fontWeight: 600
                      }}>{doc.title}</td>
                            <td style={{
                        padding: 12,
                        fontFamily: "monospace",
                        color: "#2997ff"
                      }}>{doc.id}</td>
                            <td style={{
                        padding: 12
                      }}>{doc.eyebrow}</td>
                            <td style={{
                        padding: 12,
                        color: "rgba(255,255,255,0.6)"
                      }}>{doc.icon}</td>
                            <td style={{
                        padding: 12,
                        fontWeight: 700,
                        color: "#f5f5f7"
                      }}>{doc.order}</td>
                            <td style={{
                        padding: 12,
                        color: "rgba(255,255,255,0.4)"
                      }}>
                              {doc.updated_at ? fmtDateTime(doc.updated_at) : "—"}
                            </td>
                            <td style={{
                        padding: 12,
                        textAlign: "center"
                      }}>
                              <div style={{
                          display: "flex",
                          gap: 8,
                          justifyContent: "center"
                        }}>
                                <button onClick={() => {
                            setEditingDoc(doc);
                            setLiveContent(doc.content || "");
                            setActiveEditorTab("edit");
                            setIsDocModalOpen(true);
                          }} className="ghost-btn" style={{
                            padding: "4px 10px",
                            fontSize: 11,
                            background: "rgba(255,255,255,0.04)"
                          }}>{t("txt_1368")}</button>
                                <button onClick={() => handleDeleteDoc(doc.id)} className="ghost-btn" style={{
                            padding: "4px 10px",
                            fontSize: 11,
                            background: "rgba(255,95,87,0.06)",
                            border: "1px solid rgba(255,95,87,0.15)",
                            color: "#FF5F57"
                          }}>{t("txt_1369")}</button>
                              </div>
                            </td>
                          </tr>)}
                        {customDocs.length === 0 && <tr>
                            <td colSpan={7} style={{
                        padding: 32,
                        textAlign: "center",
                        color: "rgba(255,255,255,0.4)"
                      }}>{t("txt_1370")}</td>
                          </tr>}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* MODAL / SLIDE-OVER FOR CREATE & EDIT */}
                {isDocModalOpen && editingDoc && (() => {
              return <div style={{
                position: "fixed",
                inset: 0,
                zIndex: 1000,
                background: "rgba(3, 3, 5, 0.75)",
                backdropFilter: "blur(20px)",
                display: "grid",
                placeItems: "center",
                padding: 24
              }}>
                      <div className="glass" style={{
                  width: "100%",
                  maxWidth: 960,
                  height: "85vh",
                  borderRadius: 24,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "#08080C",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden"
                }}>
                        {/* Header */}
                        <div style={{
                    padding: "20px 24px",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                          <div>
                            <h3 style={{
                        margin: 0,
                        fontSize: 18,
                        fontWeight: 700
                      }}>
                              {editingDoc.id ? `Редагувати розділ "${editingDoc.title}"` : t("txt_1371")}
                            </h3>
                            <span style={{
                        fontSize: 12,
                        color: "rgba(255,255,255,0.4)"
                      }}>Slug: {editingDoc.id || t("txt_1372")}</span>
                          </div>
                          <button onClick={() => {
                      setIsDocModalOpen(false);
                      setEditingDoc(null);
                    }} style={{
                      background: "none",
                      border: "none",
                      color: "rgba(255,255,255,0.4)",
                      cursor: "pointer"
                    }}>{t("txt_1373")}</button>
                        </div>

                        {/* Form & Workspace */}
                        <form onSubmit={handleSaveDoc} style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden"
                  }}>
                          
                          {/* Top Metadata Row */}
                          <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                      gap: 14,
                      padding: "20px 24px",
                      borderBottom: "1px solid rgba(255,255,255,0.04)"
                    }}>
                            
                            <div>
                              <label style={{
                          display: "block",
                          fontSize: 11,
                          color: "rgba(255,255,255,0.4)",
                          textTransform: "uppercase",
                          fontWeight: 700,
                          marginBottom: 6
                        }}>{t("txt_1374")}</label>
                              <input name="id" type="text" defaultValue={editingDoc.id} disabled={!!editingDoc.id} placeholder={t("txt_1375")} required className="input-field" style={{
                          width: "100%",
                          padding: "8px 12px",
                          background: "rgba(255,255,255,0.02)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: 10,
                          color: "#fff"
                        }} />
                            </div>

                            <div>
                              <label style={{
                          display: "block",
                          fontSize: 11,
                          color: "rgba(255,255,255,0.4)",
                          textTransform: "uppercase",
                          fontWeight: 700,
                          marginBottom: 6
                        }}>{t("txt_1376")}</label>
                              <input name="title" type="text" defaultValue={editingDoc.title} placeholder={t("txt_1377")} required className="input-field" style={{
                          width: "100%",
                          padding: "8px 12px",
                          background: "rgba(255,255,255,0.02)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: 10,
                          color: "#fff"
                        }} />
                            </div>

                            <div>
                              <label style={{
                          display: "block",
                          fontSize: 11,
                          color: "rgba(255,255,255,0.4)",
                          textTransform: "uppercase",
                          fontWeight: 700,
                          marginBottom: 6
                        }}>{t("txt_1378")}</label>
                              <input name="eyebrow" type="text" defaultValue={editingDoc.eyebrow} placeholder={t("txt_1379")} className="input-field" style={{
                          width: "100%",
                          padding: "8px 12px",
                          background: "rgba(255,255,255,0.02)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: 10,
                          color: "#fff"
                        }} />
                            </div>

                            <div>
                              <label style={{
                          display: "block",
                          fontSize: 11,
                          color: "rgba(255,255,255,0.4)",
                          textTransform: "uppercase",
                          fontWeight: 700,
                          marginBottom: 6
                        }}>{t("txt_1380")}</label>
                              <select name="icon" defaultValue={editingDoc.icon} className="input-field" style={{
                          width: "100%",
                          padding: "8px 12px",
                          background: "rgba(10,10,12,0.95)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: 10,
                          color: "#fff"
                        }}>
                                {["BookOpen", "Zap", "Layers", "Package", "Key", "Globe", "Activity", "HelpCircle", "Settings", "Shield", "Code", "Sparkles"].map(iconName => <option key={iconName} value={iconName}>{iconName}</option>)}
                              </select>
                            </div>

                            <div>
                              <label style={{
                          display: "block",
                          fontSize: 11,
                          color: "rgba(255,255,255,0.4)",
                          textTransform: "uppercase",
                          fontWeight: 700,
                          marginBottom: 6
                        }}>{t("txt_1381")}</label>
                              <input name="order" type="number" defaultValue={editingDoc.order} className="input-field" style={{
                          width: "100%",
                          padding: "8px 12px",
                          background: "rgba(255,255,255,0.02)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: 10,
                          color: "#fff"
                        }} />
                            </div>

                          </div>

                          <div style={{
                      padding: "10px 24px 0"
                    }}>
                            <label style={{
                        display: "block",
                        fontSize: 11,
                        color: "rgba(255,255,255,0.4)",
                        textTransform: "uppercase",
                        fontWeight: 700,
                        marginBottom: 6
                      }}>{t("txt_1382")}</label>
                            <input name="desc" type="text" defaultValue={editingDoc.desc} placeholder={t("txt_1383")} className="input-field" style={{
                        width: "100%",
                        padding: "8px 12px",
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 10,
                        color: "#fff"
                      }} />
                          </div>

                          {/* Editor Area with Tab Selectors */}
                          <div style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      padding: 24,
                      overflow: "hidden"
                    }}>
                            
                            {/* Editor Tab Selectors */}
                            <div style={{
                        display: "flex",
                        gap: 12,
                        marginBottom: 12,
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                        paddingBottom: 8
                      }}>
                              <button type="button" onClick={() => setActiveEditorTab("edit")} style={{
                          background: "none",
                          border: "none",
                          color: activeEditorTab === "edit" ? "#2997ff" : "rgba(255,255,255,0.4)",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                          paddingBottom: 4,
                          borderBottom: activeEditorTab === "edit" ? "2px solid #2997ff" : "none"
                        }}>{t("txt_1384")}</button>
                              <button type="button" onClick={() => setActiveEditorTab("preview")} style={{
                          background: "none",
                          border: "none",
                          color: activeEditorTab === "preview" ? "#2997ff" : "rgba(255,255,255,0.4)",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                          paddingBottom: 4,
                          borderBottom: activeEditorTab === "preview" ? "2px solid #2997ff" : "none"
                        }}>{t("txt_1385")}</button>
                            </div>

                            {/* Tab Content */}
                            {activeEditorTab === "edit" ? <textarea name="content" value={liveContent} onChange={e => setLiveContent(e.target.value)} placeholder={t("txt_1386")} style={{
                        flex: 1,
                        width: "100%",
                        background: "rgba(5,5,7,0.95)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 14,
                        padding: 16,
                        color: "#a5b4fc",
                        fontFamily: "monospace",
                        fontSize: 13,
                        lineHeight: 1.6,
                        resize: "none",
                        outline: "none"
                      }} /> : <div style={{
                        flex: 1,
                        width: "100%",
                        background: "#030303",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 14,
                        padding: "20px 24px",
                        overflowY: "auto",
                        textAlign: "left",
                        fontSize: "14.5px",
                        color: "rgba(255,255,255,0.75)",
                        lineHeight: 1.8
                      }}>
                                {/* Render Live Markdown Preview */}
                                <div dangerouslySetInnerHTML={{
                          __html: formatMarkdownPreview(liveContent)
                        }} />
                              </div>}

                          </div>

                          {/* Footer Actions */}
                          <div style={{
                      padding: "20px 24px",
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 12
                    }}>
                            <button type="button" onClick={() => {
                        setIsDocModalOpen(false);
                        setEditingDoc(null);
                      }} className="ghost-btn" style={{
                        padding: "10px 20px",
                        fontSize: 13
                      }}>{t("txt_1387")}</button>
                            <button type="submit" className="cta-btn" style={{
                        padding: "10px 24px",
                        fontSize: 13
                      }}>{t("txt_1388")}</button>
                          </div>

                        </form>
                      </div>
                    </div>;
            })()}

              </div>;
        })()}

        {/* Tab: Careers / Candidates */}
        {activeTab === "admins" && user?.is_super_admin && (
          <div className="fade-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Управління Адміністраторами</h2>
                <div style={{ color: "rgba(255,255,255,0.5)", marginTop: 4 }}>Головний доступ: Створення та видалення субадміністраторів</div>
              </div>
              <button className="cta-btn" onClick={() => setIsCreatingAdmin(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 20px", height: 44, borderRadius: 12 }}>
                <Plus size={16} /> Створити адміністратора
              </button>
            </div>

            <div className="glass" style={{ borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.02)", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <th style={{ padding: "16px 24px", color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>Ім'я</th>
                    <th style={{ padding: "16px 24px", color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>Email</th>
                    <th style={{ padding: "16px 24px", color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>Створено</th>
                    <th style={{ padding: "16px 24px", color: "rgba(255,255,255,0.4)", fontWeight: 600, textAlign: "right" }}>Дії</th>
                  </tr>
                </thead>
                <tbody>
                  {subadmins.map(sa => (
                    <tr key={sa.user_id} style={{ borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
                      <td style={{ padding: "16px 24px", fontWeight: 500 }}>{sa.name}</td>
                      <td style={{ padding: "16px 24px", color: "rgba(255,255,255,0.7)" }}>{sa.email}</td>
                      <td style={{ padding: "16px 24px", color: "rgba(255,255,255,0.5)" }}>{fmtDate(sa.created_at)}</td>
                      <td style={{ padding: "16px 24px", textAlign: "right" }}>
                        <button onClick={async () => {
                          if (window.confirm("Видалити цього адміністратора?")) {
                            try {
                              await api.delete(`/api/admin/subadmins/${sa.user_id}`);
                              toast.success("Адміністратора видалено");
                              refresh();
                            } catch (e) {
                              toast.error("Помилка видалення");
                            }
                          }
                        }} style={{ background: "rgba(255,95,87,0.1)", color: "#FF5F57", border: "1px solid rgba(255,95,87,0.2)", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                          Видалити
                        </button>
                      </td>
                    </tr>
                  ))}
                  {subadmins.length === 0 && (
                    <tr><td colSpan="4" style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>Немає інших адміністраторів</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {isCreatingAdmin && (
              <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div className="glass" style={{ width: "100%", maxWidth: 400, borderRadius: 24, padding: 32, position: "relative" }}>
                  <button onClick={() => { setIsCreatingAdmin(false); setGeneratedCreds(null); }} style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer" }}>
                    <X size={20} />
                  </button>
                  <h3 style={{ margin: "0 0 24px", fontSize: 20, fontWeight: 700 }}>{generatedCreds ? "Облікові дані" : "Новий адміністратор"}</h3>
                  
                  {generatedCreds ? (
                    <div>
                      <div style={{ background: "rgba(40,200,64,0.1)", color: "#28C840", padding: 12, borderRadius: 8, marginBottom: 20, fontSize: 13, border: "1px solid rgba(40,200,64,0.2)" }}>
                        Адміністратора успішно створено. Збережіть ці дані, пароль більше не відображатиметься і його не можна змінити.
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>Email (Логін)</div>
                        <div className="mono" style={{ background: "rgba(0,0,0,0.3)", padding: 12, borderRadius: 8, fontSize: 14 }}>{generatedCreds.email}</div>
                      </div>
                      <div style={{ marginBottom: 24 }}>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>Пароль</div>
                        <div className="mono" style={{ background: "rgba(0,0,0,0.3)", padding: 12, borderRadius: 8, fontSize: 14 }}>{generatedCreds.password}</div>
                      </div>
                      <button className="cta-btn" onClick={() => {
                        navigator.clipboard.writeText(`Логін: ${generatedCreds.email}\nПароль: ${generatedCreds.password}`);
                        toast.success("Скопійовано");
                      }} style={{ width: "100%", height: 44, borderRadius: 12 }}>Скопіювати</button>
                    </div>
                  ) : (
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        const res = await api.post("/api/admin/subadmins", { email: newAdminEmail, name: newAdminName });
                        setGeneratedCreds(res.data);
                        refresh();
                        setNewAdminEmail("");
                        setNewAdminName("");
                      } catch (err) {
                        toast.error(err.response?.data?.detail || "Помилка створення");
                      }
                    }}>
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>Ім'я</div>
                        <input value={newAdminName} onChange={e => setNewAdminName(e.target.value)} required style={{ width: "100%", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 16px", color: "#fff", outline: "none" }} />
                      </div>
                      <div style={{ marginBottom: 24 }}>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>Email</div>
                        <input type="email" value={newAdminEmail} onChange={e => setNewAdminEmail(e.target.value)} required style={{ width: "100%", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 16px", color: "#fff", outline: "none" }} />
                      </div>
                      <button type="submit" className="cta-btn" style={{ width: "100%", height: 44, borderRadius: 12 }}>Згенерувати доступ</button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Waitlist (Early Access Queue) */}
        {activeTab === "waitlist" && (
          <div className="fade-in">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
              <div>
                <h3 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 800 }}>Черга запису на ранній доступ</h3>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                  Список користувачів, що записались в чергу на бета-тестування Atlas AI
                </div>
              </div>
              {waitlistData && (
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {[
                    { label: "Всього", value: waitlistData.total, color: "#2997ff" },
                    { label: "Очікують", value: waitlistData.pending, color: "#FEBC2E" },
                    { label: "Схвалено", value: waitlistData.approved, color: "#28C840" },
                    { label: "Відхилено", value: waitlistData.rejected, color: "#FF5F57" },
                  ].map((s, i) => (
                    <div key={i} style={{
                      padding: "12px 20px", borderRadius: 16,
                      background: "rgba(255,255,255,0.03)",
                      border: `1px solid ${s.color}33`,
                      textAlign: "center", minWidth: 90,
                    }}>
                      <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {waitlistData && waitlistData.pending > 0 && (
              <div style={{ marginBottom: 24, display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={async () => {
                    if (!window.confirm(`Ви впевнені, що хочете надати доступ ВСІМ (${waitlistData.pending}) користувачам у черзі?`)) return;
                    try {
                      const r = await api.post("/api/admin/waitlist/approve-all");
                      toast.success(`Надано доступ ${r.data.approved_count} користувачам!`);
                      refresh();
                    } catch (e) {
                      toast.error("Помилка при схваленні всіх");
                    }
                  }}
                  className="cta-btn"
                  style={{
                    background: "rgba(40,200,64,0.15)", border: "1px solid rgba(40,200,64,0.3)",
                    color: "#28C840", borderRadius: 12, padding: "10px 20px", fontSize: 14,
                    display: "inline-flex", gap: 8, alignItems: "center", cursor: "pointer"
                  }}
                >
                  <ShieldCheck size={16} /> Надати доступ всім очікуючим ({waitlistData.pending})
                </button>
              </div>
            )}

            <div className="glass" style={{ padding: 0, borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
              {!waitlistData ? (
                <div style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.4)" }}>
                  <Loader2 size={28} className="spin" />
                </div>
              ) : waitlistData.entries?.length === 0 ? (
                <div style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 15 }}>
                  Поки що ніхто не записався. Список поповниться після реєстрації перших користувачів.
                </div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      {["#", "Ім'я / Email", "Тариф", "Країна", "Дата запису", "Статус", "Дії"].map((h, i) => (
                        <th key={i} style={{ padding: "14px 16px", textAlign: "left", fontWeight: 600, color: "rgba(255,255,255,0.5)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {waitlistData.entries.map((entry, idx) => (
                      <tr key={entry._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.2s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <td style={{ padding: "14px 16px", color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>#{idx + 1}</td>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ fontWeight: 600, color: "#fff" }}>{entry.name || "—"}</div>
                          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>{entry.email}</div>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{
                            padding: "4px 10px", borderRadius: 6,
                            background: "rgba(255,255,255,0.048)", border: "1px solid rgba(255,255,255,0.120)",
                            color: "#2997ff", fontSize: 12, fontWeight: 600,
                          }}>
                            {entry.plan === "early_access" ? "Ранній доступ" : (entry.plan === "atlas_monthly" ? "Місячний" : entry.plan === "atlas_quarterly" ? "Квартальний" : "Річний")}
                          </span>
                        </td>
                        <td style={{ padding: "14px 16px", color: "rgba(255,255,255,0.7)" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span>{entry.country_code && entry.country_code !== "XX" ? `${entry.country_code}` : "🌍"}</span>
                            <span>{entry.country || "Unknown"}</span>
                          </div>
                          {entry.city && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{entry.city}</div>}
                        </td>
                        <td style={{ padding: "14px 16px", color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
                          {entry.registered_at ? new Date(entry.registered_at).toLocaleDateString("uk-UA", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{
                            padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 700,
                            background: entry.status === "approved" ? "rgba(40,200,64,0.12)" : entry.status === "rejected" ? "rgba(255,95,87,0.1)" : "rgba(254,188,46,0.1)",
                            border: `1px solid ${entry.status === "approved" ? "rgba(40,200,64,0.3)" : entry.status === "rejected" ? "rgba(255,95,87,0.3)" : "rgba(254,188,46,0.3)"}`,
                            color: entry.status === "approved" ? "#28C840" : entry.status === "rejected" ? "#FF5F57" : "#FEBC2E",
                          }}>
                            {entry.status === "approved" ? "✓ Схвалено" : entry.status === "rejected" ? "✗ Відхилено" : "⏳ Очікує"}
                          </span>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          {entry.status === "pending" && (
                            <div style={{ display: "flex", gap: 8 }}>
                              <button
                                disabled={waitlistBusy === entry._id}
                                onClick={async () => {
                                  setWaitlistBusy(entry._id);
                                  try {
                                    await api.post(`/api/admin/waitlist/${entry._id}/approve`);
                                    toast.success("Доступ надано!");
                                    refresh();
                                  } catch (e) {
                                    toast.error("Помилка схвалення");
                                  } finally { setWaitlistBusy(null); }
                                }}
                                style={{
                                  padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600,
                                  background: "rgba(40,200,64,0.12)", border: "1px solid rgba(40,200,64,0.3)",
                                  color: "#28C840", display: "flex", alignItems: "center", gap: 4,
                                }}
                              >
                                {waitlistBusy === entry._id ? <Loader2 size={12} className="spin" /> : <ShieldCheck size={12} />} Схвалити
                              </button>
                              <button
                                disabled={waitlistBusy === entry._id}
                                onClick={async () => {
                                  setWaitlistBusy(entry._id);
                                  try {
                                    await api.post(`/api/admin/waitlist/${entry._id}/reject`);
                                    toast.success("Відхилено");
                                    refresh();
                                  } catch { toast.error("Помилка"); } finally { setWaitlistBusy(null); }
                                }}
                                style={{
                                  padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600,
                                  background: "rgba(255,95,87,0.1)", border: "1px solid rgba(255,95,87,0.3)",
                                  color: "#FF5F57", display: "flex", alignItems: "center", gap: 4,
                                }}
                              >
                                <ShieldOff size={12} /> Відхилити
                              </button>
                            </div>
                          )}
                          {entry.status !== "pending" && (
                            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {activeTab === "careers" && (
          <div className="fade-in">
            <h3 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 800 }}>{t("atlas_v2.admin.candidates_title") || "Заявки кандидатів"}</h3>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 24 }}>
              {t("atlas_v2.admin.candidates_desc") || "Люди, які подали заявку на приєднання до команди ATLAS."}
            </div>

            <div className="glass" style={{ padding: 24, borderRadius: 20, border: "1px solid rgba(255,255,255,0.04)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", textAlign: "left" }}>
                    <th style={{ padding: "12px 16px" }}>{t("atlas_v2.admin.col_date") || "Дата"}</th>
                    <th style={{ padding: "12px 16px" }}>{t("atlas_v2.admin.col_name") || "Ім'я"}</th>
                    <th style={{ padding: "12px 16px" }}>{t("atlas_v2.admin.col_contact") || "Контакт"}</th>
                    <th style={{ padding: "12px 16px" }}>{t("atlas_v2.admin.col_portfolio") || "Портфоліо"}</th>
                    <th style={{ padding: "12px 16px" }}>{t("atlas_v2.admin.col_exp") || "Відповіді / Досвід"}</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((c, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", verticalAlign: "top" }}>
                      <td style={{ padding: "16px", color: "rgba(255,255,255,0.5)", whiteSpace: "nowrap" }}>
                        {new Date(c.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "16px", fontWeight: 600 }}>{c.name}</td>
                      <td style={{ padding: "16px", color: "#2997ff" }}>{c.contact}</td>
                      <td style={{ padding: "16px" }}>
                        <a href={c.portfolio} target="_blank" rel="noreferrer" style={{ color: "#f5f5f7", textDecoration: "none", wordBreak: "break-all" }}>
                          {c.portfolio}
                        </a>
                      </td>
                      <td style={{ padding: "16px", color: "rgba(255,255,255,0.8)", maxWidth: 400 }}>
                        {c.experience && <div style={{marginBottom: 8}}>{c.experience}</div>}
                        {c.answers && Object.entries(c.answers).map(([k, v]) => {
                          const labels = {
                            timezone: "Часовий пояс",
                            availability: "Зайнятість",
                            tools: "AI Інструменти",
                            weakness: "Слабкі сторони AI",
                            practical: "Промпт AppleScript",
                            source: "Джерело",
                            motivation: "Мотивація"
                          };
                          const availMapping = {
                            full_time: "Повна зайнятість",
                            part_time: "Часткова зайнятість",
                            freelance: "Фріланс",
                            internship: "Стажування"
                          };
                          const displayVal = k === "availability" ? (availMapping[v] || v) : v;
                          return (
                            <div key={k} style={{ marginBottom: 10 }}>
                              <div style={{ fontSize: 11, color: "#2997ff", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>{labels[k] || k}</div>
                              <div style={{ fontSize: 13, lineHeight: 1.4, color: "rgba(255,255,255,0.9)" }}>{displayVal}</div>
                            </div>
                          );
                        })}
                      </td>
                    </tr>
                  ))}
                  {candidates.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ padding: 32, textAlign: "center", color: "rgba(255,255,255,0.4)" }}>
                        {t("atlas_v2.admin.no_candidates") || "Немає заявок"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        </main>

        {/* Right Sidebar Navigation Menu */}
        <aside className="admin-sidebar" style={{
        width: 280,
        background: "rgba(4,4,6,0.6)",
        borderLeft: "1px solid rgba(255,255,255,0.05)",
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        position: "sticky",
        top: 61,
        height: "calc(100vh - 61px)",
        backdropFilter: "blur(12px)"
      }}>
          <div style={{
          fontSize: 10,
          letterSpacing: "0.15em",
          color: "rgba(255,255,255,0.4)",
          textTransform: "uppercase",
          fontWeight: 700,
          marginBottom: 12
        }}>{t("txt_1389")}</div>
          
          <SidebarButton icon={<Compass size={16} />} label={t("txt_1390")} active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} />
          <SidebarButton icon={<DollarSign size={16} />} label={t("txt_1391")} active={activeTab === "analytics"} onClick={() => setActiveTab("analytics")} />
          <SidebarButton icon={<Globe size={16} />} label={t("txt_1392")} active={activeTab === "map"} onClick={() => setActiveTab("map")} />
          <SidebarButton icon={<Activity size={16} />} label="Аналітика Дій (Кліки)" active={activeTab === "tracking"} onClick={() => setActiveTab("tracking")} />
          <SidebarButton icon={<Users size={16} />} label={t("txt_1393")} active={activeTab === "users"} onClick={() => setActiveTab("users")} />
          <SidebarButton icon={<Cpu size={16} />} label={t("txt_1394")} active={activeTab === "health"} onClick={() => setActiveTab("health")} />
          <SidebarButton icon={<Radio size={16} />} label={t("txt_1395")} active={activeTab === "broadcast"} onClick={() => setActiveTab("broadcast")} />
          <SidebarButton icon={<FileText size={16} />} label={t("txt_1396")} active={activeTab === "logs"} onClick={() => setActiveTab("logs")} />
          <SidebarButton icon={<BookOpen size={16} />} label={t("txt_1397")} active={activeTab === "docs_cms"} onClick={() => setActiveTab("docs_cms")} />
          <SidebarButton icon={<Users size={16} />} label={t("atlas_v2.admin.candidates_tab") || "Кандидати"} active={activeTab === "careers"} onClick={() => setActiveTab("careers")} />
          <SidebarButton icon={<Clock size={16} />} label="Черга запису" active={activeTab === "waitlist"} onClick={() => setActiveTab("waitlist")} />

          {user?.is_super_admin && (
             <SidebarButton icon={<ShieldCheck size={16} />} label="Адміністратори" active={activeTab === "admins"} onClick={() => setActiveTab("admins")} />
          )}
          
          <div style={{
          marginTop: "auto",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          paddingTop: 16
        }}>
            <div style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.3)",
            display: "flex",
            alignItems: "center",
            gap: 6
          }}>
              <Lock size={12} color="#28C840" />
              <span>{t("txt_1398")}</span>
            </div>
            <div style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.3)",
            marginTop: 4
          }}>{t("txt_1399")}<b style={{
              color: "#28C840"
            }}>Online</b>
            </div>
          </div>
        </aside>

      </div>

      {selectedUser && <UserDetailsModal user={selectedUser} onClose={() => setSelectedUser(null)} onUpdated={() => {
      refresh();
    }} />}
    </div>;
}
const td = {
  padding: "12px 14px",
  whiteSpace: "nowrap"
};
function SidebarButton({
  icon,
  label,
  active,
  onClick
}) {
  return <button onClick={onClick} style={{
    display: "flex",
    alignItems: "center",
    gap: 12,
    width: "100%",
    padding: "12px 16px",
    borderRadius: 12,
    border: "none",
    background: active ? "linear-gradient(135deg, rgba(255,255,255,0.072) 0%, rgba(255,255,255,0.025) 100%)" : "transparent",
    color: active ? "#2997ff" : "rgba(255,255,255,0.65)",
    cursor: "pointer",
    fontWeight: active ? 700 : 500,
    fontSize: 13,
    textAlign: "left",
    borderLeft: active ? "3px solid #2997ff" : "3px solid transparent",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
  }} onMouseEnter={e => {
    if (!active) {
      e.currentTarget.style.background = "rgba(255,255,255,0.02)";
      e.currentTarget.style.color = "#fff";
    }
  }} onMouseLeave={e => {
    if (!active) {
      e.currentTarget.style.background = "transparent";
      e.currentTarget.style.color = "rgba(255,255,255,0.65)";
    }
  }}>
      {icon}
      {label}
    </button>;
}
function StatCard({
  icon,
  label,
  value,
  accent,
  active,
  onClick
}) {
  return <div className="glass" onClick={onClick} style={{
    padding: 20,
    borderRadius: 16,
    cursor: "pointer",
    border: active ? `1px solid ${accent}` : "1px solid rgba(255,255,255,0.05)",
    background: active ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.01)",
    boxShadow: active ? `0 0 15px ${accent}15` : "none",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    borderLeft: `4px solid ${accent}`
  }}>
      <div style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      color: "rgba(255,255,255,0.5)",
      fontSize: 11,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      fontWeight: 700
    }}>
        <span style={{
        color: accent
      }}>{icon}</span>
        {label}
      </div>
      <div style={{
      fontSize: 28,
      fontWeight: 800,
      marginTop: 8,
      letterSpacing: "-0.02em"
    }}>{value}</div>
    </div>;
}
function GrowthChart({
  data,
  metric,
  color
}) {
  const max = Math.max(1, ...data.map(d => d[metric] || 0));
  return <div style={{
    display: "flex",
    alignItems: "flex-end",
    gap: 8,
    height: 160,
    paddingTop: 10
  }}>
      {data.map(d => <div key={d.month} style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 6
    }}>
          <div style={{
        width: "100%",
        height: `${(d[metric] || 0) / max * 100}%`,
        background: `linear-gradient(180deg, ${color}, ${color}15)`,
        borderRadius: "4px 4px 0 0",
        minHeight: 4,
        transition: "height 0.6s ease"
      }} title={`${d[metric] || 0}`} />
          <div style={{
        fontSize: 9,
        color: "rgba(255,255,255,0.45)",
        fontWeight: 500
      }}>{d.month.slice(5)}</div>
        </div>)}
    </div>;
}
function UserDetailsModal({
  user,
  onClose,
  onUpdated
}) {
  const { t } = useTranslation();
  const [notes, setNotes] = useState(user.admin_notes || "");
  const [busy, setBusy] = useState(false);
  const [showEmailChange, setShowEmailChange] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [emailStep, setEmailStep] = useState(0); // 0: input email, 1: input code

  const doAction = async (action, extra = {}) => {
    setBusy(true);
    try {
      await api.post("/api/admin/users/action", {
        user_id: user.user_id,
        action,
        ...extra
      });
      toast.success(`Дія "${action}" виконана`);
      onUpdated();
      if (["regen_key", "extend"].includes(action)) {
        // Stay open
      }
    } catch (e) {
      toast.error(t("txt_1400"));
    } finally {
      setBusy(false);
    }
  };

  const requestEmailChange = async () => {
    if (!newEmail.includes("@")) return toast.error("Введіть коректний email");
    setBusy(true);
    try {
      const res = await api.post(`/api/admin/users/${user.user_id}/change-email/request`, { new_email: newEmail });
      toast.success(res.data.message || "Код надіслано");
      setEmailStep(1);
    } catch (e) {
      toast.error(e.response?.data?.detail || "Помилка при надсиланні коду");
    } finally {
      setBusy(false);
    }
  };

  const confirmEmailChange = async () => {
    if (!emailCode) return toast.error("Введіть код");
    setBusy(true);
    try {
      const res = await api.post(`/api/admin/users/${user.user_id}/change-email/confirm`, { code: emailCode });
      toast.success(res.data.message || "Email успішно змінено");
      setShowEmailChange(false);
      onUpdated();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Помилка при підтвердженні");
    } finally {
      setBusy(false);
    }
  };
  return <div onClick={onClose} style={{
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    zIndex: 1000,
    display: "grid",
    placeItems: "center",
    padding: 24,
    animation: "fadeIn 0.2s ease-out"
  }} data-testid="user-details-modal">
      <div onClick={e => e.stopPropagation()} style={{
      width: "min(520px, 100%)",
      maxHeight: "90vh",
      overflowY: "auto",
      padding: 32,
      borderRadius: 28,
      background: "rgba(28, 28, 30, 0.75)",
      border: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "0 24px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05) inset"
    }}>
        <div style={{
        display: "flex",
        alignItems: "center",
        justifyConstraint: "space-between",
        justifyContent: "space-between",
        marginBottom: 20
      }}>
          <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12
        }}>
            {user.avatar_url ? <img src={user.avatar_url} alt="" style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: "2px solid #2997ff"
          }} /> : <div style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#2997ff,#f5f5f7)",
            boxShadow: "0 0 10px rgba(255,255,255,0.180)"
          }} />}
            <div>
              <div style={{
              fontWeight: 600,
              fontSize: 22,
              letterSpacing: "-0.02em",
              color: "#fff"
            }}>{user.name || user.email}</div>
              <div style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.5)",
              marginTop: 4,
              letterSpacing: "-0.01em"
            }}>{user.email}</div>
            </div>
          </div>
          <button onClick={onClose} className="ghost-btn" style={{
          width: 36,
          height: 36,
          padding: 0,
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          background: "rgba(255,255,255,0.03)"
        }}>
            <X size={16} />
          </button>
        </div>

        <div style={{
        display: "flex",
        flexDirection: "column",
        fontSize: 14,
        color: "rgba(255,255,255,0.85)",
        marginBottom: 32,
        background: "rgba(255,255,255,0.03)",
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.06)",
        overflow: "hidden"
      }}>
          <Row label={t("txt_1401")} value={user.key} mono />
          <Row label={t("txt_1402")} value={user.mac_id ? `${user.mac_name || "Mac"} · ${user.mac_id.slice(0, 16)}...` : t("txt_1403")} />
          <Row label={t("txt_1404")} value={user.version} />
          <Row label={t("txt_1405")} value={user.active ? t("txt_1406") : t("txt_1407")} />
          <Row label={t("txt_1408")} value={fmtDate(user.created_at)} />
          <Row label={t("txt_1409")} value={fmtDate(user.expires_at)} isLast />
        </div>

        {/* Зміна Email */}
        <div style={{ marginBottom: 32 }}>
          {!showEmailChange ? (
             <button disabled={busy} onClick={() => setShowEmailChange(true)} className="ghost-btn" style={{
               width: "100%", background: "rgba(255,255,255,0.05)", padding: "10px", borderRadius: "10px"
             }}>
               Змінити Email користувача
             </button>
          ) : (
            <div style={{ background: "rgba(0,0,0,0.3)", padding: 16, borderRadius: 14, border: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ fontWeight: 600, marginBottom: 12 }}>Зміна Email</div>
              {emailStep === 0 ? (
                <>
                  <input
                    type="email"
                    placeholder="Новий Email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", marginBottom: "10px" }}
                  />
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => setShowEmailChange(false)} className="ghost-btn" style={{ flex: 1, padding: "8px" }}>Скасувати</button>
                    <button onClick={requestEmailChange} disabled={busy} className="cta-btn" style={{ flex: 1, padding: "8px", borderRadius: "8px" }}>Надіслати код</button>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: "10px" }}>Код підтвердження надіслано на <b>{newEmail}</b>. Попросіть користувача його продиктувати.</div>
                  <input
                    type="text"
                    placeholder="Код з email"
                    value={emailCode}
                    onChange={(e) => setEmailCode(e.target.value)}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", marginBottom: "10px" }}
                  />
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => setEmailStep(0)} className="ghost-btn" style={{ flex: 1, padding: "8px" }}>Назад</button>
                    <button onClick={confirmEmailChange} disabled={busy} className="cta-btn" style={{ flex: 1, padding: "8px", borderRadius: "8px" }}>Підтвердити</button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12,
        marginBottom: 32
      }}>
          <button data-testid="action-extend" disabled={busy} onClick={() => doAction("extend", {
          days: 30
        })} className="ghost-btn" style={{
          background: "rgba(255,255,255,0.06)",
          color: "#fff",
          borderRadius: 12,
          padding: "12px 16px",
          fontWeight: 500,
          border: "none"
        }}>
            <Clock size={16} />{t("txt_1410")}</button>
          <button data-testid="action-regen" disabled={busy} onClick={() => doAction("regen_key")} className="ghost-btn" style={{
          background: "rgba(255,255,255,0.06)",
          color: "#fff",
          borderRadius: 12,
          padding: "12px 16px",
          fontWeight: 500,
          border: "none"
        }}>
            <RefreshCw size={16} />{t("txt_1412")}</button>
          <button data-testid="action-reset-mac" disabled={busy} onClick={() => doAction("reset_mac")} className="ghost-btn" style={{
          background: "rgba(255,255,255,0.06)",
          color: "#fff",
          borderRadius: 12,
          padding: "12px 16px",
          fontWeight: 500,
          border: "none"
        }}>{t("txt_1413")}</button>
          <button data-testid="action-block" disabled={busy} onClick={() => doAction(user.is_blocked ? "unblock" : "block")} className="ghost-btn" style={{
          background: user.is_blocked ? "rgba(40,200,64,0.1)" : "rgba(255,255,255,0.06)",
          color: user.is_blocked ? "#28C840" : "#fff",
          borderRadius: 12,
          padding: "12px 16px",
          fontWeight: 500,
          border: "none"
        }}>
            {user.is_blocked ? t("txt_1414") : t("txt_1415")}
          </button>
          <button data-testid="action-cancel" disabled={busy} onClick={() => doAction("cancel")} className="ghost-btn" style={{
          gridColumn: "1 / -1",
          background: "rgba(255,59,48,0.1)",
          color: "#FF3B30",
          borderRadius: 12,
          padding: "12px 16px",
          fontWeight: 500,
          border: "none"
        }}>{t("txt_1411")}</button>
        </div>

        <div>
          <div style={{
          fontSize: 12,
          color: "rgba(255,255,255,0.4)",
          marginBottom: 8,
          fontWeight: 600
        }}>{t("txt_1416")}</div>
          <textarea data-testid="user-notes-textarea" value={notes} onChange={e => setNotes(e.target.value)} rows={3} style={{
          width: "100%",
          padding: 12,
          background: "rgba(0,0,0,0.5)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 12,
          color: "#fff",
          fontSize: 13,
          fontFamily: "inherit",
          resize: "vertical",
          outline: "none"
        }} />
          <button data-testid="save-notes-btn" onClick={() => doAction("save_notes", {
          notes
        })} className="cta-btn" style={{
          marginTop: 10,
          padding: "8px 20px",
          borderRadius: 10,
          height: 38
        }} disabled={busy}>{t("txt_1417")}</button>
        </div>
      </div>
    </div>;
}
function Row({
  label,
  value,
  mono,
  isLast
}) {
  const { t } = useTranslation();
  return <div style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    padding: "14px 16px",
    borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.06)",
    background: "transparent"
  }}>
      <span style={{
      color: "rgba(255,255,255,0.5)",
      fontWeight: 400
    }}>{label}</span>
      <span style={{
      color: "#fff",
      fontFamily: mono ? "SF Mono, monospace" : "inherit",
      textAlign: "right",
      wordBreak: "break-all",
      fontWeight: 500
    }}>{value || "—"}</span>
    </div>;
}
function ManualKeyGen({
  onCreated
}) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [days, setDays] = useState(30);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const submit = async () => {
    if (!email) return;
    setBusy(true);
    try {
      const r = await api.post("/api/admin/generate-key", {
        email,
        days
      });
      setResult(r.data);
      toast.success(t("txt_1418"), {
        style: {
          background: "rgba(40,200,64,0.15)",
          border: "1px solid rgba(40,200,64,0.4)",
          color: "#fff"
        }
      });
      onCreated();
    } catch (e) {
      toast.error(t("txt_1419"), {
        style: {
          background: "rgba(255,95,87,0.15)",
          border: "1px solid rgba(255,95,87,0.4)",
          color: "#fff"
        }
      });
    } finally {
      setBusy(false);
    }
  };
  const copyKey = () => {
    if (result && result.key) {
      navigator.clipboard.writeText(result.key);
      toast.success(t("txt_1420"), {
        duration: 2000
      });
    }
  };
  return <div style={{
    padding: "4px 0"
  }}>
      <div style={{
      display: "flex",
      gap: 12,
      flexDirection: "column"
    }}>
        <input data-testid="gen-email-input" type="email" placeholder={t("txt_1421")} value={email} onChange={e => setEmail(e.target.value)} style={{
        width: "100%",
        padding: "12px 14px",
        background: "rgba(0,0,0,0.5)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 12,
        color: "#fff",
        fontSize: 13,
        outline: "none"
      }} />
        <div style={{
        display: "flex",
        gap: 8
      }}>
          <select data-testid="gen-days-select" value={days} onChange={e => setDays(Number(e.target.value))} style={{
          padding: "12px 14px",
          background: "rgba(0,0,0,0.5)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 12,
          color: "#fff",
          fontSize: 13,
          outline: "none",
          flex: 1,
          cursor: "pointer"
        }}>
            <option value={30}>{t("txt_1422")}</option>
            <option value={90}>{t("txt_1423")}</option>
            <option value={180}>{t("txt_1424")}</option>
            <option value={365}>{t("txt_1425")}</option>
          </select>
          <button data-testid="gen-submit-btn" disabled={busy || !email} onClick={submit} className="cta-btn" style={{
          padding: "0 24px",
          borderRadius: 12,
          height: 43
        }}>
            {busy ? <Loader2 size={14} className="spin" /> : <KeyRound size={14} />}{t("txt_1426")}</button>
        </div>
      </div>

      {result && <div data-testid="gen-result" style={{
      marginTop: 16,
      padding: 16,
      background: "linear-gradient(135deg, rgba(255,255,255,0.036) 0%, rgba(255,255,255,0.015) 100%)",
      border: "1px solid rgba(255,255,255,0.120)",
      borderRadius: 12,
      display: "flex",
      flexDirection: "column",
      gap: 10
    }}>
          <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
            <span style={{
          fontSize: 11,
          color: "rgba(255,255,255,0.5)",
          textTransform: "uppercase",
          letterSpacing: "0.05em"
        }}>{t("txt_1427")}{result.email}</span>
            <span style={{
          fontSize: 10,
          background: "rgba(40,200,64,0.15)",
          color: "#28C840",
          padding: "2px 8px",
          borderRadius: 4,
          fontWeight: 700
        }}>{t("txt_1428")}{fmtDate(result.expires_at)}</span>
          </div>
          
          <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "rgba(0,0,0,0.4)",
        padding: "10px 14px",
        borderRadius: 10,
        border: "1px dashed rgba(255,255,255,0.150)"
      }}>
            <div style={{
          fontFamily: "monospace",
          fontSize: 15,
          fontWeight: 700,
          color: "#2997ff",
          letterSpacing: "0.05em"
        }}>
              {result.key}
            </div>
            <button onClick={copyKey} className="ghost-btn" style={{
          padding: "4px 10px",
          borderRadius: 6,
          background: "rgba(255,255,255,0.06)",
          border: "none",
          fontSize: 11
        }}>{t("txt_1429")}</button>
          </div>
        </div>}
    </div>;
}
function VersionUpload({
  onUploaded
}) {
  const { t } = useTranslation();
  const [version, setVersion] = useState("");
  const [url, setUrl] = useState("");
  const [sizeMb, setSizeMb] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    if (!url || !version) {
      toast.error(t("admin_ver_err"));
      return;
    }
    setBusy(true);
    try {
      await api.post("/api/admin/version/link", {
        version,
        url,
        size_mb: parseFloat(sizeMb) || 0
      });
      toast.success(t("admin_ver_success"));
      onUploaded();
      setVersion("");
      setUrl("");
      setSizeMb("");
    } catch {
      toast.error(t("admin_ver_err2"));
    } finally {
      setBusy(false);
    }
  };
  return <div style={{
    display: "flex",
    gap: 8,
    flexDirection: "column"
  }}>
      <div style={{ display: "flex", gap: 8 }}>
        <input placeholder={t("admin_ver_ph")} value={version} onChange={e => setVersion(e.target.value)} style={{
        padding: "12px 14px",
        background: "rgba(0,0,0,0.5)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 12,
        color: "#fff",
        fontSize: 13,
        outline: "none",
        flex: 1
      }} />
        <input placeholder={t("admin_ver_size")} type="number" value={sizeMb} onChange={e => setSizeMb(e.target.value)} style={{
        padding: "12px 14px",
        background: "rgba(0,0,0,0.5)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 12,
        color: "#fff",
        fontSize: 13,
        outline: "none",
        flex: 1
      }} />
      </div>
      <input placeholder={t("admin_ver_link")} value={url} onChange={e => setUrl(e.target.value)} style={{
        padding: "12px 14px",
        background: "rgba(0,0,0,0.5)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 12,
        color: "#fff",
        fontSize: 13,
        outline: "none",
        width: "100%"
      }} />
      <button onClick={submit} disabled={busy || !version || !url} className="cta-btn" style={{
        padding: "0 20px",
        borderRadius: 12,
        height: 43
      }}>
        {busy ? <Loader2 size={14} className="spin" /> : <Upload size={14} />} {t("admin_ver_btn")}
      </button>
    </div>;
}
function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}
function fmtDateTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("uk-UA", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function LeafletGlowMap({
  activeMap,
  mapRef
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current, {
      center: [48.3794, 31.1656],
      // Default centered on Ukraine/Eastern Europe
      zoom: 3,
      minZoom: 1.5,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false
    });
    mapInstanceRef.current = map;
    if (mapRef) {
      mapRef.current = map;
    }

    // Add zoom control in bottom right
    L.control.zoom({
      position: "bottomright"
    }).addTo(map);

    // Add CartoDB Dark Matter tiles (sleek, high resolution dark map with all borders, oblasts and details)
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 20
    }).addTo(map);

    // Create markers layer group
    const markersGroup = L.layerGroup().addTo(map);
    markersGroupRef.current = markersGroup;

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapRef]);

  // Update markers when activeMap changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;
    markersGroup.clearLayers();
    if (!activeMap || activeMap.length === 0) return;
    activeMap.forEach(spot => {
      const lat = parseFloat(spot.lat);
      const lon = parseFloat(spot.lon);
      if (isNaN(lat) || isNaN(lon)) return;
      const isSuspicious = spot.suspicious;
      const isAdmin = spot.is_admin_marker;
      let markerColor = "#2997ff";
      if (isSuspicious) markerColor = "#FF5F57";
      if (isAdmin) markerColor = "#FEBC2E"; // Gold for admins
      
      const customIcon = L.divIcon({
        className: `custom-glow-marker ${isSuspicious ? "suspicious" : ""} ${isAdmin ? "admin" : ""}`,
        html: `
          <div class="marker-glow-ring" style="border-color: ${markerColor}"></div>
          <div class="marker-glow-ring2" style="border-color: ${isSuspicious ? '#FF5F57' : (isAdmin ? '#FEBC2E' : '#f5f5f7')}"></div>
          <div class="marker-glow-core" style="background-color: ${markerColor}; box-shadow: 0 0 8px ${markerColor}, 0 0 16px ${markerColor}"></div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
      const popupContent = `
        <div class="map-popup-card">
          <div class="map-popup-header">
            <span class="status-dot online"></span>
            <strong>${spot.city || "Unknown City"}</strong>, ${spot.country || "Unknown Country"}
          </div>
          <div class="map-popup-body">
            <div><strong>${isAdmin ? 'Email:' : 'IP:'}</strong> <span class="mono">${isAdmin ? spot.key_prefix.replace('ADMIN:', '') : spot.ip}</span></div>
            ${spot.region ? `<div><strong>Регіон / Область:</strong> ${spot.region}</div>` : ""}
            ${!isAdmin ? `<div><strong>Ключ:</strong> <span class="mono">${spot.key_prefix.slice(0, 14)}...</span></div>` : `<div><strong style="color: #FEBC2E;">⭐ Адміністратор</strong></div>`}
            <div><strong>Час активності:</strong> ${new Date(spot.ts).toLocaleString()}</div>
            ${isSuspicious ? `
              <div class="suspicious-alert">
                ⚠️ Виявлено аномальну швидкість переміщення!
              </div>
            ` : ""}
          </div>
        </div>
      `;
      const marker = L.marker([lat, lon], {
        icon: customIcon
      });
      marker.bindPopup(popupContent, {
        closeButton: false,
        className: "custom-leaflet-popup"
      });
      markersGroup.addLayer(marker);
    });
  }, [activeMap]);
  return <div style={{
    position: "relative",
    width: "100%",
    height: "100%"
  }}>
      <div ref={mapContainerRef} style={{
      width: "100%",
      height: "100%",
      background: "#060609"
    }} />
      <style>{`
        .custom-glow-marker {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .marker-glow-core {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          z-index: 3;
        }
        .marker-glow-ring {
          position: absolute;
          width: 24px;
          height: 24px;
          border: 2px solid;
          border-radius: 50%;
          opacity: 0;
          animation: pulse-glow-ring 2.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
          z-index: 1;
        }
        .marker-glow-ring2 {
          position: absolute;
          width: 24px;
          height: 24px;
          border: 1px solid;
          border-radius: 50%;
          opacity: 0;
          animation: pulse-glow-ring 2.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
          animation-delay: 0.8s;
          z-index: 2;
        }
        @keyframes pulse-glow-ring {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }

        .custom-leaflet-popup .leaflet-popup-content-wrapper {
          background: rgba(10, 10, 15, 0.9) !important;
          backdrop-filter: blur(16px) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          border-radius: 14px !important;
          color: #fff !important;
          padding: 6px !important;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.7) !important;
        }
        .custom-leaflet-popup .leaflet-popup-tip {
          background: rgba(10, 10, 15, 0.9) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
        }
        .map-popup-card {
          font-family: 'Inter', sans-serif;
          min-width: 210px;
        }
        .map-popup-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding-bottom: 6px;
          margin-bottom: 8px;
        }
        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          display: inline-block;
        }
        .status-dot.online {
          background-color: #28C840;
          box-shadow: 0 0 6px #28C840;
        }
        .map-popup-body {
          font-size: 11px;
          line-height: 1.6;
          color: rgba(255,255,255,0.7);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .map-popup-body .mono {
          font-family: monospace;
          color: #2997ff;
        }
        .suspicious-alert {
          background: rgba(255, 95, 87, 0.12);
          border: 1px solid rgba(255, 95, 87, 0.25);
          color: #FF5F57;
          padding: 6px;
          border-radius: 6px;
          margin-top: 6px;
          font-weight: 600;
        }
      `}</style>
    </div>;
}

// Simple Markdown Preview renderer for CMS Editor
function formatMarkdownPreview(text) {
  if (!text) return "";

  // Escapes HTML tags
  let html = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Format code blocks (```lang ... ```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<div style="position: relative; border-radius: 12px; overflow: hidden; margin: 16px 0; border: 1px solid rgba(255,255,255,0.08); font-family: monospace;">
      <div style="background: rgba(10,10,12,0.85); padding: 8px 16px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 11px; color: rgba(255,255,255,0.4); text-transform: uppercase;">${lang || 'code'}</div>
      <pre style="margin: 0; padding: 20px; background: rgba(5,5,7,0.95); overflow-x: auto; color: #a5b4fc; font-size: 13px; line-height: 1.6;"><code>${code.trim()}</code></pre>
    </div>`;
  });

  // Format inline code (`code`)
  html = html.replace(/`([^`]+)`/g, '<code style="font-family: monospace; background: rgba(255,255,255,0.08); padding: 2px 6px; border-radius: 4px; color: #2997ff;">$1</code>');

  // Format headers (### title, ## title, # title)
  html = html.replace(/^### (.*?)$/gm, '<h4 style="font-size: 16px; font-weight: 700; margin: 24px 0 12px; color: #fff;">$1</h4>');
  html = html.replace(/^## (.*?)$/gm, '<h3 style="font-size: 20px; font-weight: 700; margin: 32px 0 16px; color: #fff;">$1</h3>');
  html = html.replace(/^# (.*?)$/gm, '<h2 style="font-size: 24px; font-weight: 800; margin: 40px 0 20px; color: #fff;">$1</h2>');

  // Format bold (**text**)
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Format bullets (* item)
  html = html.replace(/^\* (.*?)$/gm, '<li style="margin-left: 20px; margin-bottom: 6px; list-style-type: disc; color: rgba(255,255,255,0.75);">$1</li>');

  // Format links ([text](url))
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer" style="color: #2997ff; text-decoration: underline;">$1</a>');
  return html;
}
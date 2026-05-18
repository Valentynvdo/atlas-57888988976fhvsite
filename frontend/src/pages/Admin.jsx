import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import {
  LogOut,
  Search,
  Users,
  TrendingUp,
  DollarSign,
  AlertCircle,
  Loader2,
  Upload,
  KeyRound,
  Activity,
  X,
  ShieldOff,
  ShieldCheck,
  RefreshCw,
  Clock,
  Compass,
  Cpu,
  Database,
  Radio,
  FileText,
  Lock,
  Globe
} from "lucide-react";
import api from "../lib/api";
import { useAuth } from "../lib/auth";
import AdminPin from "./AdminPin";

export default function Admin() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
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
    if (!loading && (!user || !user.is_admin)) navigate("/", { replace: true });
  }, [user, loading, navigate]);

  // Check if PIN already unlocked
  useEffect(() => {
    if (!user?.is_admin) return;
    api
      .get("/api/admin/ping")
      .then(() => setUnlocked(true))
      .catch(() => setUnlocked(false))
      .finally(() => setChecking(false));
  }, [user]);

  if (loading || checking) {
    return (
      <div style={{ minHeight: "100vh", background: "#000", display: "grid", placeItems: "center" }}>
        <Loader2 size={28} color="#00E5FF" className="spin" />
        <style>{`.spin{animation: spin 0.9s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!unlocked) return <AdminPin onUnlock={() => setUnlocked(true)} />;

  return <AdminPanel onLogout={async () => { await logout(); navigate("/"); }} />;
}

function AdminPanel({ onLogout }) {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState({ key: "created_at", dir: "desc" });
  const [selectedUser, setSelectedUser] = useState(null);
  const [apiLogs, setApiLogs] = useState([]);
  const [version, setVersion] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState("users"); // 'users' | 'active' | 'revenue' | 'churn'
  const fileRef = useRef(null);

  // Нові стани для розширених преміум-фіч
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, analytics, map, users, health, broadcast, logs
  const [detailedStats, setDetailedStats] = useState(null);
  const [healthMetrics, setHealthMetrics] = useState(null);
  const [activeMap, setActiveMap] = useState([]);
  const [adminLogs, setAdminLogs] = useState([]);
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastTarget, setBroadcastTarget] = useState("all");
  const [sendingBroadcast, setSendingBroadcast] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const [s, u, l, v, ds, hm, am, al] = await Promise.all([
        api.get("/api/admin/stats"),
        api.get("/api/admin/users", { params: { q, filter } }),
        api.get("/api/admin/api-logs"),
        api.get("/api/admin/version"),
        api.get("/api/admin/detailed-stats"),
        api.get("/api/admin/health-metrics"),
        api.get("/api/admin/active-map"),
        api.get("/api/admin/admin-logs"),
      ]);
      setStats(s.data);
      setUsers(u.data);
      setApiLogs(l.data);
      setVersion(v.data);
      setDetailedStats(ds.data);
      setHealthMetrics(hm.data);
      setActiveMap(am.data);
      setAdminLogs(al.data);
    } catch (err) {
      console.error("Admin refresh error", err);
    }
  }, [q, filter]);

  useEffect(() => {
    refresh();
    const intervalId = setInterval(refresh, 10000); // Оновлення кожні 10 секунд
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

  const toggleSort = (k) =>
    setSort((s) => (s.key === k ? { key: k, dir: s.dir === "asc" ? "desc" : "asc" } : { key: k, dir: "asc" }));

  const chartConfig = useMemo(() => {
    switch (selectedMetric) {
      case "active":
        return { title: "Активні користувачі", color: "#28C840" };
      case "revenue":
        return { title: "Місячний дохід ($)", color: "#FEBC2E" };
      case "churn":
        return { title: "Відтік ліцензій за місяць", color: "#FF5F57" };
      case "users":
      default:
        return { title: "Зростання користувачів", color: "#00E5FF" };
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
      toast.success("Сповіщення успішно надіслано!", { style: { background: "rgba(40,200,64,0.15)", border: "1px solid rgba(40,200,64,0.4)", color: "#fff" }});
      setBroadcastMessage("");
      refresh();
    } catch {
      toast.error("Помилка надсилання сповіщення.");
    } finally {
      setSendingBroadcast(false);
    }
  };

  return (
    <div data-testid="admin-page" style={{ minHeight: "100vh", background: "#040406", color: "#fff", fontFamily: "Inter, sans-serif", display: "flex", flexDirection: "column" }}>
      <Toaster theme="dark" position="top-center" />

      {/* Header */}
      <header
        className="admin-header"
        style={{
          padding: "14px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(4,4,6,0.8)",
          backdropFilter: "blur(16px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #00E5FF, #9D4CDD)", display: "grid", placeItems: "center", fontSize: 14, fontWeight: 700, boxShadow: "0 0 15px rgba(0,229,255,0.3)" }}>
            A
          </div>
          <div style={{ fontWeight: 700, letterSpacing: "-0.01em", fontSize: 16 }}>Atlas Mission Control</div>
          <span style={{ fontSize: 10, background: "rgba(255,255,255,0.06)", padding: "2px 8px", borderRadius: 4, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            v2.1
          </span>
        </div>
        <button data-testid="admin-logout-btn" onClick={onLogout} className="ghost-btn" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", display: "flex", gap: 6, alignItems: "center" }}>
          <LogOut size={13} /> Вийти
        </button>
      </header>

      {/* Layout wrapper */}
      <div style={{ display: "flex", flex: 1, minHeight: "calc(100vh - 61px)", position: "relative" }}>
        
        {/* Main Content Area */}
        <main style={{ flex: 1, padding: "32px 3% 80px", maxWidth: "calc(100% - 280px)", overflowY: "auto" }}>
          
          {/* Tab: Dashboard */}
          {activeTab === "dashboard" && (
            <div className="fade-in">
              {stats && (
                <section data-testid="admin-stats" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
                  <StatCard icon={<ShieldCheck size={18} />} label="Активних" value={stats.active_count} accent="#28C840" active={selectedMetric === "active"} onClick={() => { setSelectedMetric("active"); }} />
                  <StatCard icon={<Users size={18} />} label="Всього юзерів" value={stats.total_users} accent="#00E5FF" active={selectedMetric === "users"} onClick={() => { setSelectedMetric("users"); }} />
                  <StatCard icon={<TrendingUp size={18} />} label="Нових сьогодні" value={stats.users_today} accent="#9D4CDD" active={false} onClick={() => {}} />
                  <StatCard icon={<AlertCircle size={18} />} label="Відтік / міс" value={stats.churn_this_month} accent="#FF5F57" active={selectedMetric === "churn"} onClick={() => { setSelectedMetric("churn"); }} />
                  <StatCard icon={<DollarSign size={18} />} label="Місячний дохід" value={`$${stats.monthly_revenue}`} accent="#FEBC2E" active={selectedMetric === "revenue"} onClick={() => { setSelectedMetric("revenue"); }} />
                </section>
              )}

              {stats && (
                <section data-testid="admin-growth" className="glass" style={{ padding: 24, borderRadius: 20, marginBottom: 24, border: "1px solid rgba(255,255,255,0.04)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <div>
                      <div style={{ fontSize: 10, letterSpacing: "0.15em", color: chartConfig.color, textTransform: "uppercase", fontWeight: 700 }}>Аналітичний звіт</div>
                      <h3 style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 700 }}>{chartConfig.title}</h3>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {["users", "active", "revenue"].map((m) => (
                        <button key={m} onClick={() => setSelectedMetric(m)} style={{
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
                          {m === "users" ? "Юзери" : m === "active" ? "Активні" : "Дохід"}
                        </button>
                      ))}
                    </div>
                  </div>
                  <GrowthChart data={stats.growth} metric={selectedMetric} color={chartConfig.color} />
                </section>
              )}

              {/* Version & Manual Key generator in one row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
                <section className="glass" style={{ padding: 24, borderRadius: 20, border: "1px solid rgba(255,255,255,0.04)" }}>
                  <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                    <KeyRound size={18} color="#00E5FF" />
                    Згенерувати ліцензійний ключ
                  </h3>
                  <ManualKeyGen onCreated={refresh} />
                </section>

                <section className="glass" style={{ padding: 24, borderRadius: 20, border: "1px solid rgba(255,255,255,0.04)" }}>
                  <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                    <Upload size={18} color="#9D4CDD" />
                    Завантажити нову версію Atlas
                  </h3>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginBottom: 16, background: "rgba(255,255,255,0.02)", padding: "10px 14px", borderRadius: 10 }}>
                    Поточна стабільна версія: <b style={{ color: "#fff" }}>{version?.version || "—"}</b> · {version?.size_mb || 0} MB<br/>
                    Опубліковано: <span style={{ color: "#fff" }}>{version?.released_at ? fmtDateTime(version.released_at) : "—"}</span>
                  </div>
                  <input ref={fileRef} type="file" accept=".dmg,.zip,.tar.gz" style={{ display: "none" }} />
                  <VersionUpload fileRef={fileRef} onUploaded={refresh} />
                </section>
              </div>
            </div>
          )}

          {/* Tab: Financial Analytics */}
          {activeTab === "analytics" && (
            <div className="fade-in">
              {detailedStats && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 24 }}>
                  <div className="glass" style={{ padding: 24, borderRadius: 20, borderLeft: "4px solid #00E5FF", position: "relative", overflow: "hidden" }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 700 }}>Оплачено через Stripe</div>
                    <div style={{ fontSize: 32, fontWeight: 800, marginTop: 8, color: "#00E5FF" }}>${detailedStats.stripe.amount}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 6 }}>Всього успішних транзакцій: {detailedStats.stripe.count}</div>
                    <DollarSign size={80} style={{ position: "absolute", right: -15, bottom: -15, color: "rgba(0,229,255,0.03)" }} />
                  </div>
                  <div className="glass" style={{ padding: 24, borderRadius: 20, borderLeft: "4px solid #FEBC2E", position: "relative", overflow: "hidden" }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 700 }}>Оплачено в TON Coin</div>
                    <div style={{ fontSize: 32, fontWeight: 800, marginTop: 8, color: "#FEBC2E" }}>${detailedStats.ton.amount}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 6 }}>Всього успішних транзакцій: {detailedStats.ton.count}</div>
                    <Globe size={80} style={{ position: "absolute", right: -15, bottom: -15, color: "rgba(254,188,46,0.03)" }} />
                  </div>
                </div>
              )}

              <section className="glass" style={{ padding: 24, borderRadius: 20, border: "1px solid rgba(255,255,255,0.04)" }}>
                <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 700 }}>Історія транзакцій платежів</h3>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ color: "rgba(255,255,255,0.4)", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <th style={{ padding: 12 }}>ID сесії / Хеш</th>
                        <th style={{ padding: 12 }}>Користувач (Email)</th>
                        <th style={{ padding: 12 }}>Метод</th>
                        <th style={{ padding: 12 }}>Сума</th>
                        <th style={{ padding: 12 }}>Статус</th>
                        <th style={{ padding: 12 }}>Дата</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailedStats?.transactions.map((tx, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                          <td style={{ padding: 12, fontFamily: "monospace", color: "rgba(255,255,255,0.6)" }}>
                            {tx.ton_tx_hash ? tx.ton_tx_hash.slice(0, 16) + "..." : tx.stripe_session_id ? tx.stripe_session_id.slice(0, 16) + "..." : "—"}
                          </td>
                          <td style={{ padding: 12 }}>{tx.email || "—"}</td>
                          <td style={{ padding: 12 }}>
                            <span style={{
                              padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                              background: tx.ton_tx_hash ? "rgba(254,188,46,0.12)" : "rgba(0,229,255,0.12)",
                              color: tx.ton_tx_hash ? "#FEBC2E" : "#00E5FF"
                            }}>
                              {tx.ton_tx_hash ? "TON" : "Stripe"}
                            </span>
                          </td>
                          <td style={{ padding: 12, fontWeight: 600 }}>${tx.amount}</td>
                          <td style={{ padding: 12 }}>
                            <span style={{
                              padding: "2px 8px", borderRadius: 99, fontSize: 10, fontWeight: 700,
                              background: tx.payment_status === "paid" ? "rgba(40,200,64,0.12)" : "rgba(255,95,87,0.12)",
                              color: tx.payment_status === "paid" ? "#28C840" : "#FF5F57"
                            }}>
                              {tx.payment_status === "paid" ? "Оплачено" : "Помилка"}
                            </span>
                          </td>
                          <td style={{ padding: 12, color: "rgba(255,255,255,0.5)" }}>{fmtDateTime(tx.created_at)}</td>
                        </tr>
                      ))}
                      {(!detailedStats || detailedStats.transactions.length === 0) && (
                        <tr>
                          <td colSpan={6} style={{ padding: 32, textAlign: "center", color: "rgba(255,255,255,0.4)" }}>Транзакцій не знайдено</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {/* Tab: SVG World Glow Map */}
          {activeTab === "map" && (
            <div className="fade-in">
              <section className="glass" style={{ padding: 24, borderRadius: 20, border: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 10, color: "#00E5FF", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700 }}>Географія активацій</div>
                  <h3 style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                    <Globe size={20} color="#00E5FF" />
                    Інтерактивна Glow Map
                  </h3>
                </div>

                <div style={{ position: "relative", width: "100%", background: "#0b0b0e", borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden", padding: "40px 20px" }}>
                  {/* Stylized Abstract SVG World Map Background */}
                  <svg viewBox="0 0 1000 500" style={{ width: "100%", height: "auto", display: "block" }}>
                    {/* Outline Continents (Simplified premium visual nodes) */}
                    <rect x="0" y="0" width="1000" height="500" fill="none" />
                    {/* Abstract digital world grid system */}
                    <path d="M 0 100 H 1000 M 0 200 H 1000 M 0 300 H 1000 M 0 400 H 1000" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                    <path d="M 200 0 V 500 M 400 0 V 500 M 600 0 V 500 M 800 0 V 500" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                    
                    {/* Stylized Abstract Continent Shapes */}
                    <path d="M 120 120 Q 180 80 250 140 T 320 220 Q 300 280 220 320 T 150 250 Z" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                    <path d="M 450 100 Q 550 80 620 120 T 750 150 Q 820 220 780 320 T 600 350 Z" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="3,3" />
                    <path d="M 380 320 Q 420 380 440 450 T 400 480 Q 360 440 350 360 Z" fill="rgba(255,255,255,0.015)" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    <path d="M 780 320 Q 840 360 880 440 T 840 470 Z" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

                    {/* Active Pulsing Locations */}
                    {activeMap.map((spot, idx) => {
                      // Simple Equirectangular projection
                      // map lon from [-180, 180] to [50, 950]
                      // map lat from [-90, 90] to [450, 50]
                      const x = 500 + (spot.lon * 500) / 180;
                      const y = 250 - (spot.lat * 250) / 90;
                      return (
                        <g key={idx}>
                          {/* Outer pulse */}
                          <circle cx={x} cy={y} r="8" fill="none" stroke="#00E5FF" strokeWidth="1.5" opacity="0.8">
                            <animate attributeName="r" values="4;16;4" dur="2.5s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.8;0;0.8" dur="2.5s" repeatCount="indefinite" />
                          </circle>
                          {/* Inner glowing dot */}
                          <circle cx={x} cy={y} r="4" fill="#00E5FF" style={{ filter: "drop-shadow(0 0 4px #00E5FF)" }} />
                        </g>
                      );
                    })}
                  </svg>
                  
                  {/* Floating legend list */}
                  <div style={{ position: "absolute", bottom: 15, left: 15, background: "rgba(0,0,0,0.6)", padding: "10px 14px", borderRadius: 10, fontSize: 11, border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(6px)" }}>
                    <div style={{ fontWeight: 700, color: "#00E5FF", marginBottom: 6 }}>Активні хости:</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {activeMap.slice(0, 5).map((spot, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00E5FF", display: "inline-block" }} />
                          <span>{spot.city}, {spot.country} ({spot.key_prefix.slice(0, 9)}...)</span>
                        </div>
                      ))}
                      {activeMap.length === 0 && <span style={{ color: "rgba(255,255,255,0.4)" }}>Немає підключень</span>}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Tab: Users Table (Live heartbeats) */}
          {activeTab === "users" && (
            <section data-testid="admin-users-block" className="glass fade-in" style={{ padding: 24, borderRadius: 20, border: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Керування користувачами</h3>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>
                    Живі статуси Online / Offline підключаються автоматично з Mac-клієнта.
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ position: "relative" }}>
                    <Search size={14} style={{ position: "absolute", left: 12, top: 11, color: "rgba(255,255,255,0.4)" }} />
                    <input
                      data-testid="users-search-input"
                      placeholder="Email або ліцензійний ключ..."
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      style={{
                        padding: "9px 12px 9px 32px",
                        background: "rgba(0,0,0,0.4)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "#fff",
                        borderRadius: 10,
                        fontSize: 13,
                        width: 240,
                        outline: "none",
                      }}
                    />
                  </div>
                  <select
                    data-testid="users-filter-select"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    style={{
                      padding: "9px 12px",
                      background: "rgba(0,0,0,0.4)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "#fff",
                      borderRadius: 10,
                      fontSize: 13,
                      outline: "none",
                    }}
                  >
                    <option value="all">Всі</option>
                    <option value="active">Активні</option>
                    <option value="inactive">Неактивні</option>
                    <option value="blocked">Заблоковані</option>
                  </select>
                  <button data-testid="users-refresh-btn" onClick={refresh} className="ghost-btn" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <RefreshCw size={13} />
                  </button>
                </div>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ color: "rgba(255,255,255,0.5)", textAlign: "left" }}>
                      {[
                        ["email", "Email"],
                        ["key", "Ключ"],
                        ["active", "Статус ліцензії"],
                        ["heartbeat", "Зв'язок (Online)"],
                        ["mac_id", "Mac ID / Назва"],
                        ["version", "Версія"],
                        ["created_at", "Реєстрація"],
                        ["expires_at", "Закінчення"],
                      ].map(([k, l]) => (
                        <th
                          key={k}
                          onClick={() => toggleSort(k)}
                          style={{ padding: "12px 14px", cursor: "pointer", fontWeight: 600, userSelect: "none", whiteSpace: "nowrap" }}
                        >
                          {l} {sort.key === k ? (sort.dir === "asc" ? "▲" : "▼") : ""}
                        </th>
                      ))}
                      <th style={{ padding: "12px 14px" }}>Дії</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedUsers.map((u) => {
                      // Check if online: last ping was < 30 seconds ago
                      const isOnline = u.last_ping && (new Date() - new Date(u.last_ping)) < 45000;
                      return (
                        <tr
                          key={u.user_id}
                          data-testid={`user-row-${u.user_id}`}
                          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                        >
                          <td style={td}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              {u.avatar_url ? (
                                <img src={u.avatar_url} alt="" style={{ width: 22, height: 22, borderRadius: "50%" }} />
                              ) : null}
                              <span>{u.email}</span>
                              {u.is_blocked && <ShieldOff size={12} color="#FF5F57" />}
                            </div>
                          </td>
                          <td style={{ ...td, fontFamily: "monospace", color: "rgba(255,255,255,0.6)" }}>
                            {u.key ? u.key.slice(0, 14) + "…" : "—"}
                          </td>
                          <td style={td}>
                            <span
                              style={{
                                padding: "3px 10px",
                                borderRadius: 999,
                                fontSize: 11,
                                fontWeight: 700,
                                background: u.active ? "rgba(40,200,64,0.12)" : "rgba(255,95,87,0.12)",
                                color: u.active ? "#28C840" : "#FF5F57",
                              }}
                            >
                              {u.active ? "Активна" : "Неактивна"}
                            </span>
                          </td>
                          <td style={td}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <span style={{
                                width: 8, height: 8, borderRadius: "50%",
                                background: isOnline ? "#28C840" : "rgba(255,255,255,0.15)",
                                boxShadow: isOnline ? "0 0 8px #28C840" : "none",
                                display: "inline-block"
                              }} />
                              <span style={{ fontSize: 11, color: isOnline ? "#28C840" : "rgba(255,255,255,0.4)" }}>
                                {isOnline ? "Online" : "Offline"}
                              </span>
                            </div>
                          </td>
                          <td style={{ ...td, fontFamily: "monospace", color: "rgba(255,255,255,0.6)" }}>
                            {u.mac_id ? `${u.mac_name || "Mac"} (${u.mac_id.slice(0, 6)})` : "—"}
                          </td>
                          <td style={td}>{u.version}</td>
                          <td style={td}>{fmtDate(u.created_at)}</td>
                          <td style={td}>{fmtDate(u.expires_at)}</td>
                          <td style={td}>
                            <button
                              data-testid={`user-open-${u.user_id}`}
                              onClick={() => setSelectedUser(u)}
                              className="ghost-btn"
                              style={{ padding: "5px 12px", fontSize: 12, background: "rgba(255,255,255,0.03)" }}
                            >
                              Відкрити
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {sortedUsers.length === 0 && (
                      <tr>
                        <td colSpan={9} style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.4)" }}>
                          Користувачів не знайдено
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Tab: Server and Database Health */}
          {activeTab === "health" && (
            <div className="fade-in">
              <section className="glass" style={{ padding: 24, borderRadius: 20, border: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 10, color: "#9D4CDD", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700 }}>Здоров'я Системи</div>
                  <h3 style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                    <Cpu size={20} color="#9D4CDD" />
                    Моніторинг процесів та бази
                  </h3>
                </div>

                {healthMetrics && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
                    <div style={{ background: "rgba(255,255,255,0.02)", padding: 20, borderRadius: 16, border: "1px solid rgba(255,255,255,0.04)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Навантаження CPU</span>
                        <Cpu size={16} color="#00E5FF" />
                      </div>
                      <div style={{ fontSize: 28, fontWeight: 800, color: "#00E5FF" }}>{healthMetrics.cpu_percent}%</div>
                      <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, marginTop: 12, overflow: "hidden" }}>
                        <div style={{ width: `${healthMetrics.cpu_percent}%`, height: "100%", background: "#00E5FF", borderRadius: 3 }} />
                      </div>
                    </div>

                    <div style={{ background: "rgba(255,255,255,0.02)", padding: 20, borderRadius: 16, border: "1px solid rgba(255,255,255,0.04)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Використання RAM</span>
                        <Database size={16} color="#9D4CDD" />
                      </div>
                      <div style={{ fontSize: 28, fontWeight: 800, color: "#9D4CDD" }}>{healthMetrics.memory.used_mb} MB</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>Загальний ліміт: {healthMetrics.memory.total_mb} MB</div>
                    </div>

                    <div style={{ background: "rgba(255,255,255,0.02)", padding: 20, borderRadius: 16, border: "1px solid rgba(255,255,255,0.04)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Пінг до PostgreSQL</span>
                        <Radio size={16} color="#28C840" />
                      </div>
                      <div style={{ fontSize: 28, fontWeight: 800, color: "#28C840" }}>{healthMetrics.db_latency_ms} ms</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 6 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#28C840" }} />
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>З'єднання з сервером стабільне</span>
                      </div>
                    </div>

                    <div style={{ background: "rgba(255,255,255,0.02)", padding: 20, borderRadius: 16, border: "1px solid rgba(255,255,255,0.04)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Час роботи API (Uptime)</span>
                        <Clock size={16} color="#FEBC2E" />
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: "#FEBC2E", marginTop: 4 }}>
                        {Math.floor(healthMetrics.uptime_seconds / 3600)} год {Math.floor((healthMetrics.uptime_seconds % 3600) / 60)} хв
                      </div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 12 }}>Python {healthMetrics.python_version}</div>
                    </div>
                  </div>
                )}
              </section>
            </div>
          )}

          {/* Tab: Broadcast Alert Center */}
          {activeTab === "broadcast" && (
            <div className="fade-in">
              <section className="glass" style={{ padding: 24, borderRadius: 20, border: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 10, color: "#FEBC2E", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700 }}>Центр Розсилок</div>
                  <h3 style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                    <Radio size={20} color="#FEBC2E" />
                    Надіслати сповіщення
                  </h3>
                </div>

                <div style={{ display: "grid", gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 8 }}>Оберіть отримувачів</label>
                    <select
                      value={broadcastTarget}
                      onChange={(e) => setBroadcastTarget(e.target.value)}
                      style={{
                        padding: "12px 16px",
                        background: "rgba(0,0,0,0.5)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        color: "#fff",
                        borderRadius: 12,
                        fontSize: 14,
                        outline: "none",
                        width: "100%",
                        maxWidth: 320
                      }}
                    >
                      <option value="all">Всім (Telegram та Mac Додатки)</option>
                      <option value="telegram">Тільки в особистий Telegram асистента</option>
                      <option value="clients">Тільки клієнтам у додаток Mac</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 8 }}>Текст повідомлення</label>
                    <textarea
                      placeholder="Введіть текст оголошення або оновлення, яке побачать ваші користувачі..."
                      value={broadcastMessage}
                      onChange={(e) => setBroadcastMessage(e.target.value)}
                      rows={5}
                      style={{
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
                      }}
                    />
                  </div>

                  <button
                    onClick={handleBroadcast}
                    disabled={sendingBroadcast || !broadcastMessage.trim()}
                    className="cta-btn"
                    style={{ padding: "14px 28px", borderRadius: 12, alignSelf: "flex-start", display: "flex", gap: 8, alignItems: "center" }}
                  >
                    {sendingBroadcast ? <Loader2 size={16} className="spin" /> : <Radio size={16} />}
                    Надіслати сповіщення
                  </button>
                </div>
              </section>
            </div>
          )}

          {/* Tab: Admin Audit Log */}
          {activeTab === "logs" && (
            <div className="fade-in">
              <section className="glass" style={{ padding: 24, borderRadius: 20, border: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 10, color: "#FF5F57", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700 }}>Аудит Системи</div>
                  <h3 style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                    <FileText size={20} color="#FF5F57" />
                    Логи критичних дій адміністратора
                  </h3>
                </div>

                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ color: "rgba(255,255,255,0.4)", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <th style={{ padding: 12 }}>Дія</th>
                        <th style={{ padding: 12 }}>Виконав (Admin)</th>
                        <th style={{ padding: 12 }}>Користувач (Target)</th>
                        <th style={{ padding: 12 }}>Дата дії</th>
                        <th style={{ padding: 12 }}>Подробиці</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminLogs.map((log, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                          <td style={{ padding: 12 }}>
                            <span style={{
                              padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700,
                              background: "rgba(255,95,87,0.12)", color: "#FF5F57"
                            }}>
                              {log.action}
                            </span>
                          </td>
                          <td style={{ padding: 12, fontWeight: 600 }}>{log.performed_by}</td>
                          <td style={{ padding: 12 }}>{log.target_email || "—"}</td>
                          <td style={{ padding: 12, color: "rgba(255,255,255,0.5)" }}>{fmtDateTime(log.performed_at)}</td>
                          <td style={{ padding: 12, fontFamily: "monospace", fontSize: 12, color: "rgba(0,229,255,0.8)" }}>
                            {JSON.stringify(log.details || {})}
                          </td>
                        </tr>
                      ))}
                      {adminLogs.length === 0 && (
                        <tr>
                          <td colSpan={5} style={{ padding: 32, textAlign: "center", color: "rgba(255,255,255,0.4)" }}>Дій адміністратора не знайдено</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

        </main>

        {/* Right Sidebar Navigation Menu */}
        <aside
          className="admin-sidebar"
          style={{
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
            backdropFilter: "blur(12px)",
          }}
        >
          <div style={{ fontSize: 10, letterSpacing: "0.15em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>
            Розділи керування
          </div>
          
          <SidebarButton icon={<Compass size={16} />} label="Головна консоль" active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} />
          <SidebarButton icon={<DollarSign size={16} />} label="Аналітика та Фінанси" active={activeTab === "analytics"} onClick={() => setActiveTab("analytics")} />
          <SidebarButton icon={<Globe size={16} />} label="Інтерактивна Glow Map" active={activeTab === "map"} onClick={() => setActiveTab("map")} />
          <SidebarButton icon={<Users size={16} />} label="База Користувачів" active={activeTab === "users"} onClick={() => setActiveTab("users")} />
          <SidebarButton icon={<Cpu size={16} />} label="Здоров'я Системи" active={activeTab === "health"} onClick={() => setActiveTab("health")} />
          <SidebarButton icon={<Radio size={16} />} label="Центр Розсилок" active={activeTab === "broadcast"} onClick={() => setActiveTab("broadcast")} />
          <SidebarButton icon={<FileText size={16} />} label="Аудит Сповіщень" active={activeTab === "logs"} onClick={() => setActiveTab("logs")} />
          
          <div style={{ marginTop: "auto", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 16 }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", gap: 6 }}>
              <Lock size={12} color="#28C840" />
              <span>Шифрування AES-256</span>
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>
              База даних PostgreSQL: <b style={{ color: "#28C840" }}>Online</b>
            </div>
          </div>
        </aside>

      </div>

      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUpdated={() => { refresh(); }}
        />
      )}
    </div>
  );
}

const td = { padding: "12px 14px", whiteSpace: "nowrap" };

function SidebarButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "100%",
        padding: "12px 16px",
        borderRadius: 12,
        border: "none",
        background: active ? "linear-gradient(135deg, rgba(0,229,255,0.12) 0%, rgba(157,76,221,0.05) 100%)" : "transparent",
        color: active ? "#00E5FF" : "rgba(255,255,255,0.65)",
        cursor: "pointer",
        fontWeight: active ? 700 : 500,
        fontSize: 13,
        textAlign: "left",
        borderLeft: active ? "3px solid #00E5FF" : "3px solid transparent",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = "rgba(255,255,255,0.02)";
          e.currentTarget.style.color = "#fff";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "rgba(255,255,255,0.65)";
        }
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function StatCard({ icon, label, value, accent, active, onClick }) {
  return (
    <div
      className="glass"
      onClick={onClick}
      style={{
        padding: 20,
        borderRadius: 16,
        cursor: "pointer",
        border: active ? `1px solid ${accent}` : "1px solid rgba(255,255,255,0.05)",
        background: active ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.01)",
        boxShadow: active ? `0 0 15px ${accent}15` : "none",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        borderLeft: `4px solid ${accent}`
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.5)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700 }}>
        <span style={{ color: accent }}>{icon}</span>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8, letterSpacing: "-0.02em" }}>{value}</div>
    </div>
  );
}

function GrowthChart({ data, metric, color }) {
  const max = Math.max(1, ...data.map((d) => d[metric] || 0));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 160, paddingTop: 10 }}>
      {data.map((d) => (
        <div key={d.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: "100%",
              height: `${((d[metric] || 0) / max) * 100}%`,
              background: `linear-gradient(180deg, ${color}, ${color}15)`,
              borderRadius: "4px 4px 0 0",
              minHeight: 4,
              transition: "height 0.6s ease",
            }}
            title={`${d[metric] || 0}`}
          />
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>{d.month.slice(5)}</div>
        </div>
      ))}
    </div>
  );
}

function UserDetailsModal({ user, onClose, onUpdated }) {
  const [notes, setNotes] = useState(user.admin_notes || "");
  const [busy, setBusy] = useState(false);

  const doAction = async (action, extra = {}) => {
    setBusy(true);
    try {
      await api.post("/api/admin/users/action", { user_id: user.user_id, action, ...extra });
      toast.success(`Дія "${action}" виконана`);
      onUpdated();
      if (["regen_key", "extend"].includes(action)) {
        // Stay open
      }
    } catch (e) {
      toast.error("Помилка");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)", zIndex: 1000, display: "grid", placeItems: "center", padding: 24 }}
      data-testid="user-details-modal"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass"
        style={{ width: "min(560px, 100%)", maxHeight: "90vh", overflowY: "auto", padding: 28, borderRadius: 24, border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyConstraint: "space-between", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {user.avatar_url ? (
              <img src={user.avatar_url} alt="" style={{ width: 44, height: 44, borderRadius: "50%", border: "2px solid #00E5FF" }} />
            ) : (
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#00E5FF,#9D4CDD)", boxShadow: "0 0 10px rgba(0,229,255,0.3)" }} />
            )}
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{user.name || user.email}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{user.email}</div>
            </div>
          </div>
          <button onClick={onClose} className="ghost-btn" style={{ width: 36, height: 36, padding: 0, borderRadius: "50%", display: "grid", placeItems: "center", background: "rgba(255,255,255,0.03)" }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ display: "grid", gap: 10, fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 24, background: "rgba(255,255,255,0.02)", padding: 16, borderRadius: 14 }}>
          <Row label="Ключ ліцензії" value={user.key} mono />
          <Row label="Зв'язаний Mac" value={user.mac_id ? `${user.mac_name || "Mac"} · ${user.mac_id.slice(0, 16)}...` : "Ні"} />
          <Row label="Версія додатка" value={user.version} />
          <Row label="Статус ліцензії" value={user.active ? "Активна" : "Неактивна"} />
          <Row label="Дата реєстрації" value={fmtDate(user.created_at)} />
          <Row label="Дата закінчення" value={fmtDate(user.expires_at)} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10, marginBottom: 24 }}>
          <button data-testid="action-extend" disabled={busy} onClick={() => doAction("extend", { days: 30 })} className="ghost-btn" style={{ background: "rgba(40,200,64,0.08)", borderColor: "rgba(40,200,64,0.2)", color: "#28C840" }}>
            <Clock size={14} /> +30 днів
          </button>
          <button data-testid="action-cancel" disabled={busy} onClick={() => doAction("cancel")} className="ghost-btn" style={{ background: "rgba(255,95,87,0.08)", borderColor: "rgba(255,95,87,0.2)", color: "#FF5F57" }}>
            Скасувати ліцензію
          </button>
          <button data-testid="action-regen" disabled={busy} onClick={() => doAction("regen_key")} className="ghost-btn">
            <RefreshCw size={14} /> Новий ключ
          </button>
          <button data-testid="action-reset-mac" disabled={busy} onClick={() => doAction("reset_mac")} className="ghost-btn">
            Скинути Mac ID
          </button>
          <button
            data-testid="action-block"
            disabled={busy}
            onClick={() => doAction(user.is_blocked ? "unblock" : "block")}
            className="ghost-btn"
            style={{ borderColor: user.is_blocked ? "rgba(40,200,64,0.4)" : "rgba(255,95,87,0.4)", color: user.is_blocked ? "#28C840" : "#FF5F57", background: user.is_blocked ? "rgba(40,200,64,0.05)" : "rgba(255,95,87,0.05)" }}
          >
            {user.is_blocked ? "Розблокувати" : "Заблокувати користувача"}
          </button>
        </div>

        <div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 8, fontWeight: 600 }}>Нотатки адміністратора</div>
          <textarea
            data-testid="user-notes-textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            style={{
              width: "100%",
              padding: 12,
              background: "rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              color: "#fff",
              fontSize: 13,
              fontFamily: "inherit",
              resize: "vertical",
              outline: "none",
            }}
          />
          <button
            data-testid="save-notes-btn"
            onClick={() => doAction("save_notes", { notes })}
            className="cta-btn"
            style={{ marginTop: 10, padding: "8px 20px", borderRadius: 10, height: 38 }}
            disabled={busy}
          >
            Зберегти нотатки
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, mono }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: 6 }}>
      <span style={{ color: "rgba(255,255,255,0.4)" }}>{label}</span>
      <span style={{ color: "#fff", fontFamily: mono ? "monospace" : "inherit", textAlign: "right", wordBreak: "break-all" }}>{value || "—"}</span>
    </div>
  );
}

function ManualKeyGen({ onCreated }) {
  const [email, setEmail] = useState("");
  const [days, setDays] = useState(30);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);

  const submit = async () => {
    if (!email) return;
    setBusy(true);
    try {
      const r = await api.post("/api/admin/generate-key", { email, days });
      setResult(r.data);
      toast.success("Новий ліцензійний ключ успішно створено", { style: { background: "rgba(40,200,64,0.15)", border: "1px solid rgba(40,200,64,0.4)", color: "#fff" }});
      onCreated();
    } catch (e) {
      toast.error("Сталася помилка при створенні ключа", { style: { background: "rgba(255,95,87,0.15)", border: "1px solid rgba(255,95,87,0.4)", color: "#fff" }});
    } finally {
      setBusy(false);
    }
  };

  const copyKey = () => {
    if (result && result.key) {
      navigator.clipboard.writeText(result.key);
      toast.success("Ключ скопійовано", { duration: 2000 });
    }
  };

  return (
    <div style={{ padding: "4px 0" }}>
      <div style={{ display: "flex", gap: 12, flexDirection: "column" }}>
        <input
          data-testid="gen-email-input"
          type="email"
          placeholder="Введіть email користувача..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 14px",
            background: "rgba(0,0,0,0.5)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            color: "#fff",
            fontSize: 13,
            outline: "none",
          }}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <select
            data-testid="gen-days-select"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            style={{
              padding: "12px 14px",
              background: "rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              color: "#fff",
              fontSize: 13,
              outline: "none",
              flex: 1,
              cursor: "pointer",
            }}
          >
            <option value={30}>30 днів (Місяць)</option>
            <option value={90}>90 днів (Квартал)</option>
            <option value={180}>180 днів (Півроку)</option>
            <option value={365}>365 днів (Рік)</option>
          </select>
          <button 
            data-testid="gen-submit-btn" 
            disabled={busy || !email} 
            onClick={submit} 
            className="cta-btn"
            style={{ padding: "0 24px", borderRadius: 12, height: 43 }}
          >
            {busy ? <Loader2 size={14} className="spin" /> : <KeyRound size={14} />} 
            Створити
          </button>
        </div>
      </div>

      {result && (
        <div
          data-testid="gen-result"
          style={{
            marginTop: 16,
            padding: 16,
            background: "linear-gradient(135deg, rgba(0,229,255,0.06) 0%, rgba(157,76,221,0.03) 100%)",
            border: "1px solid rgba(0,229,255,0.2)",
            borderRadius: 12,
            display: "flex",
            flexDirection: "column",
            gap: 10
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Ключ для {result.email}</span>
            <span style={{ fontSize: 10, background: "rgba(40,200,64,0.15)", color: "#28C840", padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>до {fmtDate(result.expires_at)}</span>
          </div>
          
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            background: "rgba(0,0,0,0.4)", 
            padding: "10px 14px", 
            borderRadius: 10,
            border: "1px dashed rgba(0,229,255,0.25)" 
          }}>
            <div style={{ fontFamily: "monospace", fontSize: 15, fontWeight: 700, color: "#00E5FF", letterSpacing: "0.05em" }}>
              {result.key}
            </div>
            <button 
              onClick={copyKey}
              className="ghost-btn" 
              style={{ padding: "4px 10px", borderRadius: 6, background: "rgba(255,255,255,0.06)", border: "none", fontSize: 11 }}
            >
              Копіювати
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function VersionUpload({ fileRef, onUploaded }) {
  const [version, setVersion] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const f = fileRef.current?.files?.[0];
    if (!f || !version) {
      toast.error("Введи версію і вибери файл");
      return;
    }
    const fd = new FormData();
    fd.append("version", version);
    fd.append("file", f);
    setBusy(true);
    try {
      await api.post("/api/admin/version", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Нову версію успішно завантажено!");
      onUploaded();
      setVersion("");
      if (fileRef.current) fileRef.current.value = "";
    } catch {
      toast.error("Помилка завантаження файлу версії.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ display: "flex", gap: 8, flexDirection: "column" }}>
      <input
        data-testid="version-input"
        placeholder="1.0.0"
        value={version}
        onChange={(e) => setVersion(e.target.value)}
        style={{
          padding: "12px 14px",
          background: "rgba(0,0,0,0.5)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 12,
          color: "#fff",
          fontSize: 13,
          outline: "none",
          width: "100%",
        }}
      />
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <button data-testid="version-pick-btn" onClick={() => fileRef.current?.click()} className="ghost-btn" style={{ padding: "0 16px", borderRadius: 12, height: 43, background: "rgba(255,255,255,0.03)" }}>
          Обрати файл
        </button>
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, flex: 1, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
          {fileRef.current?.files?.[0]?.name || "Файл не обрано..."}
        </span>
        <button data-testid="version-upload-btn" onClick={submit} disabled={busy || !version} className="cta-btn" style={{ padding: "0 20px", borderRadius: 12, height: 43 }}>
          {busy ? <Loader2 size={14} className="spin" /> : <Upload size={14} />} Завантажити
        </button>
      </div>
    </div>
  );
}

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("uk-UA", { day: "numeric", month: "short", year: "numeric" });
}
function fmtDateTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("uk-UA", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

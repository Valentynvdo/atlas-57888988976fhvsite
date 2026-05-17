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

  return <AdminPanel onLogout={async () => { await logout(); navigate("/login"); }} />;
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
  const fileRef = useRef(null);

  const refresh = useCallback(async () => {
    const [s, u, l, v] = await Promise.all([
      api.get("/api/admin/stats"),
      api.get("/api/admin/users", { params: { q, filter } }),
      api.get("/api/admin/api-logs"),
      api.get("/api/admin/version"),
    ]);
    setStats(s.data);
    setUsers(u.data);
    setApiLogs(l.data);
    setVersion(v.data);
  }, [q, filter]);

  useEffect(() => {
    refresh();
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

  return (
    <div data-testid="admin-page" style={{ minHeight: "100vh", background: "#050507", color: "#fff", fontFamily: "Inter, sans-serif" }}>
      <Toaster theme="dark" position="top-center" />

      <header
        style={{
          padding: "14px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #FF5F57, #9D4CDD)", display: "grid", placeItems: "center", fontSize: 14, fontWeight: 700 }}>
            A
          </div>
          <div style={{ fontWeight: 600 }}>Atlas Admin</div>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            x7k9m
          </span>
        </div>
        <button data-testid="admin-logout-btn" onClick={onLogout} className="ghost-btn">
          <LogOut size={14} /> Вийти
        </button>
      </header>

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 80px" }}>
        {/* Stats grid */}
        {stats && (
          <section data-testid="admin-stats" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 24 }}>
            <StatCard icon={<ShieldCheck size={18} />} label="Активних" value={stats.active_count} accent="#28C840" />
            <StatCard icon={<Users size={18} />} label="Всього юзерів" value={stats.total_users} accent="#00E5FF" />
            <StatCard icon={<TrendingUp size={18} />} label="Нових сьогодні" value={stats.users_today} accent="#9D4CDD" />
            <StatCard icon={<AlertCircle size={18} />} label="Відтік / міс" value={stats.churn_this_month} accent="#FF5F57" />
            <StatCard icon={<DollarSign size={18} />} label="Місячний дохід" value={`$${stats.monthly_revenue}`} accent="#FEBC2E" />
            <StatCard icon={<DollarSign size={18} />} label="Річний прогноз" value={`$${stats.yearly_forecast}`} accent="#FEBC2E" />
          </section>
        )}

        {/* Growth chart */}
        {stats && (
          <section data-testid="admin-growth" className="glass" style={{ padding: 24, borderRadius: 20, marginBottom: 24 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.18em", color: "#00E5FF", textTransform: "uppercase", fontWeight: 600 }}>
              Графік
            </div>
            <h3 style={{ margin: "6px 0 16px", fontSize: 18, fontWeight: 600 }}>Зростання користувачів</h3>
            <GrowthChart data={stats.growth} />
          </section>
        )}

        {/* Users table */}
        <section data-testid="admin-users-block" className="glass" style={{ padding: 24, borderRadius: 20, marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Користувачі</h3>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ position: "relative" }}>
                <Search size={14} style={{ position: "absolute", left: 12, top: 11, color: "rgba(255,255,255,0.4)" }} />
                <input
                  data-testid="users-search-input"
                  placeholder="Email або ключ"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  style={{
                    padding: "9px 12px 9px 32px",
                    background: "rgba(0,0,0,0.4)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#fff",
                    borderRadius: 10,
                    fontSize: 13,
                    width: 220,
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
              <button data-testid="users-refresh-btn" onClick={refresh} className="ghost-btn">
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
                    ["active", "Статус"],
                    ["mac_id", "Mac ID"],
                    ["version", "Версія"],
                    ["created_at", "Реєстрація"],
                    ["expires_at", "Закінчення"],
                  ].map(([k, l]) => (
                    <th
                      key={k}
                      onClick={() => toggleSort(k)}
                      style={{ padding: "10px 12px", cursor: "pointer", fontWeight: 500, userSelect: "none", whiteSpace: "nowrap" }}
                    >
                      {l} {sort.key === k ? (sort.dir === "asc" ? "▲" : "▼") : ""}
                    </th>
                  ))}
                  <th style={{ padding: "10px 12px" }}>Дії</th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map((u) => (
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
                          fontWeight: 600,
                          background: u.active ? "rgba(40,200,64,0.12)" : "rgba(255,95,87,0.12)",
                          color: u.active ? "#28C840" : "#FF5F57",
                        }}
                      >
                        {u.active ? "Активна" : "Неактивна"}
                      </span>
                    </td>
                    <td style={{ ...td, fontFamily: "monospace", color: "rgba(255,255,255,0.6)" }}>
                      {u.mac_id ? u.mac_id.slice(0, 8) + "…" : "—"}
                    </td>
                    <td style={td}>{u.version}</td>
                    <td style={td}>{fmtDate(u.created_at)}</td>
                    <td style={td}>{fmtDate(u.expires_at)}</td>
                    <td style={td}>
                      <button
                        data-testid={`user-open-${u.user_id}`}
                        onClick={() => setSelectedUser(u)}
                        className="ghost-btn"
                        style={{ padding: "5px 12px", fontSize: 12 }}
                      >
                        Відкрити
                      </button>
                    </td>
                  </tr>
                ))}
                {sortedUsers.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.4)" }}>
                      Користувачів не знайдено
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Manual key generation */}
        <section data-testid="admin-gen-key-block" className="glass" style={{ padding: 24, borderRadius: 20, marginBottom: 24 }}>
          <h3 style={{ margin: "0 0 12px", fontSize: 18, fontWeight: 600 }}>
            <KeyRound size={16} style={{ display: "inline", verticalAlign: -2, marginRight: 8 }} />
            Згенерувати ключ вручну
          </h3>
          <ManualKeyGen onCreated={refresh} />
        </section>

        {/* Atlas version */}
        <section data-testid="admin-version-block" className="glass" style={{ padding: 24, borderRadius: 20, marginBottom: 24 }}>
          <h3 style={{ margin: "0 0 12px", fontSize: 18, fontWeight: 600 }}>
            <Upload size={16} style={{ display: "inline", verticalAlign: -2, marginRight: 8 }} />
            Версія Atlas
          </h3>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginBottom: 12 }}>
            Поточна: <b>{version?.version || "—"}</b> · {version?.size_mb || 0} MB · оновлено {version?.released_at ? fmtDateTime(version.released_at) : "—"}
          </div>
          <input ref={fileRef} type="file" accept=".dmg,.zip" style={{ display: "none" }} />
          <VersionUpload fileRef={fileRef} onUploaded={refresh} />
        </section>

        {/* API logs */}
        <section data-testid="admin-logs-block" className="glass" style={{ padding: 24, borderRadius: 20 }}>
          <h3 style={{ margin: "0 0 12px", fontSize: 18, fontWeight: 600 }}>
            <Activity size={16} style={{ display: "inline", verticalAlign: -2, marginRight: 8 }} />
            API лог · /api/atlas/validate-key
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ color: "rgba(255,255,255,0.5)", textAlign: "left" }}>
                  <th style={td}>Час</th>
                  <th style={td}>Ключ</th>
                  <th style={td}>Mac ID</th>
                  <th style={td}>IP</th>
                  <th style={td}>Результат</th>
                </tr>
              </thead>
              <tbody>
                {apiLogs.map((l, i) => (
                  <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.04)", background: l.suspicious ? "rgba(255,95,87,0.06)" : "transparent" }}>
                    <td style={td}>{fmtDateTime(l.ts)}</td>
                    <td style={{ ...td, fontFamily: "monospace" }}>{l.key_prefix || "—"}</td>
                    <td style={{ ...td, fontFamily: "monospace" }}>{l.mac_id ? l.mac_id.slice(0, 8) + "…" : "—"}</td>
                    <td style={{ ...td, fontFamily: "monospace", color: "rgba(255,255,255,0.5)" }}>{l.ip}</td>
                    <td style={td}>
                      <span style={{ color: l.result === "ok" ? "#28C840" : "#FF5F57", fontWeight: 500 }}>{l.result}</span>
                      {l.suspicious && (
                        <span style={{ marginLeft: 8, padding: "2px 8px", borderRadius: 6, background: "rgba(255,95,87,0.15)", color: "#FF5F57", fontSize: 10, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                          ⚠ suspicious
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {apiLogs.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: 24, textAlign: "center", color: "rgba(255,255,255,0.4)" }}>
                      Поки що немає логів
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

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

const td = { padding: "10px 12px", whiteSpace: "nowrap" };

function StatCard({ icon, label, value, accent }) {
  return (
    <div className="glass" style={{ padding: 18, borderRadius: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, color: accent, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
        {icon}
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, marginTop: 8, letterSpacing: "-0.02em" }}>{value}</div>
    </div>
  );
}

function GrowthChart({ data }) {
  const max = Math.max(1, ...data.map((d) => d.users));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 140 }}>
      {data.map((d) => (
        <div key={d.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: "100%",
              height: `${(d.users / max) * 100}%`,
              background: "linear-gradient(180deg, #00E5FF, #007AFF)",
              borderRadius: "6px 6px 0 0",
              minHeight: 4,
              transition: "height 0.6s ease",
            }}
            title={`${d.users}`}
          />
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{d.month.slice(5)}</div>
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
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", zIndex: 100, display: "grid", placeItems: "center", padding: 24 }}
      data-testid="user-details-modal"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass"
        style={{ width: "min(560px, 100%)", maxHeight: "90vh", overflowY: "auto", padding: 28, borderRadius: 24 }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {user.avatar_url ? (
              <img src={user.avatar_url} alt="" style={{ width: 40, height: 40, borderRadius: "50%" }} />
            ) : (
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#007AFF,#9D4CDD)" }} />
            )}
            <div>
              <div style={{ fontWeight: 600 }}>{user.name || user.email}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{user.email}</div>
            </div>
          </div>
          <button onClick={onClose} className="ghost-btn" style={{ width: 36, height: 36, padding: 0, borderRadius: "50%", display: "grid", placeItems: "center" }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ display: "grid", gap: 8, fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 20 }}>
          <Row label="Ключ" value={user.key} mono />
          <Row label="Mac" value={user.mac_id ? `${user.mac_name || "Mac"} · ${user.mac_id.slice(0, 12)}…` : "—"} />
          <Row label="Версія" value={user.version} />
          <Row label="Статус" value={user.active ? "Активна" : "Неактивна"} />
          <Row label="Реєстрація" value={fmtDate(user.created_at)} />
          <Row label="Закінчення" value={fmtDate(user.expires_at)} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 8, marginBottom: 20 }}>
          <button data-testid="action-extend" disabled={busy} onClick={() => doAction("extend", { days: 30 })} className="ghost-btn">
            <Clock size={14} /> +30 днів
          </button>
          <button data-testid="action-cancel" disabled={busy} onClick={() => doAction("cancel")} className="ghost-btn">
            Скасувати
          </button>
          <button data-testid="action-regen" disabled={busy} onClick={() => doAction("regen_key")} className="ghost-btn">
            <RefreshCw size={14} /> Новий ключ
          </button>
          <button data-testid="action-reset-mac" disabled={busy} onClick={() => doAction("reset_mac")} className="ghost-btn">
            Скинути Mac
          </button>
          <button
            data-testid="action-block"
            disabled={busy}
            onClick={() => doAction(user.is_blocked ? "unblock" : "block")}
            className="ghost-btn"
            style={{ borderColor: user.is_blocked ? "rgba(40,200,64,0.4)" : "rgba(255,95,87,0.4)", color: user.is_blocked ? "#28C840" : "#FF5F57" }}
          >
            {user.is_blocked ? "Розблокувати" : "Заблокувати"}
          </button>
        </div>

        <div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>Нотатки</div>
          <textarea
            data-testid="user-notes-textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            style={{
              width: "100%",
              padding: 12,
              background: "rgba(0,0,0,0.4)",
              border: "1px solid rgba(255,255,255,0.08)",
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
            className="ghost-btn"
            style={{ marginTop: 8 }}
            disabled={busy}
          >
            Зберегти
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, mono }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
      <span style={{ color: "rgba(255,255,255,0.45)" }}>{label}</span>
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
      toast.success("Ключ створено");
      onCreated();
    } catch (e) {
      toast.error("Помилка");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input
          data-testid="gen-email-input"
          type="email"
          placeholder="email@user.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            flex: "1 1 240px",
            padding: "10px 12px",
            background: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 10,
            color: "#fff",
            fontSize: 13,
            outline: "none",
          }}
        />
        <select
          data-testid="gen-days-select"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          style={{
            padding: "10px 12px",
            background: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 10,
            color: "#fff",
            fontSize: 13,
            outline: "none",
          }}
        >
          {[30, 60, 90, 365].map((d) => (
            <option key={d} value={d}>{d} днів</option>
          ))}
        </select>
        <button data-testid="gen-submit-btn" disabled={busy || !email} onClick={submit} className="cta-btn">
          {busy ? <Loader2 size={14} className="spin" /> : null} Згенерувати
        </button>
      </div>
      {result && (
        <div
          data-testid="gen-result"
          style={{
            marginTop: 12,
            padding: 12,
            background: "rgba(0,229,255,0.06)",
            border: "1px solid rgba(0,229,255,0.2)",
            borderRadius: 10,
            fontFamily: "monospace",
            fontSize: 13,
          }}
        >
          {result.email} → <b>{result.key}</b> · до {fmtDate(result.expires_at)}
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
      toast.success("Версія оновлена");
      onUploaded();
      setVersion("");
      if (fileRef.current) fileRef.current.value = "";
    } catch {
      toast.error("Помилка завантаження");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
      <input
        data-testid="version-input"
        placeholder="1.0.0"
        value={version}
        onChange={(e) => setVersion(e.target.value)}
        style={{
          padding: "10px 12px",
          background: "rgba(0,0,0,0.4)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 10,
          color: "#fff",
          fontSize: 13,
          width: 140,
          outline: "none",
        }}
      />
      <button data-testid="version-pick-btn" onClick={() => fileRef.current?.click()} className="ghost-btn">
        Обрати файл
      </button>
      <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
        {fileRef.current?.files?.[0]?.name || "—"}
      </span>
      <button data-testid="version-upload-btn" onClick={submit} disabled={busy} className="cta-btn">
        {busy ? <Loader2 size={14} className="spin" /> : <Upload size={14} />} Завантажити
      </button>
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

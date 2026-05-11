"use client";

import { useState, useCallback } from "react";

interface Submission {
  id: number;
  booking_id: string;
  arrival_time: string;
  meal_plan: string;
  meal_guests: number | null;
  active_bicycle: boolean;
  active_sup: boolean;
  active_garden: boolean;
  active_excursions: boolean;
  active_mushrooms: boolean;
  need_baby_cot: boolean;
  hygiene_slippers: boolean;
  hygiene_toothbrush: boolean;
  hygiene_shampoo: boolean;
  hygiene_soap: boolean;
  comments: string | null;
  created_at: string;
}

const MEAL_LABELS: Record<string, string> = {
  none: "Без харчування",
  breakfast: "Сніданок",
  half: "Напівпансіон",
  full: "Повний пансіон",
};

const boolIcon = (v: boolean) => (v ? "✅" : "—");

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchSubmissions = useCallback(async (pwd: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/submissions", {
        headers: { "x-admin-password": pwd },
      });
      if (res.status === 401) {
        setError("Невірний пароль");
        setAuthenticated(false);
        return;
      }
      const data = await res.json();
      setSubmissions(data.submissions);
      setAuthenticated(true);
    } catch {
      setError("Помилка з'єднання");
    } finally {
      setLoading(false);
    }
  }, []);

  if (!authenticated) {
    return (
      <main className="container" style={{ maxWidth: 400, marginTop: "4rem" }}>
        <h1 style={{ marginBottom: "1rem" }}>🔒 Адмін</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchSubmissions(password);
          }}
        >
          <label htmlFor="admin-password" style={{ display: "block", marginBottom: 4 }}>
            Пароль
          </label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: 8,
              marginBottom: 12,
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
          />
          {error && <p style={{ color: "red", marginBottom: 8 }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 6,
              background: "#2563eb",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            {loading ? "Завантаження…" : "Увійти"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="container" style={{ maxWidth: 1200, marginTop: "2rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h1>Заявки гостей ({submissions.length})</h1>
        <button
          onClick={() => fetchSubmissions(password)}
          style={{
            padding: "8px 16px",
            borderRadius: 6,
            background: "#2563eb",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Оновити
        </button>
      </div>

      {submissions.length === 0 ? (
        <p style={{ textAlign: "center", color: "#94a3b8" }}>Заявок поки немає</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
                <th style={th}>#</th>
                <th style={th}>Бронювання</th>
                <th style={th}>Заїзд</th>
                <th style={th}>Харчування</th>
                <th style={th}>Гостей</th>
                <th style={th}>🚲</th>
                <th style={th}>🏄</th>
                <th style={th}>🌿</th>
                <th style={th}>🗺️</th>
                <th style={th}>🍄</th>
                <th style={th}>👶</th>
                <th style={th}>🩴</th>
                <th style={th}>🪥</th>
                <th style={th}>🧴</th>
                <th style={th}>🧼</th>
                <th style={th}>Коментар</th>
                <th style={th}>Дата</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr key={s.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={td}>{s.id}</td>
                  <td style={td}>{s.booking_id}</td>
                  <td style={td}>{s.arrival_time}</td>
                  <td style={td}>{MEAL_LABELS[s.meal_plan] ?? s.meal_plan}</td>
                  <td style={td}>{s.meal_guests ?? "—"}</td>
                  <td style={td}>{boolIcon(s.active_bicycle)}</td>
                  <td style={td}>{boolIcon(s.active_sup)}</td>
                  <td style={td}>{boolIcon(s.active_garden)}</td>
                  <td style={td}>{boolIcon(s.active_excursions)}</td>
                  <td style={td}>{boolIcon(s.active_mushrooms)}</td>
                  <td style={td}>{boolIcon(s.need_baby_cot)}</td>
                  <td style={td}>{boolIcon(s.hygiene_slippers)}</td>
                  <td style={td}>{boolIcon(s.hygiene_toothbrush)}</td>
                  <td style={td}>{boolIcon(s.hygiene_shampoo)}</td>
                  <td style={td}>{boolIcon(s.hygiene_soap)}</td>
                  <td
                    style={{
                      ...td,
                      maxWidth: 200,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {s.comments ?? "—"}
                  </td>
                  <td style={td}>{new Date(s.created_at).toLocaleString("uk-UA")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

const th: React.CSSProperties = { padding: "8px 6px", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "8px 6px" };

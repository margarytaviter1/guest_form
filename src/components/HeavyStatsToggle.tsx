"use client";

import { lazy, Suspense, useState } from "react";

// Lazy-loaded: JS bundle for HeavyStats is NOT loaded until the button is clicked
const HeavyStats = lazy(() => import("@/components/HeavyStats"));

export default function HeavyStatsToggle() {
  const [show, setShow] = useState(false);

  return (
    <div style={{ marginTop: "1.5rem" }}>
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        style={{
          width: "100%",
          padding: "0.75rem",
          background: show ? "#ef4444" : "#6366f1",
          color: "#fff",
          border: "none",
          borderRadius: 14,
          fontSize: "0.9rem",
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        {show ? "🔽 Сховати статистику" : "📊 Показати важку статистику (lazy-loaded)"}
      </button>

      {show && (
        <Suspense
          fallback={
            <div style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>
              ⏳ Завантаження важкого компонента…
            </div>
          }
        >
          <HeavyStats />
        </Suspense>
      )}
    </div>
  );
}

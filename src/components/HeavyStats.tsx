"use client";

import { useState, useMemo } from "react";

/**
 * A deliberately heavy component that simulates expensive rendering.
 * Used to demonstrate React.lazy() + Suspense performance benefits.
 */

function expensiveCalculation(n: number): number {
  // Fibonacci — intentionally slow for large n
  if (n <= 1) return n;
  return expensiveCalculation(n - 1) + expensiveCalculation(n - 2);
}

export default function HeavyStats() {
  const [iterations, setIterations] = useState(38);

  // This will block the main thread for ~1-3 seconds
  const result = useMemo(() => {
    console.time("HeavyStats render");
    const fib = expensiveCalculation(iterations);
    console.timeEnd("HeavyStats render");
    return fib;
  }, [iterations]);

  // Generate a large fake dataset
  const rows = useMemo(
    () =>
      Array.from({ length: 5000 }, (_, i) => ({
        id: i + 1,
        guest: `Guest #${i + 1}`,
        room: `${100 + (i % 50)}`,
        score: Math.round(Math.sin(i) * 50 + 50),
        status: i % 3 === 0 ? "✅ Checked in" : i % 3 === 1 ? "⏳ Pending" : "❌ Cancelled",
      })),
    [],
  );

  return (
    <div
      style={{
        padding: "1.5rem",
        background: "#fff",
        borderRadius: 16,
        border: "1px solid #e2e8f0",
        marginTop: "1rem",
      }}
    >
      <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>📊 Heavy Stats Panel</h2>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ fontSize: "0.85rem", color: "#475569" }}>
          Fibonacci complexity (higher = slower):{" "}
          <select
            value={iterations}
            onChange={(e) => setIterations(Number(e.target.value))}
            style={{ marginLeft: "0.5rem" }}
          >
            <option value={35}>35 (fast)</option>
            <option value={38}>38 (medium ~1s)</option>
            <option value={40}>40 (slow ~3s)</option>
            <option value={42}>42 (very slow ~8s)</option>
          </select>
        </label>
        <p style={{ fontSize: "0.82rem", color: "#94a3b8", marginTop: "0.25rem" }}>
          Result: <strong>{result.toLocaleString()}</strong>
        </p>
      </div>

      <div
        style={{
          maxHeight: 300,
          overflow: "auto",
          fontSize: "0.78rem",
          border: "1px solid #e2e8f0",
          borderRadius: 8,
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc", position: "sticky", top: 0 }}>
              <th style={{ padding: "6px 8px", textAlign: "left" }}>ID</th>
              <th style={{ padding: "6px 8px", textAlign: "left" }}>Guest</th>
              <th style={{ padding: "6px 8px", textAlign: "left" }}>Room</th>
              <th style={{ padding: "6px 8px", textAlign: "left" }}>Score</th>
              <th style={{ padding: "6px 8px", textAlign: "left" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} style={{ borderTop: "1px solid #f1f5f9" }}>
                <td style={{ padding: "4px 8px" }}>{row.id}</td>
                <td style={{ padding: "4px 8px" }}>{row.guest}</td>
                <td style={{ padding: "4px 8px" }}>{row.room}</td>
                <td style={{ padding: "4px 8px" }}>{row.score}</td>
                <td style={{ padding: "4px 8px" }}>{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

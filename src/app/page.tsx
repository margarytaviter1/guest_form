import { Suspense } from "react";
import GuestForm from "@/components/GuestForm";
import HeavyStatsToggle from "@/components/HeavyStatsToggle";

export default function Home() {
  return (
    <main className="container" id="main-content">
      <div className="page-header">
        <h1>Ваше перебування</h1>
        <p>Розкажіть нам про ваші побажання — це займе хвилину</p>
      </div>
      <Suspense
        fallback={
          <div style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>
            Завантаження…
          </div>
        }
      >
        <GuestForm />
      </Suspense>
      <HeavyStatsToggle />
    </main>
  );
}

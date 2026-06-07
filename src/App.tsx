// App.tsx — SPA principal de VinylTrack
// Conecta con Firebase Firestore a través de vinylService

import { useState, useMemo, useEffect } from "react";
import { Navbar }               from "./components/Navbar";
import { ToastProvider, showSuccess, showError } from "./components/Toast";
import { VinylCard }            from "./components/VinylCard";
import { VinylForm }            from "./components/VinylForm";
import type { VinylRecord }     from "./components/VinylCard";
import type { GenreFilterType } from "./components/GenreFilter";
import type { VinylFormData }   from "./components/VinylForm";
import {
  getVinyls,
  addVinyl,
  deleteVinyl,
} from "./services/vinylService";

// ── Componente principal ───────────────────────────────────────────────────────

export default function App() {
  const [records, setRecords]       = useState<VinylRecord[]>([]);
  const [search, setSearch]         = useState("");
  const [activeGenre, setActiveGenre] = useState<GenreFilterType>("All");
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  // ── Carga inicial desde Firestore ──────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getVinyls()
      .then((vinyls) => {
        if (cancelled) return;
        // Firestore devuelve Vinyl (id?: string); los docs siempre tienen id
        setRecords(vinyls as VinylRecord[]);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Error loading vinyls:", err);
        setError("Could not load the catalog. Check your connection.");
        showError("Could not connect to the database.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  // ── Filtrado local (búsqueda + género) ────────────────────────────────────
  const filtered = useMemo(() => {
    return records.filter((r) => {
      const matchSearch =
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.artist.toLowerCase().includes(search.toLowerCase());
      const matchGenre = activeGenre === "All" || r.genre === activeGenre;
      return matchSearch && matchGenre;
    });
  }, [records, search, activeGenre]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    // Optimistic UI: eliminamos de estado antes de esperar Firestore
    setRecords((prev) => prev.filter((r) => r.id !== id));
    try {
      await deleteVinyl(id);
      showSuccess("Vinyl removed from catalog.");
    } catch (err) {
      console.error("Error deleting vinyl:", err);
      showError("Could not delete the vinyl. Try again.");
      // En caso de fallo recargamos para restaurar estado
      getVinyls().then((v) => setRecords(v as VinylRecord[]));
    }
  };

  const handleAdd = async (data: VinylFormData): Promise<void> => {
    try {
      const newVinyl = await addVinyl(data);
      setRecords((prev) => [newVinyl as VinylRecord, ...prev]);
      showSuccess("Vinyl added successfully!");
    } catch (err) {
      console.error("Error adding vinyl:", err);
      showError("Could not save the vinyl. Try again.");
      throw err; // Para que VinylForm no haga reset si falló
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight:  "100vh",
        background: "#0D0D0D",
        color:      "#F0EDE8",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <ToastProvider />

      {/* ── NAVBAR ──────────────────────────────────────────────────────── */}
      <Navbar
        search={search}
        onSearchChange={setSearch}
        activeGenre={activeGenre}
        onGenreChange={setActiveGenre}
        filteredCount={loading ? null : filtered.length}
      />

      {/* ── MAIN ────────────────────────────────────────────────────────── */}
      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 24px 0" }}>

        {/* ── Catalog section ─────────────────────────────────────────── */}
        <section style={{ marginBottom: "64px" }}>
          {loading ? (
            <SkeletonGrid />
          ) : error ? (
            <ErrorState message={error} />
          ) : filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <div
              style={{
                display:             "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap:                 "20px",
              }}
              className="vinyl-grid"
            >
              {filtered.map((record) => (
                <VinylCard key={record.id} record={record} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </section>

        {/* ── Add Form section ────────────────────────────────────────── */}
        <VinylForm onAdd={handleAdd} />
      </main>

      <style>{`
        @media (max-width: 1024px) {
          .vinyl-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .vinyl-grid { grid-template-columns: 1fr !important; }
        }
        input[type=search]::-webkit-search-cancel-button { opacity: 0.4; }
        * { scrollbar-width: none; }
        *::-webkit-scrollbar { display: none; }
        *:hover { scrollbar-width: thin; scrollbar-color: rgba(245,166,35,0.3) transparent; }
      `}</style>
    </div>
  );
}

// ── Sub-componentes ────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div
      style={{
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "center",
        padding:        "80px 24px",
        gap:            "16px",
      }}
    >
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="38" stroke="rgba(245,166,35,0.2)" strokeWidth="2" />
        {[12, 18, 24, 30].map((r) => (
          <circle key={r} cx="40" cy="40" r={r} fill="none" stroke="rgba(245,166,35,0.08)" strokeWidth="1" />
        ))}
        <circle cx="40" cy="40" r="4" fill="rgba(245,166,35,0.3)" />
      </svg>
      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", color: "#A0A0A0", textAlign: "center" }}>
        No vinyls found.
      </p>
      <p style={{ fontSize: "14px", color: "#666", fontFamily: "'Inter', sans-serif" }}>
        Add your first one below.
      </p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div
      style={{
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "center",
        padding:        "80px 24px",
        gap:            "12px",
      }}
    >
      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", color: "#E05252", textAlign: "center" }}>
        Connection error
      </p>
      <p style={{ fontSize: "14px", color: "#A0A0A0", fontFamily: "'Inter', sans-serif" }}>
        {message}
      </p>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{ background: "#1A1A1A", borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="shimmer" style={{ width: "100%", aspectRatio: "1", background: "#242424" }} />
      <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <div className="shimmer" style={{ height: "16px", width: "75%", borderRadius: "4px", background: "#242424" }} />
        <div className="shimmer" style={{ height: "13px", width: "55%", borderRadius: "4px", background: "#242424" }} />
        <div style={{ display: "flex", gap: "6px" }}>
          <div className="shimmer" style={{ height: "20px", width: "50px", borderRadius: "99px", background: "#242424" }} />
          <div className="shimmer" style={{ height: "20px", width: "40px", borderRadius: "99px", background: "#242424" }} />
        </div>
      </div>
      <style>{`
        @keyframes shimmer { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
        .shimmer { animation: shimmer 1.4s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }} className="vinyl-grid">
      {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}

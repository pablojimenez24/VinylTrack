import { useState, useMemo } from "react";
import { Toaster, toast } from "sonner";
import { Disc3 } from "lucide-react";
import { VinylCard } from "./components/VinylCard";
import { VinylForm } from "./components/VinylForm";
import type { VinylRecord, Genre } from "./components/VinylCard";

/* MARKER-MAKE-KIT-INVOKED */

const INITIAL_RECORDS: VinylRecord[] = [
  {
    id: "1",
    title: "Kind of Blue",
    artist: "Miles Davis",
    genre: "Blues",
    year: 1960,
    coverUrl: "https://images.unsplash.com/photo-1515552726023-7125c8d07fb3?w=400&h=400&fit=crop&auto=format",
    condition: "Mint",
  },
  {
    id: "2",
    title: "What's Going On",
    artist: "Marvin Gaye",
    genre: "Soul",
    year: 1971,
    coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&auto=format",
    condition: "VG+",
  },
  {
    id: "3",
    title: "Rumours",
    artist: "Fleetwood Mac",
    genre: "Rock",
    year: 1977,
    coverUrl: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=400&h=400&fit=crop&auto=format",
    condition: "VG+",
  },
  {
    id: "4",
    title: "Thriller",
    artist: "Michael Jackson",
    genre: "R&B",
    year: 1982,
    coverUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&h=400&fit=crop&auto=format",
    condition: "VG",
  },
  {
    id: "5",
    title: "La Fania All Stars",
    artist: "Fania All Stars",
    genre: "Salsa",
    year: 1975,
    coverUrl: "https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=400&h=400&fit=crop&auto=format",
    condition: "Good",
  },
  {
    id: "6",
    title: "Led Zeppelin IV",
    artist: "Led Zeppelin",
    genre: "Rock",
    year: 1971,
    coverUrl: "https://images.unsplash.com/photo-1516981442399-a91139e20ff8?w=400&h=400&fit=crop&auto=format",
    condition: "Mint",
  },
];

type GenreFilter = "All" | Genre;
const GENRE_FILTERS: GenreFilter[] = ["All", "Rock", "Soul", "R&B", "Blues", "Salsa"];

export default function App() {
  const [records, setRecords] = useState<VinylRecord[]>(INITIAL_RECORDS);
  const [search, setSearch] = useState("");
  const [activeGenre, setActiveGenre] = useState<GenreFilter>("All");
  const [loading] = useState(false);

  const filtered = useMemo(() => {
    return records.filter((r) => {
      const matchSearch =
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.artist.toLowerCase().includes(search.toLowerCase());
      const matchGenre = activeGenre === "All" || r.genre === activeGenre;
      return matchSearch && matchGenre;
    });
  }, [records, search, activeGenre]);

  const handleDelete = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
    toast.success("Vinyl removed from catalog.");
  };

  const handleAdd = async (record: VinylRecord): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    setRecords((prev) => [record, ...prev]);
    toast.success("Vinyl added successfully!");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0D0D0D",
        color: "#F0EDE8",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1A1A1A",
            color: "#F0EDE8",
            border: "1px solid rgba(255,255,255,0.1)",
            fontFamily: "'Inter', sans-serif",
          },
        }}
      />

      {/* ── NAVBAR ─────────────────────────────────────────────── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(13,13,13,0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          {/* Top row: logo + search */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              padding: "16px 0 12px",
            }}
          >
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
              <Disc3 size={28} color="#F5A623" strokeWidth={1.5} />
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#F0EDE8",
                  letterSpacing: "-0.02em",
                }}
              >
                Vinyl<span style={{ color: "#F5A623" }}>Track</span>
              </span>
            </div>

            {/* Search */}
            <div style={{ flex: 1, maxWidth: "480px" }}>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title or artist..."
                style={{
                  width: "100%",
                  background: "#1A1A1A",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "4px",
                  color: "#F0EDE8",
                  padding: "9px 14px",
                  fontSize: "14px",
                  fontFamily: "'Inter', sans-serif",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* Genre filter pills */}
          <div style={{ display: "flex", gap: "8px", paddingBottom: "14px", flexWrap: "wrap" }}>
            {GENRE_FILTERS.map((g) => {
              const active = activeGenre === g;
              return (
                <button
                  key={g}
                  onClick={() => setActiveGenre(g)}
                  style={{
                    padding: "5px 14px",
                    borderRadius: "99px",
                    border: active ? "none" : "1px solid rgba(255,255,255,0.12)",
                    background: active ? "#F5A623" : "transparent",
                    color: active ? "#0D0D0D" : "#A0A0A0",
                    fontSize: "13px",
                    fontWeight: active ? 600 : 400,
                    fontFamily: "'Inter', sans-serif",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {g}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ───────────────────────────────────────── */}
      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 24px 0" }}>
        {/* ── SECTION 1: Catalog ─────────────────────────────── */}
        <section style={{ marginBottom: "64px" }}>
          {loading ? (
            <SkeletonGrid />
          ) : filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "20px",
              }}
              className="vinyl-grid"
            >
              {filtered.map((record) => (
                <VinylCard key={record.id} record={record} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </section>

        {/* ── SECTION 2: Add Form ─────────────────────────────── */}
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

function EmptyState() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 24px",
        gap: "16px",
      }}
    >
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="38" stroke="rgba(245,166,35,0.2)" strokeWidth="2" />
        {[12, 18, 24, 30].map((r) => (
          <circle key={r} cx="40" cy="40" r={r} fill="none" stroke="rgba(245,166,35,0.08)" strokeWidth="1" />
        ))}
        <circle cx="40" cy="40" r="4" fill="rgba(245,166,35,0.3)" />
      </svg>
      <p
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "20px",
          color: "#A0A0A0",
          textAlign: "center",
        }}
      >
        No vinyls found.
      </p>
      <p style={{ fontSize: "14px", color: "#666", fontFamily: "'Inter', sans-serif" }}>
        Add your first one below.
      </p>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div
      style={{
        background: "#1A1A1A",
        borderRadius: "8px",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div
        className="shimmer"
        style={{ width: "100%", aspectRatio: "1", background: "#242424" }}
      />
      <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <div className="shimmer" style={{ height: "16px", width: "75%", borderRadius: "4px", background: "#242424" }} />
        <div className="shimmer" style={{ height: "13px", width: "55%", borderRadius: "4px", background: "#242424" }} />
        <div style={{ display: "flex", gap: "6px" }}>
          <div className="shimmer" style={{ height: "20px", width: "50px", borderRadius: "99px", background: "#242424" }} />
          <div className="shimmer" style={{ height: "20px", width: "40px", borderRadius: "99px", background: "#242424" }} />
        </div>
      </div>
      <style>{`
        @keyframes shimmer {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }
        .shimmer { animation: shimmer 1.4s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}
      className="vinyl-grid"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

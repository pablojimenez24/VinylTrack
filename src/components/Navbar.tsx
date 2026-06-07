import { Disc3 } from "lucide-react";
import { GenreFilter, type GenreFilterType } from "./GenreFilter";

interface Props {
  search: string;
  onSearchChange: (val: string) => void;
  activeGenre: GenreFilterType;
  onGenreChange: (val: GenreFilterType) => void;
  filteredCount: number | null; // null if loading
}

export function Navbar({ search, onSearchChange, activeGenre, onGenreChange, filteredCount }: Props) {
  return (
    <header
      style={{
        position:      "sticky",
        top:           0,
        zIndex:        50,
        background:    "rgba(13,13,13,0.95)",
        backdropFilter:"blur(12px)",
        borderBottom:  "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
        {/* Top row: logo + search */}
        <div
          style={{
            display:     "flex",
            alignItems:  "center",
            gap:         "24px",
            padding:     "16px 0 12px",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
            <Disc3 size={28} color="#F5A623" strokeWidth={1.5} />
            <span
              style={{
                fontFamily:    "'Playfair Display', serif",
                fontSize:      "22px",
                fontWeight:    700,
                color:         "#F0EDE8",
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
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by title or artist..."
              style={{
                width:        "100%",
                background:   "#1A1A1A",
                border:       "1px solid rgba(255,255,255,0.1)",
                borderRadius: "4px",
                color:        "#F0EDE8",
                padding:      "9px 14px",
                fontSize:     "14px",
                fontFamily:   "'Inter', sans-serif",
                outline:      "none",
              }}
            />
          </div>

          {/* Record count badge */}
          {filteredCount !== null && (
            <span
              style={{
                fontSize:     "12px",
                color:        "#A0A0A0",
                fontFamily:   "'Inter', sans-serif",
                whiteSpace:   "nowrap",
              }}
            >
              {filteredCount} {filteredCount === 1 ? "record" : "records"}
            </span>
          )}
        </div>

        {/* Genre filter pills */}
        <GenreFilter activeGenre={activeGenre} onGenreChange={onGenreChange} />
      </div>
    </header>
  );
}

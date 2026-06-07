import type { Genre } from "../types/vinyl";

export type GenreFilterType = "All" | Genre;
const GENRE_FILTERS: GenreFilterType[] = ["All", "Rock", "Soul", "R&B", "Blues", "Salsa"];

interface Props {
  activeGenre: GenreFilterType;
  onGenreChange: (genre: GenreFilterType) => void;
}

export function GenreFilter({ activeGenre, onGenreChange }: Props) {
  return (
    <div style={{ display: "flex", gap: "8px", paddingBottom: "14px", flexWrap: "wrap" }}>
      {GENRE_FILTERS.map((g) => {
        const active = activeGenre === g;
        return (
          <button
            key={g}
            onClick={() => onGenreChange(g)}
            style={{
              padding:      "5px 14px",
              borderRadius: "99px",
              border:       active ? "none" : "1px solid rgba(255,255,255,0.12)",
              background:   active ? "#F5A623" : "transparent",
              color:        active ? "#0D0D0D" : "#A0A0A0",
              fontSize:     "13px",
              fontWeight:   active ? 600 : 400,
              fontFamily:   "'Inter', sans-serif",
              cursor:       "pointer",
              transition:   "all 0.15s",
            }}
          >
            {g}
          </button>
        );
      })}
    </div>
  );
}

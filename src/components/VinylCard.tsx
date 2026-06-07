// VinylCard.tsx — adaptado de Figma Make
// Importa tipos desde src/types/vinyl.ts (fuente de verdad del modelo)

import { useState } from "react";
import { Trash2, Check } from "lucide-react";
import type { Vinyl, Genre, Condition } from "../types/vinyl";

// Re-export para uso en otros componentes (VinylForm, App)
export type { Genre, Condition };

// VinylRecord = Vinyl con id requerido (los docs de Firestore siempre tienen id)
export interface VinylRecord extends Omit<Vinyl, 'id'> {
  id: string;
}

const GENRE_COLORS: Record<Genre, string> = {
  Rock:  "#E05252",
  Soul:  "#9B59B6",
  "R&B": "#3498DB",
  Blues: "#1ABC9C",
  Salsa: "#F39C12",
};

const CONDITION_STYLES: Record<Condition, { bg: string; text: string }> = {
  Mint:  { bg: "rgba(76,175,130,0.2)",  text: "#4CAF82" },
  "VG+": { bg: "rgba(245,166,35,0.2)",  text: "#F5A623" },
  VG:    { bg: "rgba(160,160,160,0.2)", text: "#A0A0A0" },
  Good:  { bg: "rgba(224,82,82,0.2)",   text: "#E05252" },
};

interface Props {
  record: VinylRecord;
  onDelete?: (id: string) => void;
  isPreview?: boolean;
}

export function VinylCard({ record, onDelete, isPreview = false }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const genreColor    = GENRE_COLORS[record.genre];
  const conditionStyle = CONDITION_STYLES[record.condition];

  const handleDeleteClick = () => {
    if (confirmDelete) {
      onDelete?.(record.id);
    } else {
      setConfirmDelete(true);
    }
  };

  return (
    <div
      className="group relative flex flex-col overflow-hidden transition-transform duration-200 hover:-translate-y-0.5"
      style={{
        background:   "#1A1A1A",
        borderRadius: "8px",
        border:       "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Album cover */}
      <div className="relative w-full aspect-square overflow-hidden" style={{ background: "#0D0D0D" }}>
        {record.coverUrl ? (
          <img
            src={record.coverUrl}
            alt={`${record.title} cover`}
            className="w-full h-full object-cover"
          />
        ) : (
          <GrooveTexture />
        )}
        {/* vinyl groove overlay */}
        {record.coverUrl && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.15) 100%)",
            }}
          />
        )}
        {/* Year badge */}
        <span
          className="absolute top-2 left-2 px-2 py-0.5 text-xs"
          style={{
            background:    "rgba(13,13,13,0.85)",
            color:         "#F5A623",
            borderRadius:  "4px",
            fontFamily:    "'JetBrains Mono', monospace",
            fontWeight:    500,
            backdropFilter:"blur(4px)",
          }}
        >
          {record.year}
        </span>
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-2 p-3 flex-1">
        <div>
          <p
            className="truncate leading-tight"
            style={{
              fontSize:   "16px",
              fontWeight: 700,
              color:      "#F0EDE8",
              fontFamily: "'Playfair Display', serif",
            }}
          >
            {record.title || "Untitled"}
          </p>
          <p
            className="truncate mt-0.5"
            style={{ fontSize: "14px", color: "#A0A0A0", fontFamily: "'Inter', sans-serif" }}
          >
            {record.artist || "Unknown Artist"}
          </p>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Genre badge */}
          <span
            className="px-2 py-0.5 text-xs font-medium"
            style={{
              background:   `${genreColor}22`,
              color:        genreColor,
              borderRadius: "99px",
              fontFamily:   "'Inter', sans-serif",
              fontSize:     "11px",
            }}
          >
            {record.genre}
          </span>
          {/* Condition badge */}
          <span
            className="px-2 py-0.5 text-xs font-medium"
            style={{
              background:   conditionStyle.bg,
              color:        conditionStyle.text,
              borderRadius: "99px",
              fontFamily:   "'Inter', sans-serif",
              fontSize:     "11px",
            }}
          >
            {record.condition}
          </span>
        </div>
      </div>

      {/* Delete button — hidden until hover, stays visible in confirm state */}
      {!isPreview && onDelete && (
        <button
          onClick={handleDeleteClick}
          onBlur={() => setTimeout(() => setConfirmDelete(false), 200)}
          className={`absolute bottom-3 right-3 flex items-center gap-1 transition-all duration-200 ${
            confirmDelete ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
          style={{
            background:   confirmDelete ? "rgba(224,82,82,0.15)" : "rgba(30,30,30,0.9)",
            color:        confirmDelete ? "#E05252" : "#A0A0A0",
            border:       confirmDelete ? "1px solid rgba(224,82,82,0.4)" : "1px solid rgba(255,255,255,0.1)",
            borderRadius: "4px",
            padding:      confirmDelete ? "4px 8px" : "5px 6px",
            fontSize:     "11px",
            fontFamily:   "'Inter', sans-serif",
            cursor:       "pointer",
          }}
        >
          {confirmDelete ? (
            <>
              <Check size={11} />
              <span>Confirm?</span>
            </>
          ) : (
            <Trash2 size={13} />
          )}
        </button>
      )}
    </div>
  );
}

function GrooveTexture() {
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: "#111" }}
    >
      <svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#111" />
        {[20, 30, 40, 50, 60, 70, 80, 90].map((r) => (
          <circle
            key={r}
            cx="100" cy="100" r={r}
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1"
          />
        ))}
        <circle cx="100" cy="100" r="8" fill="#1A1A1A" />
        <circle cx="100" cy="100" r="3" fill="#F5A623" opacity="0.5" />
        <text
          x="100" y="145"
          textAnchor="middle"
          fill="rgba(245,166,35,0.3)"
          fontSize="9"
          fontFamily="'JetBrains Mono', monospace"
        >
          NO COVER
        </text>
      </svg>
    </div>
  );
}

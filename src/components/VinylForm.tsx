// VinylForm.tsx — adaptado de Figma Make
// Soporta modo Add (sin initialData) y modo Edit (con initialData)

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { VinylCard } from "./VinylCard";
import type { Genre, Condition, Vinyl } from "../types/vinyl";
import type { VinylRecord } from "./VinylCard";
import { Loader2 } from "lucide-react";
import { updateVinyl } from "../services/vinylService";

interface FormValues {
  title:     string;
  artist:    string;
  genre:     Genre;
  year:      number;
  coverUrl:  string;
  condition: Condition;
}

// Los datos que el form envía hacia arriba (sin id ni createdAt — Firebase los gestiona)
export type VinylFormData = Omit<FormValues, 'year'> & { year: number };

interface Props {
  onAdd:        (data: VinylFormData) => Promise<void>;
  initialData?: Vinyl;        // si se pasa, el form entra en modo edición
  onSuccess?:   () => void;   // llamado al completar un update
  onCancel?:    () => void;   // llamado al cancelar la edición
}

const GENRES:     Genre[]     = ["Rock", "Soul", "R&B", "Blues", "Salsa"];
const CONDITIONS: Condition[] = ["Mint", "VG+", "VG", "Good"];

const inputStyle: React.CSSProperties = {
  width:        "100%",
  background:   "#242424",
  border:       "1px solid rgba(255,255,255,0.1)",
  borderRadius: "4px",
  color:        "#F0EDE8",
  padding:      "10px 12px",
  fontSize:     "14px",
  fontFamily:   "'Inter', sans-serif",
  outline:      "none",
  transition:   "border-color 0.15s",
};

const errorInputStyle: React.CSSProperties = {
  ...inputStyle,
  borderColor: "#E05252",
};

const labelStyle: React.CSSProperties = {
  display:      "block",
  fontSize:     "13px",
  fontWeight:   500,
  color:        "#A0A0A0",
  marginBottom: "6px",
  fontFamily:   "'Inter', sans-serif",
};

export function VinylForm({ onAdd, initialData, onSuccess, onCancel }: Props) {
  const [saving, setSaving] = useState(false);
  const isEditMode = Boolean(initialData);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { genre: "Rock", condition: "VG+" },
  });

  // Cuando initialData cambia (usuario pulsa editar otra card), rellenamos el form
  useEffect(() => {
    if (initialData) {
      reset({
        title:     initialData.title,
        artist:    initialData.artist,
        genre:     initialData.genre,
        year:      initialData.year,
        coverUrl:  initialData.coverUrl ?? "",
        condition: initialData.condition,
      });
    } else {
      reset({ genre: "Rock", condition: "VG+" });
    }
  }, [initialData, reset]);

  const watchedValues = watch();

  // Preview: construimos un VinylRecord temporal con id ficticio
  const previewRecord: VinylRecord = {
    id:        "preview",
    title:     watchedValues.title     || "",
    artist:    watchedValues.artist    || "",
    genre:     watchedValues.genre     || "Rock",
    year:      Number(watchedValues.year) || new Date().getFullYear(),
    coverUrl:  watchedValues.coverUrl  || "",
    condition: watchedValues.condition || "VG+",
  };

  const onSubmit = async (data: FormValues) => {
    setSaving(true);
    try {
      if (isEditMode && initialData?.id) {
        // Modo edición: llama a updateVinyl y luego avisa al padre
        await updateVinyl(initialData.id, { ...data, year: Number(data.year) });
        onSuccess?.();
      } else {
        // Modo creación: llama a onAdd (manejado en App)
        await onAdd({ ...data, year: Number(data.year) });
        reset({ genre: "Rock", condition: "VG+" });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <section style={{ padding: "0 0 64px" }}>
      {/* Amber divider + heading */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ height: "1px", background: isEditMode ? "#3498DB" : "#F5A623", marginBottom: "24px", opacity: 0.6 }} />
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize:   "28px",
            fontWeight: 700,
            color:      "#F0EDE8",
          }}
        >
          {isEditMode ? "Edit Vinyl" : "Add New Vinyl"}
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div
          style={{
            display:             "grid",
            gridTemplateColumns: "1fr 320px",
            gap:                 "48px",
            alignItems:          "start",
          }}
          className="vinyl-form-grid"
        >
          {/* LEFT — fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Title */}
            <div>
              <label style={labelStyle}>
                Title <span style={{ color: "#E05252" }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Kind of Blue"
                style={errors.title ? errorInputStyle : inputStyle}
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                <p style={{ color: "#E05252", fontSize: "12px", marginTop: "4px", fontFamily: "'Inter', sans-serif" }}>
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Artist */}
            <div>
              <label style={labelStyle}>
                Artist <span style={{ color: "#E05252" }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Miles Davis"
                style={errors.artist ? errorInputStyle : inputStyle}
                {...register("artist", { required: "Artist is required" })}
              />
              {errors.artist && (
                <p style={{ color: "#E05252", fontSize: "12px", marginTop: "4px", fontFamily: "'Inter', sans-serif" }}>
                  {errors.artist.message}
                </p>
              )}
            </div>

            {/* Genre */}
            <div>
              <label style={labelStyle}>
                Genre <span style={{ color: "#E05252" }}>*</span>
              </label>
              <select
                style={{ ...inputStyle, cursor: "pointer" }}
                {...register("genre", { required: "Genre is required" })}
              >
                {GENRES.map((g) => (
                  <option key={g} value={g} style={{ background: "#242424" }}>{g}</option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div>
              <label style={labelStyle}>
                Year <span style={{ color: "#E05252" }}>*</span>
              </label>
              <input
                type="number"
                placeholder="1965"
                style={errors.year ? errorInputStyle : inputStyle}
                {...register("year", {
                  required: "Year is required",
                  min: { value: 1960, message: "Year must be between 1960 and 1989" },
                  max: { value: 1989, message: "Year must be between 1960 and 1989" },
                })}
              />
              <p style={{ color: "#A0A0A0", fontSize: "11px", marginTop: "4px", fontFamily: "'Inter', sans-serif" }}>
                Between 1960 and 1989
              </p>
              {errors.year && (
                <p style={{ color: "#E05252", fontSize: "12px", marginTop: "2px", fontFamily: "'Inter', sans-serif" }}>
                  {errors.year.message}
                </p>
              )}
            </div>

            {/* Cover URL */}
            <div>
              <label style={labelStyle}>Cover URL</label>
              <input
                type="text"
                placeholder="https://..."
                style={inputStyle}
                {...register("coverUrl")}
              />
            </div>

            {/* Condition */}
            <div>
              <label style={labelStyle}>
                Condition <span style={{ color: "#E05252" }}>*</span>
              </label>
              <select
                style={{ ...inputStyle, cursor: "pointer" }}
                {...register("condition", { required: "Condition is required" })}
              >
                {CONDITIONS.map((c) => (
                  <option key={c} value={c} style={{ background: "#242424" }}>{c}</option>
                ))}
              </select>
            </div>

            {/* Submit + Cancel (modo edición) */}
            <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  flex:            1,
                  background:      saving ? "rgba(245,166,35,0.5)" : "#F5A623",
                  color:           "#0D0D0D",
                  border:          "none",
                  borderRadius:    "4px",
                  padding:         "12px",
                  fontSize:        "15px",
                  fontWeight:      600,
                  fontFamily:      "'Inter', sans-serif",
                  cursor:          saving ? "not-allowed" : "pointer",
                  display:         "flex",
                  alignItems:      "center",
                  justifyContent:  "center",
                  gap:             "8px",
                  transition:      "background 0.15s",
                }}
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : isEditMode ? (
                  "Update Vinyl"
                ) : (
                  "Add to Catalog"
                )}
              </button>

              {/* Cancel — solo visible en modo edición */}
              {isEditMode && (
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={saving}
                  style={{
                    flex:          "0 0 auto",
                    background:    "transparent",
                    color:         "#F5A623",
                    border:        "1px solid rgba(245,166,35,0.6)",
                    borderRadius:  "4px",
                    padding:       "12px 20px",
                    fontSize:      "15px",
                    fontWeight:    500,
                    fontFamily:    "'Inter', sans-serif",
                    cursor:        saving ? "not-allowed" : "pointer",
                    transition:    "border-color 0.15s, color 0.15s",
                    whiteSpace:    "nowrap",
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* RIGHT — live preview */}
          <div>
            <p
              style={{
                fontSize:      "11px",
                letterSpacing: "0.1em",
                color:         "#A0A0A0",
                textTransform: "uppercase",
                fontFamily:    "'Inter', sans-serif",
                marginBottom:  "12px",
                fontWeight:    600,
              }}
            >
              Preview
            </p>
            <div style={{ maxWidth: "240px" }}>
              <VinylCard record={previewRecord} isPreview />
            </div>
          </div>
        </div>
      </form>

      <style>{`
        @media (max-width: 768px) {
          .vinyl-form-grid { grid-template-columns: 1fr !important; }
        }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { opacity: 0.3; }
        select option { background: #1A1A1A; color: #F0EDE8; }
      `}</style>
    </section>
  );
}

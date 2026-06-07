import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { VinylCard } from "./VinylCard";
import type { VinylRecord, Genre, Condition } from "./VinylCard";
import { Loader2 } from "lucide-react";

interface FormValues {
  title: string;
  artist: string;
  genre: Genre;
  year: number;
  coverUrl: string;
  condition: Condition;
}

interface Props {
  onAdd: (record: VinylRecord) => Promise<void>;
}

const GENRES: Genre[] = ["Rock", "Soul", "R&B", "Blues", "Salsa"];
const CONDITIONS: Condition[] = ["Mint", "VG+", "VG", "Good"];

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#242424",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "4px",
  color: "#F0EDE8",
  padding: "10px 12px",
  fontSize: "14px",
  fontFamily: "'Inter', sans-serif",
  outline: "none",
  transition: "border-color 0.15s",
};

const errorInputStyle: React.CSSProperties = {
  ...inputStyle,
  borderColor: "#E05252",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "13px",
  fontWeight: 500,
  color: "#A0A0A0",
  marginBottom: "6px",
  fontFamily: "'Inter', sans-serif",
};

export function VinylForm({ onAdd }: Props) {
  const [saving, setSaving] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { genre: "Rock", condition: "VG+" },
  });

  const watchedValues = watch();

  const previewRecord: VinylRecord = {
    id: "preview",
    title: watchedValues.title || "",
    artist: watchedValues.artist || "",
    genre: watchedValues.genre || "Rock",
    year: Number(watchedValues.year) || new Date().getFullYear(),
    coverUrl: watchedValues.coverUrl || "",
    condition: watchedValues.condition || "VG+",
  };

  const onSubmit = async (data: FormValues) => {
    setSaving(true);
    const record: VinylRecord = {
      id: crypto.randomUUID(),
      ...data,
      year: Number(data.year),
    };
    await onAdd(record);
    reset({ genre: "Rock", condition: "VG+" });
    setSaving(false);
  };

  return (
    <section style={{ padding: "0 0 64px" }}>
      {/* Amber divider + heading */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ height: "1px", background: "#F5A623", marginBottom: "24px", opacity: 0.6 }} />
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "28px",
            fontWeight: 700,
            color: "#F0EDE8",
          }}
        >
          Add New Vinyl
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 320px",
            gap: "48px",
            alignItems: "start",
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
                  <option key={g} value={g} style={{ background: "#242424" }}>
                    {g}
                  </option>
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
                  <option key={c} value={c} style={{ background: "#242424" }}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={saving}
              style={{
                width: "100%",
                background: saving ? "rgba(245,166,35,0.5)" : "#F5A623",
                color: "#0D0D0D",
                border: "none",
                borderRadius: "4px",
                padding: "12px",
                fontSize: "15px",
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                cursor: saving ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "background 0.15s",
                marginTop: "4px",
              }}
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                "Add to Catalog"
              )}
            </button>
          </div>

          {/* RIGHT — live preview */}
          <div>
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "0.1em",
                color: "#A0A0A0",
                textTransform: "uppercase",
                fontFamily: "'Inter', sans-serif",
                marginBottom: "12px",
                fontWeight: 600,
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
          .vinyl-form-grid {
            grid-template-columns: 1fr !important;
          }
        }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
          opacity: 0.3;
        }
        select option {
          background: #1A1A1A;
          color: #F0EDE8;
        }
      `}</style>
    </section>
  );
}

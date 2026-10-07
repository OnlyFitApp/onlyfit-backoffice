import { ArrowRight, BadgeCheck, ImagePlus, Trash2 } from "lucide-react";
import { ChangeEvent, MouseEvent, useState } from "react";
import {
  marketStoreMediaErrorMessage,
  uploadMarketStoreHero,
} from "../lib/marketSettings";

export const heroFocusPattern = /^(100|[1-9]?[0-9])% (100|[1-9]?[0-9])%$/;
export const tileBgPattern = /^#[0-9A-Fa-f]{6}$/;

const defaultFocus = { x: 50, y: 25 };
const minWidth = 1080;
const minHeight = 1350;

type HeroValue = {
  cover_image_url?: string | null;
  hero_focus?: string | null;
  tile_bg?: string | null;
};

type Props = {
  value: HeroValue;
  name: string;
  category: string | null | undefined;
  tagline: string | null | undefined;
  logoUrl: string | null | undefined;
  onChange: (patch: HeroValue) => void;
};

function parseFocus(focus: string | null | undefined) {
  const match = focus?.match(heroFocusPattern);
  if (!match) return defaultFocus;
  return { x: Number(match[1]), y: Number(match[2]) };
}

function readImageSize(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
      URL.revokeObjectURL(url);
    };
    image.onerror = () => {
      reject(new Error("staff.invalid_market_store_media"));
      URL.revokeObjectURL(url);
    };
    image.src = url;
  });
}

/**
 * Editor do hero da loja em destaque: a prévia reproduz o hero do app
 * (foto, scrims, texto e tile do logo) e um clique na foto define o ponto
 * focal. O logo aparece só no tile, como no Mercado.
 */
export function MarketStoreHeroEditor({
  value,
  name,
  category,
  tagline,
  logoUrl,
  onChange,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState<{ tone: "danger" | "warning"; text: string } | null>(null);
  const focus = parseFocus(value.hero_focus);
  const cover = value.cover_image_url ?? "";
  const tileBg = value.tile_bg && tileBgPattern.test(value.tile_bg) ? value.tile_bg : "#FFFFFF";
  const eyebrow = ["Loja oficial", category?.trim()].filter(Boolean).join(" · ");

  const setFocus = (x: number, y: number) =>
    onChange({ hero_focus: `${Math.round(x)}% ${Math.round(y)}%` });

  const pickFocus = (event: MouseEvent<HTMLButtonElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    setFocus(
      Math.min(100, Math.max(0, ((event.clientX - box.left) / box.width) * 100)),
      Math.min(100, Math.max(0, ((event.clientY - box.top) / box.height) * 100)),
    );
  };

  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setNotice(null);
    setUploading(true);
    try {
      const size = await readImageSize(file);
      const url = await uploadMarketStoreHero(file);
      onChange({ cover_image_url: url, hero_focus: value.hero_focus ?? "50% 25%" });
      if (size.width < minWidth || size.height < minHeight) {
        setNotice({
          tone: "warning",
          text: `Foto enviada com ${size.width} × ${size.height} px. O ideal é a partir de ${minWidth} × ${minHeight} px para ficar nítida.`,
        });
      }
    } catch (error) {
      setNotice({ tone: "danger", text: marketStoreMediaErrorMessage(error) });
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="hero-editor" aria-label="Hero da loja no Mercado">
      <div className="hero-editor-preview">
        <div className="hero-phone">
          <button
            type="button"
            className="hero-phone-photo"
            onClick={pickFocus}
            aria-label="Definir ponto focal da foto"
            disabled={!cover}
          >
            {cover ? (
              <img
                src={cover}
                alt=""
                style={{ objectPosition: `${focus.x}% ${focus.y}%` }}
              />
            ) : (
              <span className="hero-phone-empty">
                <ImagePlus size={22} aria-hidden="true" /> Foto de campanha
              </span>
            )}
            <span className="hero-phone-vignette" aria-hidden="true" />
            {cover && (
              <span
                className="hero-phone-focus"
                style={{ left: `${focus.x}%`, top: `${focus.y}%` }}
                aria-hidden="true"
              />
            )}
          </button>
          <div className="hero-phone-scrim" aria-hidden="true" />
          <div className="hero-phone-copy" aria-hidden="true">
            <div className="hero-phone-progress">
              <span className="on" />
              <span />
              <span />
            </div>
            <span className="hero-phone-eyebrow">
              <BadgeCheck size={10} /> {eyebrow.toUpperCase()}
            </span>
            <strong>{name || "Nome da loja"}</strong>
            {tagline?.trim() && <p>{tagline}</p>}
            <span className="hero-phone-cta">
              Entrar na loja <ArrowRight size={10} />
            </span>
          </div>
          <div className="hero-phone-tiles" aria-hidden="true">
            <span className="hero-phone-tile active" style={{ background: tileBg }}>
              {logoUrl ? <img src={logoUrl} alt="" /> : <b>{name.charAt(0) || "?"}</b>}
            </span>
            <span className="hero-phone-tile ghost" />
            <span className="hero-phone-tile ghost" />
          </div>
        </div>
      </div>

      <div className="hero-editor-controls">
        <div className="hero-editor-upload">
          <label className={`button primary ${uploading ? "disabled" : ""}`}>
            <ImagePlus size={16} aria-hidden="true" />
            {uploading ? "Enviando..." : cover ? "Trocar foto" : "Enviar foto"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={upload}
              disabled={uploading}
              hidden
            />
          </label>
          {cover && (
            <button
              type="button"
              className="button ghost"
              onClick={() => onChange({ cover_image_url: null })}
            >
              <Trash2 size={15} aria-hidden="true" /> Remover
            </button>
          )}
        </div>
        {notice && (
          <div className={`inline-alert ${notice.tone}`} role="status">
            {notice.text}
          </div>
        )}
        <p className="hero-editor-rules">
          Foto de campanha ou lifestyle da marca, vertical 4:5, a partir de
          1080 × 1350 px. Sem selo, preço, texto ou logo: o logo aparece só
          no tile.
        </p>
        <label className="market-field">
          <span>URL HTTPS da foto</span>
          <input
            type="url"
            value={cover}
            onChange={(event) =>
              onChange({ cover_image_url: event.target.value.trim() || null })
            }
            placeholder="https://..."
          />
        </label>
        <fieldset className="hero-editor-focus" disabled={!cover}>
          <legend>Ponto focal · clique na foto ou ajuste</legend>
          <label className="market-field">
            <span>Horizontal {focus.x}%</span>
            <input
              type="range"
              min="0"
              max="100"
              value={focus.x}
              onChange={(event) => setFocus(Number(event.target.value), focus.y)}
            />
          </label>
          <label className="market-field">
            <span>Vertical {focus.y}%</span>
            <input
              type="range"
              min="0"
              max="100"
              value={focus.y}
              onChange={(event) => setFocus(focus.x, Number(event.target.value))}
            />
          </label>
        </fieldset>
        <label className="market-field">
          <span>Fundo do tile do logo</span>
          <div className="market-color-field">
            <input
              type="color"
              aria-label="Escolher fundo do tile do logo"
              value={tileBg.toLowerCase()}
              onChange={(event) => onChange({ tile_bg: event.target.value.toUpperCase() })}
            />
            <input
              value={value.tile_bg ?? ""}
              onChange={(event) => onChange({ tile_bg: event.target.value.trim() || null })}
              placeholder="#FFFFFF"
            />
          </div>
        </label>
      </div>
    </section>
  );
}

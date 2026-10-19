import { Download, MapPin, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import type { AmbassadorAssignment } from "../lib/ambassadorNetwork";
import {
  buildRankingMembers,
  buildRankingPageHtml,
  newRankingSlug,
} from "../lib/ambassadorRankingPage";

export function AmbassadorRankingPanel({
  assignments,
}: {
  assignments: AmbassadorAssignment[];
}) {
  const members = useMemo(() => buildRankingMembers(assignments), [assignments]);
  const [title, setTitle] = useState("Ranking de embaixadores");
  const [slug, setSlug] = useState(() => newRankingSlug());
  const [excluded, setExcluded] = useState<Set<string>>(() => new Set());
  const [generating, setGenerating] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const included = members.filter((member) => !excluded.has(member.key));

  const toggle = (key: string) => {
    setExcluded((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const download = async () => {
    setGenerating(true);
    setDownloadError(null);
    try {
      const html = await buildRankingPageHtml({
        slug,
        title: title.trim() || "Ranking de embaixadores",
        generatedAt: new Date().toISOString(),
        members: included,
      });
      const url = URL.createObjectURL(
        new Blob([html], { type: "text/html;charset=utf-8" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = `ranking-${slug}.html`;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 0);
    } catch {
      setDownloadError("Não foi possível gerar a página. Tente novamente.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="ambassador-list-panel ambassador-ranking-panel">
      <div className="ambassador-section-head">
        <div>
          <h2>Página do ranking</h2>
          <p>Escolha os participantes. A publicação do arquivo é feita separadamente.</p>
        </div>
      </div>

      <label className="ambassador-field">
        Título da página
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={80}
        />
      </label>

      <fieldset className="ambassador-ranking-members">
        <legend>
          Participantes ({included.length} de {members.length})
        </legend>
        {members.map((member) => (
          <label key={member.key} className="ambassador-ranking-choice">
            <input
              type="checkbox"
              checked={!excluded.has(member.key)}
              onChange={() => toggle(member.key)}
            />
            <span className="ambassador-ranking-copy">
              <strong>{member.name}</strong>
              {member.affinity ? <span>{member.affinity}</span> : null}
              {member.place ? <small><MapPin size={12} aria-hidden="true" />{member.place}</small> : null}
            </span>
          </label>
        ))}
      </fieldset>

      <details className="ambassador-ranking-publish">
        <summary>Opções de publicação</summary>
        <div>
          <code>/{slug}/index.html</code>
          <button
            className="button secondary"
            type="button"
            onClick={() => setSlug(newRankingSlug())}
            title="Gera outro caminho sugerido; páginas já publicadas continuam acessíveis"
          >
            <RefreshCw size={14} /> Novo caminho
          </button>
        </div>
      </details>

      {downloadError ? (
        <div className="inline-alert danger" role="alert">
          {downloadError}
        </div>
      ) : null}

      <button
        className="button primary ambassador-ranking-download"
        type="button"
        onClick={download}
        disabled={included.length === 0 || generating}
      >
        <Download size={16} />
        {generating ? "Gerando página…" : "Baixar página do ranking"}
      </button>
    </div>
  );
}

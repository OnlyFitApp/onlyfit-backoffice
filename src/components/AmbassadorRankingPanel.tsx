import { Download, RefreshCw } from "lucide-react";
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

  const included = members.filter((member) => !excluded.has(member.key));

  const toggle = (key: string) => {
    setExcluded((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const download = () => {
    const html = buildRankingPageHtml({
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
  };

  return (
    <div className="ambassador-list-panel">
      <h2>Página do ranking</h2>
      <p className="ambassador-muted">
        Gera um arquivo HTML estático com os cadastros escolhidos. Não cria
        tabela nem endpoint: quem tiver o link vê a página, e ela não aparece
        em buscadores. A posição A/B/C é guardada no navegador de quem move os
        cards.
      </p>

      <label>
        Título da página
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={80}
        />
      </label>

      <p className="ambassador-muted">
        Caminho sugerido para publicar: <code>/{slug}/index.html</code>
        <button
          className="button secondary"
          type="button"
          onClick={() => setSlug(newRankingSlug())}
          title="Gera um caminho novo; a página antiga deixa de valer"
        >
          <RefreshCw size={14} /> Novo caminho
        </button>
      </p>

      <fieldset>
        <legend>
          Cadastros na página ({included.length} de {members.length})
        </legend>
        {members.map((member) => (
          <label key={member.key}>
            <input
              type="checkbox"
              checked={!excluded.has(member.key)}
              onChange={() => toggle(member.key)}
            />
            {member.name} <span className="ambassador-muted">@{member.username}</span>{" "}
            <span className="ambassador-muted">· {member.status}</span>
          </label>
        ))}
      </fieldset>

      <button
        className="button primary"
        type="button"
        onClick={download}
        disabled={included.length === 0}
      >
        <Download size={16} /> Baixar página do ranking
      </button>
    </div>
  );
}

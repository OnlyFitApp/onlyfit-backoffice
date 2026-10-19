import type { AmbassadorAssignment } from "./ambassadorNetwork";

// Projeção do vínculo para o ranking. A chave interna da seleção é
// pseudonimizada na exportação; contato e número de contrato não saem na página.
export type RankingMember = {
  key: string;
  name: string;
  username: string;
  classification: string;
  affinity: string;
  place: string;
  followers: number;
  status: string;
  hasContractReference: boolean;
};

const classificationLabels: Record<string, string> = {
  principal: "Principal",
  associate: "Associado",
  professional: "Profissional",
};

const statusLabels: Record<string, string> = {
  draft: "Rascunho",
  pending: "Pendente",
  active: "Ativo",
  suspended: "Suspenso",
  ended: "Encerrado",
};

export function buildRankingMembers(
  assignments: AmbassadorAssignment[],
): RankingMember[] {
  return assignments
    .filter((item) => item.status !== "ended")
    .map((item) => ({
      key: item.id,
      name: item.display_name,
      username: item.username,
      classification:
        classificationLabels[item.classification] ?? item.classification,
      affinity: item.affinity_group_label,
      place: [item.city_name, item.state_code, item.country_code]
        .filter(Boolean)
        .join(" · "),
      followers: item.follower_count,
      status: statusLabels[item.status] ?? item.status,
      hasContractReference: Boolean(item.contract_reference?.trim()),
    }));
}

export function newRankingSlug(): string {
  const bytes = new Uint8Array(18);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Escapa "<" e separadores de linha para o JSON poder viver dentro de <script>
// sem fechar a tag nem quebrar o parse.
function embedJson(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export async function buildRankingPageHtml(input: {
  slug: string;
  title: string;
  generatedAt: string;
  members: RankingMember[];
}): Promise<string> {
  const data = {
    slug: input.slug,
    title: input.title,
    generatedAt: input.generatedAt,
    members: await Promise.all(
      input.members.map(async (member) => {
        const digest = await crypto.subtle.digest(
          "SHA-256",
          new TextEncoder().encode(JSON.stringify([input.slug, member.key])),
        );
        return {
          key: Array.from(new Uint8Array(digest), (byte) =>
            byte.toString(16).padStart(2, "0"),
          ).join(""),
          name: member.name,
          username: member.username,
          classification: member.classification,
          affinity: member.affinity,
          place: member.place,
          followers: member.followers,
          status: member.status,
          hasContractReference: member.hasContractReference,
        };
      }),
    ),
  };
  return RANKING_PAGE_TEMPLATE.replace("__TITLE__", escapeHtml(input.title)).replace(
    "__DATA__",
    () => embedJson(data),
  );
}

const RANKING_PAGE_TEMPLATE = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow,noarchive,nosnippet,noimageindex">
<meta name="referrer" content="no-referrer">
<title>__TITLE__</title>
<style>
:root { color-scheme: dark; --bg: #0c1117; --panel: #141b24; --card: #0f151d; --line: #243040; --text: #e8edf3; --muted: #8b9bb0; }
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--text); font: 15px/1.45 Inter, system-ui, -apple-system, "Segoe UI", sans-serif; }
.wrap { max-width: 1200px; margin: 0 auto; padding: 24px 16px 48px; }
.top { display: flex; flex-wrap: wrap; gap: 12px; justify-content: space-between; align-items: flex-end; margin-bottom: 20px; }
h1 { font-size: 22px; margin: 0; }
.hint { color: var(--muted); margin: 4px 0 0; font-size: 13px; }
.reset { background: transparent; color: var(--text); border: 1px solid var(--line); border-radius: 6px; height: 34px; padding: 0 12px; cursor: pointer; font: inherit; font-size: 13px; }
.reset:hover { border-color: var(--text); }
.lane { border: 1px solid var(--line); border-left: 6px solid var(--tone); background: var(--panel); border-radius: 10px; margin-bottom: 16px; overflow: hidden; }
.lane-head { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: color-mix(in srgb, var(--tone) 14%, transparent); }
.lane-tag { font-weight: 800; font-size: 22px; color: var(--tone); width: 28px; }
.lane-head h2 { font-size: 15px; margin: 0; }
.lane-head p { margin: 0; color: var(--muted); font-size: 12px; }
.count { margin-left: auto; background: var(--tone); color: #06110d; border-radius: 6px; padding: 2px 10px; font-weight: 700; font-size: 13px; }
.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 10px; padding: 12px; min-height: 80px; transition: background .15s; }
.cards.over { background: color-mix(in srgb, var(--tone) 10%, transparent); }
.card { background: var(--card); border: 1px solid var(--line); border-radius: 6px; padding: 12px; cursor: grab; display: flex; flex-direction: column; gap: 6px; }
.card.dragging { opacity: .4; }
.card.over { outline: 2px dashed var(--tone); outline-offset: 2px; }
.card strong { font-size: 15px; }
.meta { margin: 0; color: var(--muted); font-size: 12.5px; }
.chips { display: flex; flex-wrap: wrap; gap: 6px; }
.chip { border: 1px solid var(--line); border-radius: 6px; padding: 1px 7px; font-size: 11.5px; color: var(--muted); }
.chip.ok { border-color: var(--tone); color: var(--tone); }
.actions { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
.mini { background: transparent; color: var(--text); border: 1px solid var(--line); border-radius: 6px; min-width: 32px; height: 28px; padding: 0 8px; cursor: pointer; font: inherit; font-size: 12px; }
.mini:hover:not(:disabled) { border-color: var(--text); }
.mini:disabled { opacity: .35; cursor: default; }
.empty { margin: 0; color: var(--muted); font-size: 13px; grid-column: 1 / -1; align-self: center; }
@media (max-width: 520px) { .wrap { padding: 16px; } }
</style>
</head>
<body>
<main class="wrap">
  <header class="top">
    <div>
      <h1 id="title"></h1>
      <p class="hint" id="hint"></p>
    </div>
    <button class="reset" id="reset" type="button">Voltar ao início</button>
  </header>
  <div id="board"></div>
</main>
<script>
(function () {
  var DATA = __DATA__;
  var LANES = [
    { id: "A", label: "Pode contar", tone: "#00b598" },
    { id: "B", label: "Em construção", tone: "#008abf" },
    { id: "C", label: "Ainda não", tone: "#d98e04" }
  ];
  var DEFAULT_LANE = "C";
  var BY_KEY = {};
  DATA.members.forEach(function (m) { BY_KEY[m.key] = m; });
  var STORAGE_KEY = "oft-ranking:" + DATA.slug;
  var refs = {};
  var dragKey = null;
  var state = reconcile(read());

  function read() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch (e) { return {}; }
  }

  function write() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* sem armazenamento: a ordem vale só nesta aba */ }
  }

  function reconcile(saved) {
    var order = [];
    var lanes = {};
    var savedOrder = Array.isArray(saved.order) ? saved.order : [];
    var savedLanes = saved.lanes || {};
    savedOrder.forEach(function (k) { if (BY_KEY[k] && order.indexOf(k) === -1) order.push(k); });
    DATA.members.forEach(function (m) {
      if (order.indexOf(m.key) === -1) order.push(m.key);
      var lane = savedLanes[m.key];
      lanes[m.key] = LANES.some(function (l) { return l.id === lane; }) ? lane : DEFAULT_LANE;
    });
    return { order: order, lanes: lanes };
  }

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  function button(label, title, disabled, onClick) {
    var b = el("button", "mini", label);
    b.type = "button";
    b.title = title;
    b.setAttribute("aria-label", title);
    b.disabled = disabled;
    b.addEventListener("click", onClick);
    return b;
  }

  function laneKeys(lane) {
    return state.order.filter(function (k) { return state.lanes[k] === lane; });
  }

  function commit() {
    write();
    render();
  }

  function moveTo(key, lane, beforeKey) {
    if (key === beforeKey) return;
    state.order = state.order.filter(function (k) { return k !== key; });
    state.lanes[key] = lane;
    var at = beforeKey ? state.order.indexOf(beforeKey) : -1;
    if (at === -1) state.order.push(key);
    else state.order.splice(at, 0, key);
    commit();
  }

  function nudge(key, dir) {
    var keys = laneKeys(state.lanes[key]);
    var i = keys.indexOf(key);
    var j = i + dir;
    if (i === -1 || j < 0 || j >= keys.length) return;
    var a = state.order.indexOf(key);
    var b = state.order.indexOf(keys[j]);
    state.order[a] = keys[j];
    state.order[b] = key;
    commit();
  }

  function clearOver() {
    document.querySelectorAll(".over").forEach(function (node) { node.classList.remove("over"); });
  }

  function card(key, index, total) {
    var m = BY_KEY[key];
    var lane = state.lanes[key];
    var art = el("article", "card");
    art.draggable = true;
    art.appendChild(el("strong", "", m.name));
    art.appendChild(el("p", "meta", "@" + m.username + " · " + m.classification + (m.affinity ? " · " + m.affinity : "")));
    if (m.place) art.appendChild(el("p", "meta", m.place));

    var chips = el("div", "chips");
    chips.appendChild(el("span", "chip", m.status));
    chips.appendChild(el("span", "chip", m.followers.toLocaleString("pt-BR") + " seguidores"));
    if (m.hasContractReference) chips.appendChild(el("span", "chip ok", "Contrato registrado"));
    art.appendChild(chips);

    var actions = el("div", "actions");
    actions.appendChild(button("↑", "Subir", index === 0, function () { nudge(key, -1); }));
    actions.appendChild(button("↓", "Descer", index === total - 1, function () { nudge(key, 1); }));
    LANES.forEach(function (target) {
      if (target.id === lane) return;
      actions.appendChild(button("→ " + target.id, "Mover para " + target.label, false, function () { moveTo(key, target.id, null); }));
    });
    art.appendChild(actions);

    art.addEventListener("dragstart", function (e) {
      dragKey = key;
      art.classList.add("dragging");
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", key);
    });
    art.addEventListener("dragend", function () {
      dragKey = null;
      art.classList.remove("dragging");
      clearOver();
    });
    art.addEventListener("dragover", function (e) {
      if (!dragKey) return;
      e.preventDefault();
      e.stopPropagation();
      art.classList.add("over");
    });
    art.addEventListener("dragleave", function () { art.classList.remove("over"); });
    art.addEventListener("drop", function (e) {
      if (!dragKey) return;
      e.preventDefault();
      e.stopPropagation();
      moveTo(dragKey, lane, key);
    });
    return art;
  }

  function buildBoard() {
    var board = document.getElementById("board");
    LANES.forEach(function (lane) {
      var section = el("section", "lane");
      section.style.setProperty("--tone", lane.tone);
      var head = el("header", "lane-head");
      head.appendChild(el("span", "lane-tag", lane.id));
      var title = el("div");
      title.appendChild(el("h2", "", lane.label));
      head.appendChild(title);
      var count = el("span", "count", "0");
      head.appendChild(count);
      var list = el("div", "cards");
      section.appendChild(head);
      section.appendChild(list);
      board.appendChild(section);
      refs[lane.id] = { list: list, count: count };

      list.addEventListener("dragover", function (e) {
        if (!dragKey) return;
        e.preventDefault();
        list.classList.add("over");
      });
      list.addEventListener("dragleave", function (e) {
        if (e.target === list) list.classList.remove("over");
      });
      list.addEventListener("drop", function (e) {
        if (!dragKey) return;
        e.preventDefault();
        moveTo(dragKey, lane.id, null);
      });
    });
  }

  function render() {
    LANES.forEach(function (lane) {
      var keys = laneKeys(lane.id);
      var ref = refs[lane.id];
      ref.list.textContent = "";
      ref.count.textContent = String(keys.length);
      keys.forEach(function (key, index) { ref.list.appendChild(card(key, index, keys.length)); });
      if (!keys.length) ref.list.appendChild(el("p", "empty", "Arraste um cadastro para cá"));
    });
  }

  document.title = DATA.title;
  document.getElementById("title").textContent = DATA.title;
  var generated = new Date(DATA.generatedAt);
  document.getElementById("hint").textContent =
    DATA.members.length + " cadastros · gerado em " + generated.toLocaleString("pt-BR") +
    " · arraste os cards ou use as setas. A ordem fica salva neste navegador.";
  document.getElementById("reset").addEventListener("click", function () {
    if (!window.confirm("Voltar todos para o início e à ordem original?")) return;
    state = reconcile({});
    commit();
  });

  buildBoard();
  render();
})();
</script>
</body>
</html>
`;

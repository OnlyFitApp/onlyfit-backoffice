/// <reference lib="es2021.intl" />

import type { AmbassadorAssignment } from "./ambassadorNetwork";

// Projeção do vínculo para o ranking. A chave interna da seleção é
// pseudonimizada na exportação; contato e número de contrato não saem na página.
export type RankingMember = {
  key: string;
  name: string;
  affinity: string;
  place: string;
};

const countryNames = typeof Intl.DisplayNames === "function"
  ? new Intl.DisplayNames(["pt-BR"], { type: "region" })
  : null;

function countryName(value: string | null): string {
  const code = value?.trim().toUpperCase() ?? "";
  if (!code) return "";
  try {
    return countryNames?.of(code) ?? code;
  } catch {
    return code;
  }
}

export function buildRankingMembers(
  assignments: AmbassadorAssignment[],
): RankingMember[] {
  return assignments
    .filter((item) => item.status !== "ended")
    .map((item) => ({
      key: item.id,
      name: item.display_name,
      affinity: item.affinity_group_label,
      place: [countryName(item.country_code), item.city_name, item.state_code]
        .filter(Boolean)
        .join(" · "),
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
          affinity: member.affinity,
          place: member.place,
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
:root { color-scheme: dark; --bg: #0d0e10; --panel: #141619; --card: #1d2025; --line: #2c3037; --text: #f1f3f6; --muted: #a1a8b4; }
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--text); font: 14px/1.5 Inter, system-ui, -apple-system, "Segoe UI", sans-serif; -webkit-font-smoothing: antialiased; }
button, summary { -webkit-tap-highlight-color: transparent; }
button:focus-visible, summary:focus-visible { outline: 2px solid #008abf; outline-offset: 4px; }
.wrap { max-width: 1280px; margin: 0 auto; padding: 52px 32px 64px; }
.top { display: flex; flex-wrap: wrap; gap: 20px; justify-content: space-between; align-items: center; margin-bottom: 32px; }
h1 { margin: 0; font-size: clamp(25px, 3vw, 34px); font-weight: 700; letter-spacing: -.035em; line-height: 1.2; }
.hint { margin: 9px 0 0; color: var(--muted); font-size: 13px; }
.reset { padding: 10px 14px; border: 1px solid var(--line); border-radius: 10px; background: transparent; color: var(--muted); font: inherit; font-size: 12px; cursor: pointer; }
.reset:hover { border-color: #535b68; color: var(--text); }
#board { display: grid; gap: 16px; }
.lane { display: grid; grid-template-columns: 144px minmax(0, 1fr); border: 1px solid var(--line); border-radius: 18px; background: var(--panel); }
.lane-head { display: grid; align-content: center; justify-items: start; gap: 10px; padding: 24px 20px; border-right: 1px solid var(--line); }
.lane-tag { display: grid; width: 42px; height: 42px; place-items: center; border-radius: 12px; background: color-mix(in srgb, var(--tone) 13%, transparent); color: var(--tone); font-size: 25px; font-weight: 750; line-height: 1; }
.lane-head h2 { margin: 0; color: var(--muted); font-size: 12px; font-weight: 500; line-height: 1.4; }
.count { color: var(--muted); font-size: 12px; font-variant-numeric: tabular-nums; }
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); align-content: start; gap: 12px; min-height: 164px; padding: 18px; border-radius: 0 18px 18px 0; transition: background .15s; }
.cards.over { background: color-mix(in srgb, var(--tone) 7%, transparent); }
.card { position: relative; min-width: 0; padding: 21px 42px 20px 20px; border: 1px solid #343941; border-radius: 13px; background: var(--card); cursor: grab; transition: border-color .15s, background .15s; }
.card:hover, .card:focus-within { border-color: #555e6c; background: #22262c; }
.card.dragging { opacity: .3; }
.card.over { outline: 2px solid var(--tone); outline-offset: 3px; }
.card h3 { margin: 0; color: var(--text); font-size: 21px; font-weight: 700; letter-spacing: -.025em; line-height: 1.25; overflow-wrap: anywhere; }
.card-vertical { margin: 8px 0 0; color: #d0d5de; font-size: 13px; overflow-wrap: anywhere; }
.card-location { margin: 5px 0 0; color: var(--muted); font-size: 12px; overflow-wrap: anywhere; }
.card-options { position: absolute; top: 12px; right: 8px; z-index: 1; }
.card-options[open] { z-index: 5; }
.drag-handle { display: grid; width: 30px; height: 32px; place-items: center; border-radius: 7px; color: #737d8c; font-size: 23px; line-height: 1; list-style: none; cursor: grab; touch-action: none; user-select: none; }
.drag-handle::-webkit-details-marker { display: none; }
.drag-handle:hover, .card-options[open] .drag-handle { background: #ffffff09; color: var(--text); }
.actions { position: absolute; top: 38px; right: 0; display: grid; gap: 3px; width: 180px; padding: 6px; border: 1px solid #454c58; border-radius: 11px; background: #22262c; box-shadow: 0 12px 36px #0006; }
.mini { min-height: 36px; padding: 8px 10px; border: 0; border-radius: 6px; background: transparent; color: var(--text); text-align: left; font: inherit; font-size: 12px; cursor: pointer; }
.mini:hover:not(:disabled), .mini:focus-visible { background: #ffffff0d; }
.mini:disabled { color: #68717e; cursor: default; }
.empty { grid-column: 1 / -1; align-self: center; margin: 0; padding: 20px; color: #778190; text-align: center; font-size: 12px; }
.drag-preview { position: fixed; z-index: 100; margin: 0; opacity: .96; box-shadow: 0 18px 48px #0006; pointer-events: none; }
.drag-preview .card-options { display: none; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
@media (max-width: 640px) {
  .wrap { padding: 30px 16px 40px; }
  .top { gap: 16px; margin-bottom: 24px; }
  .lane { grid-template-columns: minmax(0, 1fr); }
  .lane-head { display: flex; align-items: center; gap: 12px; padding: 13px 16px; border-right: 0; border-bottom: 1px solid var(--line); }
  .lane-tag { width: 32px; height: 32px; border-radius: 9px; font-size: 20px; }
  .lane-head > div { flex: 1; }
  .cards { gap: 10px; min-height: 110px; padding: 12px; border-radius: 0 0 18px 18px; }
  .card { padding: 19px 48px 19px 18px; }
  .card h3 { font-size: 21px; }
  .drag-handle { width: 36px; height: 36px; }
}
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
</style>
</head>
<body>
<main class="wrap">
  <header class="top">
    <div>
      <h1 id="title"></h1>
      <p class="hint" id="hint"></p>
    </div>
    <button class="reset" id="reset" type="button">Restaurar ordem</button>
  </header>
  <div id="board"></div>
  <p class="sr-only" id="announcement" role="status" aria-live="polite"></p>
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

  function commit(focusKey) {
    write();
    render();
    if (focusKey) {
      var handle = document.querySelector('[data-key="' + focusKey + '"] .drag-handle');
      if (handle) handle.focus({ preventScroll: true });
      var lane = LANES.find(function (item) { return item.id === state.lanes[focusKey]; });
      document.getElementById("announcement").textContent = BY_KEY[focusKey].name + " · " + lane.label;
    }
  }

  function moveTo(key, lane, beforeKey) {
    if (key === beforeKey) return;
    state.order = state.order.filter(function (k) { return k !== key; });
    state.lanes[key] = lane;
    var at = beforeKey ? state.order.indexOf(beforeKey) : -1;
    if (at === -1) state.order.push(key);
    else state.order.splice(at, 0, key);
    commit(key);
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
    commit(key);
  }

  function clearOver() {
    document.querySelectorAll(".over").forEach(function (node) { node.classList.remove("over"); });
  }

  function touchDropTarget(x, y) {
    var node = document.elementFromPoint(x, y);
    if (!node) return null;
    var list = node.closest(".cards");
    if (!list) return null;
    var targetCard = node.closest(".card");
    return { list: list, card: targetCard };
  }

  function attachTouchDrag(handle, art, key) {
    var start = null;
    var preview = null;
    var suppressClick = false;

    function cleanup() {
      if (preview) preview.remove();
      preview = null;
      start = null;
      dragKey = null;
      art.classList.remove("dragging");
      clearOver();
    }

    handle.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse" || !e.isPrimary || e.button !== 0) return;
      var rect = art.getBoundingClientRect();
      start = { id: e.pointerId, x: e.clientX, y: e.clientY, offsetX: e.clientX - rect.left, offsetY: e.clientY - rect.top };
      suppressClick = false;
      handle.setPointerCapture(e.pointerId);
    });

    handle.addEventListener("pointermove", function (e) {
      if (!start || start.id !== e.pointerId) return;
      if (!preview && Math.hypot(e.clientX - start.x, e.clientY - start.y) < 8) return;
      e.preventDefault();
      if (!preview) {
        handle.parentElement.open = false;
        preview = art.cloneNode(true);
        preview.className = "card drag-preview";
        preview.removeAttribute("data-key");
        preview.setAttribute("aria-hidden", "true");
        preview.style.width = art.getBoundingClientRect().width + "px";
        document.body.appendChild(preview);
        art.classList.add("dragging");
        dragKey = key;
        suppressClick = true;
      }
      preview.style.left = (e.clientX - start.offsetX) + "px";
      preview.style.top = (e.clientY - start.offsetY) + "px";
      if (e.clientY < 60) window.scrollBy(0, -16);
      else if (e.clientY > window.innerHeight - 60) window.scrollBy(0, 16);
      clearOver();
      var target = touchDropTarget(e.clientX, e.clientY);
      if (target) (target.card || target.list).classList.add("over");
    });

    handle.addEventListener("pointerup", function (e) {
      if (!start || start.id !== e.pointerId) return;
      var target = preview ? touchDropTarget(e.clientX, e.clientY) : null;
      cleanup();
      if (target) moveTo(key, target.list.dataset.lane, target.card ? target.card.dataset.key : null);
    });
    function cancelTouch(e) {
      if (start && start.id === e.pointerId) cleanup();
    }
    handle.addEventListener("pointercancel", cancelTouch);
    handle.addEventListener("lostpointercapture", cancelTouch);
    handle.addEventListener("click", function (e) {
      if (suppressClick) {
        e.preventDefault();
        e.stopPropagation();
        suppressClick = false;
      }
    });
  }

  function card(key, index, total) {
    var m = BY_KEY[key];
    var lane = state.lanes[key];
    var art = el("article", "card");
    art.dataset.key = key;
    art.draggable = true;
    art.appendChild(el("h3", "", m.name));
    if (m.affinity) art.appendChild(el("p", "card-vertical", m.affinity));
    if (m.place) art.appendChild(el("p", "card-location", m.place));

    var options = el("details", "card-options");
    var handle = el("summary", "drag-handle", "⠿");
    handle.setAttribute("aria-label", "Mover " + m.name);
    handle.title = "Arrastar ou abrir opções de movimento";
    options.appendChild(handle);
    var actions = el("div", "actions");
    actions.appendChild(button("↑ Subir", "Subir", index === 0, function () { nudge(key, -1); }));
    actions.appendChild(button("↓ Descer", "Descer", index === total - 1, function () { nudge(key, 1); }));
    LANES.forEach(function (target) {
      if (target.id === lane) return;
      actions.appendChild(button("Mover para " + target.id, "Mover para " + target.label, false, function () { moveTo(key, target.id, null); }));
    });
    options.appendChild(actions);
    options.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { options.open = false; handle.focus(); }
    });
    art.appendChild(options);
    attachTouchDrag(handle, art, key);

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
      list.dataset.lane = lane.id;
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
      if (!keys.length) ref.list.appendChild(el("p", "empty", "Solte aqui"));
    });
  }

  document.title = DATA.title;
  document.getElementById("title").textContent = DATA.title;
  document.getElementById("hint").textContent = DATA.members.length + " cadastros";
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

/* Preference panel — a draggable, closable dev pill for reviewing a page.

   Three toggles:
   - Layout: site-defined option groups. Picking one sets
     <html data-pref-<group>="<value>">, and the site's own CSS reacts.
   - Sections: every element marked data-pref-section="Label" on the page
     can be switched off or dragged into a new order. Saved per page path.
   - Viewport: previews the page at a fixed device size (phone, 13" laptop,
     15" laptop, HD) in a same-origin iframe, scaled down to fit when the
     size is bigger than your window. Media queries fire for real because
     the iframe IS that width.

   Configure with window.PREF_PANEL before this script loads (see
   docs/preference-panel.md). Everything renders inside a shadow root, so
   the page's CSS can't touch the panel and the panel's can't touch the
   page. Choices persist in localStorage; inside the preview iframe only the
   layout attributes are applied, never a second panel. */
(() => {
  "use strict";
  if (window.__prefPanel) return;
  window.__prefPanel = true;

  const cfg = Object.assign(
    {
      key: "pref-panel",
      shortcut: "KeyP", // with Alt/Option + Shift
      groups: [],
      viewports: [
        { id: "live", title: "Live", sub: "Your window" },
        { id: "mobile", title: "Mobile", w: 390, h: 844, sub: "iPhone 15" },
        { id: "laptop-sm", title: "Small laptop", w: 1280, h: 800, sub: '13" MacBook Air' },
        { id: "laptop-15", title: "15-inch", w: 1440, h: 900, sub: '15" MacBook Air' },
        { id: "hd", title: "HD", w: 1920, h: 1080, sub: "Full HD desktop" },
      ],
    },
    window.PREF_PANEL || {}
  );

  const store = {
    get() {
      try { return JSON.parse(localStorage.getItem(cfg.key)) || {}; } catch (e) { return {}; }
    },
    set(s) {
      try { localStorage.setItem(cfg.key, JSON.stringify(s)); } catch (e) {}
    },
  };
  const state = Object.assign({ vp: "live", prefs: {}, pos: null, closed: false, sections: {} }, store.get());
  const save = () => store.set({ vp: state.vp, prefs: state.prefs, pos: state.pos, closed: state.closed, sections: state.sections });

  const applyPrefs = (doc) => {
    if (!doc) return;
    cfg.groups.forEach((g) => {
      const v = state.prefs[g.id] || g.options[0].value;
      doc.documentElement.setAttribute("data-pref-" + g.id, v);
    });
  };
  applyPrefs(document);

  // ------------------------------------------------------------ sections
  // Each [data-pref-section] gets a comment marker in its original spot the
  // first time round, so a new order is just "put the nth section at the nth
  // marker". Parked sections (server-rendered with `hidden`) stay off until
  // switched on; hiding uses display:none !important so a section's own
  // display rule can't win.
  const pageKey = location.pathname.replace(/\/index\.html$/, "/");
  const secId = (el) => el.getAttribute("data-pref-section").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const secPrefs = () => state.sections[pageKey] || { order: [], vis: {} };
  const secList = (doc) => {
    if (!doc.__prefSecs) {
      const els = [...doc.querySelectorAll("[data-pref-section]")];
      doc.__prefSecs = els.map((el) => {
        const mark = doc.createComment(" pref-section ");
        el.parentNode.insertBefore(mark, el);
        return { id: secId(el), label: el.getAttribute("data-pref-section"), el, mark, parked: el.hidden };
      });
    }
    return doc.__prefSecs;
  };
  const secOrdered = (doc) => {
    const list = secList(doc), saved = secPrefs().order.filter((id) => list.some((x) => x.id === id));
    const out = saved.map((id) => list.find((x) => x.id === id));
    // sections the saved order doesn't know about keep their original slot
    list.forEach((x, i) => { if (!saved.includes(x.id)) out.splice(Math.min(i, out.length), 0, x); });
    return out;
  };
  const secVisible = (x) => { const v = secPrefs().vis; return x.id in v ? v[x.id] : !x.parked; };
  const applySections = (doc) => {
    if (!doc || !doc.querySelector("[data-pref-section]")) return;
    const list = secList(doc);
    // only move what's out of place: a move resets scroll positions inside it
    secOrdered(doc).forEach((x, i) => {
      if (list[i].mark.nextSibling !== x.el) list[i].mark.parentNode.insertBefore(x.el, list[i].mark.nextSibling);
    });
    list.forEach((x) => {
      if (secVisible(x)) {
        x.el.hidden = false;
        x.el.style.removeProperty("display");
      } else x.el.style.setProperty("display", "none", "important");
    });
    // scroll-driven bits (deck, snake, reveals) re-measure on resize
    doc.defaultView.dispatchEvent(new Event("resize"));
  };
  const setSections = (patch) => {
    state.sections[pageKey] = Object.assign(secPrefs(), patch);
    save();
  };
  applySections(document);

  // inside the preview frame: layout choices only
  if (window.self !== window.top) return;

  const ICON = {
    grip: '<svg viewBox="0 0 12 18" width="12" height="18" aria-hidden="true"><g fill="currentColor"><circle cx="3" cy="3" r="1.6"/><circle cx="9" cy="3" r="1.6"/><circle cx="3" cy="9" r="1.6"/><circle cx="9" cy="9" r="1.6"/><circle cx="3" cy="15" r="1.6"/><circle cx="9" cy="15" r="1.6"/></g></svg>',
    layout: '<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><path d="M8 3v6M8 15v6M16 3v2M16 11v10"/><circle cx="8" cy="12" r="2.6"/><circle cx="16" cy="8" r="2.6"/></svg>',
    viewport: '<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true"><rect x="2.5" y="4.5" width="14" height="10" rx="1.6"/><path d="M1 18h17"/><rect x="18.5" y="8.5" width="4.5" height="10" rx="1.2"/></svg>',
    sections: '<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="5" rx="1.4"/><rect x="3.5" y="10.5" width="17" height="4" rx="1.2"/><rect x="3.5" y="16.5" width="17" height="4" rx="1.2"/></svg>',
    close: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  };

  const CSS = `
:host{all:initial}
*,*::before,*::after{box-sizing:border-box}
.pp{--bg:#0b0b0c;--pop:#1c1c1f;--line:rgba(255,255,255,.1);--txt:#fafafa;--sub:#a1a1aa;--sel:rgba(255,255,255,.12);
  font-family:"Inter",ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  -webkit-font-smoothing:antialiased;color:var(--txt);font-size:14px;line-height:1.3}
.pill{position:fixed;z-index:2147483600;display:flex;flex-direction:column;align-items:center;gap:4px;
  width:52px;padding:10px 0;border-radius:999px;background:var(--bg);
  box-shadow:0 12px 32px -8px rgba(0,0,0,.45),0 0 0 1px rgba(255,255,255,.06);
  touch-action:none;user-select:none;-webkit-user-select:none}
.pill.is-dragging{cursor:grabbing;box-shadow:0 22px 48px -10px rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,.1)}
.grip{display:grid;place-items:center;width:40px;height:30px;color:#6b6b72;cursor:grab;border-radius:10px}
.grip:hover{color:#a1a1aa}
.btn{display:grid;place-items:center;width:40px;height:40px;margin:0;padding:0;border:0;border-radius:50%;
  background:none;color:var(--txt);cursor:pointer;transition:background .2s,box-shadow .2s,transform .15s}
.btn:hover{background:rgba(255,255,255,.08)}
.btn:active{transform:scale(.92)}
.btn[aria-expanded="true"]{box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.55)}
.btn:focus-visible,.opt:focus-visible,.sec button:focus-visible,.reset:focus-visible{outline:2px solid #60a5fa;outline-offset:2px}
.btn--close{color:#a1a1aa}
.pop{position:fixed;z-index:2147483601;width:272px;padding:16px 10px 10px;border-radius:20px;background:var(--pop);
  box-shadow:0 24px 60px -12px rgba(0,0,0,.55),0 0 0 1px var(--line);
  opacity:0;transform:scale(.96);transform-origin:var(--origin,left center);pointer-events:none;
  transition:opacity .16s ease,transform .22s cubic-bezier(.2,.9,.3,1.2)}
.pop.is-open{opacity:1;transform:none;pointer-events:auto}
.pop{max-height:calc(100vh - 16px);overflow:auto;scrollbar-width:thin}
.note{margin:-4px 10px 10px;font-size:12.5px;color:var(--sub)}
.secs{list-style:none;margin:0;padding:0}
.sec{display:flex;align-items:center;gap:6px;padding:4px 6px 4px 2px;border-radius:12px;background:var(--pop);transition:background .15s}
.sec:hover{background:rgba(255,255,255,.05)}
.sec.is-dragging{position:relative;z-index:1;background:#2a2a2f;box-shadow:0 10px 24px -8px rgba(0,0,0,.6)}
.sec.is-off .sec__name{color:#71717a;text-decoration:line-through;text-decoration-color:rgba(255,255,255,.25)}
.sec button{margin:0;border:0;background:none;color:inherit;font:inherit;cursor:pointer}
.sec__grip{display:grid;place-items:center;flex:none;width:28px;height:32px;padding:0;border-radius:8px;color:#6b6b72;cursor:grab;touch-action:none}
.sec__grip:hover{color:#d4d4d8}
.sec.is-dragging .sec__grip{cursor:grabbing}
.sec__name{flex:1;min-width:0;padding:7px 4px;text-align:left;font-size:14.5px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;border-radius:8px}
.sw{position:relative;flex:none;width:34px;height:20px;padding:0;border-radius:999px;background:#3f3f46 !important;transition:background .2s}
.sw::after{content:"";position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fafafa;transition:transform .2s}
.sw[aria-checked="true"]{background:#22c55e !important}
.sw[aria-checked="true"]::after{transform:translateX(14px)}
.reset{display:block;margin:8px 10px 2px auto;padding:4px 6px;border:0;border-radius:8px;background:none;color:var(--sub);font:inherit;font-size:12.5px;cursor:pointer}
.reset:hover{color:var(--txt)}
.grp+.grp{margin-top:12px;padding-top:14px;border-top:1px solid var(--line)}
.lbl{margin:0 10px 8px;font-size:11.5px;font-weight:600;letter-spacing:.13em;text-transform:uppercase;color:#d4d4d8}
.opt{display:block;width:100%;margin:0;padding:10px 12px;border:0;border-radius:13px;background:none;
  color:inherit;font:inherit;text-align:left;cursor:pointer;transition:background .15s}
.opt:hover{background:rgba(255,255,255,.06)}
.opt[aria-checked="true"]{background:var(--sel)}
.opt b{display:block;font-size:15.5px;font-weight:600;letter-spacing:-.01em}
.opt span{display:block;margin-top:3px;font-size:13px;color:var(--sub)}
.stage{position:fixed;inset:0;z-index:2147483500;display:none;flex-direction:column;align-items:center;justify-content:center;gap:12px;
  background:#141416 radial-gradient(circle,rgba(255,255,255,.07) 1px,transparent 1.4px) 0 0/18px 18px}
.stage.is-on{display:flex}
.meta{font-size:12.5px;font-weight:500;color:#a1a1aa;letter-spacing:.01em}
.meta b{color:#fafafa;font-weight:600}
.box{position:relative;flex:none;border-radius:14px;overflow:hidden;background:#fff;
  box-shadow:0 30px 80px -20px rgba(0,0,0,.7),0 0 0 1px rgba(255,255,255,.08)}
.box.is-phone{border-radius:34px;box-shadow:0 30px 80px -20px rgba(0,0,0,.7),0 0 0 8px #000,0 0 0 9px #333}
iframe{position:absolute;left:0;top:0;border:0;background:#fff;transform-origin:0 0}
.toast{position:fixed;left:50%;bottom:24px;z-index:2147483602;transform:translate(-50%,12px);padding:10px 16px;border-radius:999px;
  background:var(--bg);color:var(--txt);font-size:13px;opacity:0;transition:opacity .2s,transform .25s;pointer-events:none;
  box-shadow:0 12px 32px -8px rgba(0,0,0,.45)}
.toast.is-on{opacity:1;transform:translate(-50%,0)}
kbd{font:inherit;padding:1px 6px;border-radius:6px;background:rgba(255,255,255,.12)}
@media (prefers-reduced-motion:reduce){.pop,.btn,.toast{transition:none}}
`;

  const host = document.createElement("div");
  host.setAttribute("data-pref-panel", "");
  const root = host.attachShadow({ mode: "open" });
  root.innerHTML = `<style>${CSS}</style><div class="pp">
    <div class="stage" part="stage"><div class="meta"></div><div class="box"><iframe title="Viewport preview"></iframe></div></div>
    <div class="pill" role="toolbar" aria-label="Preference panel" aria-orientation="vertical">
      <div class="grip" title="Drag">${ICON.grip}</div>
      ${cfg.groups.length ? `<button class="btn" data-pop="layout" aria-label="Layout options" aria-expanded="false" title="Layout">${ICON.layout}</button>` : ""}
      ${document.querySelector("[data-pref-section]") ? `<button class="btn" data-pop="sections" aria-label="Sections" aria-expanded="false" title="Sections">${ICON.sections}</button>` : ""}
      <button class="btn" data-pop="viewport" aria-label="Viewport size" aria-expanded="false" title="Viewport">${ICON.viewport}</button>
      <button class="btn btn--close" aria-label="Close panel" title="Close (Alt+Shift+P brings it back)">${ICON.close}</button>
    </div>
    <div class="pop" data-for="layout" role="dialog" aria-label="Layout options"></div>
    <div class="pop" data-for="sections" role="dialog" aria-label="Sections"></div>
    <div class="pop" data-for="viewport" role="dialog" aria-label="Viewport size"></div>
    <div class="toast" role="status"></div>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const pill = $(".pill"), stage = $(".stage"), box = $(".box"), frame = $("iframe"), meta = $(".meta"), toast = $(".toast");
  const pops = { layout: $('.pop[data-for="layout"]'), sections: $('.pop[data-for="sections"]'), viewport: $('.pop[data-for="viewport"]') };
  let openPop = null;

  const optionHTML = (group, o, checked) =>
    `<button class="opt" role="radio" aria-checked="${checked}" data-group="${group}" data-value="${o.value}"><b>${o.title}</b>${o.sub ? `<span>${o.sub}</span>` : ""}</button>`;

  const renderPops = () => {
    pops.layout.innerHTML = cfg.groups
      .map((g) => {
        const cur = state.prefs[g.id] || g.options[0].value;
        return `<div class="grp" role="radiogroup" aria-label="${g.label}"><p class="lbl">${g.label}</p>${g.options.map((o) => optionHTML(g.id, o, o.value === cur)).join("")}</div>`;
      })
      .join("");
    if (document.__prefSecs) {
      pops.sections.innerHTML = `<div class="grp"><p class="lbl">Sections</p><p class="note">Drag to reorder · switch to hide</p><ul class="secs">${secOrdered(document)
        .map((x) => {
          const on = secVisible(x);
          return `<li class="sec${on ? "" : " is-off"}" data-id="${x.id}"><button class="sec__grip" aria-label="Move ${x.label} (arrow keys)" title="Drag">${ICON.grip}</button><button class="sec__name" title="Scroll to ${x.label}">${x.label}</button><button class="sw" role="switch" aria-checked="${on}" aria-label="Show ${x.label}"></button></li>`;
        })
        .join("")}</ul><button class="reset">Reset order &amp; visibility</button></div>`;
    }
    pops.viewport.innerHTML = `<div class="grp" role="radiogroup" aria-label="Viewport"><p class="lbl">Viewport</p>${cfg.viewports
      .map((v) => optionHTML("__vp", { value: v.id, title: v.title, sub: v.w ? `${v.w} × ${v.h} · ${v.sub}` : `${v.sub} · ${innerWidth} × ${innerHeight}` }, v.id === state.vp))
      .join("")}</div>`;
  };

  // ------------------------------------------------------------ position
  const clampPos = (x, y) => {
    const r = pill.getBoundingClientRect();
    return { x: Math.max(8, Math.min(innerWidth - r.width - 8, x)), y: Math.max(8, Math.min(innerHeight - r.height - 8, y)) };
  };
  const place = () => {
    const r = pill.getBoundingClientRect();
    const p = state.pos ? clampPos(state.pos.x, state.pos.y) : clampPos(innerWidth - r.width - 20, (innerHeight - r.height) / 2);
    pill.style.left = p.x + "px";
    pill.style.top = p.y + "px";
    placePop();
  };
  const placePop = () => {
    if (!openPop) return;
    const pop = pops[openPop];
    const pr = pill.getBoundingClientRect();
    const w = pop.offsetWidth, h = pop.offsetHeight;
    const right = pr.left + pr.width / 2 < innerWidth / 2;
    const x = right ? pr.right + 12 : pr.left - 12 - w;
    const y = Math.max(8, Math.min(innerHeight - h - 8, pr.top));
    pop.style.left = Math.max(8, Math.min(innerWidth - w - 8, x)) + "px";
    pop.style.top = y + "px";
    pop.style.setProperty("--origin", right ? "left top" : "right top");
  };

  let drag = null;
  pill.addEventListener("pointerdown", (e) => {
    if (e.button || e.target.closest(".btn")) return;
    const r = pill.getBoundingClientRect();
    drag = { dx: e.clientX - r.left, dy: e.clientY - r.top };
    pill.setPointerCapture(e.pointerId);
    pill.classList.add("is-dragging");
    e.preventDefault();
  });
  pill.addEventListener("pointermove", (e) => {
    if (!drag) return;
    state.pos = clampPos(e.clientX - drag.dx, e.clientY - drag.dy);
    pill.style.left = state.pos.x + "px";
    pill.style.top = state.pos.y + "px";
    placePop();
  });
  const endDrag = () => {
    if (!drag) return;
    drag = null;
    pill.classList.remove("is-dragging");
    save();
  };
  pill.addEventListener("pointerup", endDrag);
  pill.addEventListener("pointercancel", endDrag);

  // ------------------------------------------------------------ popovers
  const setPop = (name) => {
    openPop = openPop === name ? null : name;
    Object.entries(pops).forEach(([k, el]) => el.classList.toggle("is-open", k === openPop));
    root.querySelectorAll("[data-pop]").forEach((b) => b.setAttribute("aria-expanded", String(b.dataset.pop === openPop)));
    if (openPop) {
      renderPops();
      placePop();
    }
  };
  root.addEventListener("click", (e) => {
    const b = e.target.closest("[data-pop]");
    if (b) return setPop(b.dataset.pop);
    if (e.target.closest(".btn--close")) return close();
    if (sectionClick(e)) return;
    const o = e.target.closest(".opt");
    if (!o) return;
    if (o.dataset.group === "__vp") setViewport(o.dataset.value);
    else {
      state.prefs[o.dataset.group] = o.dataset.value;
      applyPrefs(document);
      try { applyPrefs(frame.contentDocument); } catch (err) {}
      save();
    }
    renderPops();
    // re-rendering replaces the buttons, so put keyboard focus back
    const again = root.querySelector(`.opt[data-group="${o.dataset.group}"][data-value="${o.dataset.value}"]`);
    if (again && e.detail === 0) again.focus();
  });
  // a click anywhere outside the panel (page or preview stage) closes the popover
  document.addEventListener("pointerdown", (e) => {
    if (openPop && !e.composedPath().some((n) => n === pill || Object.values(pops).includes(n))) setPop(openPop);
  });

  // ------------------------------------------------------------ sections popover
  const applyEverywhere = () => {
    applySections(document);
    try { applySections(frame.contentDocument); } catch (err) {}
  };
  const commitOrder = () => {
    setSections({ order: [...pops.sections.querySelectorAll(".sec")].map((li) => li.dataset.id) });
    applyEverywhere();
  };
  const sectionClick = (e) => {
    const li = e.target.closest(".sec");
    if (e.target.closest(".reset")) {
      delete state.sections[pageKey];
      save();
      applyEverywhere();
      renderPops();
      return true;
    }
    if (!li) return false;
    const x = secList(document).find((s) => s.id === li.dataset.id);
    if (e.target.closest(".sw")) {
      setSections({ vis: Object.assign(secPrefs().vis, { [x.id]: !secVisible(x) }) });
      applyEverywhere();
      renderPops();
      const again = pops.sections.querySelector(`.sec[data-id="${x.id}"] .sw`);
      if (again && e.detail === 0) again.focus();
    } else if (e.target.closest(".sec__name") && secVisible(x)) {
      x.el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    return true;
  };
  // drag a row by its grip; rows swap as you pass their midpoints
  let secDrag = null;
  pops.sections.addEventListener("pointerdown", (e) => {
    const grip = e.target.closest(".sec__grip");
    if (!grip || e.button) return;
    secDrag = grip.closest(".sec");
    secDrag.classList.add("is-dragging");
    grip.setPointerCapture(e.pointerId);
    e.preventDefault();
  });
  pops.sections.addEventListener("pointermove", (e) => {
    if (!secDrag) return;
    const rows = [...pops.sections.querySelectorAll(".sec")].filter((r) => r !== secDrag);
    const before = rows.find((r) => { const b = r.getBoundingClientRect(); return e.clientY < b.top + b.height / 2; });
    if (before) { if (secDrag.nextElementSibling !== before) before.before(secDrag); }
    else if (rows.length && rows[rows.length - 1].nextElementSibling) rows[rows.length - 1].after(secDrag);
  });
  const endSecDrag = () => {
    if (!secDrag) return;
    secDrag.classList.remove("is-dragging");
    secDrag = null;
    commitOrder();
  };
  pops.sections.addEventListener("pointerup", endSecDrag);
  pops.sections.addEventListener("pointercancel", endSecDrag);
  pops.sections.addEventListener("keydown", (e) => {
    const grip = e.target.closest(".sec__grip");
    if (!grip || (e.key !== "ArrowUp" && e.key !== "ArrowDown")) return;
    e.preventDefault();
    const li = grip.closest(".sec");
    const to = e.key === "ArrowUp" ? li.previousElementSibling : li.nextElementSibling;
    if (!to) return;
    e.key === "ArrowUp" ? to.before(li) : to.after(li);
    commitOrder();
    grip.focus();
  });
  stage.addEventListener("pointerdown", (e) => {
    if (openPop && e.target === stage) setPop(openPop);
  });

  // ------------------------------------------------------------ viewport stage
  const fit = () => {
    const v = cfg.viewports.find((x) => x.id === state.vp);
    if (!v || !v.w) return;
    const s = Math.min(1, (innerWidth - 48) / v.w, (innerHeight - 76) / v.h);
    frame.style.width = v.w + "px";
    frame.style.height = v.h + "px";
    frame.style.transform = `scale(${s})`;
    box.style.width = Math.round(v.w * s) + "px";
    box.style.height = Math.round(v.h * s) + "px";
    box.classList.toggle("is-phone", v.w < 600);
    meta.innerHTML = `<b>${v.title}</b> · ${v.w} × ${v.h}${s < 1 ? ` · shown at ${Math.round(s * 100)}%` : ""}`;
  };
  const setViewport = (id) => {
    const v = cfg.viewports.find((x) => x.id === id) || cfg.viewports[0];
    const wasOn = stage.classList.contains("is-on");
    state.vp = v.id;
    save();
    if (!v.w) {
      stage.classList.remove("is-on");
      document.documentElement.style.removeProperty("overflow");
      frame.removeAttribute("src");
      return;
    }
    fit();
    if (!wasOn) {
      // open the preview where you're reading, roughly
      const frac = scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight);
      frame.onload = () => {
        try {
          const d = frame.contentDocument.documentElement;
          frame.contentWindow.scrollTo(0, frac * (d.scrollHeight - frame.contentWindow.innerHeight));
        } catch (err) {}
        frame.onload = null;
      };
      frame.src = location.href;
      stage.classList.add("is-on");
      document.documentElement.style.overflow = "hidden";
    }
  };

  // ------------------------------------------------------------ show / hide
  let toastT;
  const say = (html) => {
    toast.innerHTML = html;
    toast.classList.add("is-on");
    clearTimeout(toastT);
    toastT = setTimeout(() => toast.classList.remove("is-on"), 2600);
  };
  const close = () => {
    if (openPop) setPop(openPop);
    setViewport("live");
    state.closed = true;
    save();
    pill.style.display = "none";
    say("Panel hidden · <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>P</kbd> brings it back");
  };
  const show = () => {
    state.closed = false;
    save();
    pill.style.display = "";
    place();
  };
  document.addEventListener("keydown", (e) => {
    if (e.altKey && e.shiftKey && e.code === cfg.shortcut) {
      e.preventDefault();
      state.closed ? show() : close();
    }
    if (e.key === "Escape" && openPop) setPop(openPop);
  });
  addEventListener("resize", () => {
    place();
    fit();
    if (openPop) renderPops();
  });

  const mount = () => {
    document.body.appendChild(host);
    // ?panel in the URL always reopens it
    if (new URLSearchParams(location.search).has("panel")) state.closed = false;
    if (state.closed) pill.style.display = "none";
    place();
    if (state.vp !== "live") {
      const vp = state.vp;
      state.vp = "live";
      setViewport(vp);
    }
  };
  document.body ? mount() : document.addEventListener("DOMContentLoaded", mount);
})();

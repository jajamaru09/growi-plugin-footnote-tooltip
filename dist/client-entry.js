const A = (
  // Note: overloads in JSDoc can’t yet use different `@template`s.
  /**
   * @type {(
   *   (<Condition extends string>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & {type: Condition}) &
   *   (<Condition extends Props>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Condition) &
   *   (<Condition extends TestFunction>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Predicate<Condition, Node>) &
   *   ((test?: null | undefined) => (node?: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node) &
   *   ((test?: Test) => Check)
   * )}
   */
  /**
   * @param {Test} [test]
   * @returns {Check}
   */
  function(e) {
    if (e == null)
      return S;
    if (typeof e == "function")
      return m(e);
    if (typeof e == "object")
      return Array.isArray(e) ? G(e) : (
        // Cast because `ReadonlyArray` goes into the above but `isArray`
        // narrows to `Array`.
        R(
          /** @type {Props} */
          e
        )
      );
    if (typeof e == "string")
      return V(e);
    throw new Error("Expected function, string, or object as test");
  }
);
function G(e) {
  const t = [];
  let o = -1;
  for (; ++o < e.length; )
    t[o] = A(e[o]);
  return m(r);
  function r(...n) {
    let l = -1;
    for (; ++l < t.length; )
      if (t[l].apply(this, n)) return !0;
    return !1;
  }
}
function R(e) {
  const t = (
    /** @type {Record<string, unknown>} */
    e
  );
  return m(o);
  function o(r) {
    const n = (
      /** @type {Record<string, unknown>} */
      /** @type {unknown} */
      r
    );
    let l;
    for (l in e)
      if (n[l] !== t[l]) return !1;
    return !0;
  }
}
function V(e) {
  return m(t);
  function t(o) {
    return o && o.type === e;
  }
}
function m(e) {
  return t;
  function t(o, r, n) {
    return !!(j(o) && e.call(
      this,
      o,
      typeof r == "number" ? r : void 0,
      n || void 0
    ));
  }
}
function S() {
  return !0;
}
function j(e) {
  return e !== null && typeof e == "object" && "type" in e;
}
const x = [], E = !0, b = !1, P = "skip";
function I(e, t, o, r) {
  let n;
  typeof t == "function" && typeof o != "function" ? (r = o, o = t) : n = t;
  const l = A(n), a = r ? -1 : 1;
  u(e, void 0, [])();
  function u(i, g, c) {
    const p = (
      /** @type {Record<string, unknown>} */
      i && typeof i == "object" ? i : {}
    );
    if (typeof p.type == "string") {
      const s = (
        // `hast`
        typeof p.tagName == "string" ? p.tagName : (
          // `xast`
          typeof p.name == "string" ? p.name : void 0
        )
      );
      Object.defineProperty(f, "name", {
        value: "node (" + (i.type + (s ? "<" + s + ">" : "")) + ")"
      });
    }
    return f;
    function f() {
      let s = x, y, d, k;
      if ((!t || l(i, g, c[c.length - 1] || void 0)) && (s = T(o(i, c)), s[0] === b))
        return s;
      if ("children" in i && i.children) {
        const h = (
          /** @type {UnistParent} */
          i
        );
        if (h.children && s[0] !== P)
          for (d = (r ? h.children.length : -1) + a, k = c.concat(h); d > -1 && d < h.children.length; ) {
            const O = h.children[d];
            if (y = u(O, d, k)(), y[0] === b)
              return y;
            d = typeof y[1] == "number" ? y[1] : d + a;
          }
      }
      return s;
    }
  }
}
function T(e) {
  return Array.isArray(e) ? e : typeof e == "number" ? [E, e] : e == null ? x : [e];
}
function v(e, t, o, r) {
  let n, l, a;
  l = t, a = o, n = r, I(e, l, u, n);
  function u(i, g) {
    const c = g[g.length - 1], p = c ? c.children.indexOf(i) : void 0;
    return a(i, p, c);
  }
}
const _ = `
.footnote-tooltip-wrapper {
  position: relative;
}
.footnote-tooltip {
  display: none;
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff9c4;
  border: 1px solid #f0e68c;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 0.85em;
  line-height: 1.5;
  max-width: 300px;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  white-space: normal;
}
.footnote-tooltip-wrapper:hover .footnote-tooltip {
  display: block;
}
`.trim();
function z(e) {
  return JSON.parse(JSON.stringify(e));
}
function N(e) {
  return e.filter((t) => !(t.type === "element" && t.tagName === "a" && (t.properties ?? {}).dataFootnoteBackref != null)).map((t) => t.type === "element" && t.children ? { ...t, children: N(t.children) } : t);
}
function C(e) {
  const t = /* @__PURE__ */ new Map();
  return v(e, "element", (o) => {
    var r;
    if (o.tagName === "section" && ((r = o.properties) == null ? void 0 : r.dataFootnotes) != null)
      return v(o, "element", (n) => {
        var l;
        if (n.tagName === "li" && typeof ((l = n.properties) == null ? void 0 : l.id) == "string") {
          const a = n.properties.id, u = z(n.children);
          t.set(a, N(u));
        }
      }), P;
  }), t;
}
const F = () => (console.log("[footnote-tooltip] rehype plugin registered"), (e) => {
  console.log("[footnote-tooltip] rehype plugin running, tree children:", e.children.length);
  const t = C(e);
  if (console.log("[footnote-tooltip] collected footnotes:", t.size, [...t.keys()]), t.size === 0) {
    console.log("[footnote-tooltip] no footnotes found, skipping");
    return;
  }
  v(e, "element", (r) => {
    var p;
    if (r.tagName !== "sup") return;
    const n = r.children.find(
      (f) => {
        var s;
        return f.type === "element" && f.tagName === "a" && ((s = f.properties) == null ? void 0 : s.dataFootnoteRef) != null;
      }
    );
    if (!n) return;
    const a = String(((p = n.properties) == null ? void 0 : p.href) ?? "").replace(/^#/, ""), u = t.get(a);
    if (!u) return;
    r.properties = r.properties ?? {};
    const i = r.properties.className, g = Array.isArray(i) ? i.filter((f) => typeof f == "string" || typeof f == "number") : i != null ? [i] : [];
    g.push("footnote-tooltip-wrapper"), r.properties.className = g;
    const c = {
      type: "element",
      tagName: "span",
      properties: { className: ["footnote-tooltip"] },
      children: u
    };
    return r.children.push(c), P;
  });
  const o = {
    type: "element",
    tagName: "style",
    properties: {},
    children: [{ type: "text", value: _ }]
  };
  e.children.unshift(o);
}), w = () => {
  if (console.log("[footnote-tooltip] activate() called"), console.log("[footnote-tooltip] growiFacade:", typeof growiFacade, growiFacade), growiFacade == null || growiFacade.markdownRenderer == null) {
    console.warn("[footnote-tooltip] growiFacade or markdownRenderer is null, aborting");
    return;
  }
  const { optionsGenerators: e } = growiFacade.markdownRenderer;
  console.log("[footnote-tooltip] optionsGenerators:", e), console.log("[footnote-tooltip] customGenerateViewOptions:", typeof e.customGenerateViewOptions), console.log("[footnote-tooltip] customGeneratePreviewOptions:", typeof e.customGeneratePreviewOptions);
  const t = e.customGenerateViewOptions;
  e.customGenerateViewOptions = (...r) => {
    console.log("[footnote-tooltip] customGenerateViewOptions called with args:", r);
    const n = (t == null ? void 0 : t(...r)) ?? {};
    return n.rehypePlugins = n.rehypePlugins ?? [], n.rehypePlugins.push(F), console.log("[footnote-tooltip] rehypePlugins after push:", n.rehypePlugins), n;
  };
  const o = e.customGeneratePreviewOptions;
  e.customGeneratePreviewOptions = (...r) => {
    console.log("[footnote-tooltip] customGeneratePreviewOptions called with args:", r);
    const n = (o == null ? void 0 : o(...r)) ?? {};
    return n.rehypePlugins = n.rehypePlugins ?? [], n.rehypePlugins.push(F), n;
  }, w._origView = t, w._origPreview = o, console.log("[footnote-tooltip] activate() completed successfully");
}, B = () => {
  if (growiFacade == null || growiFacade.markdownRenderer == null)
    return;
  const { optionsGenerators: e } = growiFacade.markdownRenderer, t = w._origView, o = w._origPreview;
  t !== void 0 && (e.customGenerateViewOptions = t), o !== void 0 && (e.customGeneratePreviewOptions = o);
};
console.log("[footnote-tooltip] script loaded, registering pluginActivators");
console.log("[footnote-tooltip] current window.pluginActivators:", window.pluginActivators);
window.pluginActivators == null && (window.pluginActivators = []);
window.pluginActivators.push({ activate: w, deactivate: B });
console.log("[footnote-tooltip] registered, pluginActivators length:", window.pluginActivators.length);

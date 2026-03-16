const F = (
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
      return j;
    if (typeof e == "function")
      return w(e);
    if (typeof e == "object")
      return Array.isArray(e) ? R(e) : (
        // Cast because `ReadonlyArray` goes into the above but `isArray`
        // narrows to `Array`.
        S(
          /** @type {Props} */
          e
        )
      );
    if (typeof e == "string")
      return G(e);
    throw new Error("Expected function, string, or object as test");
  }
);
function R(e) {
  const t = [];
  let n = -1;
  for (; ++n < e.length; )
    t[n] = F(e[n]);
  return w(o);
  function o(...r) {
    let s = -1;
    for (; ++s < t.length; )
      if (t[s].apply(this, r)) return !0;
    return !1;
  }
}
function S(e) {
  const t = (
    /** @type {Record<string, unknown>} */
    e
  );
  return w(n);
  function n(o) {
    const r = (
      /** @type {Record<string, unknown>} */
      /** @type {unknown} */
      o
    );
    let s;
    for (s in e)
      if (r[s] !== t[s]) return !1;
    return !0;
  }
}
function G(e) {
  return w(t);
  function t(n) {
    return n && n.type === e;
  }
}
function w(e) {
  return t;
  function t(n, o, r) {
    return !!(E(n) && e.call(
      this,
      n,
      typeof o == "number" ? o : void 0,
      r || void 0
    ));
  }
}
function j() {
  return !0;
}
function E(e) {
  return e !== null && typeof e == "object" && "type" in e;
}
const A = [], I = !0, N = !1, k = "skip";
function T(e, t, n, o) {
  let r;
  typeof t == "function" && typeof n != "function" ? (o = n, n = t) : r = t;
  const s = F(r), l = o ? -1 : 1;
  f(e, void 0, [])();
  function f(i, d, p) {
    const u = (
      /** @type {Record<string, unknown>} */
      i && typeof i == "object" ? i : {}
    );
    if (typeof u.type == "string") {
      const c = (
        // `hast`
        typeof u.tagName == "string" ? u.tagName : (
          // `xast`
          typeof u.name == "string" ? u.name : void 0
        )
      );
      Object.defineProperty(a, "name", {
        value: "node (" + (i.type + (c ? "<" + c + ">" : "")) + ")"
      });
    }
    return a;
    function a() {
      let c = A, h, y, x;
      if ((!t || s(i, d, p[p.length - 1] || void 0)) && (c = V(n(i, p)), c[0] === N))
        return c;
      if ("children" in i && i.children) {
        const g = (
          /** @type {UnistParent} */
          i
        );
        if (g.children && c[0] !== k)
          for (y = (o ? g.children.length : -1) + l, x = p.concat(g); y > -1 && y < g.children.length; ) {
            const O = g.children[y];
            if (h = f(O, y, x)(), h[0] === N)
              return h;
            y = typeof h[1] == "number" ? h[1] : y + l;
          }
      }
      return c;
    }
  }
}
function V(e) {
  return Array.isArray(e) ? e : typeof e == "number" ? [I, e] : e == null ? A : [e];
}
function b(e, t, n, o) {
  let r, s, l;
  s = t, l = n, r = o, T(e, s, f, r);
  function f(i, d) {
    const p = d[d.length - 1], u = p ? p.children.indexOf(i) : void 0;
    return l(i, u, p);
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
function C(e) {
  return JSON.parse(JSON.stringify(e));
}
function v(e) {
  return e.filter((t) => !(t.type === "element" && t.tagName === "a" && (t.properties ?? {}).dataFootnoteBackref != null)).map((t) => t.type === "element" && t.children ? { ...t, children: v(t.children) } : t);
}
function z(e) {
  const t = /* @__PURE__ */ new Map();
  return b(e, "element", (n) => {
    var o;
    if (n.tagName === "section" && ((o = n.properties) == null ? void 0 : o.dataFootnotes) != null)
      return b(n, "element", (r) => {
        var s;
        if (r.tagName === "li" && typeof ((s = r.properties) == null ? void 0 : s.id) == "string") {
          const l = r.properties.id, f = C(r.children);
          t.set(l, v(f));
        }
      }), k;
  }), t;
}
const P = () => (e) => {
  const t = z(e);
  if (t.size === 0) return;
  b(e, "element", (o) => {
    var u;
    if (o.tagName !== "sup") return;
    const r = o.children.find(
      (a) => {
        var c;
        return a.type === "element" && a.tagName === "a" && ((c = a.properties) == null ? void 0 : c.dataFootnoteRef) != null;
      }
    );
    if (!r) return;
    const l = String(((u = r.properties) == null ? void 0 : u.href) ?? "").replace(/^#/, ""), f = t.get(l);
    if (!f) return;
    o.properties = o.properties ?? {};
    const i = o.properties.className, d = Array.isArray(i) ? i.filter((a) => typeof a == "string" || typeof a == "number") : i != null ? [i] : [];
    d.push("footnote-tooltip-wrapper"), o.properties.className = d;
    const p = {
      type: "element",
      tagName: "span",
      properties: { className: ["footnote-tooltip"] },
      children: f
    };
    return o.children.push(p), k;
  });
  const n = {
    type: "element",
    tagName: "style",
    properties: {},
    children: [{ type: "text", value: _ }]
  };
  e.children.unshift(n);
}, m = () => {
  if (growiFacade == null || growiFacade.markdownRenderer == null)
    return;
  const { optionsGenerators: e } = growiFacade.markdownRenderer, t = e.customGenerateViewOptions;
  e.customGenerateViewOptions = (...o) => {
    const r = (t == null ? void 0 : t(...o)) ?? {};
    return r.rehypePlugins = r.rehypePlugins ?? [], r.rehypePlugins.push(P), r;
  };
  const n = e.customGeneratePreviewOptions;
  e.customGeneratePreviewOptions = (...o) => {
    const r = (n == null ? void 0 : n(...o)) ?? {};
    return r.rehypePlugins = r.rehypePlugins ?? [], r.rehypePlugins.push(P), r;
  }, m._origView = t, m._origPreview = n;
}, B = () => {
  if (growiFacade == null || growiFacade.markdownRenderer == null)
    return;
  const { optionsGenerators: e } = growiFacade.markdownRenderer, t = m._origView, n = m._origPreview;
  t !== void 0 && (e.customGenerateViewOptions = t), n !== void 0 && (e.customGeneratePreviewOptions = n);
};
window.pluginActivators == null && (window.pluginActivators = []);
window.pluginActivators.push({ activate: m, deactivate: B });

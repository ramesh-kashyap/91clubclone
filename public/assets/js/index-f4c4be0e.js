import { _ as I, G as le, g as M, aX as te, dx as ce, dy as be, o as ee, u as ye, S as re, a as we, dz as ke, dA as Se, dB as $e, dC as Ce, b6 as Ae, bm as Le, b7 as Ie, b8 as De, K as ue, i as ae, h as Te, dD as oe, dE as Be, r as de, j as Ee } from "./page-activity-43faed1f.js"; import { _ as R, P as ve, Q, a2 as L, o as p, j as k, a4 as Z, a5 as Pe, l as s, a6 as h, a1 as y, a0 as d, a9 as _e, H as r, A as O, N as me, ap as pe, r as f, a3 as fe, aa as A, af as xe, ag as Ne, q as Re, Z as Ve, J as N, G as J, ae as C, a7 as P, a8 as K, K as Fe, aD as Ge, aC as ne, b1 as je, X as He, ac as z, $ as Oe, B as Ue, b2 as Me, ak as U, k as Ke, a_ as ze, b3 as Ye, b4 as Xe, b5 as qe, b6 as We, b7 as Je, b8 as Qe, b9 as Ze, ba as et, bb as tt, bc as st, bd as at, be as ot, bf as nt, bg as it, bh as lt, bi as ct, bj as rt, bk as ut, bl as dt, bm as vt, bn as _t, bo as mt, bp as pt, bq as ft, br as gt, bs as ht, bt, bu as yt, bv as wt, bw as kt, bx as St, by as $t, bz as Ct, bA as At, bB as Lt, bC as It, bD as Dt, bE as Tt, bF as Bt, bG as Et, bH as Pt } from "./modules-9132e430.js"; import { u as xt } from "./page-login-fb5c94e2.js"; import "./native/index-ae5759df.js"; import "./en-5d8a3ac3.js"; import "./rus-f0d331de.js"; import "./vi-89dc03ec.js"; import "./id-bea2dc85.js"; import "./hd-3edac788.js"; import "./tha-5f8bf325.js"; import "./md-fb8bbb52.js"; import "./bra-570a64af.js"; import "./my-f6ad06a4.js"; import "./bdt-86ee3846.js"; import "./zh-33a42051.js"; import "./pak-69f269ef.js"; import "./ar-abf1e4fe.js"; import "./page-home-12650d85.js"; window.getBuildInfo = function () { return { buildTime: "8/9/2024, 8:28:04 PM", branch: " commitId:4615ae242a31a42c124039426c32d79ae723f681" } }; (function () { const e = document.createElement("link").relList; if (e && e.supports && e.supports("modulepreload")) return; for (const o of document.querySelectorAll('link[rel="modulepreload"]')) n(o); new MutationObserver(o => { for (const i of o) if (i.type === "childList") for (const u of i.addedNodes) u.tagName === "LINK" && u.rel === "modulepreload" && n(u) }).observe(document, { childList: !0, subtree: !0 }); function a(o) { const i = {}; return o.integrity && (i.integrity = o.integrity), o.referrerPolicy && (i.referrerPolicy = o.referrerPolicy), o.crossOrigin === "use-credentials" ? i.credentials = "include" : o.crossOrigin === "anonymous" ? i.credentials = "omit" : i.credentials = "same-origin", i } function n(o) { if (o.ep) return; o.ep = !0; const i = a(o); fetch(o.href, i) } })(); const Nt = { class: "tabbar__container" }, Rt = ["onClick"], Vt = { key: 0, class: "promotionBg" }, Ft = R({ __name: "index", setup(t) { const e = ve(), a = Q(); async function n(i) { await e.push({ name: i }) } const o = [{ name: "home" }, { name: "activity" }, { name: "promotion" }, { name: "wallet" }, { name: "main" }]; return (i, u) => { const c = L("svg-icon"); return p(), k("div", Nt, [(p(), k(Z, null, Pe(o, (l, v) => s("div", { class: _e(["tabbar__container-item", { active: l.name === r(a).name }]), key: l + "" + v, onClick: _ => n(l.name) }, [h(c, { name: l.name }, null, 8, ["name"]), l.name === "promotion" ? (p(), k("div", Vt)) : y("v-if", !0), s("span", null, d(i.$t(l.name)), 1)], 10, Rt)), 64))]) } } }); const Gt = I(Ft, [["__scopeId", "data-v-6ab3f23e"], ["__file", "/var/lib/jenkins/workspace/web-å°åº¦-Big Daddy Pro-webnew2/src/components/TabBar/index.vue"]]); function jt() { const t = le(), e = () => { document.visibilityState === "visible" ? t.setvisibility() : t.setvisibility(0) }; O(() => { document.addEventListener("visibilitychange", e) }), me(() => { document.removeEventListener("visibilitychange", e) }) } const Ht = R({ __name: "Customer", setup(t) { pe(m => ({ "f6a705e1-currentFontFamily": V.value })); const e = f(!1), a = f({ x: 0, y: 0 }), n = f(0), o = f(0), i = f(0), u = f(0), c = f(0), l = f(0), v = f(); let _, D, T, B; const { getSelfCustomerServiceLink: G } = xt({ ServerType: 2 }); function j() { H(_, D, T, B) || G() } O(() => { v.value = document.getElementById("customerId") }); function w(m) { e.value = !0; var g; m.touches ? g = m.touches[0] : g = m, a.value.x = g.clientX, a.value.y = g.clientY, n.value = v.value.offsetLeft, o.value = v.value.offsetTop, _ = m.clientX, D = m.clientY } function $(m) { if (e.value) { var g, E = document.getElementById("customerId"), F = E.clientWidth, Y = E.clientHeight, X = document.documentElement.clientHeight, b = document.documentElement.clientWidth; m.touches ? g = m.touches[0] : g = m, i.value = g.clientX - a.value.x, u.value = g.clientY - a.value.y, c.value = n.value + i.value, l.value = o.value + u.value, c.value <= 0 && (c.value = 0), l.value <= 0 && (l.value = 0), c.value >= b - F && (c.value = b - F), l.value >= X - Y && (l.value = X - Y), v.value.style.left = c.value + "px", v.value.style.top = l.value + "px", document.addEventListener("touchmove", function () { m.preventDefault() }, !1) } m.stopPropagation(), m.preventDefault() } function S(m) { e.value = !1, T = m.clientX, B = m.clientY } function H(m, g, E, F) { return !(Math.sqrt((m - E) * (m - E) + (g - F) * (g - F)) <= 1) } const V = f("bahnschrift"); return (m, g) => { const E = fe("lazy"); return p(), k("div", { class: "customer", onClick: j, onMousedown: w, onTouchstart: w, onMousemove: $, onTouchmove: $, onMouseup: S, id: "customerId" }, [A(s("img", null, null, 512), [[E, r(M)("home", "icon_sevice")]])], 32) } } }); const Ot = I(Ht, [["__file", "/var/lib/jenkins/workspace/web-å°åº¦-Big Daddy Pro-webnew2/src/components/common/Customer.vue"]]), Ut = "/assets/png/logo-f7e29255.png"; const Mt = {}, ge = t => (xe("data-v-5eb72be7"), t = t(), Ne(), t), Kt = { class: "start-page" }, zt = ge(() => s("div", { class: "dice" }, null, -1)), Yt = ge(() => s("img", { class: "logo", src: Ut }, null, -1)); function Xt(t, e) { return p(), k("div", Kt, [s("div", null, [zt, s("p", null, d(t.$t("fairAndSafe")), 1), Yt])]) } const qt = I(Mt, [["render", Xt], ["__scopeId", "data-v-5eb72be7"], ["__file", "/var/lib/jenkins/workspace/web-å°åº¦-Big Daddy Pro-webnew2/entrance/91club/StartPage.vue"]]), Wt = { class: "header" }, Jt = { class: "title" }, Qt = { class: "tip" }, Zt = { class: "container" }, es = { class: "footer" }, ts = R({ __name: "dialog", setup(t) { const e = ve(), a = Q(), n = f(!1), { closeFirstSave: o } = te(), { ActiveSotre: i, getFirstRechargeList: u } = ce(), c = Re(new Date).format("YYYY-MM-DD"), l = Ve("firstSave", null), v = N(() => l.value == c), _ = () => { v.value ? (l.value = "", localStorage.removeItem("firstSave")) : l.value = c }, D = () => { n.value = !1, o() }, T = ["activity", "home", "main", "wallet", "promotion"]; J(() => a.name, w => { T.includes(a.name) && B() }); const B = () => { l.value != c && u().then(w => { if (!w.length) { n.value = !1, o(); return } const $ = w.find(S => S.isFinshed); $ && (i.value.isShowFirstSaveDialog = !1), $ || (n.value = !0) }) }, G = () => { n.value = !1, o(!0), e.push({ name: "FirstRecharge" }) }, j = () => { n.value = !1, o(!0), e.push({ name: "Recharge" }) }; return O(() => { T.includes(a.name) && B() }), (w, $) => { const S = L("svg-icon"), H = L("van-dialog"); return p(), C(H, { show: n.value, "onUpdate:show": $[0] || ($[0] = V => n.value = V), className: "firstSaveDialog" }, { title: P(() => [s("div", Wt, [s("div", Jt, d(w.$t("firstDialogH")), 1), s("div", Qt, d(w.$t("firstDialogTip")), 1)])]), footer: P(() => [s("div", es, [s("div", { class: _e(["active", { a: v.value }]), onClick: _ }, [h(S, { name: "active" }), K(d(w.$t("noTipToday")), 1)], 2), s("div", { class: "btn", onClick: G }, d(w.$t("activity")), 1)])]), default: P(() => [s("div", Zt, [h(be, { list: r(i).FirstRechargeList, onGorecharge: j }, null, 8, ["list"])]), s("div", { class: "close", onClick: D })]), _: 1 }, 8, ["show"]) } } }); const ss = I(ts, [["__scopeId", "data-v-9cd12fb2"], ["__file", "/var/lib/jenkins/workspace/web-å°åº¦-Big Daddy Pro-webnew2/src/components/Activity/FirstRecharge/dialog.vue"]]), as = { class: "dialog-window" }, os = { class: "dialog-wrapper" }, ns = { class: "dialog-title" }, is = { class: "dialog-content" }, ls = { class: "dialog-window" }, cs = { class: "dialog-wrapper" }, rs = { class: "dialog-title" }, us = { class: "dialog-tips" }, ds = { class: "dialog-content" }, vs = { class: "dialog-tips", style: { "margin-bottom": "0" } }, _s = { class: "dialog-window" }, ms = { class: "dialog-wrapper" }, ps = { class: "dialog-tips", style: { "margin-top": "10px" } }, fs = { class: "dialog-title", style: { "margin-top": "0" } }, gs = { class: "dialog-tips" }, hs = { class: "dialog-content" }, bs = R({ __name: "AllPageDialog", setup(t) { Q(); const { ActiveSotre: e } = ce(), { store: a, closeInvite: n, showFirstSave: o, onReturnAwards: i } = te(); return (u, c) => { const l = L("van-dialog"), v = fe("lazy"); return p(), k(Z, null, [r(o) ? (p(), C(ss, { key: 0 })) : y("v-if", !0), h(l, { show: r(e).showReceiveDialog, "onUpdate:show": c[1] || (c[1] = _ => r(e).showReceiveDialog = _), "show-confirm-button": !1, className: "noOverHidden" }, { default: P(() => [s("div", as, [s("div", os, [A(s("img", null, null, 512), [[v, r(M)("public", "succeed")]]), s("div", ns, d(u.$t("awardsReceived")), 1), s("div", is, [A(s("img", null, null, 512), [[v, r(M)("activity/DailyTask", "amountIcon")]]), s("span", null, d(r(ee)(r(e).receiveAmount)), 1)]), s("div", { class: "dialog-btn", onClick: c[0] || (c[0] = _ => r(e).showReceiveDialog = !1) }, d(u.$t("confirm")), 1)])])]), _: 1 }, 8, ["show"]), h(l, { show: r(a).invite, "onUpdate:show": c[3] || (c[3] = _ => r(a).invite = _), "show-confirm-button": !1, className: "noOverHidden" }, { default: P(() => [s("div", ls, [s("div", cs, [A(s("img", null, null, 512), [[v, r(M)("public", "succeed")]]), s("div", rs, d(u.$t("inviteTips")), 1), s("p", us, d(u.$t("inviteAmount")), 1), s("div", ds, [s("span", vs, d(u.$t("commissionAmount")), 1), s("span", null, d(r(ee)(r(a).rebateAmount)), 1)]), s("div", { class: "dialog-btn", onClick: c[2] || (c[2] = _ => r(n)()) }, d(u.$t("receive")), 1)])])]), _: 1 }, 8, ["show"]), h(l, { show: r(a).oldUser, "onUpdate:show": c[5] || (c[5] = _ => r(a).oldUser = _), "show-confirm-button": !1, "close-on-click-overlay": !0, className: "noOverHidden" }, { default: P(() => [s("div", _s, [s("div", ms, [A(s("img", null, null, 512), [[v, r(M)("public", "succeed")]]), s("p", ps, d(u.$t("oldPromptTip")), 1), s("div", fs, d(u.$t("oldPrompt")), 1), s("p", gs, d(u.$t("oldPromptGift")), 1), s("div", hs, [s("span", null, d(r(ee)(r(a).returnAwards)), 1)]), s("div", { class: "dialog-btn", onClick: c[4] || (c[4] = _ => r(i)()) }, d(u.$t("receive")), 1)])])]), _: 1 }, 8, ["show"])], 64) } } }); const ys = I(bs, [["__scopeId", "data-v-3d4fafbb"], ["__file", "/var/lib/jenkins/workspace/web-å°åº¦-Big Daddy Pro-webnew2/src/components/common/AllPageDialog.vue"]]), ws = R({ __name: "App", setup(t) { pe(b => ({ "f13b4d11-currentFontFamily": V.value })); const { openAll: e } = te(), a = Le(), n = f(!1), o = f(!1), i = Q(), u = ye(), c = re(), { locale: l } = Fe(), v = le(), _ = f(!1), D = N(() => i.meta.tabBar), T = "redHome", B = N(() => ["electronic", "blackGoldHome"].includes(T) ? !1 : !["/wallet/Withdraw/C2cDetail", "/wallet/RechargeHistory/RechargeUpiDetail", "/wallet/Withdraw/Upi", "/wallet/Withdraw/AddUpi", "/wallet/Withdraw/c2cCancelWithdrawal/index.vue", "/wallet/otherPay?type=C2C", "/home/game"].includes(i.path)), G = f(0), j = f(Math.floor(Math.random() * 1e4)), w = N(() => i.name + j.value), $ = () => { a.on("changeKeepAliveKey", () => { j.value = Math.floor(Math.random() * 1e4) }) }; sessionStorage.getItem("isload") ? n.value = !1 : (o.value = !0, sessionStorage.setItem("isload", o.value.toString()), n.value = !0), c.getHomeSetting(), J(() => c.getAreacode, b => { b && u.setNumberType(b.substring(1)) }), J(() => c.getDL, b => { l.value = b, v.updateLanguage(b), Ie(b), De(ue.global.t) }), setTimeout(() => { n.value = !1 }, 2e3); const S = f(!1), H = we(); H.$subscribe((b, x) => { S.value = x.isLoading, H.setLoading(S.value) }); const V = f("bahnschrift"); let m = ke(), g = c.getLanguage, E = Se(m, g); const F = async b => { const x = [{ title: "vi", fontStyle: "bahnschrift" }, { title: "else", fontStyle: "'Roboto', 'Inter', sans-serif" }], q = x.findIndex(W => W.title == E); q >= 0 ? V.value = x[q].fontStyle : V.value = x[x.length - 1].fontStyle }, Y = () => { a.on("keyChange", () => { G.value++ }), a.on("changeIsGame", () => { _.value = !_.value, S.value = !S.value }) }, X = () => { a.off("keyChange"), a.off("changeKeepAliveKey"), a.off("changeIsGame") }; return u.setNumberType(c.getAreacode.substring(1)), F(), O(() => { $e() && Ce(), e(), X(), Y(), $(), localStorage.getItem("language") && Ae(localStorage.getItem("language")) }), jt(), (b, x) => { const q = L("LoadingView"); return p(), k(Z, null, [h(q, { loading: S.value, type: "loading", isGame: _.value }, { default: P(() => [(p(), C(r(je), { key: G.value }, { default: P(({ Component: W }) => [(p(), C(Ge, { max: 1 }, [r(i).meta.keepAlive ? (p(), C(ne(W), { key: w.value })) : y("v-if", !0)], 1024)), r(i).meta.keepAlive ? y("v-if", !0) : (p(), C(ne(W), { key: 0 }))]), _: 1 })), y("online custom service"), B.value ? (p(), C(Ot, { key: 0 })) : y("v-if", !0), D.value ? (p(), C(Gt, { key: 1 })) : y("v-if", !0)]), _: 1 }, 8, ["loading", "isGame"]), n.value ? (p(), C(qt, { key: 0 })) : y("v-if", !0), h(ys)], 64) } } }); const ks = I(ws, [["__file", "/var/lib/jenkins/workspace/web-å°åº¦-Big Daddy Pro-webnew2/entrance/91club/App.vue"]]); const Ss = { mounted(t, e) { if (typeof e.value[0] != "function" || typeof e.value[1] != "number") throw new Error("v-debounce: value must be an array that includes a function and a number"); let a = null; const n = e.value[0], o = e.value[1]; t.__handleClick__ = function () { a && clearTimeout(a), a = setTimeout(() => { n() }, o || 500) }, t.addEventListener("click", t.__handleClick__) }, beforeUnmount(t) { t.removeEventListener("click", t.__handleClick__) } }, $s = { mounted(t, e) { if (typeof e.value[0] != "function" || typeof e.value[1] != "number") throw new Error("v-throttle: value must be an array that includes a function and a number"); let a = null; const n = e.value[0], o = e.value[1]; t.__handleClick__ = function () { a && clearTimeout(a), t.disabled || (t.disabled = !0, n(), a = setTimeout(() => { t.disabled = !1 }, o || 500)) }, t.addEventListener("click", t.__handleClick__) }, beforeUnmount(t) { t.removeEventListener("click", t.__handleClick__) } }, Cs = { mounted(t, e) { t.addEventListener("input", a => { const o = t.value.replace(/\D+/g, ""); t.value = o, e.value = o }) } }, As = t => ({ beforeMount: (e, a) => { e.classList.add("ar-lazyload"); const { value: n } = a; e.dataset.origin = n, t.observe(e) }, updated(e, a) { e.dataset.origin = a.value, t.observe(e) }, unmounted(e, a) { t.unobserve(e) }, mounted(e, a) { t.observe(e) } }), Ls = { mounted(t, e) { let a = 0; const n = e.value && e.value.wait ? e.value.wait : 3e3, o = i => { const u = Date.now(); u - a >= n && (a = u, e.value && e.value.handler && e.value.handler(i)) }; t.addEventListener("click", o), t._throttleClickCleanup = () => { t.removeEventListener("click", o) } }, unmounted(t) { t._throttleClickCleanup && t._throttleClickCleanup(), delete t._throttleClickCleanup } }, Is = { mounted(t, e) { const { value: a } = e; let n = He("permission", null); n.value === null || !a || (n && (n = JSON.parse(n.value)), n && n[a] === !1 && (t.style.display = "none")) } }, ie = { debounce: Ss, throttle: $s, onlyNum: Cs, throttleClick: Ls, haspermission: Is }, Ds = { install: function (t) { Object.keys(ie).forEach(a => { t.directive(a, ie[a]) }); const e = new IntersectionObserver(a => { a.forEach(n => { if (n.isIntersecting) { const o = n.target; o.src = o.dataset.origin || ae("images", "avatar"), o.onerror = () => { e.unobserve(o); let i = o.dataset.img || ae("images", "avatar"); if (!i || i != null && i.includes("undefined")) { o.onerror = null; return } o.src = i, o.style.objectFit = "contain" }, o.classList.remove("ar-lazyload"), e.unobserve(o) } }) }, { rootMargin: "0px 0px -50px 0px" }); t.directive("lazy", As(e)) } }, Ts = { class: "navbar-fixed" }, Bs = { class: "navbar__content" }, Es = { class: "navbar__content-center" }, Ps = { class: "navbar__content-title" }, xs = R({ __name: "NavBar", props: { title: { type: String, default: "" }, placeholder: { type: Boolean, default: !0 }, leftArrow: { type: Boolean, default: !1 }, backgroundColor: { type: String, default: "#f7f8ff" }, classN: { type: String, default: "" }, headLogo: { type: Boolean, default: !1 }, headerUrl: { type: String, default: "" } }, emits: ["click-left", "click-right"], setup(t, { emit: e }) { const a = f(), n = re(), o = N(() => n.getHeadLogo), i = () => { e("click-left") }, u = () => { e("click-right") }; return O(() => { }), (c, l) => { const v = L("van-icon"); return p(), k("div", { class: "navbar", ref_key: "navbar", ref: a }, [s("div", Ts, [s("div", Bs, [s("div", { class: "navbar__content-left", onClick: i }, [z(c.$slots, "left", {}, () => [t.leftArrow ? (p(), C(v, { key: 0, name: "arrow-left" })) : y("v-if", !0)], !0)]), s("div", Es, [t.headLogo ? (p(), k("div", { key: 0, class: "headLogo", style: Oe({ backgroundImage: "url(" + (t.headerUrl || o.value) + ")" }) }, null, 4)) : y("v-if", !0), z(c.$slots, "center", {}, () => [s("div", Ps, d(t.title), 1)], !0)]), s("div", { class: "navbar__content-right", onClick: u }, [z(c.$slots, "right", {}, void 0, !0)])])])], 512) } } }); const Ns = I(xs, [["__scopeId", "data-v-12a80a3e"], ["__file", "/var/lib/jenkins/workspace/web-å°åº¦-Big Daddy Pro-webnew2/src/components/common/NavBar.vue"]]), Rs = { class: "ar-loading-view" }, Vs = { class: "loading-wrapper" }, Fs = { class: "com__box" }, Gs = Ke('<div class="loading" data-v-647954c7><div class="shape shape-1" data-v-647954c7></div><div class="shape shape-2" data-v-647954c7></div><div class="shape shape-3" data-v-647954c7></div><div class="shape shape-4" data-v-647954c7></div></div>', 1), js = { class: "skeleton-wrapper" }, Hs = { class: "iosDialog" }, Os = { class: "title" }, Us = { class: "websit_info" }, Ms = ["src"], Ks = { class: "link" }, zs = { class: "text" }, Ys = { class: "text" }, Xs = { class: "text" }, qs = ["src"], Ws = R({ __name: "LoadingView", props: { loading: { type: Boolean, required: !0 }, type: { type: String, required: !0 }, isGame: { type: Boolean, required: !0 } }, setup(t) { const e = t, a = f(); let n = null; const { homeState: o, downloadIcon: i, webSiteUrl: u } = Te(), c = N(() => location.origin || ""); return O(async () => { await Ue(), n = Me.loadAnimation({ container: a.value, renderer: "svg", loop: !0, autoplay: !0, path: "/data.json" }) }), J(() => e.loading, () => { e.type === "loading" && !e.isGame && (e.loading ? n && n.play() : n && n.stop()) }), me(() => { n && n.destroy(), n = null }), (l, v) => { const _ = L("VanSkeleton"), D = L("svg-icon"), T = L("van-popup"); return p(), k(Z, null, [A(s("div", Rs, [z(l.$slots, "template", {}, () => [A(s("div", Vs, [y(" <VanLoading /> "), A(s("div", { ref_key: "element", ref: a, class: "loading-animat" }, null, 512), [[U, !l.isGame]]), A(s("div", Fs, [y(" loading "), Gs, y(" è¯´æ˜Žï¼šç»„ä»¶å ")], 512), [[U, l.isGame]]), y(' <div class="animation"></div> ')], 512), [[U, l.type === "loading"]]), A(s("div", js, [h(_, { row: 10 }), h(_, { title: "", avatar: "", row: 5 }), h(_, { title: "", row: 5 })], 512), [[U, l.type === "skeleton"]])], !0)], 512), [[U, l.loading]]), z(l.$slots, "default", {}, void 0, !0), h(T, { show: r(o).iosDialog, "onUpdate:show": v[0] || (v[0] = B => r(o).iosDialog = B), round: "", closeable: "", position: "bottom", style: { height: "40%" } }, { default: P(() => [s("div", Hs, [s("div", Os, d(l.$t("pwaInstall")), 1), s("div", Us, [s("img", { class: "icon", src: r(i) }, null, 8, Ms), s("div", Ks, [s("div", null, d(c.value.split("://")[1]), 1), s("div", null, d(c.value), 1)])]), s("div", zs, [K("1. " + d(l.$t("pwaText1")) + " ", 1), h(D, { name: "share" })]), s("div", Ys, [K("2. " + d(l.$t("pwaText2")) + " ", 1), s("span", null, [K(d(l.$t("pwaText3")) + " ", 1), h(D, { name: "add_icon" })])]), s("div", Xs, [K("3. " + d(l.$t("pwaText4")) + " ", 1), s("img", { class: "icon", src: r(i) }, null, 8, qs)])])]), _: 1 }, 8, ["show"])], 64) } } }); const Js = I(Ws, [["__scopeId", "data-v-647954c7"], ["__file", "/var/lib/jenkins/workspace/web-å°åº¦-Big Daddy Pro-webnew2/src/components/common/LoadingView.vue"]]); const Qs = ["xlink:href"], Zs = { __name: "svgIcons", props: { name: { type: String, required: !0 }, color: { type: String, default: "" } }, setup(t) { const e = t, a = N(() => `#icon-${e.name}`), n = N(() => e.name ? `svg-icon icon-${e.name}` : "svg-icon"); return (o, i) => (p(), k("svg", ze({ class: n.value }, o.$attrs, { style: { color: t.color } }), [s("use", { "xlink:href": a.value }, null, 8, Qs)], 16)) } }, ea = I(Zs, [["__file", "/var/lib/jenkins/workspace/web-å°åº¦-Big Daddy Pro-webnew2/src/components/common/svgIcons.vue"]]), ta = { class: "ar-searchbar__selector" }, sa = { class: "ar-searchbar__selector-default" }, aa = R({ __name: "ArSelect", props: { selectName: { type: String, default: "" } }, emits: ["click-select"], setup(t, { emit: e }) { const a = () => { e("click-select") }; return (n, o) => { const i = L("van-icon"); return p(), k("div", ta, [s("div", { onClick: a }, [s("span", sa, d(t.selectName), 1), h(i, { name: "arrow-down" })])]) } } }); const oa = I(aa, [["__scopeId", "data-v-fa757a88"], ["__file", "/var/lib/jenkins/workspace/web-å°åº¦-Big Daddy Pro-webnew2/src/components/common/ArSelect.vue"]]), na = t => { t.component("NavBar", Ns), t.component("LoadingView", Js), t.component("ArSelect", oa), t.component("svg-icon", ea), t.use(Ye).use(Xe).use(qe).use(We).use(Je).use(Qe).use(Ze).use(et).use(tt).use(st).use(at).use(ot).use(nt).use(it).use(lt).use(ct).use(rt).use(ut).use(dt).use(vt).use(_t).use(mt).use(pt).use(ft).use(gt).use(ht).use(bt).use(yt).use(wt).use(kt).use(St).use($t).use(Ct).use(At).use(Lt).use(It).use(Dt).use(ue).use(Ds).use(Tt); let e = t.config.globalProperties, a = {}; a.TopHeight = 38, Object.keys(oe.refiter).forEach(n => { a[n] = oe.refiter[n] }), e.$u = a }; Be["Big Daddy Pro"](); de.addRoute({ path: "/", name: "home", component: () => Ee(() => import("./page-home-12650d85.js").then(t => t.X), ["assets/js/page-home-12650d85.js", "assets/js/modules-9132e430.js", "assets/css/modules-5dd73da0.css", "assets/js/page-activity-43faed1f.js", "assets/js/native/index-ae5759df.js", "assets/js/en-5d8a3ac3.js", "assets/js/rus-f0d331de.js", "assets/js/vi-89dc03ec.js", "assets/js/id-bea2dc85.js", "assets/js/hd-3edac788.js", "assets/js/tha-5f8bf325.js", "assets/js/md-fb8bbb52.js", "assets/js/bra-570a64af.js", "assets/js/my-f6ad06a4.js", "assets/js/bdt-86ee3846.js", "assets/js/zh-33a42051.js", "assets/js/pak-69f269ef.js", "assets/js/ar-abf1e4fe.js", "assets/css/page-activity-2987852d.css", "assets/css/page-home-38735181.css"]), meta: { title: "home", tabBar: !0, keepAlive: !1 } }); const se = Bt(ks), he = Et(); na(se); he.use(Pt); se.use(de).use(he); se.mount("#app");
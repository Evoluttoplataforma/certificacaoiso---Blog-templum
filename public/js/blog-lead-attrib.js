/**
 * Atribuição de lead no blog (sessionStorage + cookies do tracking-kit).
 * Sobrevive ao clique para /form/ e evita perder artigo de origem e referrer.
 */
(function () {
  var KEY = "tpl_blog_attrib";
  var ORIGIN = location.origin || "https://certificacaoiso.com.br";

  function readCookie(name) {
    var re = new RegExp("(?:^|; )" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "=([^;]*)");
    var m = document.cookie.match(re);
    return m ? decodeURIComponent(m[1]) : "";
  }

  function normPath(path) {
    var p = path || "/";
    if (p.charAt(0) !== "/") p = "/" + p;
    if (p.length > 1 && p.charAt(p.length - 1) !== "/") p += "/";
    return p;
  }

  function isContentPath(path) {
    var p = normPath(path);
    if (p === "/") return false;
    if (/^\/form\/?$/i.test(p)) return false;
    if (p.indexOf("/buscar") === 0) return false;
    if (p.indexOf("/acesso") === 0) return false;
    return true;
  }

  function utmFromSearch() {
    var p = new URLSearchParams(location.search);
    var o = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach(function (k) {
      var v = p.get(k);
      if (v) o[k] = v;
    });
    return o;
  }

  function load() {
    try {
      var raw = sessionStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (_) {
      return {};
    }
  }

  function save(a) {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(a));
    } catch (_) {}
  }

  function syncKitCookies(a) {
    var lp = readCookie("trk_landing_page");
    if (lp) a.kit_landing_page = lp;
    var ftS = readCookie("ft_utm_source");
    if (ftS) {
      a.ft_utm_source = ftS;
      a.ft_utm_medium = readCookie("ft_utm_medium") || "";
      a.ft_utm_campaign = readCookie("ft_utm_campaign") || "";
    }
    var ltS = readCookie("lt_utm_source");
    if (ltS) {
      a.lt_utm_source = ltS;
      a.lt_utm_medium = readCookie("lt_utm_medium") || "";
      a.lt_utm_campaign = readCookie("lt_utm_campaign") || "";
    }
    return a;
  }

  function onPage() {
    var path = normPath(location.pathname);
    var a = load();
    if (!a.session_started) a.session_started = Date.now();

    if (!a.first_path) {
      a.first_path = path;
      a.first_url = location.href.split("#")[0];
      a.first_referrer = document.referrer || "";
    }

    var utm = utmFromSearch();
    if (utm.utm_source && utm.utm_source !== "direct") {
      if (!a.first_utm_source) {
        a.first_utm_source = utm.utm_source;
        a.first_utm_medium = utm.utm_medium || "";
        a.first_utm_campaign = utm.utm_campaign || "";
      }
      a.last_utm_source = utm.utm_source;
      a.last_utm_medium = utm.utm_medium || "";
      a.last_utm_campaign = utm.utm_campaign || "";
      a.last_utm_term = utm.utm_term || "";
    }

    if (isContentPath(path)) {
      a.last_content_path = path;
      a.last_content_url = ORIGIN.replace(/\/$/, "") + path;
      a.last_content_slug = path.replace(/^\/+|\/+$/g, "");
      var u = utmFromSearch();
      if (u.utm_campaign) a.last_content_utm_campaign = u.utm_campaign;
      else if (a.last_content_slug) a.last_content_utm_campaign = a.last_content_slug;
    }

    a.last_path = path;
    a.updated_at = Date.now();
    save(syncKitCookies(a));

    try {
      if (a.last_content_path) sessionStorage.setItem("blog_last_content_path", a.last_content_path);
    } catch (_) {}
  }

  function getPayload() {
    onPage();
    var a = syncKitCookies(load());
    return {
      pagina_entrada: a.first_path || "",
      pagina_entrada_url: a.first_url || "",
      blog_first_referrer: a.first_referrer || "",
      content_path: a.last_content_path || "",
      content_page: a.last_content_url || "",
      kit_landing_page: a.kit_landing_page || readCookie("trk_landing_page") || "",
      ft_utm_source: a.ft_utm_source || readCookie("ft_utm_source") || "",
      ft_utm_medium: a.ft_utm_medium || readCookie("ft_utm_medium") || "",
      ft_utm_campaign: a.ft_utm_campaign || readCookie("ft_utm_campaign") || "",
      lt_utm_source: a.lt_utm_source || readCookie("lt_utm_source") || "",
      lt_utm_medium: a.lt_utm_medium || readCookie("lt_utm_medium") || "",
      lt_utm_campaign: a.lt_utm_campaign || readCookie("lt_utm_campaign") || "",
      last_utm_source: a.last_utm_source || "",
      last_utm_medium: a.last_utm_medium || "",
    };
  }

  onPage();
  window.tplBlogLeadAttrib = {
    refresh: onPage,
    getPayload: getPayload,
    isContentPath: isContentPath,
  };
})();

/* =========================================================
   CD Tir 34 — TARIFS DES FORMULAIRES
   ---------------------------------------------------------
   Les tarifs se modifient sur la page reglages.html
   (protégée par mot de passe). Ils sont stockés dans une
   feuille Google et relus à chaque ouverture des formulaires.

   Les valeurs ci-dessous ne servent QUE de secours si Google
   est injoignable.
   ========================================================= */

// Adresse du script Google (Déployer > Application Web) — à renseigner une seule fois
window.TARIFS_API = "https://script.google.com/macros/s/AKfycbwIKBseLjw9H648gh3SFHm1He604BR81su4H4-RkNlLaywyGoLdHn0JIP5f4F3W2Kya/exec";

window.TARIFS = {
  km: 0.40,
  fait_a: "Montpellier",
  club_journee: 50,
  club_tir: 2,
  club_repas: 25,
  club_convivialite: 50
};
window.TARIFS_SOURCE = "secours";
window.TARIFS_MAJ = "";

window.TARIFS_APPLY = function(t){
  Object.keys(window.TARIFS).forEach(k => {
    if (!(k in t)) return;
    if (typeof window.TARIFS[k] === "number"){
      const x = Number(String(t[k]).replace(",", "."));
      if (Number.isFinite(x) && x >= 0) window.TARIFS[k] = x;
    } else if (String(t[k]).trim()) window.TARIFS[k] = String(t[k]).trim();
  });
};

window.TARIFS_READY = (function(){
  if (!/^https:\/\/script\.google\.com\//.test(window.TARIFS_API)) {
    console.warn("[Tarifs] Adresse du script non renseignée : tarifs de secours.");
    return Promise.resolve(window.TARIFS);
  }
  const ctrl = ("AbortController" in window) ? new AbortController() : null;
  const timer = setTimeout(() => ctrl && ctrl.abort(), 8000);
  return fetch(window.TARIFS_API + "?t=" + Date.now(), { signal: ctrl ? ctrl.signal : undefined })
    .then(r => r.json())
    .then(d => {
      if (!d || !d.ok || !d.tarifs) throw new Error("réponse invalide");
      window.TARIFS_APPLY(d.tarifs);
      window.TARIFS_SOURCE = "google";
      window.TARIFS_MAJ = d.maj || "";
    })
    .catch(err => console.warn("[Tarifs] Google injoignable, tarifs de secours utilisés :", err.message))
    .finally(() => clearTimeout(timer))
    .then(() => window.TARIFS);
})();

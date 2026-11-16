/* =========================================================
   CD Tir 34 — TARIFS DES FORMULAIRES
   ---------------------------------------------------------
   Les tarifs se modifient dans la feuille Google Sheets
   "CD Tir 34 — Tarifs des formulaires" (lien ci-dessous).
   Les formulaires la relisent à chaque ouverture.

   Les valeurs ci-dessous ne servent QUE de secours si la
   feuille est injoignable (pas d'internet, feuille non partagée…).
   ========================================================= */
window.TARIFS_SHEET_ID = "1sexuKtZgbiZq5gHDddIhmzes05AwLbTjY2rQ9dk0KYI";
window.TARIFS_SHEET_URL = "https://docs.google.com/spreadsheets/d/" + window.TARIFS_SHEET_ID + "/edit";

window.TARIFS = {
  km: 0.40,
  fait_a: "Montpellier",
  club_journee: 50,
  club_tir: 2,
  club_repas: 25,
  club_convivialite: 50
};
window.TARIFS_SOURCE = "secours";

(function(){
  function parseCsv(txt){
    const rows = []; let row = [], cur = "", q = false;
    for (let i = 0; i < txt.length; i++){
      const c = txt[i];
      if (q){
        if (c === '"' && txt[i+1] === '"'){ cur += '"'; i++; }
        else if (c === '"') q = false;
        else cur += c;
      } else if (c === '"') q = true;
      else if (c === ","){ row.push(cur); cur = ""; }
      else if (c === "\n" || c === "\r"){
        if (c === "\r" && txt[i+1] === "\n") i++;
        row.push(cur); rows.push(row); row = []; cur = "";
      } else cur += c;
    }
    if (cur !== "" || row.length){ row.push(cur); rows.push(row); }
    return rows;
  }

  const url = "https://docs.google.com/spreadsheets/d/" + window.TARIFS_SHEET_ID +
              "/gviz/tq?tqx=out:csv&headers=1&t=" + Date.now();
  const ctrl = ("AbortController" in window) ? new AbortController() : null;
  const timer = setTimeout(() => ctrl && ctrl.abort(), 6000);

  window.TARIFS_READY = fetch(url, { cache: "no-store", signal: ctrl ? ctrl.signal : undefined })
    .then(r => { if (!r.ok) throw new Error("HTTP " + r.status); return r.text(); })
    .then(txt => {
      if (/^\s*</.test(txt)) throw new Error("feuille non partagée");
      let n = 0;
      parseCsv(txt).forEach(cols => {
        const code = (cols[2] || "").trim();
        const val = (cols[1] || "").trim();
        if (!code || !(code in window.TARIFS) || val === "") return;
        if (typeof window.TARIFS[code] === "number"){
          const x = Number(val.replace(/\s|€/g, "").replace(",", "."));
          if (Number.isFinite(x) && x >= 0){ window.TARIFS[code] = x; n++; }
        } else { window.TARIFS[code] = val; n++; }
      });
      if (n) window.TARIFS_SOURCE = "feuille";
    })
    .catch(err => console.warn("[Tarifs] Feuille Google injoignable, tarifs de secours utilisés :", err.message))
    .finally(() => clearTimeout(timer))
    .then(() => window.TARIFS);
})();

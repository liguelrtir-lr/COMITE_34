/* =========================================================
   CD Tir 34 — TARIFS DE BASE
   ---------------------------------------------------------
   C'est le SEUL fichier à modifier pour changer les tarifs.
   (Ou plus simple : utiliser la page reglages.html qui
    fabrique ce fichier automatiquement.)

   Règles : utiliser un POINT pour les décimales (0.40 et non 0,40)
            ne pas toucher aux guillemets ni aux virgules en fin de ligne
   ========================================================= */
window.TARIFS = {
  version: "16/11/2026",          // date de mise à jour (affichée en bas de page)

  // Formulaires Arbitre / Comité / Divers
  km: 0.40,                       // € par kilomètre
  fait_a: "Montpellier",          // ville du "Fait à ..." sur le PDF

  // Formulaire Club (organisation compétition départementale)
  club_journee: 50,               // € par journée d'organisation
  club_tir: 2,                    // € par tir
  club_repas: 25,                 // € par repas arbitre
  club_convivialite: 50           // € forfait moment de convivialité
};

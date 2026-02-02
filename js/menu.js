// Sélection des éléments
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

// Ouvrir / fermer le menu hamburger
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Fermer le menu automatiquement quand on clique sur un lien (utile sur smartphone)
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
});

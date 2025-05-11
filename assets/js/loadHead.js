document.addEventListener("DOMContentLoaded", () => {
  fetch("./assets/components/head.html")
    .then(res => res.text())
    .then(html => document.head.insertAdjacentHTML("beforeend", html))
    .catch(err => console.error("Error cargando head global:", err));
});
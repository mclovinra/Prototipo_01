document.addEventListener("DOMContentLoaded", () => {
  fetch("./assets/components/menu.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("menu").innerHTML = html;

      // Marcar el enlace activo
      const links = document.querySelectorAll('#menu a');
      const currentPage = window.location.pathname.split("/").pop();

      links.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
          link.classList.add('active');
        }
      });
    });
});

function cerrarSesion() {
  if (confirm("¿Estás seguro que deseas cerrar sesión?")) {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
  }
}
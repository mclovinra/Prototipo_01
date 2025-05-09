// Cargar menú
fetch("/assets/components/menu.html")
  .then(res => res.text())
  .then(html => document.getElementById("menu").innerHTML = html);

// Mostrar tarjetas de productos
const productos = JSON.parse(localStorage.getItem("productos")) || [];
const contenedor = document.getElementById("tarjetas");

productos.forEach(p => {
  const tarjeta = document.createElement("div");
  tarjeta.className = "tarjeta";
  tarjeta.onclick = () => {
    const url = `producto.html?codigo=${encodeURIComponent(p.codigo)}`;
    window.location.href = url;
  };
  tarjeta.innerHTML = `
    <h3>${p.nombre}</h3>
    <p><strong>Código:</strong> ${p.codigo}</p>
    <p><strong>Stock:</strong> ${p.stock}</p>
    <p><strong>Etiqueta:</strong> ${p.etiqueta}</p>
  `;
  contenedor.appendChild(tarjeta);
});
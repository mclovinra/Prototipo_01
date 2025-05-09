// Cargar menú
fetch("/assets/components/menu.html")
  .then(res => res.text())
  .then(html => document.getElementById("menu").innerHTML = html);

// Productos iniciales
const inventarioInicial = [
  { nombre: "Lubricante A", codigo: "LB-A12", stock: 3, vencimiento: "2025-06-01", etiqueta: "Químico" },
  { nombre: "Motor Hidráulico", codigo: "MH-009", stock: 12, vencimiento: "---", etiqueta: "Mecánico" },
  { nombre: "Aceite Sintético", codigo: "AS-007", stock: 5, vencimiento: "2025-05-12", etiqueta: "Lubricante" },
  { nombre: "Filtro Industrial", codigo: "FI-015", stock: 2, vencimiento: "2026-01-01", etiqueta: "Repuesto" },
  { nombre: "Compresor X-500", codigo: "CX-500", stock: 0, vencimiento: "---", etiqueta: "Herramienta" }
];

// Guardar en localStorage si no existe
if (!localStorage.getItem("productos")) {
  localStorage.setItem("productos", JSON.stringify(inventarioInicial));
}

const body = document.getElementById("inventario-body");
const alerta = document.getElementById("alertaInfo");

function obtenerProductos() {
  return JSON.parse(localStorage.getItem("productos")) || [];
}

function guardarProductos(productos) {
  localStorage.setItem("productos", JSON.stringify(productos));
}

function renderTabla(filtro = "") {
  const productos = obtenerProductos();
  body.innerHTML = "";
  let alertas = 0;

  productos.forEach(prod => {
    if (filtro && !prod.nombre.toLowerCase().includes(filtro.toLowerCase()) && !prod.etiqueta.toLowerCase().includes(filtro.toLowerCase())) {
      return;
    }

    const row = document.createElement("tr");

    if (prod.stock < 4) {
      row.classList.add("alerta-stock");
      alertas++;
    }

    const hoy = new Date();
    if (prod.vencimiento !== "---" && prod.vencimiento !== "" && new Date(prod.vencimiento) < new Date(hoy.getFullYear(), hoy.getMonth() + 1, hoy.getDate())) {
      row.classList.add("alerta-vencimiento");
    }

    row.innerHTML = `
      <td>${prod.nombre}</td>
      <td>${prod.codigo}</td>
      <td>${prod.stock}</td>
      <td>${prod.vencimiento || "---"}</td>
      <td><span class="etiqueta">${prod.etiqueta}</span></td>
      <td><button onclick="window.location.href='detalle_pieza.html'">
      <i class="fas fa-eye"></i> Ver detalle</button></td>
    `;
    body.appendChild(row);
  });

  alerta.textContent = alertas > 0
    ? `⚠️ Hay ${alertas} productos por debajo del stock mínimo.`
    : "Inventario en condiciones óptimas.";
}

function verDetalle(nombre, codigo, stock, vencimiento, etiqueta) {
  const url = `producto.html?nombre=${encodeURIComponent(nombre)}&codigo=${encodeURIComponent(codigo)}&stock=${stock}&vencimiento=${encodeURIComponent(vencimiento)}&etiqueta=${encodeURIComponent(etiqueta)}&modo=ver`;
  window.location.href = url;
}

// Filtro
document.getElementById("filtroForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const valor = document.getElementById("filtroInput").value;
  renderTabla(valor);
});

// Agregar producto
document.getElementById("formAgregar").addEventListener("submit", function (e) {
  e.preventDefault();
  const productos = obtenerProductos();

  const nuevo = {
    nombre: document.getElementById("nombre").value,
    codigo: document.getElementById("codigo").value,
    stock: parseInt(document.getElementById("stock").value),
    vencimiento: document.getElementById("vencimiento").value || "---",
    etiqueta: document.getElementById("etiqueta").value
  };

  productos.push(nuevo);
  guardarProductos(productos);
  renderTabla();
  this.reset();
});

renderTabla();
// Cargar menú
fetch("/assets/components/menu.html")
  .then(res => res.text())
  .then(html => document.getElementById("menu").innerHTML = html);

// Obtener parámetros de la URL
const params = new URLSearchParams(window.location.search);
const codigo = params.get("codigo");
const modo = params.get("modo"); // puede ser 'ver' o 'editar'

let productos = JSON.parse(localStorage.getItem("productos")) || [];
let producto = productos.find(p => p.codigo === codigo);

if (!producto) {
  producto = {
    nombre: params.get("nombre"),
    codigo: codigo,
    stock: params.get("stock"),
    vencimiento: params.get("vencimiento"),
    etiqueta: params.get("etiqueta")
  };
}

// Rellenar campos
document.getElementById("nombre").value = producto.nombre;
document.getElementById("stock").value = producto.stock;
document.getElementById("vencimiento").value = producto.vencimiento !== "---" ? producto.vencimiento : "";
document.getElementById("etiqueta").value = producto.etiqueta;

// Deshabilitar campos por defecto (modo lectura)
const inputs = document.querySelectorAll("#formEditar input");
const guardarBtn = document.getElementById("guardarBtn");

if (modo === "editar") {
  inputs.forEach(i => i.disabled = false);
  guardarBtn.style.display = "inline-block";
} else {
  inputs.forEach(i => i.disabled = true);
  guardarBtn.style.display = "none";
}

// Botón EDITAR habilita campos
document.getElementById("editarBtn").addEventListener("click", () => {
  inputs.forEach(i => i.disabled = false);
  guardarBtn.style.display = "inline-block";
});

// GUARDAR cambios
document.getElementById("formEditar").addEventListener("submit", function (e) {
  e.preventDefault();

  producto.nombre = document.getElementById("nombre").value;
  producto.stock = parseInt(document.getElementById("stock").value);
  producto.vencimiento = document.getElementById("vencimiento").value || "---";
  producto.etiqueta = document.getElementById("etiqueta").value;

  productos = productos.map(p => p.codigo === codigo ? producto : p);
  localStorage.setItem("productos", JSON.stringify(productos));

  document.getElementById("mensajeConfirmacion").textContent = "✔ Cambios guardados correctamente.";
});

// ELIMINAR producto
document.getElementById("eliminarBtn").addEventListener("click", () => {
  if (confirm("¿Eliminar este producto?")) {
    productos = productos.filter(p => p.codigo !== codigo);
    localStorage.setItem("productos", JSON.stringify(productos));
    alert("Producto eliminado.");
    window.location.href = "detalle.html";
  }
});
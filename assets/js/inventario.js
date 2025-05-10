console.log("inventario.js cargado correctamente");

document.addEventListener("DOMContentLoaded", () => {
  // Inicializar datos de prueba si no existen
  if (!localStorage.getItem("productos")) {
    const productosDemo = [
      {
        codigo: "PZ-001",
        descripcion: "Rodamiento industrial",
        numeroSerie: "SN123456",
        lote: "L001",
        fechaVencimiento: "2024-07-15",
        ubicacion: "Almacén A1",
        stock: 4,
        categoria: "Mecánica",
        precioCompra: 250.00
      },
      {
        codigo: "PZ-002",
        descripcion: "Lubricante sintético",
        numeroSerie: "SN654321",
        lote: "L002",
        fechaVencimiento: "2024-05-25",
        ubicacion: "Almacén B2",
        stock: 12,
        categoria: "Lubricantes",
        precioCompra: 80.50
      },
      {
        codigo: "PZ-003",
        descripcion: "Filtro de aire pesado",
        numeroSerie: "SN987654",
        lote: "L003",
        fechaVencimiento: "2024-06-10",
        ubicacion: "Almacén C3",
        stock: 2,
        categoria: "Filtros",
        precioCompra: 130.75
      }
    ];
    localStorage.setItem("productos", JSON.stringify(productosDemo));
  }

  renderTabla();

  document.getElementById("formAgregar").addEventListener("submit", function(e) {
    e.preventDefault();
    const productos = JSON.parse(localStorage.getItem("productos")) || [];

    const nuevo = {
      codigo: document.getElementById("codigo").value,
      descripcion: document.getElementById("descripcion").value,
      numeroSerie: document.getElementById("numeroSerie").value,
      lote: document.getElementById("lote").value,
      fechaVencimiento: document.getElementById("fechaVencimiento").value,
      ubicacion: document.getElementById("ubicacion").value,
      stock: parseInt(document.getElementById("stock").value),
      categoria: document.getElementById("categoria").value,
      precioCompra: parseFloat(document.getElementById("precioCompra").value)
    };

    productos.push(nuevo);
    localStorage.setItem("productos", JSON.stringify(productos));
    this.reset();
    renderTabla();
  });

  document.getElementById("formFiltroInventario").addEventListener("submit", function(e) {
    e.preventDefault();
    const filtro = document.getElementById("filtroInventario").value.trim();
    renderTabla(filtro);
  });

  document.getElementById("btnQuitarFiltroInventario").addEventListener("click", () => {
    document.getElementById("filtroInventario").value = "";
    renderTabla();
  });
});

function renderTabla(filtro = "") {
  const productos = JSON.parse(localStorage.getItem("productos")) || [];
  const body = document.getElementById("inventarioBody");
  const alertas = document.getElementById("alertas");
  body.innerHTML = "";
  alertas.innerHTML = "";

  productos.forEach(prod => {
    // ✅ Búsqueda dentro de cualquier campo
    if (filtro) {
      const valores = Object.values(prod).map(v => String(v).toLowerCase());
      if (!valores.some(val => val.includes(filtro.toLowerCase()))) return;
    }

    const row = document.createElement("tr");

    const hoy = new Date();
    const fechaVenc = new Date(prod.fechaVencimiento);
    const diasRestantes = Math.floor((fechaVenc - hoy) / (1000 * 60 * 60 * 24));

    if (prod.stock < 5) row.classList.add("alerta-stock");
    if (!isNaN(diasRestantes) && diasRestantes >= 0 && diasRestantes <= 30) row.classList.add("alerta-vencimiento");

    row.innerHTML = `
      <td>${prod.codigo}</td>
      <td>${prod.descripcion}</td>
      <td>${prod.numeroSerie}</td>
      <td>${prod.lote}</td>
      <td>${prod.fechaVencimiento}</td>
      <td>${prod.ubicacion}</td>
      <td>${prod.stock}</td>
      <td>${prod.categoria}</td>
      <td>${prod.precioCompra ? prod.precioCompra.toFixed(2) : "0.00"}</td>
      <td><button class="btn-action" onclick="verDetalle('${prod.codigo}')">Ver Detalle</button></td>
    `;
    body.appendChild(row);
  });

  // Mostrar alertas generales
  const alertasStock = productos.filter(p => p.stock < 5).length;
  const alertasVenc = productos.filter(p => {
    const venc = new Date(p.fechaVencimiento);
    const dias = Math.floor((venc - new Date()) / (1000 * 60 * 60 * 24));
    return !isNaN(dias) && dias >= 0 && dias <= 30;
  }).length;

  if (alertasStock > 0) alertas.innerHTML += `<p>⚠️ Hay ${alertasStock} productos con stock bajo.</p>`;
  if (alertasVenc > 0) alertas.innerHTML += `<p>⚠️ Hay ${alertasVenc} productos próximos a vencer.</p>`;
}

function verDetalle(codigo) {
  const productos = JSON.parse(localStorage.getItem("productos")) || [];
  const producto = productos.find(p => p.codigo === codigo);
  if (producto) {
    localStorage.setItem("productoSeleccionado", JSON.stringify(producto));
    window.location.href = "producto.html";
  } else {
    alert("Producto no encontrado.");
  }
}
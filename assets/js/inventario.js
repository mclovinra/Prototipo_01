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
        fechaVencimiento: "2026-07-15", // ✅ corregido
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
        fechaVencimiento: "2026-05-25",
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
        fechaVencimiento: "2026-06-10",
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
      fechaVencimiento: document.getElementById("fechaVencimiento").value || "---",
      ubicacion: document.getElementById("ubicacion").value,
      stock: parseInt(document.getElementById("stock").value),
      categoria: document.getElementById("categoria").value,
      precioCompra: parseFloat(document.getElementById("precioCompra").value)
    };

    // ✅ Validar código único
    const existe = productos.some(p => p.codigo === nuevo.codigo);
    if (existe) {
      alert("Ya existe un producto con este código.");
      return;
    }

    productos.push(nuevo);
    localStorage.setItem("productos", JSON.stringify(productos));

    // ✅ Registrar alta en historial
    guardarHistorialAltaProducto(nuevo);

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
    if (document.getElementById("filtroEstado")) {
      document.getElementById("filtroEstado").value = "";
    }
    renderTabla();
  });
});

function renderTabla(filtro = "") {
  const productos = JSON.parse(localStorage.getItem("productos")) || [];
  const body = document.getElementById("inventarioBody");
  const alertas = document.getElementById("alertas");
  const estado = document.getElementById("filtroEstado") ? document.getElementById("filtroEstado").value : "";

  body.innerHTML = "";
  alertas.innerHTML = "";

  productos.forEach(prod => {
    const hoy = new Date();
    const fechaVenc = new Date(prod.fechaVencimiento);
    const diasRestantes = Math.floor((fechaVenc - hoy) / (1000 * 60 * 60 * 24));

    // ✅ Filtro avanzado
    if (estado === "vencidos" && !(fechaVenc < hoy && !isNaN(fechaVenc.getTime()))) return;
    if (estado === "porvencer" && !(diasRestantes >= 0 && diasRestantes <= 15)) return;
    if (estado === "stockbajo" && !(prod.stock < 5)) return;

    // ✅ Filtro búsqueda general
    if (filtro) {
      const valores = Object.values(prod).map(v => String(v).toLowerCase());
      if (!valores.some(val => val.includes(filtro.toLowerCase()))) return;
    }

    const row = document.createElement("tr");

    if (prod.stock < 5) row.classList.add("alerta-stock");

    if (!isNaN(fechaVenc.getTime())) {
      if (diasRestantes < 0) {
        row.style.backgroundColor = "#ffcccc";
        row.style.color = "#a00";
      } else if (diasRestantes >= 0 && diasRestantes <= 15) {
        row.classList.add("alerta-vencimiento");
      }
    }

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

  // Alertas generales
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

// ✅ NUEVA FUNCIÓN para registrar alta en historial
function guardarHistorialAltaProducto(producto) {
  const historial = JSON.parse(localStorage.getItem("historialCambios") || "{}");
  if (!historial[producto.codigo]) historial[producto.codigo] = [];

  const user = JSON.parse(localStorage.getItem("currentUser"));
  const usuario = user ? `${user.nombre} ${user.apellidoP} ${user.apellidoM}` : "Desconocido";

  historial[producto.codigo].push({
    fecha: new Date().toLocaleString(),
    usuario: usuario,
    anterior: {},
    cambios: {
      descripcion: producto.descripcion,
      numeroSerie: producto.numeroSerie,
      lote: producto.lote,
      fechaVencimiento: producto.fechaVencimiento,
      ubicacion: producto.ubicacion,
      stock: producto.stock,
      categoria: producto.categoria,
      precioCompra: producto.precioCompra
    }
  });

  localStorage.setItem("historialCambios", JSON.stringify(historial));
}
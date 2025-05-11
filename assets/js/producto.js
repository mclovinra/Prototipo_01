document.addEventListener("DOMContentLoaded", () => {
  const producto = JSON.parse(localStorage.getItem("productoSeleccionado"));
  const cancelarBtn = document.getElementById("cancelarBtn");

  if (!producto) {
    alert("No se encontró un producto seleccionado.");
    window.location.href = "inventario.html";
    return;
  }

  const productos = JSON.parse(localStorage.getItem("productos")) || [];
  const codigo = producto.codigo;

  // Rellenar campos
  document.getElementById("codigo").value = producto.codigo;
  document.getElementById("descripcion").value = producto.descripcion;
  document.getElementById("numeroSerie").value = producto.numeroSerie;
  document.getElementById("lote").value = producto.lote;
  document.getElementById("fechaVencimiento").value = producto.fechaVencimiento !== "---" ? producto.fechaVencimiento : "";
  document.getElementById("ubicacion").value = producto.ubicacion;
  document.getElementById("stock").value = producto.stock;
  document.getElementById("categoria").value = producto.categoria;
  document.getElementById("precioCompra").value = producto.precioCompra;

  const inputs = document.querySelectorAll("#formEditar input, #formEditar select");
  const guardarBtn = document.getElementById("guardarBtn");

  inputs.forEach(i => i.disabled = true);

  // Botón editar
  document.getElementById("editarBtn").addEventListener("click", () => {
    inputs.forEach(i => i.disabled = false);
    guardarBtn.style.display = "inline-block";
    cancelarBtn.style.display = "inline-block";
    document.getElementById("editarBtn").style.display = "none";

    // Guarda valores originales por si cancela
    inputs.forEach(input => input.setAttribute("data-original", input.value));
  });

  cancelarBtn.addEventListener("click", () => {
    inputs.forEach(input => {
      input.value = input.getAttribute("data-original");
      input.disabled = true;
    });
    guardarBtn.style.display = "none";
    cancelarBtn.style.display = "none";
    document.getElementById("editarBtn").style.display = "inline-block";
  });

  // Botón guardar cambios
  document.getElementById("formEditar").addEventListener("submit", function(e) {
    e.preventDefault();

    const anterior = {
      descripcion: producto.descripcion,
      numeroSerie: producto.numeroSerie,
      lote: producto.lote,
      fechaVencimiento: producto.fechaVencimiento,
      ubicacion: producto.ubicacion,
      stock: producto.stock,
      categoria: producto.categoria,
      precioCompra: producto.precioCompra
    };

    producto.descripcion = document.getElementById("descripcion").value;
    producto.numeroSerie = document.getElementById("numeroSerie").value;
    producto.lote = document.getElementById("lote").value;
    producto.fechaVencimiento = document.getElementById("fechaVencimiento").value || "---";
    producto.ubicacion = document.getElementById("ubicacion").value;
    producto.stock = parseInt(document.getElementById("stock").value);
    producto.categoria = document.getElementById("categoria").value;
    producto.precioCompra = parseFloat(document.getElementById("precioCompra").value);

    guardarHistorial(codigo, anterior, {
      descripcion: producto.descripcion,
      numeroSerie: producto.numeroSerie,
      lote: producto.lote,
      fechaVencimiento: producto.fechaVencimiento,
      ubicacion: producto.ubicacion,
      stock: producto.stock,
      categoria: producto.categoria,
      precioCompra: producto.precioCompra
    });

    const nuevosProductos = productos.map(p => p.codigo === codigo ? producto : p);
    localStorage.setItem("productos", JSON.stringify(nuevosProductos));
    localStorage.setItem("productoSeleccionado", JSON.stringify(producto));

    alert("Producto actualizado.");
    inputs.forEach(i => i.disabled = true);
    guardarBtn.style.display = "none";
    cancelarBtn.style.display = "none";
    document.getElementById("editarBtn").style.display = "inline-block";

    mostrarHistorial(codigo);
  });

  // Botón eliminar
  document.getElementById("eliminarBtn").addEventListener("click", () => {
    if (confirm("¿Seguro que quieres eliminar este producto?")) {
      const nuevosProductos = productos.filter(p => p.codigo !== codigo);
      localStorage.setItem("productos", JSON.stringify(nuevosProductos));
      localStorage.removeItem("productoSeleccionado");
      alert("Producto eliminado.");
      window.location.href = "inventario.html";
    }
  });

  mostrarHistorial(codigo);
});

// ✅ Nueva función con usuario
function guardarHistorial(codigo, anterior, cambios) {
  const historial = JSON.parse(localStorage.getItem("historialCambios") || "{}");
  if (!historial[codigo]) historial[codigo] = [];

  const user = JSON.parse(localStorage.getItem("currentUser"));
  const usuario = user ? `${user.nombre} ${user.apellidoP} ${user.apellidoM}` : "Desconocido";

  historial[codigo].push({
    fecha: new Date().toLocaleString(),
    usuario: usuario,
    anterior,
    cambios
  });

  localStorage.setItem("historialCambios", JSON.stringify(historial));
}

function mostrarHistorial(codigo) {
  const historial = JSON.parse(localStorage.getItem("historialCambios") || "{}")[codigo] || [];
  const contenedor = document.getElementById("historial");
  if (!contenedor) return;

  if (historial.length === 0) {
    contenedor.innerHTML = "<p>Sin cambios registrados.</p>";
    return;
  }

  contenedor.innerHTML = "";
  historial.slice().reverse().forEach(entry => {
    const anterior = entry.anterior || {};
    const cambios = entry.cambios;
    let detalleCambios = "";

    Object.keys(cambios).forEach(attr => {
      const valorAnterior = (anterior[attr] !== undefined) ? anterior[attr] : "(sin dato)";
      const valorNuevo = cambios[attr];
      if (valorAnterior !== valorNuevo) {
        detalleCambios += `${attr}: Antes "${valorAnterior}" → Ahora "${valorNuevo}"<br>`;
      }
    });

    const div = document.createElement("div");
    div.style.border = "1px solid #ddd";
    div.style.padding = "10px";
    div.style.marginBottom = "8px";
    div.style.background = "#fafafa";
    div.innerHTML = `<strong>${entry.fecha}</strong><br><em>Usuario: ${entry.usuario || "Desconocido"}</em><br>${detalleCambios}`;
    contenedor.appendChild(div);
  });
}
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
  document.getElementById("fechaVencimiento").value = producto.fechaVencimiento;
  document.getElementById("ubicacion").value = producto.ubicacion;
  document.getElementById("stock").value = producto.stock;
  document.getElementById("categoria").value = producto.categoria;
  document.getElementById("precioCompra").value = producto.precioCompra;

  const inputs = document.querySelectorAll("#formEditar input");
  const guardarBtn = document.getElementById("guardarBtn");

  // Botón editar
  document.getElementById("editarBtn").addEventListener("click", () => {
    inputs.forEach(i => i.disabled = false);
    guardarBtn.style.display = "inline-block";
    cancelarBtn.style.display = "inline-block";
    document.getElementById("editarBtn").style.display = "none";

    // Guarda valores originales por si cancela
    inputs.forEach(input => input.setAttribute("data-original", input.value));
  });

  // Botón cancelar
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
    if (producto.stock < 5) {
      generarOrdenCompra(producto);
    }

    e.preventDefault();

    const cambios = {
      descripcion: document.getElementById("descripcion").value,
      numeroSerie: document.getElementById("numeroSerie").value,
      lote: document.getElementById("lote").value,
      fechaVencimiento: document.getElementById("fechaVencimiento").value,
      ubicacion: document.getElementById("ubicacion").value,
      stock: parseInt(document.getElementById("stock").value),
      categoria: document.getElementById("categoria").value,
      precioCompra: parseFloat(document.getElementById("precioCompra").value)
    };

    guardarHistorial(codigo, cambios);

    producto.descripcion = cambios.descripcion;
    producto.numeroSerie = cambios.numeroSerie;
    producto.lote = cambios.lote;
    producto.fechaVencimiento = cambios.fechaVencimiento;
    producto.ubicacion = cambios.ubicacion;
    producto.stock = cambios.stock;
    producto.categoria = cambios.categoria;
    producto.precioCompra = cambios.precioCompra;

    mostrarHistorial(codigo);

    const nuevosProductos = productos.map(p => p.codigo === codigo ? producto : p);
    localStorage.setItem("productos", JSON.stringify(nuevosProductos));
    localStorage.setItem("productoSeleccionado", JSON.stringify(producto));

    alert("Producto actualizado.");
    inputs.forEach(i => i.disabled = true);
    guardarBtn.style.display = "none";
    document.getElementById("editarBtn").style.display = "inline-block";
    cancelarBtn.style.display = "none";
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

  // ====== HISTORIAL ======
  function guardarHistorial(codigo, cambios) {
    const historial = JSON.parse(localStorage.getItem("historialCambios") || "{}");
    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    const anterior = productos.find(p => p.codigo === codigo) || {};

    if (!historial[codigo]) historial[codigo] = [];

    historial[codigo].push({
      fecha: new Date().toLocaleString(),
      cambios,
      anterior
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
      const div = document.createElement("div");
      div.style.border = "1px solid #ddd";
      div.style.padding = "10px";
      div.style.marginBottom = "8px";
      div.style.background = "#fafafa";

      div.innerHTML = `<strong>${entry.fecha}</strong><br>
        Descripción: <span style="color:${anterior.descripcion !== cambios.descripcion ? 'red' : 'black'}">${cambios.descripcion}</span><br>
        Número Serie: <span style="color:${anterior.numeroSerie !== cambios.numeroSerie ? 'red' : 'black'}">${cambios.numeroSerie}</span><br>
        Lote: <span style="color:${anterior.lote !== cambios.lote ? 'red' : 'black'}">${cambios.lote}</span><br>
        Vencimiento: <span style="color:${anterior.fechaVencimiento !== cambios.fechaVencimiento ? 'red' : 'black'}">${cambios.fechaVencimiento}</span><br>
        Ubicación: <span style="color:${anterior.ubicacion !== cambios.ubicacion ? 'red' : 'black'}">${cambios.ubicacion}</span><br>
        Stock: <span style="color:${anterior.stock !== cambios.stock ? 'red' : 'black'}">${cambios.stock}</span><br>
        Categoría: <span style="color:${anterior.categoria !== cambios.categoria ? 'red' : 'black'}">${cambios.categoria}</span><br>
        Precio: <span style="color:${anterior.precioCompra !== cambios.precioCompra ? 'red' : 'black'}">${cambios.precioCompra}</span>`;
      contenedor.appendChild(div);
    });
  }
});

function generarOrdenCompra(producto) {
  const ordenes = JSON.parse(localStorage.getItem("ordenes")) || [];
  const proveedores = JSON.parse(localStorage.getItem("proveedores")) || [];

  let proveedorSeleccionado = { nombre: "Proveedor Genérico", correo: "sinregistro@proveedor.com" };
  if (proveedores.length > 0) {
    const random = Math.floor(Math.random() * proveedores.length);
    proveedorSeleccionado = proveedores[random];
  }

  const nuevaOrden = {
    id: ordenes.length + 1,
    codigo: producto.codigo,
    descripcion: producto.descripcion,
    stock: producto.stock,
    fecha: new Date().toLocaleString(),
    proveedor: proveedorSeleccionado.nombre,
    correoProveedor: proveedorSeleccionado.correo
  };

  ordenes.push(nuevaOrden);
  localStorage.setItem("ordenes", JSON.stringify(ordenes));
}
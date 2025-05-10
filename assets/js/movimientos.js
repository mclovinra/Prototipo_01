document.addEventListener("DOMContentLoaded", () => {
  renderMovimientos();

  // Registrar movimiento
  document.getElementById("formMovimiento").addEventListener("submit", function(e) {
    e.preventDefault();

    const codigo = document.getElementById("codigoProducto").value.trim();
    const tipo = document.getElementById("tipoMovimiento").value;
    const cantidad = parseInt(document.getElementById("cantidad").value);

    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    const producto = productos.find(p => p.codigo === codigo);

    if (!producto) {
      alert("Producto no encontrado.");
      return;
    }

    if (tipo === "Salida" && producto.stock < cantidad) {
      alert("Stock insuficiente para realizar la salida.");
      return;
    }

    // Registrar movimiento
    const movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];
    movimientos.push({
      fecha: new Date().toLocaleString(),
      codigoProducto: codigo,
      tipo,
      cantidad
    });
    localStorage.setItem("movimientos", JSON.stringify(movimientos));

    // Actualizar stock
    if (tipo === "Entrada") {
      producto.stock += cantidad;
    } else if (tipo === "Salida") {
      producto.stock -= cantidad;
      // ✅ Generar orden automática si stock < 5
      if (producto.stock < 5) {
        generarOrdenCompra(producto);
      }
    }

    const nuevosProductos = productos.map(p => p.codigo === codigo ? producto : p);
    localStorage.setItem("productos", JSON.stringify(nuevosProductos));

    alert("Movimiento registrado.");
    this.reset();
    renderMovimientos();
  });

  // Filtrar movimientos
  document.getElementById("formFiltro").addEventListener("submit", function(e) {
    e.preventDefault();
    const filtro = document.getElementById("filtroCodigo").value.trim();
    renderMovimientos(filtro);
  });

    document.getElementById("btnQuitarFiltro").addEventListener("click", () => {
        document.getElementById("filtroCodigo").value = "";
        renderMovimientos();
    });

    document.getElementById("btnExportar").addEventListener("click", function() {
      const movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];
      if (movimientos.length === 0) {
        alert("No hay movimientos para exportar.");
        return;
      }

      let csv = "Fecha,Código Producto,Tipo,Cantidad\n";
      movimientos.forEach(mov => {
        csv += `"${mov.fecha}","${mov.codigoProducto}","${mov.tipo}","${mov.cantidad}"\n`;
      });

      // ✅ Solución definitiva: añade BOM para Excel
      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "movimientos_inventario.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });

});

function renderMovimientos(filtro = "") {
  const movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];
  const body = document.getElementById("movimientosBody");
  body.innerHTML = "";

  movimientos.slice().reverse().forEach(mov => {
    if (filtro && !mov.codigoProducto.toLowerCase().includes(filtro.toLowerCase())) return;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${mov.fecha}</td>
      <td>${mov.codigoProducto}</td>
      <td>${mov.tipo}</td>
      <td>${mov.cantidad}</td>
    `;
    body.appendChild(row);
  });
}

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
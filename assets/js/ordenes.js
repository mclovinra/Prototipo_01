document.addEventListener("DOMContentLoaded", () => {
  renderOrdenes();

  document.getElementById("btnExportarOrdenes").addEventListener("click", function() {
    const ordenes = JSON.parse(localStorage.getItem("ordenes")) || [];
    if (ordenes.length === 0) {
      alert("No hay órdenes para exportar.");
      return;
    }

    let csv = "ID,Código Producto,Descripción,Stock Actual,Fecha Orden,Proveedor,Correo Proveedor\n";
    ordenes.forEach(o => {
      csv += `"${o.id}","${o.codigo}","${o.descripcion}","${o.stock}","${o.fecha}","${o.proveedor}","${o.correoProveedor}"\n`;
    });

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "ordenes_compra.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
});

function renderOrdenes() {
  const ordenes = JSON.parse(localStorage.getItem("ordenes")) || [];
  const body = document.getElementById("ordenesBody");
  body.innerHTML = "";

  ordenes.forEach((orden, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${orden.id}</td>
      <td>${orden.codigo}</td>
      <td>${orden.descripcion}</td>
      <td>${orden.stock}</td>
      <td>${orden.fecha}</td>
      <td>${orden.proveedor}</td>
      <td>${orden.correoProveedor}</td>
      <td><button class="btn-action btn-danger" onclick="eliminarOrden(${index})"><i class="fas fa-trash"></i> Eliminar</button></td>`;
    body.appendChild(row);
  });
}

function eliminarOrden(index) {
  if (confirm("¿Estás seguro de eliminar esta orden?")) {
    const ordenes = JSON.parse(localStorage.getItem("ordenes")) || [];
    ordenes.splice(index, 1);
    localStorage.setItem("ordenes", JSON.stringify(ordenes));
    renderOrdenes();
  }
}
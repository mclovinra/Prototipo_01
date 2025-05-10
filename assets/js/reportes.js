let datosReporte = [];

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("formReporte").addEventListener("submit", function(e) {
    e.preventDefault();
    const tipo = document.getElementById("tipoReporte").value;
    if (!tipo) return;

    const head = document.getElementById("reporteHead");
    const body = document.getElementById("reporteBody");
    head.innerHTML = "";
    body.innerHTML = "";
    datosReporte = [];

    if (tipo === "stock") {
      const productos = JSON.parse(localStorage.getItem("productos")) || [];
      head.innerHTML = `<tr><th>Código</th><th>Descripción</th><th>Stock</th></tr>`;
      productos.forEach(p => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${p.codigo}</td><td>${p.descripcion}</td><td>${p.stock}</td>`;
        body.appendChild(row);
        datosReporte.push({ Codigo: p.codigo, Descripcion: p.descripcion, Stock: p.stock });
      });

    } else if (tipo === "movimientos") {
      const movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];
      const desde = document.getElementById("fechaDesde").value;
      const hasta = document.getElementById("fechaHasta").value;

      head.innerHTML = `<tr><th>Fecha</th><th>Código Producto</th><th>Tipo</th><th>Cantidad</th></tr>`;
      movimientos.forEach(m => {
        const fechaMovimiento = new Date(m.fecha.split(",")[0]);
        let incluir = true;
        if (desde) incluir = incluir && (fechaMovimiento >= new Date(desde));
        if (hasta) incluir = incluir && (fechaMovimiento <= new Date(hasta));
        if (!incluir) return;

        const row = document.createElement("tr");
        row.innerHTML = `<td>${m.fecha}</td><td>${m.codigoProducto}</td><td>${m.tipo}</td><td>${m.cantidad}</td>`;
        body.appendChild(row);
        datosReporte.push({ Fecha: m.fecha, Codigo: m.codigoProducto, Tipo: m.tipo, Cantidad: m.cantidad });
      });

    } else if (tipo === "historial") {
      const historial = JSON.parse(localStorage.getItem("historialCambios") || "{}");
      const filtroAtributo = document.getElementById("filtroAtributo").value.trim().toLowerCase();
        
      head.innerHTML = `<tr><th>Código Producto</th><th>Fecha</th><th>Detalle Cambios</th></tr>`;
        
      Object.keys(historial).forEach(codigo => {
        historial[codigo].forEach(entry => {
          const anterior = entry.anterior || {};
          const cambios = entry.cambios;
          let detalleCambios = "";
        
          Object.keys(cambios).forEach(attr => {
            if (filtroAtributo && !attr.toLowerCase().includes(filtroAtributo)) return;
          
            const valorAnterior = (anterior[attr] !== undefined) ? anterior[attr] : "(sin dato)";
            const valorNuevo = cambios[attr];
            if (valorAnterior !== valorNuevo) {
              detalleCambios += `${attr}: Antes "${valorAnterior}" → Cambio "${valorNuevo}" | `;
            }
          });
        
          if (detalleCambios) {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${codigo}</td><td>${entry.fecha}</td><td>${detalleCambios}</td>`;
            body.appendChild(row);
            datosReporte.push({ Codigo: codigo, Fecha: entry.fecha, Cambios: detalleCambios });
          }
        });
      });
    }

  });

  document.getElementById("btnExportarReporte").addEventListener("click", () => {
    if (datosReporte.length === 0) {
      alert("Primero genera un reporte.");
      return;
    }

    let csv = "";
    const keys = Object.keys(datosReporte[0]);
    csv += keys.join(",") + "\n";

    datosReporte.forEach(item => {
      const line = keys.map(k => `"${item[k]}"`).join(",");
      csv += line + "\n";
    });

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "reporte.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
});
document.addEventListener("DOMContentLoaded", () => {

    localStorage.setItem("proveedores", JSON.stringify([ 
        { nombre: "Suministros Industriales Atacama", correo: "contacto@suministrosatacama.cl", telefono: "+56 9 8765 4321", detalles: "Proveedor de piezas y repuestos" },
        { nombre: "Lubricantes Mineros S.A.", correo: "ventas@lubricantesmineros.com", telefono: "+56 2 2345 6789", detalles: "Suministro mensual de aceites y grasas" },
        { nombre: "Maquinaria Pesada Copiapó", correo: "info@maquinariacopiapo.cl", telefono: "+56 9 1234 5678", detalles: "Alquiler y venta de maquinaria pesada" },
        { nombre: "Repuestos Industriales Norte", correo: "soporte@rinorte.cl", telefono: "+56 2 3456 7890", detalles: "Distribuidor autorizado de repuestos OEM" },
        { nombre: "Transportes y Logística Andina", correo: "operaciones@tylandina.cl", telefono: "+56 9 5678 1234", detalles: "Servicio logístico para traslado de maquinaria" } ]));
  renderProveedores();



  document.getElementById("formProveedor").addEventListener("submit", function(e) {
    e.preventDefault();

    const nombre = document.getElementById("nombreProveedor").value.trim();
    const correo = document.getElementById("correoProveedor").value.trim();
    const telefono = document.getElementById("telefonoProveedor").value.trim();
    const detalles = document.getElementById("detallesProveedor").value.trim();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(correo)) {
      alert("Correo electrónico inválido.");
      return;
    }

    const proveedores = JSON.parse(localStorage.getItem("proveedores")) || [];
    proveedores.push({ nombre, correo, telefono, detalles });
    localStorage.setItem("proveedores", JSON.stringify(proveedores));

    alert("Proveedor agregado.");
    this.reset();
    renderProveedores();
  });

  document.getElementById("formFiltroProveedor").addEventListener("submit", function(e) {
    e.preventDefault();
    const filtro = document.getElementById("filtroProveedor").value.trim();
    renderProveedores(filtro);
  });

  document.getElementById("btnQuitarFiltroProveedor").addEventListener("click", () => {
    document.getElementById("filtroProveedor").value = "";
    renderProveedores();
  });

  document.getElementById("btnExportarProveedores").addEventListener("click", function() {
    const proveedores = JSON.parse(localStorage.getItem("proveedores")) || [];
    if (proveedores.length === 0) {
      alert("No hay proveedores para exportar.");
      return;
    }

    let csv = "Nombre,Correo,Teléfono,Detalles\n";
    proveedores.forEach(prov => {
      csv += `"${prov.nombre}","${prov.correo}","${prov.telefono}","${prov.detalles}"\n`;
    });

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "proveedores.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
});

function renderProveedores(filtro = "") {
  const proveedores = JSON.parse(localStorage.getItem("proveedores")) || [];
  const body = document.getElementById("proveedoresBody");
  body.innerHTML = "";

  proveedores.forEach((prov, index) => {
    if (filtro && !prov.nombre.toLowerCase().includes(filtro.toLowerCase())) return;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${prov.nombre}</td>
      <td>${prov.correo}</td>
      <td>${prov.telefono}</td>
      <td>${prov.detalles}</td>
      <td><button class="btn-action btn-danger" onclick="eliminarProveedor(${index})"><i class="fas fa-trash"></i> Eliminar</button></td>
    `;
    body.appendChild(row);
  });
}

function eliminarProveedor(index) {
  if (confirm("¿Estás seguro de eliminar este proveedor?")) {
    const proveedores = JSON.parse(localStorage.getItem("proveedores")) || [];
    proveedores.splice(index, 1);
    localStorage.setItem("proveedores", JSON.stringify(proveedores));
    renderProveedores();
  }
}
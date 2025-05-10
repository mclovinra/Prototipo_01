// Mostrar / ocultar secciones
document.getElementById("showRegister").onclick = () => {
  document.getElementById("registerSection").classList.toggle("hidden");
  document.getElementById("recoverSection").classList.add("hidden");
};
document.getElementById("showRecover").onclick = () => {
  document.getElementById("recoverSection").classList.toggle("hidden");
  document.getElementById("registerSection").classList.add("hidden");
};

// Mostrar / ocultar contraseñas
document.getElementById("toggleLoginPassword").onclick = () => togglePassword("loginPassword");
document.getElementById("toggleRegPassword").onclick = () => togglePassword("regPassword");

function togglePassword(id) {
  const input = document.getElementById(id);
  input.type = input.type === "password" ? "text" : "password";
}

// Login
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const user = document.getElementById("loginUser").value;
  const pass = document.getElementById("loginPassword").value;
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const found = users.find(u => u.username === user && u.password === pass);
  if (found) {
    alert("Bienvenido " + found.nombre);
    localStorage.setItem("currentUser", JSON.stringify(found));
    window.location.href = "principal.html";
  } else {
    alert("Usuario o contraseña incorrectos");
  }
});

// Registro
document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const username = document.getElementById("regUsername").value;
  if (users.find(u => u.username === username)) {
    alert("Nombre de usuario ya existe");
    return;
  }

  const correo = document.getElementById("regCorreo").value;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(correo)) {
    alert("Correo electrónico inválido");
    return;
  }

  const nuevo = {
    username,
    nombre: document.getElementById("regNombre").value,
    apellidoP: document.getElementById("regApellidoP").value,
    apellidoM: document.getElementById("regApellidoM").value,
    fechaNac: document.getElementById("regFechaNac").value,
    correo,
    password: document.getElementById("regPassword").value
  };
  users.push(nuevo);
    localStorage.setItem("users", JSON.stringify(users));
    alert("Usuario registrado correctamente");
    document.getElementById("registerForm").reset();

    // 🔥 NUEVO: ocultar formulario registro y mostrar login
    document.getElementById("registerSection").classList.add("hidden");
    document.getElementById("recoverSection").classList.add("hidden");
});

// Recuperar contraseña
document.getElementById("recoverForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const user = document.getElementById("recoverUser").value;
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const found = users.find(u => u.username === user);
  document.getElementById("recoveredPassword").textContent = found
    ? "Tu contraseña es: " + found.password
    : "Usuario no encontrado.";
});
// *** Manejo del saldo inicial con LocalStorage ***
const obtenerSaldoInicial = () => {
    return 120; // Saldo inicial fijo
};

const obtenerSaldoGuardado = () => {
    const saldoGuardado = localStorage.getItem('saldo');
    return saldoGuardado !== null ? JSON.parse(saldoGuardado) : obtenerSaldoInicial();
};

const guardarSaldo = (nuevoSaldo) => {
    localStorage.setItem('saldo', JSON.stringify(nuevoSaldo));
};

const obtenerUsuarioGuardado = () => {
    return localStorage.getItem('usuario') || "";
};

const guardarUsuario = (nombre) => {
    localStorage.setItem('usuario', nombre);
};

// *** Inicialización del usuario con saldo y nombre ***
const usuario = {
    nombre: obtenerUsuarioGuardado(),
    saldo: obtenerSaldoGuardado(),
};

// Clase Película
class Pelicula {
    constructor(id, titulo, costo, disponible, imagen) {
        this.id = id;
        this.titulo = titulo;
        this.costo = costo;
        this.disponible = disponible;
        this.imagen = imagen;
    }

    reducirDisponibilidad() {
        if (this.disponible > 0) {
            this.disponible -= 1;
        }
    }

    calcularCosto() {
        return this.disponible === 1 ? this.costo / 2 : this.costo;
    }
}

// *** Datos de las películas ***
const peliculas = [
    new Pelicula(1, "El laberinto del Fauno", 5, 3, "images/fauno.jpg"),
    new Pelicula(2, "Inception", 4, 3, "images/inception.jpg"),
    new Pelicula(3, "Interstellar", 6, 3, "images/interstellar.jpg"),
    new Pelicula(4, "Matrix", 3, 3, "images/matrix.jpg"),
    new Pelicula(5, "Avatar", 5, 3, "images/avatar.jpg"),
];

const peliculasGratis = [
    new Pelicula(1, "Parasite", 0, 2, "images/parasite.jpg"),
    new Pelicula(2, "1917", 0, 2, "images/1917.jpg"),
    new Pelicula(3, "Jojo Rabbit", 0, 2, "images/jojo.jpg"),
    new Pelicula(4, "The Irishman", 0, 2, "images/irishman.jpg"),
    new Pelicula(5, "Little Women", 0, 2, "images/littlewomen.jpg"),
];

// *** Mostrar Películas Disponibles ***
const mostrarPeliculas = () => {
    const peliculasContainer = document.getElementById('peliculasContainer');
    peliculasContainer.innerHTML = ""; // Limpia el contenedor

    peliculas.forEach((pelicula) => {
        const peliculaCard = document.createElement('div');
        peliculaCard.classList.add('pelicula-card');

        peliculaCard.innerHTML = `
            <img src="${pelicula.imagen}" alt="${pelicula.titulo}">
            <h3>${pelicula.titulo}</h3>
            <p>Costo: $${pelicula.calcularCosto()}</p>
            <p>Disponibles: ${pelicula.disponible}</p>
            <button data-id="${pelicula.id}" class="alquilar-btn">Alquilar</button>
        `;

        peliculasContainer.appendChild(peliculaCard);
    });

    // *** Añadir evento a los botones de alquilar ***
    const botones = document.querySelectorAll('.alquilar-btn');
    botones.forEach((boton) => {
        boton.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            const pelicula = peliculas.find((p) => p.id === id);
            if (pelicula) {
                procesarAlquiler(pelicula);
            }
        });
    });
};

// *** Procesar Alquiler de Películas ***
const procesarAlquiler = async (pelicula) => {
    const costo = pelicula.calcularCosto();
    if (usuario.saldo < costo) {
        mostrarMensaje(`No tienes suficiente saldo para alquilar "${pelicula.titulo}".`);
        return;
    }

    pelicula.reducirDisponibilidad();
    usuario.saldo -= costo;
    guardarSaldo(usuario.saldo); // Guardar saldo actualizado en LocalStorage

    mostrarMensaje(`Has alquilado "${pelicula.titulo}". Saldo actual: $${usuario.saldo}.`);
    mostrarPeliculas(); // Actualizar visualización de películas
};

// *** Mostrar un Mensaje en el Contenedor de Mensajes ***
const mostrarMensaje = (mensaje) => {
    const mensajeContainer = document.getElementById('messageContainer');
    mensajeContainer.textContent = mensaje;
};

// *** Manejo del Inicio de Sesión ***
const manejarInicioSesion = () => {
    const nombreInput = document.getElementById('nombreUsuario');
    const nombre = nombreInput.value.trim();

    if (!nombre) {
        mostrarMensaje('Por favor, ingresa un nombre válido.');
        return;
    }

    usuario.nombre = nombre;
    usuario.saldo = obtenerSaldoInicial(); // Reinicia el saldo al iniciar sesión
    guardarUsuario(nombre);
    guardarSaldo(usuario.saldo);

    mostrarMensaje(`Bienvenido, ${usuario.nombre}! Tu saldo actual es $${usuario.saldo}.`);
    mostrarPeliculas();
    document.getElementById('inicioSesionContainer').style.display = 'none';
    document.getElementById('contenidoPrincipal').style.display = 'block';
};

// *** Iniciar el Sistema ***
const iniciarSistema = () => {
    if (!usuario.nombre) {
        document.getElementById('inicioSesionContainer').style.display = 'block';
        document.getElementById('contenidoPrincipal').style.display = 'none';
    } else {
        mostrarMensaje(`Bienvenido de nuevo, ${usuario.nombre}! Tu saldo actual es $${usuario.saldo}.`);
        mostrarPeliculas();
    }
};

// *** Inicia el Sistema al Cargar la Página ***
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btnIniciarSesion').addEventListener('click', manejarInicioSesion);
    iniciarSistema();
});

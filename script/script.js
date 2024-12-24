
class Pelicula {
    constructor(id, titulo, costo, disponible) {
        this.id = id;
        this.titulo = titulo;
        this.costo = costo;
        this.disponible = disponible;
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


const peliculas = [
    new Pelicula(1, "El laberinto del Fauno", 5, 3),
    new Pelicula(2, "Inception", 4, 3),
    new Pelicula(3, "Interstellar", 6, 3),
    new Pelicula(4, "Matrix", 3, 3),
    new Pelicula(5, "Avatar", 5, 3),
];

const peliculasGratis = [
    new Pelicula(1, "Parasite", 0, 2),
    new Pelicula(2, "1917", 0, 2),
    new Pelicula(3, "Jojo Rabbit", 0, 2),
    new Pelicula(4, "The Irishman", 0, 2),
    new Pelicula(5, "Little Women", 0, 2),
];


let saldo = 50;
const usuario = { nombre: "", saldo };


const modal = document.createElement('div');
modal.id = 'modal';
modal.innerHTML = `
    <div class="modal-content">
        <p id="modal-message"></p>
        <input id="modal-input" style="display:none;" type="text"/>
        <button id="modal-confirm">Aceptar</button>
        <button id="modal-cancel" style="display:none;">Cancelar</button>
    </div>
`;
document.body.appendChild(modal);

const modalMessage = document.getElementById('modal-message');
const modalInput = document.getElementById('modal-input');
const modalConfirm = document.getElementById('modal-confirm');
const modalCancel = document.getElementById('modal-cancel');

modal.style.display = 'none';

const showModal = (message, input = false) => {
    return new Promise((resolve) => {
        modal.style.display = 'block';
        modalMessage.textContent = message;
        modalInput.style.display = input ? 'block' : 'none';
        modalInput.value = '';
        modalInput.focus();
        modalCancel.style.display = input ? 'inline-block' : 'none';

        const confirmAction = () => {
            modal.style.display = 'none';
            resolve(input ? modalInput.value : true);
        };

        modalConfirm.onclick = confirmAction;
        modalCancel.onclick = () => {
            modal.style.display = 'none';
            resolve(null);
        };

        modalInput.onkeydown = (event) => {
            if (event.key === 'Enter') {
                confirmAction();
            }
        };
    });
};


const iniciarSistema = async () => {
    do {
        usuario.nombre = await showModal("Ingresa tu nombre para continuar:", true);
        if (usuario.nombre === null) {
            await showModal("Has salido del sistema. ¡Hasta luego!");
            return;
        }
    } while (!usuario.nombre);

    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('appContainer').style.display = 'block';

    await showModal(`¡Bienvenido, ${usuario.nombre}! Tu saldo inicial es de $${usuario.saldo}.`);

    while (true) {
        const opcion = await showModal(`Elige una opción:\n1. Ver películas disponibles\n2. Ver películas gratis\n3. Información estadística\n4. Salir`, true);
        if (opcion === "4" || opcion === null) break;

        switch (opcion.trim()) {
            case "1":
                await mostrarPeliculas();
                break;
            case "2":
                await mostrarPeliculasGratis();
                break;
            case "3":
                await mostrarEstadisticas();
                break;
            default:
                await showModal("Opción no válida. Intenta de nuevo.");
        }
    }

    await showModal(`Gracias por visitarnos, ${usuario.nombre}. Tu saldo final es de $${usuario.saldo}.`);
};


const mostrarPeliculas = async () => {
    const listado = peliculas.map(p => {
        const costo = p.calcularCosto();
        return `${p.id}. ${p.titulo} - Costo: $${costo}, Disponibles: ${p.disponible}`;
    }).join("\n");

    const idSeleccionado = await showModal(`Películas disponibles:\n${listado}\n\nIngresa el ID de la película que deseas alquilar:`, true);
    const pelicula = peliculas.find(p => p.id === parseInt(idSeleccionado));
    if (pelicula && pelicula.disponible > 0) {
        await procesarAlquiler(pelicula);
    } else if (pelicula) {
        await showModal(`La película "${pelicula.titulo}" no está disponible.`);
    } else {
        await showModal("Película no encontrada. Verifica el ID ingresado.");
    }
};

const mostrarPeliculasGratis = async () => {
    const listadoGratis = peliculasGratis.map(p => `${p.id}. ${p.titulo} - Disponibles: ${p.disponible}`).join("\n");

    const idSeleccionado = await showModal(`Películas gratuitas:\n${listadoGratis}\n\nIngresa el ID de la película que deseas seleccionar:`, true);
    const peliculaGratis = peliculasGratis.find(p => p.id === parseInt(idSeleccionado));
    if (peliculaGratis && peliculaGratis.disponible > 0) {
        peliculaGratis.reducirDisponibilidad();
        await showModal(`Has seleccionado "${peliculaGratis.titulo}". Disfrútala.`);
    } else if (peliculaGratis) {
        await showModal(`La película gratuita "${peliculaGratis.titulo}" no está disponible.`);
    } else {
        await showModal("Película gratuita no encontrada. Verifica el ID ingresado.");
    }
};

const mostrarEstadisticas = async () => {
    const costos = peliculas.map(p => p.costo);
    const costoMin = Math.min(...costos);
    const costoMax = Math.max(...costos);
    const promedioCosto = costos.reduce((sum, c) => sum + c, 0) / costos.length;

    const disponibilidadTotal = peliculas.reduce((sum, p) => sum + p.disponible, 0);
    const titulos = peliculas.map(p => p.titulo).join(", ");

    await showModal(`Estadísticas:\n- Costo mínimo: $${costoMin}\n- Costo máximo: $${costoMax}\n- Promedio de costos: $${promedioCosto.toFixed(2)}\n- Total disponibles: ${disponibilidadTotal}\n- Títulos: ${titulos}`);
};

const procesarAlquiler = async (pelicula) => {
    const costo = pelicula.calcularCosto();
    if (usuario.saldo < costo) {
        await showModal(`No tienes suficiente saldo para alquilar "${pelicula.titulo}".`);
        return;
    }

    pelicula.reducirDisponibilidad();
    usuario.saldo -= costo;

    await showModal(`Has alquilado "${pelicula.titulo}". Saldo actual: $${usuario.saldo}.`);
};

iniciarSistema();

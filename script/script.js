localStorage.clear(); 


const obtenerSaldoInicial = () => 120;

const usuario = {
    nombre: "",
    saldo: obtenerSaldoInicial(),
};

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

class CatalogoPeliculas {
    constructor() {
        this.peliculas = [];
        this.peliculasGratis = [
            new Pelicula(6, "Parasite", 0, 2, "images/parasite.jpg"),
            new Pelicula(7, "1917", 0, 2, "images/1917.jpg"),
            new Pelicula(8, "Jojo Rabbit", 0, 2, "images/jojo.jpg"),
            new Pelicula(9, "The Irishman", 0, 2, "images/irishman.jpg"),
            new Pelicula(10, "Little Women", 0, 2, "images/littlewomen.jpg"),
        ];
    }

    
    async cargarPeliculas() {
        try {
            document.getElementById('loadingSpinner').style.display = 'block';
            const response = await fetch('peliculas.json'); // Aquí se simula la llamada a la API
            if (!response.ok) throw new Error('No se pudieron cargar las películas.');
            const data = await response.json();
            this.peliculas = data.map(p => new Pelicula(p.id, p.titulo, p.costo, p.disponible, p.imagen));
        } catch (error) {
            Swal.fire({ title: 'Error', text: error.message, icon: 'error' });
        } finally {
            document.getElementById('loadingSpinner').style.display = 'none';
        }
    }

    mostrarPeliculas() {
        const peliculasContainer = document.getElementById('peliculasContainer');
        peliculasContainer.innerHTML = "";

        [...this.peliculas, ...this.peliculasGratis].forEach((pelicula) => {
            const { id, titulo, costo, disponible, imagen } = pelicula;
            const peliculaCard = document.createElement('div');
            peliculaCard.classList.add('pelicula-card');
            peliculaCard.innerHTML = `
                <img src="${imagen}" alt="${titulo}">
                <h3>${titulo}</h3>
                <p>Costo: ${costo === 0 ? 'Gratis' : `$${pelicula.calcularCosto()}`}</p>
                <p>Disponibles: ${disponible}</p>
                <button data-id="${id}" class="alquilar-btn">Alquilar</button>
            `;
            peliculasContainer.appendChild(peliculaCard);

            peliculaCard.querySelector('.alquilar-btn').addEventListener('click', () => {
                costo === 0 ? this.procesarAlquilerGratis(pelicula) : this.procesarAlquiler(pelicula);
            });
        });
    }

    procesarAlquiler(pelicula) {
        const mensaje = usuario.saldo >= pelicula.calcularCosto()
            ? `Has alquilado "${pelicula.titulo}". Saldo actual: $${usuario.saldo}.`
            : `No tienes suficiente saldo para alquilar "${pelicula.titulo}".`;

        if (usuario.saldo < pelicula.calcularCosto() || pelicula.disponible <= 0) {
            Swal.fire('Error', mensaje, 'warning');
            return;
        }

        pelicula.reducirDisponibilidad();
        usuario.saldo -= pelicula.calcularCosto();

        this.guardarPeliculasAlquiladas(pelicula);
        Swal.fire('Película Alquilada', mensaje, 'success');
        this.mostrarPeliculas();
        this.mostrarPeliculasAlquiladas();
    }

    procesarAlquilerGratis(pelicula) {
        if (pelicula.disponible <= 0) {
            Swal.fire('Sin Disponibilidad', `Lo siento, "${pelicula.titulo}" no está disponible.`, 'error');
            return;
        }

        pelicula.reducirDisponibilidad();
        this.guardarPeliculasAlquiladas(pelicula);
        Swal.fire('Película Alquilada', `Has alquilado "${pelicula.titulo}". Es gratis, ¡disfrútala!`, 'success');
        this.mostrarPeliculas();
        this.mostrarPeliculasAlquiladas();
    }

    guardarPeliculasAlquiladas(pelicula) {
        const peliculasAlquiladas = JSON.parse(localStorage.getItem('peliculasAlquiladas') || '[]');
        peliculasAlquiladas.push(pelicula);
        localStorage.setItem('peliculasAlquiladas', JSON.stringify(peliculasAlquiladas));
    }

    mostrarPeliculasAlquiladas() {
        const listaPeliculasAlquiladas = document.getElementById('listaPeliculasAlquiladas');
        listaPeliculasAlquiladas.innerHTML = "";

        const peliculasAlquiladas = JSON.parse(localStorage.getItem('peliculasAlquiladas') || '[]');
        peliculasAlquiladas.length === 0 && (listaPeliculasAlquiladas.innerHTML = "<p>No has alquilado ninguna película.</p>");

        peliculasAlquiladas.forEach((pelicula) => {
            const peliculaItem = document.createElement('div');
            peliculaItem.classList.add('pelicula-alquilada');
            peliculaItem.innerHTML = `<img src="${pelicula.imagen}" alt="${pelicula.titulo}"><h3>${pelicula.titulo}</h3>`;
            listaPeliculasAlquiladas.appendChild(peliculaItem);
        });
    }
}

const catalogo = new CatalogoPeliculas();

document.getElementById('btnIniciarSesion').addEventListener('click', async () => {
    const nombre = document.getElementById('nombreUsuario').value.trim();
    if (!nombre) {
        Swal.fire('Error', 'Por favor, ingresa un nombre válido.', 'warning');
        return;
    }

    usuario.nombre = nombre;
    usuario.saldo = obtenerSaldoInicial();
    Swal.fire('Bienvenido', `Hola, ${usuario.nombre}. Tu saldo actual es $${usuario.saldo}.`, 'success');

    await catalogo.cargarPeliculas();
    catalogo.mostrarPeliculas();
    catalogo.mostrarPeliculasAlquiladas();

    document.getElementById('inicioSesionContainer').style.display = 'none';
    document.getElementById('contenidoPrincipal').style.display = 'block';
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('inicioSesionContainer').style.display = 'block';
    document.getElementById('contenidoPrincipal').style.display = 'none';
});

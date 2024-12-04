// Lista de películas
const peliculas = [
    { id: 1, titulo: "El laberinto del Fauno", costo: 5, disponible: 3 },
    { id: 2, titulo: "Inception", costo: 4, disponible: 3 },
    { id: 3, titulo: "Interstellar", costo: 6, disponible: 3 },
    { id: 4, titulo: "Matrix", costo: 3, disponible: 3 },
    { id: 5, titulo: "Avatar", costo: 5, disponible: 3 },
];

let saldo = 50;

function iniciarSistema() {
    
    let nombre;
    do {
        nombre = prompt("Ingresa tu nombre para continuar:");
        if (nombre === null) {
            alert("Has salido del sistema. ¡Hasta luego!");
            return; 
        }
        if (!nombre) alert("Debes ingresar tu nombre.");
    } while (!nombre);

    alert(`¡Bienvenido, ${nombre}! Tu saldo inicial es de $${saldo}.\n`);

    let opcion;
    do {
        let listaPeliculas = "Películas disponibles:\n";
        for (let pelicula of peliculas) {
            let precio = pelicula.costo;
            if (pelicula.disponible === 1) {
                precio = precio / 2;
                listaPeliculas += `${pelicula.id}. ${pelicula.titulo} - Costo en promoción: $${precio} (¡Solo queda 1, PROMOCIÓN DEL 50%!), Disponibles: ${pelicula.disponible}\n`;
            } else {
                listaPeliculas += `${pelicula.id}. ${pelicula.titulo} - Costo: $${precio}, Disponibles: ${pelicula.disponible}\n`;
            }
        }
        listaPeliculas += "\nEscribe el número de la película que deseas alquilar, o presiona 'Cancelar' para salir.";

        opcion = prompt(listaPeliculas);

       
        if (opcion === null) {
            alert(`Gracias por usar el sistema de alquiler, ${nombre}. Tu saldo final es $${saldo}. ¡Hasta luego!`);
            return;
        }

        if (!opcion) continue;

        if (opcion === "salir") break;

        opcion = parseInt(opcion);
        const pelicula = peliculas.find((p) => p.id === opcion);

        if (!pelicula) {
            alert("La opción ingresada no es válida.");
        } else if (pelicula.disponible <= 0) {
            alert(`La película "${pelicula.titulo}" no tiene alquileres disponibles.`);
        } else {
            let costo = pelicula.disponible === 1 ? pelicula.costo / 2 : pelicula.costo;

            if (saldo < costo) {
                alert(`No tienes suficiente saldo para alquilar "${pelicula.titulo}".`);
            } else {
                pelicula.disponible -= 1;
                saldo -= costo;
                alert(
                    `Has alquilado "${pelicula.titulo}". Tu saldo actual es de $${saldo}.`
                );
            }
        }
    } while (true);

    alert(`Esperamos hayas disfrutado de las pelis,  ${nombre}. Tu saldo final es $${saldo}. ¡Gracias por visitarnos!`);
}

iniciarSistema();

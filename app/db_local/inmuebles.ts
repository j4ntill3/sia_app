import Inmueble from "../types/inmueble";

const inmuebles: Inmueble[] = [
    {
        id: 1,
        idRubro: 101,
        localidad: "Santa Fe",
        dirección: "Av. General Paz 1234",
        barrio: "Centro",
        numHabitaciones: 3,
        numBaños: 2,
        superficie: 120,
        garaje: true,
        estado: "Disponible"
    },
    {
        id: 2,
        idRubro: 102,
        localidad: "Santa Fe",
        dirección: "Calle San Martín 456",
        barrio: "Recoleta",
        numHabitaciones: 2,
        numBaños: 1,
        superficie: 80,
        garaje: false,
        estado: "En alquiler"
    },
    {
        id: 3,
        idRubro: 103,
        localidad: "Santa Fe",
        dirección: "Boulevard Gálvez 789",
        barrio: "Candioti Sur",
        numHabitaciones: 4,
        numBaños: 3,
        superficie: 150,
        garaje: true,
        estado: "Disponible"
    },
    {
        id: 4,
        idRubro: 104,
        localidad: "Santa Fe",
        dirección: "Calle Francia 1111",
        barrio: "Guadalupe",
        numHabitaciones: 3,
        numBaños: 2,
        superficie: 100,
        garaje: true,
        estado: "En construcción"
    },
    {
        id: 5,
        idRubro: 105,
        localidad: "Santa Fe",
        dirección: "Pasaje Mitre 987",
        barrio: "Santa Rosa de Lima",
        numHabitaciones: 1,
        numBaños: 1,
        superficie: 60,
        garaje: false,
        estado: "En alquiler"
    },
    {
        id: 6,
        idRubro: 106,
        localidad: "Santa Fe",
        dirección: "Av. Aristóbulo del Valle 654",
        barrio: "Los Hornos",
        numHabitaciones: 2,
        numBaños: 2,
        superficie: 90,
        garaje: true,
        estado: "Vendido"
    }
];

export default inmuebles;

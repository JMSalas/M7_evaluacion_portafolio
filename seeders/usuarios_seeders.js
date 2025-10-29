import { Usuario } from "../models/Usuario.js";

export async function crearUsuariosIniciales() {
    await Usuario.bulkCreate([
        {
            nombre : "Usuario Base1",
            email: "usuariobase1@gmail.com",
            password: "01234Pass%",
        },
        {
            nombre : "Usuario Base2",
            email: "usuariobase2@gmail.com",
            password: "56789Pass%",
        },
    ]);

    console.log("Usuarios iniciales creados.");
}
import express from "express";
import { listarUsuarios, actualizarUsuario, buscarUsuarioPedidos, crearUsuario, eliminarUsuario, buscarUsuario } from "../controllers/usuarios_controller.js";

// Crear Router
export const usuariosRouter = express.Router();

// Middleware recibir JSON en req
usuariosRouter.use(express.json());

//Rutas
usuariosRouter.route('/')
    .get(listarUsuarios)
    .post(crearUsuario);

usuariosRouter.route('/:id')
    .get(buscarUsuario)
    .put(actualizarUsuario)
    .delete(eliminarUsuario);

usuariosRouter.route('/:id/pedidos')
    .get(buscarUsuarioPedidos);
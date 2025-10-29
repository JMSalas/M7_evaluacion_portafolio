import express from "express";
import { crearPedido } from "../controllers/pedidos_controller.js";

// Crear Router
export const pedidosRouter = express.Router();

// Middleware recibir JSON en req
pedidosRouter.use(express.json());

//Rutas
pedidosRouter.route('/')
    .post(crearPedido);

// Ruta probar error con statusCode 500     
pedidosRouter.route('/error500')
    .get((req, res) => {
        const data=null;
        console.log(data.propiedadInexistente);
    });
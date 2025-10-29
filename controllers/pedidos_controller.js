import { Pedido } from "../models/Pedido.js";
import { Usuario } from "../models/Usuario.js";
import { ErrorRecursoNoEncontrado, ErrorValidacion } from "../utils/errors.js";

export const crearPedido = async(req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.body.UsuarioId);

        if(!usuario)
            throw new ErrorRecursoNoEncontrado(`Usuario con ID ${req.body.UsuarioId} no existe`);    

        const nuevoPedido = await Pedido.create(req.body);
        
        return res.status(201).json(nuevoPedido);    
    } catch(error) {

        if (Array.isArray(error.errors)) {
            const validationMessages = error.errors.map(e => e.message);
            error.message = validationMessages.join(', ');
        }
    
        if (error.name === "SequelizeValidationError")
            throw new ErrorValidacion(error.message);
        
        throw error;
    }
}
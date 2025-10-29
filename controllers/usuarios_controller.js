import { Usuario } from "../models/Usuario.js";
import { ErrorValidacion, ErrorRecursoNoEncontrado } from "../utils/errors.js";

export const listarUsuarios = async (req, res) => {
    const usuarios = await Usuario.findAll();
    return res.status(200).json(usuarios);
};

export const crearUsuario = async(req, res) => {
    try {
        const nuevoUsuario = await Usuario.create(req.body);
        return res.status(201).json(nuevoUsuario);    
    
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

export const buscarUsuario = async(req, res) => {
    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario)
        throw new ErrorRecursoNoEncontrado(`Usuario con ID ${req.params.id} no existe`); 
        
    return res.status(200).json(usuario);
}

export const buscarUsuarioPedidos = async(req, res) => {
    const usuario = await Usuario.findByPk(req.params.id, { include : 'Pedidos' });

    if (!usuario)
        throw new ErrorRecursoNoEncontrado(`Usuario con ID ${req.params.id} no existe`); 

    return res.status(200).json(usuario.Pedidos);         
}

export const actualizarUsuario = async(req, res) => {
    try {
        const [filasActualizadas, usuariosActualizados] = await Usuario.update(req.body, {
            where: {
                id: req.params.id,
            }, 
            returning: true,
        });

        if(!filasActualizadas)
            throw new ErrorRecursoNoEncontrado(`Usuario con ID ${req.params.id} no existe`);

        return res.status(200).json(usuariosActualizados[0]);
    
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

export const eliminarUsuario = async(req, res) => {
    const usuarioEliminado = await Usuario.findByPk(req.params.id);
    
    if (!usuarioEliminado)
        throw new ErrorRecursoNoEncontrado(`Usuario con ID ${req.params.id} no existe`);

    await usuarioEliminado.destroy();
    return res.status(200).json(usuarioEliminado);
}
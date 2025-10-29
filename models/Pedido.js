import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";

export const Pedido = sequelize.define('Pedido', {
    producto : {
        type : DataTypes.STRING,
        allowNull : false,
        validate : {
            notEmpty:{
                msg: "El nombre del producto no puede estar vacío",
            },
            notNull : {
                msg: "Se debe ingresar producto",
            }    
        }
    },
    cantidad : {
        type : DataTypes.INTEGER,
        allowNull : false,
        validate : {
            notNull : {
                msg: "Se debe ingresar cantidad",
            },  
            isInt : {
                msg : "Cantidad debe ser un número entero",
            }, 
            min : {
                args : 1,
                msg : "Cantidad debe ser mayor a 0",
            }
        }
    },
    fecha_Pedido: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
});
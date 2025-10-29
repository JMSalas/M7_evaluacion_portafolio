import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";

export const Usuario = sequelize.define('Usuario', {
    nombre : {
        type : DataTypes.STRING,
        allowNull: false,
        validate : {
            notNull : {
                msg: "Se debe ingresar nombre del usuario",
            },
            notEmpty: {
                msg: 'El nombre de usuario no puede estar vacío',
            },
        }
    },
    email : {
        type : DataTypes.STRING,
        allowNull: false,
        unique : {
            msg: 'Correo electrónico ya está registrado.'
        },
        validate : {
            notNull : {
                msg: "Se debe ingresar email del usuario",
            },
            isEmail : {
                msg: "Ingresar un email válido",
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate : {
            notNull : {
                msg: "Se debe ingresar password del usuario",
            },
            // 1. Longitud Mínima (entre 10 y 64 caracteres)
            len: {
                args: [10, 64],
                msg: "Contraseña debe tener entre 10 y 64 caracteres",
            },
            
            // 2. Requerir Mayúscula (al menos una)
            hasUpperCase(value) {
                // Expresión regular: debe contener al menos una letra mayúscula
                if (!/[A-Z]/.test(value)) {
                    throw new Error('Contraseña debe contener al menos una letra mayúscula');
                }
            },
            
            // 3. Requerir Minúscula (al menos una)
            hasLowerCase(value) {
                // Expresión regular: debe contener al menos una letra minúscula
                if (!/[a-z]/.test(value)) {
                    throw new Error('Contraseña debe contener al menos una letra minúscula');
                }
            },
            
            // 4. Requerir Número (al menos un dígito)
            hasNumber(value) {
                // Expresión regular: debe contener al menos un dígito
                if (!/[0-9]/.test(value)) {
                    throw new Error('Contraseña debe contener al menos un número');
                }
            },
            
            // 5. Requerir Símbolo/Especial (al menos uno)
            hasSpecialChar(value) {
                // Expresión regular: debe contener al menos un carácter no alfanumérico
                if (!/[^a-zA-Z0-9\s]/.test(value)) { 
                    throw new Error('Contraseña debe contener al menos un carácter especial');
                }
            }    
        }
    },
});
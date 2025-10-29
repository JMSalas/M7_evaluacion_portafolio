import { Pedido } from "./Pedido.js";
import { Usuario } from "./Usuario.js";

Usuario.hasMany(Pedido, {onDelete: 'CASCADE'});
Pedido.belongsTo(Usuario);
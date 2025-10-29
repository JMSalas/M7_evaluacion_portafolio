import { Usuario } from "../models/Usuario.js";
import { Pedido } from "../models/Pedido.js";

export async function crearPedidosIniciales() {
  const usuarios = await Usuario.findAll();

  const pedidos = await Pedido.bulkCreate([
    {
      producto: "Producto 1",
      cantidad: 10,
    },
    {
      producto: "Producto 2",
      cantidad: 20,
    },
    {
      producto: "Producto 3",
      cantidad: 40,
    }
  ]);

  await usuarios[0].addPedidos([pedidos[0], pedidos[1]]);
  await usuarios[1].addPedido(pedidos[2]);

  console.log("Pedidos iniciales creados.");
}
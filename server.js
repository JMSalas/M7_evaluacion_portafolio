import express from "express";
import chalk from "chalk";
import { inicializarApp } from "./config/inicializarApp.js";
import { usuariosRouter } from "./routes/usuarios_router.js";
import { pedidosRouter } from "./routes/pedidos_router.js";
import { ErrorRecursoNoEncontrado } from "./utils/errors.js";
import { errorMiddleware } from "./middleware/error_middleware.js";

async function main() {
  await inicializarApp();
  
  // Puerto
  const port = 8080;
  // Crear aplicacion
  const app = express()

  // Rutas
  app.route("/").get((req, res) => {
    res.redirect('/usuarios');
  });

  // Manejar Rutas con usuariosRouter y pedidosRouter
  app.use("/usuarios", usuariosRouter);
  app.use("/pedidos", pedidosRouter);

  // Manejar rutas no capturadas anteriormente
  app.all("/{*ruta}", (req, res) => {
    const ruta = `http://localhost:${port}/${req.params.ruta}`;
    throw new ErrorRecursoNoEncontrado(`Página ruta ${ruta}, no encontrada`);
  });

  // Middleware de Manejo de Errores Personalizado
  // Debe ser el último middleware agregado y debe tener la firma o signature de cuatro argumentos: (err, req, res, next)
  app.use(errorMiddleware);

  app.listen(port, () => {
    console.log(chalk.cyanBright(`Servidor corriendo en http://localhost:${port}`));
  });
}

main();

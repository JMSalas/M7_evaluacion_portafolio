import chalk from "chalk";

export const errorMiddleware = (err, req, res, next) => {
    // Delegar al manipulador de errores por defecto de Express, si los headers de la respuesta ya han sido enviados al cliente.
    if (res.headersSent) {
        console.error(chalk.redBright("*** Error capturado por el manipulador de errores por defecto ***"));
        return next(err);
    }

    // Si no tiene statusCode, se asigna statusCode = 500 (Error de Servidor). 
    if (!err.statusCode)
        err.statusCode = 500;
        
    // Logear el error en consola
    console.error(chalk.redBright('*** Error capturado por el middleware de errores ***'));
    console.error(chalk.redBright(`${err.name} (${err.statusCode}): ${err.message}`));
  
    res.status(err.statusCode).json({ name: err.name, error: err.message });
}
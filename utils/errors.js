export class ErrorRecursoNoEncontrado extends Error {
    constructor(mensaje) {
        super(mensaje);
        this.name = 'NotFoundError';
        this.statusCode = 404;
    }
}

export class ErrorValidacion extends Error {
    constructor(mensaje) {
        super(mensaje);
        this.name = 'ValidationError';
        this.statusCode = 400;
    }
}
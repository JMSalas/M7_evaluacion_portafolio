# API REST para Tienda en Línea (Usuarios y Pedidos)

## Introducción

Esta es una **API RESTful** diseñada para la gestión de clientes y sus pedidos dentro de un sistema de tienda en línea. Está construida sobre **Node.js** y **Express v5**, utilizando **Sequelize** como ORM para la base de datos **PostgreSQL** (`tienda_online`). El diseño prioriza la robustez mediante *controllers* asíncronos optimizados y un manejo centralizado de errores.

-----

## NOTA DE SEGURIDAD

Actualmente, el modelo `Usuario.js` no implementa *hashing* de contraseñas, lo que significa que las claves se almacenan en texto plano en la base de datos.

-----

## Configuración y Ejecución del Proyecto

### 1\. Requisitos Previos

  * **Node.js** (compatible con ES Modules).
  * **PostgreSQL** (base de datos llamada `tienda_online`).

### 2\. Instalación de Dependencias

```bash
npm install
```

### 3\. Configuración del Entorno (`.env`)

Crea un archivo `.env` en la raíz con las credenciales de tu base de datos:

```env
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_HOST=localhost
DB_NAME=nombre_bd
DB_DIALECT=postgres
DB_PORT=5432
```

### 4\. Ejecución

El comando `npm run start` inicializará la aplicación, **eliminará y recreará todas las tablas** (`{ force: true }`), y poblará la base de datos con usuarios, roles y pedidos iniciales a través de los *seeders*.

```bash
npm run start
```

La API estará disponible en `http://localhost:8080`.

-----

## 📁 Estructura del Proyecto

```
.
├── config/
│   ├── database.js          # Configura la conexión a Sequelize/Postgres.
│   └── inicializarApp.js    # Sincronización de DB y ejecución de seeders.
├── controllers/
│   ├── pedidos_controller.js  # Lógica de negocio para Pedidos.
│   └── usuarios_controller.js # Lógica de negocio para Usuarios.
├── middleware/
│   └── error_middleware.js  # Manejador central de errores.
├── models/
│   ├── Pedido.js            # Modelo de Pedido (validación de producto y cantidad).
│   ├── Usuario.js           # Modelo de Usuario (validación estricta de password y email).
│   └── associations.js      # Definición de relaciones entre modelos.
├── routes/
│   ├── pedidos_router.js    # Rutas para Pedidos.
│   └── usuarios_router.js   # Rutas para Usuarios (incluye ruta anidada para Pedidos).
├── seeders/
│   ├── pedidos_seeders.js   # Datos iniciales para Pedidos.
│   └── usuarios_seeders.js  # Datos iniciales para Usuarios.
├── utils/
│   └── errors.js            # Clases de errores personalizadas (400, 404).
├── .env
└── server.js                # Archivo principal de Express.
```

-----

## Relaciones del Modelo

El proyecto define una relación **Uno a Muchos** entre `Usuario` y `Pedido`:

  * Un **Usuario** puede tener muchos **Pedidos** (`Usuario.hasMany(Pedido)`).
  * Un **Pedido** pertenece a un **Usuario** (`Pedido.belongsTo(Usuario)`).
  * **Política de Borrado (`onDelete: 'CASCADE'`):** Si un Usuario es eliminado, **todos sus Pedidos asociados se eliminan automáticamente** de la base de datos.

-----

## Endpoints (Rutas de la API)

Base URL: `http://localhost:8080`.

### Recurso: `/usuarios` (Gestión de Clientes)

| Método | Ruta | Detalle de Operación |
| :--- | :--- | :--- |
| `GET` | `/usuarios` | Obtiene la lista completa de usuarios. |
| `POST` | `/usuarios` | Crea un nuevo usuario. |
| `GET` | `/usuarios/:id` | Busca y devuelve un usuario por ID. |
| `PUT` | `/usuarios/:id` | Actualiza un usuario por ID. |
| `DELETE` | `/usuarios/:id`| Elimina un usuario por ID y **todos sus pedidos asociados**. |
| `GET` | `/usuarios/:id/pedidos` | **Ruta Anidada**. Lista todos los pedidos realizados por el usuario con el ID especificado. |

### Recurso: `/pedidos` (Gestión de Órdenes)

| Método | Ruta | Detalle de Operación |
| :--- | :--- | :--- |
| `POST` | `/pedidos` | Crea un nuevo pedido. **Requiere un `UsuarioId` existente**. |
| `GET` | `/pedidos/error500`| **Ruta de Prueba.** Lanza un error de código intencional para verificar la captura del `errorMiddleware` (retorna 500). |

-----

## Manejo de Errores Detallado

El manejo de errores se realiza mediante un *middleware* central (`error_middleware.js`) y clases personalizadas que asignan el código de estado HTTP (Status Code) correcto al error.

### Flujo de Captura de Errores

    Manejo Asíncrono Automático (Express v5):

        Todos los controllers (listarUsuarios, crearPedido, etc.) son funciones async.

        Gracias a la versión Express v5 (o superior), cuando una función de controller asíncrona lanza un error (throw error;), Express lo captura automáticamente sin necesidad de envolverlo en bloques try...catch en cada ruta o usar una utilidad express-async-errors.

        El error capturado es redirigido inmediatamente al siguiente middleware con cuatro argumentos, que es errorMiddleware.

    Manejo de Errores Síncronos y Validación de Sequelize (400):

        Las operaciones de creación y actualización que interactúan con Sequelize (crearUsuario, actualizarUsuario, crearPedido) sí utilizan un bloque try...catch.

        Este bloque tiene el objetivo de capturar errores de validación específicos de Sequelize (SequelizeValidationError), convertirlos a una clase personalizada ErrorValidacion (status 400 Bad Request) y lanzar el error ya convertido (throw new ErrorValidacion(...)) para que sea capturado por el paso 1.

        Esto asegura que los errores de datos (ej. email duplicado, password débil) siempre devuelvan un 400 legible.

    Respuesta Final (errorMiddleware):

        El errorMiddleware es el último punto de la cadena de Express. Recibe el objeto err (lanzado de forma asíncrona o convertido).

        Este middleware asigna un 500 Internal Server Error si el error no tiene un código de estado definido.

        Finalmente, uniformiza la respuesta al cliente a un objeto JSON { name, error } con el código de estado HTTP adecuado.

| HTTP Status | Clase de Error | Nombre (`name`) | Caso de Uso Principal |
| :--- | :--- | :--- | :--- |
| **404 Not Found** | `ErrorRecursoNoEncontrado` | `NotFoundError` | **1. ID Desconocido:** Intento de `GET`, `PUT`, o `DELETE` a un Usuario/Rol/Pedido con ID inexistente. **2. Ruta No Válida:** Acceso a un endpoint no definido. |
| **400 Bad Request** | `ErrorValidacion` | `ValidationError` | Fallas en la validación de datos de Sequelize (ej. formato de email inválido, password débil, campos obligatorios vacíos). |
| **500 Internal Server Error** | Error Genérico | *(Variado)* | Errores no capturados (ej. fallas de conexión a DB, errores de sintaxis en *controllers* como el de `/pedidos/error500`). |

-----

## Pruebas (Postman)

Todas las solicitudes `POST` y `PUT` deben configurarse con **Body** en modo **`raw`** y formato **`JSON`**. Los IDs de los usuarios iniciales comienzan en 1.

### Pruebas de Usuarios y Relaciones (`http://localhost:8080/usuarios`)

| Método | Ruta | Body (JSON) | Resultado Esperado |
| :--- | :--- | :--- | :--- |
| **GET** | `/usuarios` | *(Vacío)* | 200 OK. Lista de usuarios (`Usuario Base1` tiene pedidos). |
| **POST** | `/usuarios` | `{ "nombre": "Cliente Nuevo", "email": "nuevo@test.com", "password": "ClaveSegura123%" }` | 201 Created. Nuevo usuario creado. |
| **GET** | `/usuarios/1/pedidos` | *(Vacío)* | 200 OK. Devuelve la lista de pedidos asociados al usuario 1 (Creados por `pedidos_seeders.js`). |
| **PUT** | `/usuarios/2` | `{ "nombre": "Cliente VIP", "email": "usuariobase2_vip@gmail.com" }` | **200 OK.** Actualiza el nombre y email del **Usuario 2** (prueba exitosa de actualización). |
| **DELETE**| `/usuarios/1` | *(Vacío)* | 200 OK. Elimina el Usuario 1 y sus **Pedidos en cascada** (Política `CASCADE`). |
| **GET** | `/usuarios/999` | *(Vacío)* | **404 Not Found**. ID no existente. |
| **PUT** | `/usuarios/999` | *(Cualquier body)* | **404 Not Found**. ID a actualizar no existente. |

### Pruebas de Pedidos y Errores (`http://localhost:8080/pedidos`)

| Método | Ruta | Body (JSON) | Resultado Esperado |
| :--- | :--- | :--- | :--- |
| **POST** | `/pedidos` | `{ "producto": "Laptop Gamer", "cantidad": 1, "UsuarioId": 2 }` | 201 Created. Pedido exitoso para el Usuario 2. |
| **POST** | `/pedidos` | `{ "producto": "Tablet", "cantidad": -5, "UsuarioId": 2 }` | **400 Bad Request (ErrorValidacion)**. Falla la validación `min: 1` de la cantidad. |
| **POST** | `/pedidos` | `{ "producto": "Test", "cantidad": 1, "UsuarioId": 999 }` | **404 Not Found (ErrorRecursoNoEncontrado)**. El `UsuarioId` no existe. |
| **GET** | `/pedidos/error500` | *(Vacío)* | **500 Internal Server Error**. Error de código forzado para prueba. |

-----


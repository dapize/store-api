# Store API

Store API es un sistema backend construido con Node.js, Express y TypeORM que permite gestionar órdenes, productos y usuarios dentro de una tienda virtual.

## 🚀 Tecnologías Usadas

-   **Node.js** - Entorno de ejecución de JavaScript
-   **Express** - Framework web para Node.js
-   **TypeScript** - Superconjunto de JavaScript con tipado estático
-   **TypeORM** - ORM para bases de datos SQL
-   **SQLite** - Base de datos liviana para pruebas y desarrollo
-   **Vitest** - Framework de pruebas
-   **Supertest** - Testing de endpoints HTTP
-   **Swagger** - Documentación interactiva de la API

## 📦 Instalación

Clona el repositorio y accede al directorio del proyecto:

```sh
$ git clone https://github.com/dapize/store-api.git
$ cd store-api
```

Instala las dependencias:

```sh
$ npm install
```

## ⚙️ Configuración

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables de entorno:

```
PORT=3000
NODE_ENV=development
DATABASE_URL=sqlite://./database.sqlite
```

## ▶️ Ejecución

Para compilar el proyecto:

```sh
$ npm run build
```

Para ejecutar la API en desarrollo:

```sh
$ npm run dev
```

Para ejecutar en producción:

```sh
$ npm start
```

## 🧪 Pruebas

Ejecuta las pruebas unitarias e integraciones con:

```sh
$ npm run test
```

## 📌 Endpoints

### Productos

-   **GET** `/products` → Lista todos los productos
-   **POST** `/products` → Crea un nuevo producto
-   **PUT** `/products/:uuid` → Actualiza el stock de un producto

### Órdenes

-   **GET** `/orders` → Lista todas las órdenes
-   **POST** `/orders` → Crea una nueva orden
-   **DELETE** `/orders/:orderId` → Elimina una orden

### Usuarios

-   **GET** `/users` → Lista todos los usuarios
-   **POST** `/users` → Crea un nuevo usuario
-   **GET** `/users/:id` → Obtiene un usuario por su ID

### Documentación de la API

La API cuenta con documentación interactiva en Swagger disponible en:

-   **GET** `/api-docs` → Accede a la documentación generada por Swagger

## 📜 Licencia

Este proyecto está bajo la licencia MIT.

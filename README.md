# Práctica 8 - Prisma: esquema y migraciones

## Cuestionario

### 1. ¿Por qué el paquete del adaptador se llama `adapter-mariadb` si usamos MySQL?
MariaDB surgió como un fork compatible a nivel binario y de protocolo con MySQL. Ambos motores comparten la misma interfaz y protocolo de comunicación en red (TCP/sockets), por lo que Prisma utiliza este controlador para gestionar las conexiones de bajo nivel con cualquiera de las dos bases de datos indistintamente.

### 2. ¿Editar `schema.prisma` cambió algo en la base de datos antes de migrar?
No. El archivo `schema.prisma` es únicamente una representación declarativa en código del modelo de datos. Para que los cambios impacten en el motor de la base de datos es necesario ejecutar el comando de migración (`prisma migrate dev`), el cual genera y ejecuta las sentencias DDL en SQL correspondientes.

### 3. ¿La carpeta de migraciones es una foto del esquema o un historial?
Es un historial cronológico y versionado. Cada subcarpeta generada documenta los cambios específicos en sentencias SQL a lo largo del tiempo, permitiendo recrear o actualizar la estructura de la base de datos paso a paso en cualquier entorno.

### 4. ¿Por qué `Horario.clase` sí crea columna y `Clase.horarios` no?
En el modelo relacional, las relaciones de 1 a N se establecen colocando una clave foránea (Foreign Key) en la tabla del lado "muchos" (`horario`). El atributo `clase` en el modelo `Horario` define físicamente la columna `clase_id` mediante `@relation(fields: [claseId], references: [id])`, mientras que `Clase.horarios` es solo un campo virtual que Prisma Client usa para facilitar consultas y navegación en TypeScript.

### 5. ¿De dónde sale la relación de muchos a muchos entre Miembro y Horario, si nunca se declaró?
Proviene de la tabla intermedia o pivote `Inscripcion`. En lugar de una relación directa, la relación N:M se descompone en dos relaciones 1:N (`Horario -> Inscripcion` y `Miembro -> Inscripcion`), con una clave única compuesta `@@unique([horarioId, miembroId])` que garantiza que un miembro no se registre múltiples veces en el mismo horario.

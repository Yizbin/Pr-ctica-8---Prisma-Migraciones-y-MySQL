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

# Práctica 9 - Blindar la API

## Repuestas a las preguntas de reflexión

### 1. Conectar Prisma a Clases
**¿Qué línea del Service o del Controller tuvo que cambiar para que Clases hablara con MySQL?**
Ninguna línea del Service ni del Controller tuvo que cambiar. Gracias a la Inyección de Dependencias y al principio de Inversión de Dependencias, las capas superiores dependen de la abstracción (`ClaseRepository`) y no de la implementación. Solo se modificó la vinculación del proveedor en el `ClasesModule`.

### 2. Repetir el mismo cambio para Horario, Miembro e Inscripción
**¿Por qué InscripcionesService no tuvo que cambiar ni una línea de las reglas de cupo y duplicados?**
Porque las reglas de negocio de cupo y duplicados pertenecen a la capa de dominio (`InscripcionesService`). El repositorio de Prisma cumple con la misma interfaz (`InscripcionRepository`) que el de memoria, por lo que el servicio sigue ejecutando las mismas validaciones sin importar la tecnología de persistencia.

### 3. Convertir los DTO en clases con validación
**¿Por qué una interfaz no puede validar nada en tiempo de ejecución?**
Las interfaces de TypeScript son herramientas exclusivas para el análisis estático en tiempo de compilación. Cuando el proyecto se transpila a JavaScript ejecutable, las interfaces son completamente eliminadas (*type erasure*), por lo que no existe código en tiempo de ejecución que pueda evaluar ni validar los datos de la petición.

### 4. Activar la validación global
**¿Qué código de estado responde y qué trae en el cuerpo al enviar un tipo equivocado o un campo que no existe?**
Responde con un código de estado **400 Bad Request**. En el cuerpo de la respuesta devuelve un objeto JSON indicando la marca de estado y un arreglo `message` con la descripción del error de validación (por ejemplo, `"property extraField should not exist"` o el mensaje de tipo inválido correspondiente).

### 5. Escribir el filtro de excepciones
**¿Cuántas líneas quedó más corto el controlador?**
El controlador se redujo aproximadamente entre 15 y 25 líneas al eliminar todos los bloques `try/catch` manuales y la re-lanzada explícita de excepciones HTTP (`NotFoundException`, `ConflictException`), delegando el manejo al filtro centralizado de excepciones.

### 6. Habilitar el intercambio entre orígenes (CORS)
**Si la respuesta llega en los dos casos, ¿quién bloquea realmente y a quién protege?**
El bloqueo lo realiza **el navegador web** del cliente, no el servidor. El mecanismo de CORS está diseñado para **proteger al usuario final**, impidiendo que aplicaciones web alojadas en otros dominios lean o procesen respuestas con información sensible sin autorización previa.

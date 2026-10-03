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

## Preguntas y Respuestas de la Práctica 10

### Parte 1

1. **¿Por qué el filtro atrapa la clase base `ErrorDeDominio` y no cada error por separado?**
   Al extender la clase abstracta `ErrorDeDominio`, el decorador `@Catch(ErrorDeDominio)` aprovecha el polimorfismo para capturar cualquier error derivado (como `CupoLlenoError` o `HorarioNoEncontradoError`) en un solo punto centralizado. Esto evita tener que declarar un filtro independiente o un `catch` múltiple para cada error existente y facilita agregar nuevas excepciones de dominio en el futuro sin modificar la infraestructura.

2. **Al comentar `next()` en el middleware, ¿qué pasa y por qué?**
   La petición se queda colgada indefinidamente en el cliente sin recibir respuesta ni lanzar un error visible. Esto ocurre porque Express y NestJS dependen de la función `next()` para ceder el control al siguiente middleware, guard o controlador en el ciclo de vida de la petición.

3. **¿Por qué este middleware no podría decidir si un usuario tiene permiso para una ruta?**
   El middleware se ejecuta en una fase muy temprana del pipeline de HTTP (a nivel de Express/Fastify), antes de que NestJS realice el enrutamiento (routing) e identifique qué controlador o método va a atender la solicitud. Sin acceso a los metadatos del controlador ni al contexto de ejecución (`ExecutionContext`), el middleware no puede saber qué permisos específicos requiere la ruta solicitada.

4. **¿Por qué la petición que responde 409 no aparece en el registro del `LoggingInterceptor`?**
   Porque las excepciones lanzadas por el servicio o controlador interrumpen la ejecución normal del flujo. Los interceptores capturan la respuesta exitosa mediante el operador `tap` dentro de `siguiente.handle()`. Al lanzarse un error, el control pasa directamente al filtro de excepciones (`DominioExceptionFilter`), saltándose la fase de respuesta dentro del interceptor.

5. **¿Por qué el interceptor del sobre (`SobreInterceptor`) rompe a cualquier cliente que ya estuviera usando la API?**
   Porque altera la estructura general de la respuesta JSON (el contrato de la API). Un cliente que antes esperaba recibir una lista en la raíz del cuerpo HTTP (por ejemplo `response.data` como array) ahora recibirá un objeto contenedor `{ data: [...], meta: {...} }`, obligándolo a reestructurar su lógica de consumo para acceder a los datos reales dentro de `response.data.data`.

6. **Si el servidor respondió en los dos casos de prueba de CORS, ¿quién bloquea y a quién protege?**
   El servidor procesa y responde a la solicitud en ambos escenarios. Quien bloquea el acceso a la respuesta es el **navegador web** al detectar que el encabezado `Access-Control-Allow-Origin` retornado por el servidor no coincide con el `Origin` desde el que se realizó la solicitud. CORS protege al **usuario final** impidiendo que sitios maliciosos Lean datos confidenciales de una API mediante peticiones cross-origin no autorizadas desde el navegador.

---

### Parte 2

1. **¿Por qué el campo se llama `passwordHash` y no `password`?**
   Se utiliza `passwordHash` para explicitar en el dominio y en la base de datos que el valor almacenado es un derivado criptográfico unidireccional (hash con salt) y nunca la contraseña en texto plano. Esto previene guardar involuntariamente contraseñas sin cifrar por descuido de desarrollo.

2. **¿Por qué los dos errores del inicio de sesión (usuario no encontrado / contraseña incorrecta) dicen exactamente lo mismo?**
   Por seguridad para evitar ataques de enumeración de usuarios. Si los mensajes fueran explícitos (ej. "El correo no existe" vs. "Contraseña incorrecta"), un atacante podría determinar qué correos electrónicos están registrados en el sistema probando combinaciones en la ruta de inicio de sesión.

3. **Al pegar el JWT en `jwt.io`, si el contenido se puede leer, ¿qué es lo que protege la firma?**
   Los JWT no están cifrados, sino codificados en Base64Url (a menos que se use JWE). La firma criptográfica (`signature`) garantiza la **integridad y autenticidad** del token. Protege al servidor de modificaciones no autorizadas: si un usuario altera el contenido del payload (por ejemplo, cambiando su `rol` a `admin`), la firma ya no coincidirá con el secreto guardado en el servidor y el token será rechazado automáticamente con un estado `401 Unauthorized`.

4. **¿Por qué es más seguro proteger todas las rutas por omisión y abrir a mano con `@Publico()`, que hacerlo al revés?**
   Aplica el principio de "seguridad por defecto" (default-deny). Si la protección es global, olvidar agregar un decorador en un endpoint nuevo resultará en un error `401 Unauthorized` visible durante el desarrollo. Por el contrario, si las rutas son públicas por defecto, olvidar proteger un endpoint sensible deja una brecha de seguridad expuesta en producción que puede pasar desapercibida.

5. **¿Cuál es la diferencia entre un error HTTP 401 y un 403?**
   - **401 Unauthorized**: Indica que el cliente no se ha autenticado o que el token presentado es inválido o expiró ("No sé quién eres").
   - **403 Forbidden**: Indica que el cliente está autenticado correctamente, pero carece de los permisos o privilegios necesarios para acceder al recurso solicitado ("Sé quién eres, pero no tienes permiso").

6. **¿Cuántas líneas del `AuthService` tuvieron que cambiar para pasar de memoria a MySQL? ¿Por qué?**
   **Cero líneas.** `AuthService` depende de la interfaz abstracta `UsuarioRepository` (mediante inyección de dependencias con el token `USUARIO_REPOSITORY`) y no de una implementación concreta. La sustitución de `UsuarioMemoriaRepository` por `UsuarioPrismaRepository` se realizó exclusivamente en el archivo de configuración del módulo (`auth.module.ts`), cumpliendo con el principio de Inversión de Dependencias (SOLID).

7. **¿Por qué es importante tomar al usuario de los claims del token y no de un parámetro de la URL o del cuerpo?**
   Los claims del JWT vienen firmados criptográficamente por el servidor y el cliente no puede alterarlos. Si la API confiara en parámetros como `GET /miembros/3/inscripciones` o el campo `miembroId` enviado en el cuerpo de la petición sin contrastarlo contra el token, cualquier usuario autenticado podría consultar o modificar la información de otros usuarios simplemente cambiando el ID en la solicitud (vulnerabilidad conocida como *Insecure Direct Object Reference* o **IDOR**). 

   En la API se utiliza el claim **`sub`** (subject, según el estándar RFC 7519) para validar el ID del usuario autenticado o **`miembroId`** para restringir operaciones propias. De esta forma, aunque el cuerpo mande un `miembroId: 3`, el servidor valida si coincide con el `miembroId` firmado en el token JWT del usuario actual, rechazando la petición con un `403 Forbidden` si difieren.

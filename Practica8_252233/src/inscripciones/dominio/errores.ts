export abstract class ErrorDeDominio extends Error {}

export class HorarioNoEncontradoError extends ErrorDeDominio {
  constructor(horarioId: number) {
    super(`No existe el horario ${horarioId}`);
  }
}

export class MiembroNoEncontradoError extends ErrorDeDominio {
  constructor(miembroId: number) {
    super(`No existe el miembro ${miembroId}`);
  }
}

export class CupoLlenoError extends ErrorDeDominio {
  constructor() {
    super('El horario ya no tiene cupo disponible');
  }
}

export class InscripcionDuplicadaError extends ErrorDeDominio {
  constructor() {
    super('El miembro ya está inscrito en este horario');
  }
}

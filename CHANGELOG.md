# CHANGELOG
Todos los cambios notables del proyecto de "Pico&PalaApp" se documentan aquí.

## [1.1.0] - 2026-Oct-09

## Agregado
- Salas privadas en tiempo real con relojes del servidor (selección de secreto, turnos y reconexión).
- Historial y estadísticas reales en la pantalla de récord.
- Sincronización de partidas offline contra IA con jugadas y secretos.
- Tests unitarios (jest-expo) y CI en GitHub Actions.

## Cambiado
- **Breaking:** el login, registro, refresh y logout usan `/mobile/auth/*` y envían `platform` (IOS|ANDROID). Requiere el backend con auth separado.
- TypeScript 6.

## [1.0.0] - 2026-Jan-14

## Agregado
- Primera configuración del proyecto.
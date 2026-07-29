# DESIGN.md — Pico & Pala

> Documento de diseño de producto y arquitectura de la app móvil. Para información del backend, ver [BACKEND.md](./BACKEND.md).

---

## 1. Product Vision

**Pico & Pala** es un juego de deducción de números para dos jugadores. Cada jugador genera un número secreto de 4 dígitos y, por turnos, intenta adivinar el número del oponente. Tras cada intento, recibe pistas sobre qué dígitos están correctos y en qué posición.

### Concepto
- **Género:** Puzzle / Deducción lógica
- **Plataformas:** iOS + Android (React Native / Expo)
- **Estilo visual:** Dark mode gamer con gradientes vibrantes (rojo, morado, verde lima)
- **Tipografía:** Cairo (Google Fonts)
- **Público:** Casual gamers, partidas rápidas de 2-5 minutos

---

## 2. Game Rules

### Número Secreto
- **4 dígitos**, cada uno entre 1 y 9.
- **No se repiten** dígitos en el mismo número.
- **No se permite el 0**.
- Ejemplo válido: `3-7-1-9`
- Ejemplo inválido: `3-3-1-9` (repite), `3-0-1-9` (contiene 0)

### Turnos
- Cada jugador, en su turno, ingresa un intento de 4 dígitos (misma regla: sin repetir, sin 0).
- El sistema evalúa el intento contra el número secreto del oponente y devuelve pistas.

### Pistas (Feedback)
| Pista | Significado |
|-------|-------------|
| **Pala** (o **Fija**) | Dígito correcto en posición correcta. |
| **Pico** | Dígito correcto pero en posición incorrecta. |
| *(nada)* | Dígito no está en el número del oponente. |

**Ejemplo:**
- Número secreto: `3-7-1-9`
- Intento: `3-1-5-9`
- Resultado: **2 Palas** (3 y 9 en posición correcta), **1 Pico** (1 está pero en posición incorrecta)

### Victoria
- Gana el primer jugador que obtenga **4 Palas** (todos los dígitos en posición correcta).
- Si ambos jugadores agotan sus turnos sin adivinar, es **empate** (configurable: máximo de turnos por partida).

---

## 3. Game Modes

### 3.1 Versus AI (Offline)
- **Descripción:** El jugador enfrenta a un bot con IA de dificultad configurable.
- **Requisito de red:** Ninguno. 100% offline.
- **Lógica:** Toda la lógica del juego corre en el cliente.
- **Dificultades:**
  - **Easy:** Bot hace intentos aleatorios (sin estrategia).
  - **Medium:** Bot usa eliminación básica de posibilidades.
  - **Hard:** Bot usa algoritmo de deducción optimizado (similar a Mastermind solver).
- **Persistencia:** Partida en curso se guarda en SecureStore para reconexión.

### 3.2 Private Room (Online)
- **Descripción:** Un jugador crea una sala privada con un código. Otro jugador se une con ese código.
- **Requisito de red:** Conexión para crear/unirse. Turnos pueden ser asíncronos.
- **Flujo:**
  1. Jugador A crea sala → obtiene código (ej: `ABCD12`).
  2. Jugador A comparte el código con Jugador B.
  3. Jugador B se une con el código.
  4. Comienza la partida por turnos.
- **Turnos asíncronos:** Si un jugador no está en línea, su turno se guarda y se notifica por push cuando el otro juega.
- **Persistencia:** Estado de partida en backend + SecureStore local.

### 3.3 Global Room (Online)
- **Descripción:** Matchmaking automático con jugadores aleatorios de todo el mundo.
- **Requisito de red:** Conexión requerida para matchmaking y sincronización en tiempo real.
- **Flujo:**
  1. Jugador entra a la cola de matchmaking.
  2. Sistema empareja con otro jugador en cola.
  3. Comienza la partida en tiempo real.
- **Sincronización:** WebSocket para turnos en tiempo real.
- **Reconexión:** Si se pierde conexión, se guarda estado y se reintenta.

---

## 4. Architecture

### Mobile App (Expo / React Native)

```
┌─────────────────────────────────────────────────┐
│                   app/ (Screens)                 │
│  _layout.tsx → (main) → (tabs) → screens        │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────┐
│              presentation/ (UI Layer)             │
│  components/ │ hooks/ │ store/ │ i18n/ │ assets/ │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────┐
│                core/ (Business Logic)             │
│  actions/ │ adapters/ │ interfaces/ │ utils/      │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────┐
│           Backend API (NestJS + Socket.IO)        │
│  REST endpoints │ WebSocket events │ Database     │
└─────────────────────────────────────────────────┘
```

**Ver [BACKEND.md](../picopalabackend/BACKEND.md) para detalles de la arquitectura del backend.**

---

## 5. Design System

### 5.1 Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `background` | `#1A1C22` | Fondo principal de la app |
| `surface` | `#2D303E` | Tarjetas, cards |
| `surfaceLight` | `#3E4251` | Elementos elevados |
| `mainRed` | `#FF5959` | Color primario (botones principales) |
| `mainRose` | `#FF2E95` | Gradientes, acentos |
| `mainPurple` | `#9D4EDD` | Gradientes, modo AI |
| `limeGreen` | `#84CC16` | Acentos, éxito |
| `mainGreen` | `#15803D` | Modo Global Room |
| `gold` | `#FFD600` | Premios, estadísticas |
| `cian` | `#00D2FF` | Acentos secundarios |
| `textMain` | `#FFFFFF` | Texto principal |
| `textMuted` | `#94959B` | Texto secundario |
| `border` | `#4A4D57` | Bordes |
| `success` | `#A2D729` | Estado éxito |
| `error` | `#FF4D4D` | Estado error |
| `warning` | `#FFC800` | Estado advertencia |

### 5.2 Typography

**Familia:** Cairo (Google Fonts)

| Peso | Uso |
|------|-----|
| CairoBlack | Títulos grandes, impacto |
| CairoBold | Títulos, botones |
| CairoSemiBold | Subtítulos, labels |
| CairoRegular | Texto general |
| CairoLight | Texto secundario |
| CairoExtraLight | Texto decorativo |

### 5.3 Componentes Base

| Componente | Descripción |
|------------|-------------|
| `ButtonGeneral` | Botón con variantes: primary (rojo-rosa), secondary (morado-cian), tertiary (cian-verde), disabled. Gradientes horizontales. |
| `GameModeCard` | Tarjeta para seleccionar modo de juego. Gradiente, ícono, título, descripción. |
| `StatsCard` | Tarjeta para estadísticas. Ícono circular, label, valor. |
| `NumberPad` | *(planificado)* Teclado numérico para ingresar dígitos (1-9). |
| `GuessRow` | *(planificado)* Fila con intento y feedback visual (pico/pala). |
| `GameBoard` | *(planificado)* Contenedor de todas las filas de intentos. |
| `TurnIndicator` | *(planificado)* Indicador de turno actual. |

---

## 6. User Flows

### 6.1 First Launch
```
Splash → Initial Screen → Home
```

### 6.2 Play Versus AI
```
Home → [New Game] → Modal → Versus AI → Game Screen → (play turns) → Result Modal
```

### 6.3 Play Private Room
```
Home → [New Game] → Modal → Private Room → Create/Join → Waiting Room → Game Screen → Result
```

### 6.4 Play Global Room
```
Home → [New Game] → Modal → Global Room → Queue → Match Found → Game Screen → Result
```

### 6.5 View Stats
```
Home → [Records] → Stats Screen
```

### 6.6 Settings
```
Home → [Settings] → Config Screen → Language / Sound / Account
```

---

## 7. Roadmap

### Phase 1: MVP (Offline)
- [ ] Versus AI con 3 dificultades
- [ ] Pantalla de juego con NumberPad y GuessRow
- [ ] Estadísticas locales
- [ ] i18n (en, es)
- [ ] Pantalla de configuración básica

### Phase 2: Backend + Online
- [ ] Backend NestJS + PostgreSQL
- [ ] Auth (registro, login, JWT)
- [ ] Private Room (crear, unir, turnos async)
- [ ] Push notifications
- [ ] Sincronización de stats

### Phase 3: Real-time
- [ ] Global Room con matchmaking
- [ ] WebSocket para turnos en tiempo real
- [ ] Reconexión automática
- [ ] Ranking global

### Phase 4: Polish
- [ ] Animaciones y transiciones
- [ ] Sonidos y vibraciones
- [ ] Avatares personalizables
- [ ] Logros/achievements
- [ ] Compartir resultados en redes

---

## 8. Non-Functional Requirements

| Requisito | Detalle |
|-----------|---------|
| **Performance** | 60fps en animaciones, < 200ms en respuesta de turnos |
| **Offline** | Versus AI 100% funcional sin conexión |
| **Seguridad** | JWT con refresh tokens, números secretos no se envían al cliente rival |
| **Escalabilidad** | Backend diseñado para 10K+ usuarios concurrentes |
| **Accesibilidad** | Soporte para VoiceOver/TalkBack, contraste AA |
| **Tamaño** | APK < 30MB, IPA < 50MB |
| **Compatibilidad** | iOS 15+, Android 8+ (API 26+) |

---

## 9. Success Metrics

| Métrica | Objetivo |
|---------|----------|
| Retención D1 | > 40% |
| Retención D7 | > 20% |
| Sesión promedio | > 3 minutos |
| Partidas por sesión | > 2 |
| Rating en stores | > 4.0 estrellas |

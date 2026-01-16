// declarations.d.ts
declare module '*.webp';
declare module '*.jpg';
declare module '*.png';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg';

// Añadir esta línea para soportar archivos .json
declare module '*.json' {
  const value: any;
  export default value;
}


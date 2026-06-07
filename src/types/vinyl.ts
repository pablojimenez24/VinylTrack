// TODO: Interfaz principal del modelo de datos Vinyl
// Fuente de verdad: CONTEXT.md sección 4

export interface Vinyl {
  id?: string
  title: string        // requerido
  artist: string       // requerido
  genre: 'Rock' | 'Soul' | 'R&B' | 'Blues' | 'Salsa'  // requerido
  year: number         // requerido, entre 1960 y 1989
  coverUrl?: string    // opcional
  condition: 'Mint' | 'VG+' | 'VG' | 'Good'           // requerido
  createdAt?: Date
}

// Tipos auxiliares exportados para uso en componentes
export type Genre = Vinyl['genre']
export type Condition = Vinyl['condition']

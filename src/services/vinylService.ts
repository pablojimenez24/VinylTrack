// CRUD con Firebase Firestore — colección: 'vinyls'
// Operaciones según CONTEXT.md sección 5

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Vinyl, Genre } from '../types/vinyl'

const COLLECTION = 'vinyls'

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Convierte un documento Firestore en un objeto Vinyl tipado */
function docToVinyl(id: string, data: Record<string, unknown>): Vinyl {
  return {
    id,
    title:     data.title as string,
    artist:    data.artist as string,
    genre:     data.genre as Vinyl['genre'],
    year:      data.year as number,
    coverUrl:  data.coverUrl as string | undefined,
    condition: data.condition as Vinyl['condition'],
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate()
      : undefined,
  }
}

// ── Operaciones ───────────────────────────────────────────────────────────────

/** Obtiene todos los vinilos ordenados por fecha de creación (más reciente primero) */
export async function getVinyls(): Promise<Vinyl[]> {
  const snap = await getDocs(
    query(collection(db, COLLECTION), orderBy('createdAt', 'desc'))
  )
  return snap.docs.map((d) => docToVinyl(d.id, d.data() as Record<string, unknown>))
}

/** Obtiene vinilos filtrados por género */
export async function getVinylsByGenre(genre: Genre): Promise<Vinyl[]> {
  const snap = await getDocs(
    query(
      collection(db, COLLECTION),
      where('genre', '==', genre),
      orderBy('createdAt', 'desc')
    )
  )
  return snap.docs.map((d) => docToVinyl(d.id, d.data() as Record<string, unknown>))
}

/** Crea un nuevo vinilo en Firestore y devuelve el objeto con su id generado */
export async function addVinyl(
  data: Omit<Vinyl, 'id' | 'createdAt'>
): Promise<Vinyl> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
  })
  return { ...data, id: ref.id, createdAt: new Date() }
}

/** Actualiza un vinilo existente por id */
export async function updateVinyl(
  id: string,
  data: Partial<Omit<Vinyl, 'id' | 'createdAt'>>
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), data)
}

/** Elimina un vinilo por id */
export async function deleteVinyl(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id))
}

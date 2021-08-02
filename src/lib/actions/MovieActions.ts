import { EntityManager, wrap } from '@mikro-orm/core'
import { MovieInputData } from 'src/types/classes/MovieInputData'
import { Movie } from 'src/types/entities/Movie'

export async function getMoviesAction (em: EntityManager): Promise<Movie[]> {
  return await em.find(Movie, {})
}

export async function createMovieAction (data: MovieInputData, em: EntityManager): Promise<Movie> {
  // const movie = em.create(Movie, data)
  const movie = em.create(Movie, { ...data, available: true })

  await em.persistAndFlush(movie)

  return movie
}

export async function getMovieAction (id: string, em: EntityManager): Promise<Movie> {
  const movie = await em.findOneOrFail(Movie, { id })
  return movie
}

export async function updateMovieAction (id: string, data: MovieInputData, em: EntityManager): Promise<Movie> {
  const movie = await em.findOneOrFail(Movie, { id })
  wrap(movie).assign(data)
  await em.persistAndFlush(movie)
  return movie
}

export async function deleteMovieAction (id: string, em: EntityManager): Promise<boolean> {
  const movie = await em.findOneOrFail(Movie, { id })
  await em.removeAndFlush(movie)
  console.log('Movie removed')
  return true
}
